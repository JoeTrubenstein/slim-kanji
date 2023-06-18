<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import { AppBar, AppShell, LightSwitch, Modal } from '@skeletonlabs/skeleton';
	import '../app.postcss';

	import { onMount } from 'svelte';
	import { firebaseAuth } from '$lib/firebase';

	let currentUserEmail: string | null;
	let currentUserUid: string | null;

	const handleLogout = () => {
    firebaseAuth.signOut()
	.then(()=>{
		console.log("signed out")
      })
      .catch((error) => {
        console.log(error);
      });
  };

	onMount(() => {
		firebaseAuth.onAuthStateChanged((user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/auth.user
				const uid = user.uid;
				const email =user.email
				currentUserEmail = email;
				currentUserUid = uid;
				// ...
			} else {
				console.log('no user');
				// User is signed out
				// ...
			}
		});
	});
</script>

<!-- App Shell -->
<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Toruben</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<!-- links -->
				{#if currentUserEmail}
				<small class="pl-4px">{currentUserEmail}</small>
				<button class="btn" on:click={handleLogout}>Logout</button>
				{/if}
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
