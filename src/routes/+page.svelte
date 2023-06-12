<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ characters } = data);

	import Hero from '$lib/components/Hero.svelte';

	import { SSE } from 'sse.js';
	import type { ChatCompletionRequestMessage } from 'openai';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import logo from '$lib/assets/skelly.png';

	let context = '';
	let loading = false;
	let error = false;
	let answer = '';
	let chatMessages: ChatCompletionRequestMessage[] = [];
	let currentDateTime = new Date();

	// Create Timestamps for AI Responses
	function getHour(c: Date) {
		return c.getHours() % 12 || 12;
	}
	function getMinute(c: Date) {
		return c.getMinutes() < 10 ? '0' + c.getMinutes() : c.getMinutes();
	}
	function getMeridiem(c: Date) {
		return c.getHours() < 12 ? 'AM' : 'PM';
	}
	const updateContext = async (char: string | null) => {
		context = String(char);
	};

	//  Send the selected Kanji to Chat GPT as context in the user role message
	const handleSubmit = async () => {
		loading = true;
		chatMessages = [...chatMessages, { role: 'user', content: context }];

		// Go through the SSE to post the request to our server file in api/chat
		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ messages: chatMessages })
		});

		eventSource.addEventListener('error', handleError);
		eventSource.addEventListener('message', (e) => {
			try {
				loading = false;
				if (e.data === '[DONE]') {
					chatMessages = [...chatMessages, { role: 'assistant', content: answer }];
					answer = '';
					return;
				}

				// watch out that this doesn't need to get updated to ChatCompletionResponse in the near future
				const completionResponse = JSON.parse(e.data);
				const [{ delta }] = completionResponse.choices;
				if (delta.content) {
					answer = (answer ?? '') + delta.content;
				}
			} catch (err) {
				handleError(err);
			}
		});
		eventSource.stream();
	};
	//

	function handleError<T>(err: T) {
		loading = false;
		answer = '';
		console.error(err);
	}
</script>

<Hero kanjis={characters} />

<div id="card-deck" class="container h-full mx-auto">
	<div class="container flex items-center justify-center">
		<form action="?/reloadKanji" method="POST">
			<button class="btn variant-filled mt-12" type="submit">give me three more Kanji</button>
		</form>
	</div>

	<div class="container py-12 mx-auto">
		<div class="flex flex-wrap">
			{#each characters as character}
				<div class="p-4 md:w-1/3 w-full">
					<div class="card overflow-hidden">
						<header>
							<div class="bg-black/10 w-full aspect-[21/9] flex items-center justify-center">
								<p class="text-8xl">{character.kanji}</p>
							</div>
							<!-- <img src="https://source.unsplash.com/vjUokUWbFOs/400x175" class="bg-black/50 w-full aspect-[21/9]" alt="Post" /> -->
						</header>
						<div class="p-4 space-y-4 h-72 min-h-72 break-words">
							<h6 class="h6">{character.jlpt}</h6>
							<h3 class="h3" data-toc-ignore>{character.kanji}</h3>

							<p>{character.onyomi}</p>

							<p>{character.kunyomi}</p>
							<article>
								<p>
									{character.meaning}
								</p>
							</article>
						</div>
						<hr class="opacity-50" />
						<footer class="p-4 flex justify-start items-center space-x-4">
							<div class="flex-auto flex justify-between items-center">
								<button class="btn variant-filled" on:click={() => updateContext(character.kanji)}
									>add to generator</button
								>
								<!-- <small>On {new Date().toLocaleDateString()}</small> -->
							</div>
						</footer>
					</div>
				</div>
			{/each}
		</div>
		<div class="container flex items-center justify-center">
			<form class="md:w-1/3 w-full p-4 text-center" on:submit|preventDefault={() => handleSubmit()}>
				<p class="mb-2">Enter a Kanji to see example words</p>
				<label class="label">
					<input
						required
						class="input mt-4"
						type="text"
						placeholder="click one of the above or type your own"
						name="context"
						bind:value={context}
					/>
				</label>
				<button class="btn variant-filled mt-6" type="submit">generate</button>
			</form>
		</div>

		<div class="p-2 container flex items-center justify-center">
			<div class=" text-center card md:w-3/5 w-full p-4">
				<div class="grid grid-cols-[auto_1fr] gap-2">
					<Avatar src={logo} width="w-12" />
					<div class="card p-4 variant-soft rounded-tl-none space-y-2">
						<header class="flex justify-between items-center">
							<p class="font-bold">AI Assistant</p>
							<!-- <small>On {new Date().toLocaleDateString()}</small> -->
						</header>
						{#each chatMessages as message}
							<ChatMessage type={message.role} message={message.content} />
						{/each}
						{#if answer}
							<small class="opacity-50"
								>{getHour(currentDateTime)}:
								{getMinute(currentDateTime)}{getMeridiem(currentDateTime)}
							</small>
							<ChatMessage type="assistant" message={answer} />
						{/if}
						{#if loading}
							<ChatMessage type="assistant" message="Loading.." />
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
