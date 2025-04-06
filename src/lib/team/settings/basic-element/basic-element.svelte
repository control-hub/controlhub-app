<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { Loader } from 'lucide-svelte';
	import { derived, readable, type Readable } from 'svelte/store';

	import { teamAccessStore, havePermission } from '$lib/stores';
	import { toastApi, cn } from '$lib/utils';
	import { writable } from 'svelte/store';

	export let title: string;
	export let description: string;

	export let executeFunction: () => Promise<any>;

	export let loading: string = 'Processing...';
	export let success: string = 'Success, your changes have been saved';
	export let error: string = 'Some error occurred, try again';
	export let actionMessage = 'Save';
	export let unAvailableMessage: string = '';
	export let accessNeeded: string = '';

	const available = derived(havePermission, ($havePermission) => $havePermission(accessNeeded));

	/*export let color:
		| 'red'
		| 'orange'
		| 'amber'
		| 'yellow'
		| 'lime'
		| 'green'
		| 'emerald'
		| 'teal'
		| 'cyan'
		| 'sky'
		| 'blue'
		| 'indigo'
		| 'violet'
		| 'purple'
		| 'fuchsia'
		| 'pink'
		| 'rose'
		| 'slate'
		| 'gray'
		| 'zinc'
		| 'neutral'
		| 'stone'
		| undefined = undefined;*/

	const isLoading = writable<boolean>(false);
	const changeSubmit = toastApi.execAsync(
		async () => {
			try {
				isLoading.set(true);
				const result = await executeFunction();
				isLoading.set(false);
				return result;
			} catch (err) {
				isLoading.set(false);
				throw err;
			}
		},
		success,
		error,
		loading
	);
</script>

<Card.Root>
	<Card.Content class="grid grid-cols-1 gap-2">
		<span class="text-2xl font-semibold">{title}</span>
		<span class="text-sm">{description}</span>
		<slot />
	</Card.Content>
	<Separator />
	<Card.Footer class="justify-end rounded-b-md bg-background p-4">
		{#if $available}
			{#if $isLoading}
				<Button variant="outline" disabled class="w-24">
					<Loader class="animate-spin" />
					{actionMessage}
				</Button>
			{:else}
				<Button onclick={changeSubmit} class="w-24">{actionMessage}</Button>
			{/if}
		{:else}
			<div class="flex w-full items-center justify-between">
				<span class="text-sm text-muted-foreground">{unAvailableMessage}</span>
			</div>
		{/if}
	</Card.Footer>
</Card.Root>
<!-- 'add_access','delete_access','edit_access','delete_team','edit_team','add_region','delete_region','edit_region','add_computer','delete_computer','edit_computer' -->
