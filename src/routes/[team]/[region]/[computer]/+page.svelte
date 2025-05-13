<script lang="ts">
	import { ExecutionsTable } from '$lib/execution';
	import { executionsStore, tabsStore } from '$lib/stores';
	import { tabsConfig } from '$lib/config';
	import { onMount, onDestroy } from 'svelte';

	onMount(async () => {
		tabsStore.set(tabsConfig.computer)
		await executionsStore.subscribeOnPocketBase();
	});

	onDestroy(async () => {
		tabsStore.update((tabs) => (tabs === tabsConfig.computer) ? [] : tabs)
		await executionsStore.unsubscribeFromPocketBase();
	});
</script>

<ExecutionsTable />
