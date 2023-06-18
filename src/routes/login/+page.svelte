<script lang="ts">
	import { goto } from '$app/navigation';
    import { get } from 'svelte/store'
	import { firebaseAuth } from '$lib/firebase';
	import { signInWithEmailAndPassword } from 'firebase/auth';

	// Modals Utils
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';

	let email: string;
	let password: string;
	let errorMessage: string;
	let success: boolean | undefined = undefined;

	const logIn = () => {
		signInWithEmailAndPassword(firebaseAuth, email, password)
			.then((userCredential) => {
				console.log(userCredential)
			})
			.then(() => {
				goto('/dashboard');

			})
			.catch((error) => {
				const errorCode = error.code;
				errorMessage = error.message;
				modalError();
				success = false;
			});
	};

	function modalReg(): void {
		const modal: ModalSettings = {
			type: 'alert',
			title: 'Success!',
			body: `Account created for ${email}`,
			image: 'https://i.imgur.com/TykCy5e.gif',
			buttonTextCancel: 'Go back'
			// image: 'https://i.imgur.com/WOgTG96.gif'
		};
		modalStore.trigger(modal);
	}
	function modalError(): void {
		const modal: ModalSettings = {
			type: 'alert',
			title: 'Error!',
			body: errorMessage,
			image: 'https://i.imgur.com/TykCy5e.gif',
			buttonTextCancel: 'Go back'
			// image: 'https://i.imgur.com/WOgTG96.gif'
		};
		modalStore.trigger(modal);
	}
</script>

<section>
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<div class="w-full rounded-lg card md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl">Sign in</h1>
				<form on:submit|preventDefault={logIn} class="space-y-4 md:space-y-6">
					<div>
						<label for="email" class="label">Your email</label>
						<input
							bind:value={email}
							type="email"
							name="email"
							id="email"
							class="input rounded-lg"
							placeholder="name@company.com"
							required
						/>
					</div>
					<div>
						<label for="password" class="label">Password</label>
						<input
							bind:value={password}
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							class="input rounded-lg"
							required
						/>
					</div>
					<div class="flex items-start">
						<button type="submit" class="btn variant-filled rounded-lg">Sign in</button>
						<!-- <p class="text-sm font-light">
						Already have an account? <a href="../#" class="font-medium">Login here</a>
					</p> -->
					</div>
				</form>
			</div>
		</div>
	</div>
</section>

