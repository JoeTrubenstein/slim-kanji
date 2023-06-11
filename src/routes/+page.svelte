<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ characters } = data);

	import type { CreateCompletionResponse } from 'openai';
	import { SSE } from 'sse.js';

	let context = '';
	let loading = false;
	let error = false;
	let answer = '';

	const updateContext = async (char: string | null) => {
		context = String(char);
	};

	const handleSubmit = async () => {
		loading = true;
		error = false;
		if (context.length > 1) {
			error = true;
			loading = false;
			alert('please enter a single Kanji character');
			return;
		}
		answer = '';

		const eventSource = new SSE('/api/words', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ context })
		});

		context = '';

		eventSource.addEventListener('error', (e) => {
			error = true;
			loading = false;
			alert('Something went wrong!');
		});

		eventSource.addEventListener('message', (e) => {
			try {
				loading = false;

				if (e.data === '[DONE]') {
					return;
				}

				const completionResponse: CreateCompletionResponse = JSON.parse(e.data);

				const [{ text }] = completionResponse.choices;

				answer = (answer ?? '') + text;
			} catch (err) {
				error = true;
				loading = false;
				console.error(err);
				alert('Something went wrong!');
			}
		});

		eventSource.stream();
	};
</script>

<div class="container h-full mx-auto">
	<h1 class="h1 text-center mt-12">Slim Kanji</h1>
	<p class="p text-center mt-12">SvelteKit + Prisma + OpenAI</p>
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
						<button
						class="btn variant-filled" 
						on:click={() => updateContext(character.kanji)}>add to generator</button
						>
						<!-- <small>On {new Date().toLocaleDateString()}</small> -->
					</div>
				</footer>
			</div>
</div>
				<!-- <div class="p-4 md:w-1/3 w-full">
					<div class="card w-full break-words h-80 min-h-80">
						<header class="card-header h1 flex items-center justify-center">
							{character.kanji}
						</header>

						<section class="p-4">
							<p>{character.onyomi}</p>
							<p>{character.kunyomi}</p>
						</section>

						<footer class="card-footer">
							<p>{character.meaning}</p>
							<button
							    class="btn-sm variant-filled mt-12" 
								on:click={() => updateContext(character.kanji)}>add to generator</button
							>
						</footer>
					</div>
				</div> -->
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
				<button class="btn variant-filled mt-6" type="submit">generate examples</button>
			</form>
		</div>

		<div class="p-2 container flex items-center justify-center">
			<div class=" text-center card md:w-3/5 w-full p-4">
				Examples will generate here:
				{#if answer}
					<p>{answer}</p>
				{/if}
			</div>
		</div>
	</div>
</div>
