<!-- <script lang="ts">
	import { Avatar, ProgressRadial, RadioGroup, RadioItem, SlideToggle, LightSwitch } from '@skeletonlabs/skeleton';

	// Local
	let value = 0;
	let demoSlideToggle = true;
    export let kanjis: any[];
    import logo from '$lib/assets/skelly.png';
</script>
 -->

<!-- 

 
<div id="card-deck" class="container h-full mx-auto">
	<div class="container flex items-center justify-center">
		<form action="?/reloadKanji" method="POST">
			<button class="btn variant-filled mt-12 rounded-lg" type="submit"
				>give me three more Kanji</button
			>
		</form>
	</div>


    
	<div class="container py-12 mx-auto">
		<div class="flex flex-wrap">
			{#each kanjis as character}
				<div class="p-4 md:w-1/3 w-full">
					<div class="card overflow-hidden">
						<header>
							<div class="bg-black/10 w-full aspect-[21/9] flex items-center justify-center">
								<p class="text-8xl">{character.kanji}</p>
							</div>
							<img src="https://source.unsplash.com/vjUokUWbFOs/400x175" class="bg-black/50 w-full aspect-[21/9]" alt="Post" />
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
									class="btn variant-filled rounded-lg"
									on:click={() => updateContext(character.kanji)}>add to generator</button
								>
								<small>On {new Date().toLocaleDateString()}</small>
							</div>
						</footer>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div> -->
