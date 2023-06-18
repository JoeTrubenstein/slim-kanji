<script lang="ts">
	import { goto } from '$app/navigation';
	import { firebaseAuth } from '$lib/firebase';
	import { createUserWithEmailAndPassword} from 'firebase/auth';
	// Modals Utils
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';

	let email: string;
	let password: string;
	let confirmpassword: string;
	let errorMessage: string;
	let success: boolean | undefined = undefined;

	const register = () => {
		if (password !== confirmpassword) {
			errorMessage = "passwords don't match";
			modalError();
		} else {
			createUserWithEmailAndPassword(firebaseAuth, email, password)
				.then((userCredentials) => {
					modalReg();
				})
				.then(() => {
					goto('/login');
				})
				.catch((error) => {
					const errorCode = error.code;
					errorMessage = error.message;
					modalError();
					console.log(errorCode, errorMessage);
					success = false;
				});
		}
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
				<h1 class="text-xl">Create account</h1>
				<form on:submit|preventDefault={register} class="space-y-4 md:space-y-6">
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
					<div>
						<label for="confirm-password" class="label">Confirm password</label>
						<input
							bind:value={confirmpassword}
							type="password"
							name="confirmpassword"
							id="confirmpassword"
							placeholder="••••••••"
							class="input rounded-lg"
							required
						/>
					</div>
					<div class="flex items-start">
						<div class="flex items-center h-5">
							<input
								id="terms"
								aria-describedby="terms"
								type="checkbox"
								class="checkbox"
								required
							/>
						</div>
						<div class="ml-3 text-sm">
							<label for="terms" class="label"
								>I accept the <a class="font-medium" href="../#">Terms and Conditions</a></label
							>
						</div>
					</div>
					<button type="submit" class="btn variant-filled rounded-lg">Create an account</button>
					<p class="text-sm font-light">
						Already have an account? <a href="../login" class="font-medium">Login here</a>
					</p>
				</form>
			</div>
		</div>
	</div>
</section>
