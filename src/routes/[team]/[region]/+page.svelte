<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { computersStore, tabsStore } from '$lib/stores';
	import { ComputersTable } from '$lib/computer';
	import { tabsConfig } from '$lib/config';

	onMount(async () => {
		tabsStore.set(tabsConfig.region)
		await computersStore.subscribeOnPocketBase();
	});

	onDestroy(async () => {
		tabsStore.update((tabs) => (tabs === tabsConfig.region) ? [] : tabs)
		await computersStore.unsubscribeFromPocketBase();
	});

</script>

<ComputersTable />
