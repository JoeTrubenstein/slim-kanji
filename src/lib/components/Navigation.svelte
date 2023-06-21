<script lang="ts">

import { userEmail } from '$lib/store';
import { get } from 'svelte/store';

</script>

<nav class="list-nav p-4 flex">
	<ul>
		<li><a href="/">Homepage</a></li>
		<li><a href="/login">Login</a></li>
        {#if $userEmail !== "none"}
        <li class="pl-4px">{get(userEmail)}</li>
      <!-- <li><button class="btn" on:click={handleLogout}>Logout</button></li>   -->
        {/if}
	</ul>
</nav>