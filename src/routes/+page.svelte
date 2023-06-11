<script lang="ts">

	import type { PageData } from './$types';
	
	export let data: PageData;

	$: ({ characters } = data);

</script>

<div class="container h-full mx-auto">
	<h1 class="h1">Welcome to Slim Kanji.</h1>
	<div class="container px-4 py-24 mx-auto">
		<div class="flex flex-wrap p-4">

			{#each characters as character}
		    <div class="p-2 md:w-1/3 w-full overflow-hidden">

				<div class="card w-full h-80 min-h-full overflow-hidden">
					
			    <header class="card-header h1 flex items-center justify-center">{character.kanji}</header>

			    <section class="p-4">
					<p class="h5">onyomi</p>
					<p>{character.onyomi}</p>
					<p class="h5">kunyomi</p>
					<p>{character.kunyomi}</p>
				</section>

			    <footer class="card-footer">
					<p class="h5">meaning</p>
					<p>{character.meaning}</p>
				</footer>

			    </div>

			</div>
			{/each}

		</div>
	</div>
</div>
