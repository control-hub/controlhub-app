<script lang="ts">
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($userStore) {
			goto('/teams');
		}
	});
</script>