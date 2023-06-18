<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ characters } = data);
	import CardDeck from '$lib/components/CardDeck.svelte';

</script>

<div class="text-center py-12 h3">
	<h3>🏗 Under Construction / 工事中👷‍♂️</h3>
	<p>Thank you for signing up early, but this needs a lot more work!</p>
	<p>Please excuse the mess</p>
</div>

<CardDeck kanjis={characters} />
