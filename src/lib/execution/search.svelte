<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { onMount, tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, getUserDefaultSearch } from '$lib/utils.js';
	import { userStore, usersStore, scriptsStore } from '$lib/stores';
	import { derived, writable, type Writable } from 'svelte/store';

	export let value: Writable<string> = writable('');

	export let previousSearchInput: string = getUserDefaultSearch($userStore) + '/';
	export let searchInput = writable(previousSearchInput);

	let open = false;
	let triggerRef: HTMLButtonElement;

	const inputUser = derived([searchInput], ([$searchInput]) => !$searchInput.includes('/'));

	const filteredScripts = derived([scriptsStore, searchInput], ([$scriptsStore, $searchInput]) => {
		return $scriptsStore.filter(
			(script) => !$inputUser && script.name.includes($searchInput.split('/')[1])
		);
	});

	const filteredUsers = derived([usersStore, searchInput], ([$usersStore, $searchInput]) => {
		return $usersStore.filter((user) => $inputUser && user.username.includes($searchInput));
	});

	onMount(() => {
		scriptsStore.updateOptions({
			filter: `user.username = "${getUserDefaultSearch($userStore) || $userStore?.username}"`,
			sort: '-executed,-created',
			autoSubGetData: false
		});

		scriptsStore.getData();
	});

	searchInput.subscribe(async ($searchInput) => {
		console.log($searchInput);

		const previousUser = previousSearchInput.split('/')[0] || '';
		const user = $searchInput.split('/')[0] || $userStore?.username || '';

		if (!$searchInput.includes('/')) {
			if ($searchInput.length < 3) {
				usersStore.set([]);
			} else if (previousUser !== user) {
				usersStore.updateOptions({
					filter: `username ~ "${$searchInput}"`,
					sort: '-created',
					autoSubGetData: false
				});

				await usersStore.getData();
			}
		}

		if ($searchInput.includes('/') && (user !== previousUser || !previousSearchInput.includes('/'))) {
			scriptsStore.updateOptions({
				filter: `user.username = "${user}"`,
				sort: '-executed,-created',
				autoSubGetData: false
			});

			await scriptsStore.getData();
		}

		previousSearchInput = $searchInput;
	});

	function closeAndFocusTrigger() {
		open = false;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:this={triggerRef as any}>
		<Button variant="outline" class="w-full justify-between" role="combobox" aria-expanded={open}>
			{$searchInput}
			<ChevronsUpDown class="opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root class="w-full" shouldFilter={false}>
			<div class="flex w-full">
				<Command.Input
					placeholder="Search script..."
					class="h-9 w-full"
					bind:value={$searchInput}
				/>
			</div>
			<!-- {#key $searchInput} -->
			{#if $inputUser}
				<Command.List>
					<Command.Empty>
						{#if $searchInput.length < 3}
							Search for at least 3 characters.
						{:else}
							No users found.
						{/if}
					</Command.Empty>
					<Command.Group>
						{#each $filteredUsers as user (user.id)}
							<Command.Item
								value={user.id}
								onclick={() => {
									searchInput.set(user.username + '/');
									// closeAndFocusTrigger();
								}}
							>
								<div class="flex items-center gap-2">
									{user.username}
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			{:else}
				<Command.List>
					<Command.Empty>No script found.</Command.Empty>
					<Command.Group>
						{#each $filteredScripts as script (script.id)}
							<Command.Item
								value={script.id}
								onclick={() => {
									searchInput.update((v) => {
										const user = v.split('/')[0];
										return `${user}/${script.name}`;
									});
									value.set(script.id);
									closeAndFocusTrigger();
								}}
							>
								<div class="flex items-center gap-2">
									<Check class={cn($searchInput !== script.id && 'text-transparent')} />
									{script.name}
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			{/if}
			<!-- {/key} -->
		</Command.Root>
	</Popover.Content>
</Popover.Root>
