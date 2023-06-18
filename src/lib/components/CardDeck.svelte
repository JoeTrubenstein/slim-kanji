<script lang="ts">
	export let kanjis: any[];

	import type { ChatCompletionRequestMessage } from 'openai';
	import { SSE } from 'sse.js';
	let tabSet: number = 0;

	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	function getRandomInt(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}

	let currentKanji: number = getRandomInt(0, 24);

	function shuffleKanji() {
		currentKanji = getRandomInt(0, 24);
	}

	let context = '';
	let loading = false;
	let error = false;
	let answer = '';
	let chatMessages: ChatCompletionRequestMessage[] = [];

	const updateContext = async (char: string | null) => {
		answer = '';
		tabSet = 2;
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

<div id="card-deck" class="container h-full mx-auto">

	<!-- <div class="container flex items-center justify-center">
		<form action="?/reloadKanji" method="POST">
			<button class="btn variant-filled mt-12 rounded-lg" type="submit"
				>give me three more Kanji</button
			>
		</form>
	</div> -->

	<div class="container py-12 mx-auto">
		<div class="flex flex-wrap">
			{#each kanjis as character}
				<div class="p-4 md:w-1/3 w-full">
					<div class="card overflow-hidden">
						<header>
							<div class="bg-black/10 w-full aspect-[21/9] flex items-center justify-center">
								<p class="text-8xl">{character.kanji}</p>
							</div>
							<!-- <img
								src="https://source.unsplash.com/vjUokUWbFOs/400x175"
								class="bg-black/50 w-full aspect-[21/9]"
								alt="Post"
							/> -->
						</header>
						<div class="p-4 space-y-4 h-72 min-h-72 break-words">
							<h6 class="h6">{character.jlpt}</h6>
							<article>
								<TabGroup>
									<Tab bind:group={tabSet} name="tab1" value={0}>Meanings</Tab>
									<Tab bind:group={tabSet} name="tab2" value={1}>Readings</Tab>
									<Tab bind:group={tabSet} name="tab3" value={2}>Notes</Tab>
									<!-- Tab Panels --->
									<svelte:fragment slot="panel">
										{#if tabSet === 0}
											<article>
												{#if character.meaning}
													{character.meaning?.replaceAll(';', ', ')}
												{/if}
											</article>
										{:else if tabSet === 1}
											<p>Onyomi: {character.onyomi}</p>
											<p>Kunyomi: {character.kunyomi}</p>
										{:else if tabSet === 2}
											<div>
												<label class="label">
													<textarea
														required
														class="w-full h-36 textarea"
														placeholder="Ask AI for help with example vocabulary"
														name="context"
														bind:value={answer}
													/>
												</label>

												{#each chatMessages as message}
													<!-- <ChatMessage type={message.role} message={message.content} /> -->
												{/each}
												{#if answer}
													<!-- <div>
												<ChatMessage type="assistant" message={answer} />
											</div> -->
												{/if}
												{#if loading}
													<ChatMessage type="assistant" message="Loading.." />
												{/if}
											</div>
										{/if}
									</svelte:fragment>
								</TabGroup>
							</article>
						</div>
						<hr class="opacity-50" />
						<footer class="p-4 flex justify-start items-center space-x-4">
							<div class="flex-auto flex justify-between items-center">
							</div>
						</footer>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
