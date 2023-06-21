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
	import Navigation from '$lib/components/Navigation.svelte';
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	
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



const drawerSettings: DrawerSettings = {
	id: 'example-2',
	meta: { foo: 'bar', fizz: 'buzz', age: 40 },
	width: 'w-[280px] md:w-[480px]'
};

function drawerOpen(): void {
	drawerStore.open(drawerSettings);
}


</script>

<!-- App Shell -->
<Modal />

<Drawer>
	<Navigation />
</Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-48">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<strong class="text-xl uppercase">Toruben</strong>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

		<!-- Left Sidebar Slot -->
		<svelte:fragment slot="sidebarLeft">
			<Navigation />
		</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
