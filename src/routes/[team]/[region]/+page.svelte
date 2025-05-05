<script lang="ts">
	import { writable } from 'svelte/store';
	import { cn, beforeNavigateOut } from '$lib/utils';
	import { onMount, onDestroy } from 'svelte';
	import { computersStore, selectedComputers } from '$lib/stores';

	import { tabsStore } from '$lib/stores';

	import { ComputersTable } from '$lib/computer/table';

	onMount(async () => {
		await computersStore.subscribeOnPocketBase();
	});

	onDestroy(async () => {
		await computersStore.unsubscribeFromPocketBase();
	});

	beforeNavigateOut(() => {
		tabsStore.set([]);
	});
</script>

<ComputersTable />
