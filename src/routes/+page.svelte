<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ characters } = data);

	import Hero from '$lib/components/Hero.svelte';
	import Explainer from '$lib/components/Explainer.svelte';

</script>

<!-- <SuperDebug data={$form} /> -->
{#if characters[0].kanji}
<Hero kanjis={characters} />
<Explainer characters={characters} />
{/if}

{#if !characters[0].kanji}
<p>loading</p>
{/if}

<!-- <Signup /> -->
