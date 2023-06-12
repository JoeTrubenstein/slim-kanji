<script lang="ts">
	import { Avatar, ProgressRadial, RadioGroup, RadioItem, SlideToggle, LightSwitch } from '@skeletonlabs/skeleton';

	// Local
	let value = 0;
	let demoSlideToggle = true;
    export let kanjis: any[];
    import logo from '$lib/assets/skelly.png';
</script>

<!-- variant-ringed-error -->
<div class="aspect-video relative">

    	<!-- Avatar -->
	<div class="anim-float-avatar absolute z-[1] top-[32%] left-[40%]">
		<Avatar src="https://source.unsplash.com/9Ev3ctTEaWA/128x128" width="w-32" shadow="shadow-xl" />
	</div>


	<!-- Progress Radial -->
	<div class="anim-float-progress anim-delay-200 absolute z-[1] top-[0%] left-[10%]">
		<div class="card variant-glass p-4 text-5xl">
            {kanjis[0].kanji}
			<!-- <ProgressRadial width="w-20" stroke={150} meter="stroke-primary-500" track="stroke-primary-500/30" /> -->
		</div>
	</div>

	<!-- Radio Group -->
	<div class="anim-float-radio absolute z-[1] top-[20%] left-[70%]">
        <div class="card variant-glass p-4 text-5xl">
            {kanjis[1].kanji}
        </div>
	</div>

	<!-- Card -->
	<div class="anim-float-card absolute z-[1] top-[80%] left-[35%]">
        <div class="card variant-glass p-4 text-5xl">
            {kanjis[2].kanji}
        </div>
	</div>


	<!-- BG Circles -->
	<div class="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-0">

		<div class="w-96 h-72 border-2 border-black/5 dark:border-white/5 rounded-xl flex justify-center items-center">
			<div class="w-[200px] aspect-square border-2 border-black/5 dark:border-white/5 rounded-full flex justify-center items-center" />
		</div>

	</div>
</div>

<style lang="postcss">
	.anim-float-avatar {
		animation: float-up 13s ease-in-out infinite;
	}
	.anim-float-progress {
		animation: float-down 15s ease-in-out infinite;
	}
	.anim-float-radio {
		animation: float-down 17s ease-in-out infinite;
	}
	.anim-float-card {
		animation: float-up 12s ease-in-out infinite;
	}

	/* prettier-ignore */
	@keyframes float-up {
		0% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
		100% { transform: translateY(0px); }
	}
	/* prettier-ignore */
	@keyframes float-down {
		0% { transform: translateY(0px); }
		50% { transform: translateY(20px); }
		100% { transform: translateY(0px); }
	}
</style>