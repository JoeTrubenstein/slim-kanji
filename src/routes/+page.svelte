<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ characters } = data);

	import Hero from '$lib/components/Hero.svelte';
	import Explainer from '$lib/components/Explainer.svelte';

</script>

<!-- <SuperDebug data={$form} /> -->

<Hero kanjis={characters} />
<Explainer characters={characters} />

<!-- <Signup /> -->
