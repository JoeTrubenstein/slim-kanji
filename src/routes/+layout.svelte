<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import { AppBar, AppShell, LightSwitch, Modal } from '@skeletonlabs/skeleton';
	import { get } from 'svelte/store';
	
	import '../app.postcss';

	import { onMount } from 'svelte';
	import { firebaseAuth } from '$lib/firebase';
	import { userEmail, userId } from '$lib/store';
	
	const handleLogout = () => {
    firebaseAuth.signOut()
	.then(()=>{
		userEmail.set("none");
		userId.set("none");
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
				userId.set(uid || "cant set uid");
				userEmail.set(email || "cant set email");
				console.log(get(userEmail))
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
				{#if $userEmail !== "none"}
				<small class="pl-4px">{get(userEmail)}</small>
				<button class="btn" on:click={handleLogout}>Logout</button>
				{/if}
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
