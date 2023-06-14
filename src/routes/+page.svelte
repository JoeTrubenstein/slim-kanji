<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ characters } = data);

	import Hero from '$lib/components/Hero.svelte';

	import { SSE } from 'sse.js';
	import type { ChatCompletionRequestMessage } from 'openai';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import logo from '$lib/assets/skelly.png';

	let tabSet: number = 0;

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
		try {
			await handleSubmit();
		} catch (e) {
			console.log(e);
		}
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

<section class="">
	<div class="container px-5 pt-24 mx-auto flex flex-wrap">
		<div class="flex flex-wrap w-full">
			<div class="lg:w-3/5 md:w-1/2 md:pr-10 md:py-6">
				<div class="flex relative pb-12">
					<div class="h-full w-10 absolute inset-0 flex items-center justify-center">
						<div class="h-full w-1 variant-filled pointer-events-none" />
					</div>
					<div
						class="flex-shrink-0 w-10 h-10 rounded-full variant-filled inline-flex items-center justify-center text-white relative z-10"
					>
						<p>一</p>
					</div>
					<div class="flex-grow pl-4">
						<h3 class="font-medium title-font h3 mb-1 tracking-wider">Step 1</h3>
						<p class="leading-relaxed">
							Access a database of over 6,000 Kanji symbols and start with a single character.
							Search by meanings, readings, or JLPT level.
						</p>
					</div>
				</div>
				<div class="flex relative pb-12">
					<div class="h-full w-10 absolute inset-0 flex items-center justify-center">
						<div class="h-full w-1 variant-filled pointer-events-none" />
					</div>
					<div
						class="flex-shrink-0 w-10 h-10 rounded-full variant-filled inline-flex items-center justify-center text-white relative z-10"
					>
						<p>二</p>
					</div>
					<div class="flex-grow pl-4">
						<h3 class="font-medium title-font h3 mb-1 tracking-wider">Step 2</h3>
						<p class="leading-relaxed">
							Use AI to generate practical examples of a given Kanji. Study new vocabularly and
							sentences on demand.
						</p>
					</div>
				</div>
				<div class="flex relative pb-12">
					<div class="h-full w-10 absolute inset-0 flex items-center justify-center" />
					<div
						class="flex-shrink-0 w-10 h-10 rounded-full variant-filled inline-flex items-center justify-center text-white relative z-10"
					>
						<p>三</p>
					</div>
					<div class="flex-grow pl-4">
						<h3 class="font-medium title-font h3 mb-1 tracking-wider">Step 3</h3>
						<p class="leading-relaxed">
							Track your progress by collecting annotated cards. Use AI to target specific areas for
							maximum results.
						</p>
					</div>
				</div>
				<div class="flex relative pb-12" />
			</div>

			<div class="lg:w-2/5 md:w-1/2 w-full md:mt-0 mt-6">
				<div class="p-4 w-full">
					<div class="card overflow-hidden">
						<header>
							<div
								class="bg-black/10 w-full aspect-[16/9] h-32 max-h-32 flex items-center justify-center"
							>
								<p class="text-7xl">{characters[0].kanji}</p>
							</div>
							<!-- <img src="https://source.unsplash.com/vjUokUWbFOs/400x175" class="bg-black/50 w-full aspect-[21/9]" alt="Post" /> -->
						</header>
						<div class="p-4 space-y-4 h-48 min-h-48 break-words">
							<h6 class="h6">{characters[0].jlpt}</h6>
							<article>
								<TabGroup>
									<Tab bind:group={tabSet} name="tab1" value={0}>Meanings</Tab>
									<Tab bind:group={tabSet} name="tab2" value={1}>Readings</Tab>
									<Tab bind:group={tabSet} name="tab3" value={2}>Notes</Tab>
									<!-- Tab Panels --->
									<svelte:fragment slot="panel">
										{#if tabSet === 0}
											<article>
												{#if characters[0].meaning}
													{characters[0].meaning.replaceAll(';', ', ')}
												{/if}
											</article>
										{:else if tabSet === 1}
											<p>Onyomi: {characters[0].onyomi}</p>
											<p>Kunyomi: {characters[0].kunyomi}</p>
										{:else if tabSet === 2}
											Ask AI to generate practical applications of a given Kanji
										{/if}
									</svelte:fragment>
								</TabGroup>
							</article>
						</div>
						<hr class="opacity-50" />
						<footer class="p-4 flex justify-start items-center space-x-4">
							<div class="flex-auto flex justify-between items-center">
								<button
									class="btn variant-filled rounded-lg"
									on:click={() => updateContext(characters[0].kanji)}>Ask AI</button
								>
								<!-- <small>On {new Date().toLocaleDateString()}</small> -->
							</div>
						</footer>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- <div class="container flex items-center justify-center">
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
		<button class="btn variant-filled mt-6 rounded-lg" type="submit">generate</button>
	</form>
</div> -->

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
