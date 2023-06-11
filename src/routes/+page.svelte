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

	const handleSubmit = async () => {
		loading = true;
		error = false;
		if (context.length > 1) {
			error = true;
			loading = false;
			alert('please enter a single Kanji character');
			return
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
			<button class="btn-icon variant-filled mt-6" type="submit">新</button>
		</form>
	</div>

	<div class="container py-12 mx-auto">
		<div class="flex flex-wrap">
			{#each characters as character}
				<div class="p-4 md:w-1/3 w-full">
					<div class="card w-full break-words h-64 min-h-64">
						<header class="card-header h1 flex items-center justify-center">
							{character.kanji}
						</header>

						<section class="p-4">
							<p>{character.onyomi}</p>
							<p>{character.kunyomi}</p>
						</section>

						<footer class="card-footer">
							<p>{character.meaning}</p>
						</footer>
					</div>
				</div>
			{/each}
		</div>
		<div class="container flex items-center justify-center">
			<form class="md:w-1/3 w-full p-4 text-center" on:submit|preventDefault={() => handleSubmit()}>
				<label class="label">
					<span>Enter a Kanji to see example words</span>
					<input
						required
						class="input mt-4"
						type="text"
						placeholder="城"
						name="context"
						bind:value={context}
					/>
				</label>
				<button class="btn-icon variant-filled mt-6" type="submit">例</button>
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
