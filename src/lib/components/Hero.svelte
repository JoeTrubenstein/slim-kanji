<script lang="ts">
	import HomeHeroComponents from './HomeHeroComponents.svelte';
    export let kanjis: any[];
</script>

<div class="container px-12 py-12 mx-auto">
<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-10 items-center">
	<!-- Info -->
	<div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4">
		<!-- <DocsLogoHero /> -->
		<h1 class="!text-5xl md:!text-6xl max-w-[600px]">AI-powered Tools for Learning Japanese</h1>
		<p class="!text-xl max-w-[475px]">
		 Supercharge your study routine with the world's most powerful public AI models
		</p>
		<div class="flex gap-4">
			<a href="#explainer" class="btn variant-filled rounded-lg">
				<span>Get Started</span>
				<i class="fa-solid fa-arrow-right-long" />
			</a>
			<a href="https://github.com/JoeTrubenstein/slim-kanji" class="btn variant-filled rounded-lg">Source Code</a>
		</div>
	</div>

	<!-- Components -->
	<div class="hidden md:inline-block w-full max-w-[650px] mx-auto mt-20">
		<HomeHeroComponents {kanjis} />
	</div>
</div>
</div>