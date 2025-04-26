<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { onMount, tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { scriptsStore, userStore } from '$lib/stores';
	import { writable } from 'svelte/store';

	// Props definition using the new Svelte 5 approach
	let { value = $bindable<string>() } = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	onMount(async () => {
		scriptsStore.getData();
	});

	const displayedValue = $derived(
		$scriptsStore.find((f) => f.id === value)?.name ?? 'Select a script...'
	);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-full justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				{displayedValue}
				<ChevronsUpDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root>
			<div class="flex">
				<Command.Input placeholder="Search script..." class="h-9" />
			</div>
			<Command.List>
				<Command.Empty>No script found.</Command.Empty>
				<Command.Group>
					{#each $scriptsStore as script (script.id)}
						<Command.Item
							class="flex h-12 justify-between"
							value={script.id}
							onSelect={() => {
								value = script.id;
								closeAndFocusTrigger();
							}}
						>
							<div class="flex items-center gap-2 space-x-2">
								<Check class={cn(value !== script.id && 'text-transparent')} />
								{script.name}
							</div>
							<Badge variant={script.public ? 'secondary' : 'outline'}
								>{script.public ? 'Public' : 'Private'}</Badge
							>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
