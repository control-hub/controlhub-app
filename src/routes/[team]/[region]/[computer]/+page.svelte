<script lang="ts">
	import { ExecutionsTable } from '$lib/execution';
	import { executionsStore } from '$lib/stores';
	import { onMount, onDestroy } from 'svelte';
	
	onMount(async () => {
		await executionsStore.subscribeOnPocketBase();
	});

	onDestroy(async () => {
		await executionsStore.unsubscribeFromPocketBase();
	});
</script>

<ExecutionsTable />
