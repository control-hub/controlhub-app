<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Play } from 'lucide-svelte';

	import { scriptsStore, selectedComputers } from '$lib/stores';
	import { writable } from 'svelte/store';
	import { toastApi } from '$lib/utils';
	import { icon } from '$lib/config';

	export let dialogOpen = writable(false);
</script>

<Dialog.Root bind:open={$dialogOpen}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				class="gap-0 bg-green-500 text-center"
				disabled={$selectedComputers.length === 0}
			>
				<Play class={icon.left} />
				Execute
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content trapFocus={false}>
		<Dialog.Header>
			<Dialog.Title>Create team</Dialog.Title>
			<Dialog.Description>Enter your new team name.</Dialog.Description>
		</Dialog.Header>
		<form>
			<Button type="submit">Create</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
