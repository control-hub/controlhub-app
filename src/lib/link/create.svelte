<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { writable } from 'svelte/store';
	import { toastApi } from '$lib/utils';
	import { icon } from '$lib/config';
	import { PlusCircle } from 'lucide-svelte';
    import { teamsLinkStore, teamStore } from '$lib/stores';
	import { generateToken } from '$lib/utils';

	const defaultPermissions = [
		'add_access',
		'delete_access',
		'edit_access',
		'delete_team',
		'edit_team',
		'add_region',
		'delete_region',
		'edit_region',
		'add_computer',
		'delete_computer',
		'edit_computer'
	];

	const dialogOpen = writable(false);
	const selectedPermissions = writable<string[]>([]);

	const createLink = async () => {
		const token = generateToken(32);

		while (true) {
			try {
				await teamsLinkStore.create({
					team: $teamStore?.id as string,
					token: token,
					permissions: $selectedPermissions
				});

				break;
			} catch (err) {
				console.error(err);
			}
		}

		dialogOpen.set(false);
	};
</script>

<Dialog.Root bind:open={$dialogOpen}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				class="relative h-[130px] w-full animate-fade-in-up text-center max-lg:h-[80px] sm:col-auto"
				variant="outline"
			>
				Create link
				<PlusCircle class={icon.left} />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content trapFocus={false}>
		<Dialog.Header>
			<Dialog.Title>Create team</Dialog.Title>
			<Dialog.Description>Enter your new team name.</Dialog.Description>
		</Dialog.Header>
		<form
			class="flex gap-2"
			onsubmit={toastApi.execAsync(createLink, `New link created.`, `Failed to create new link.`)}
		>
			<div class="grid w-full grid-cols-3 gap-2">
				{#each defaultPermissions as permission}
					<Button
						variant={$selectedPermissions.includes(permission) ? 'default' : 'outline'}
						class="col-span-3"
						onclick={() =>
							selectedPermissions.update((p) =>
								p.includes(permission) ? p.filter((x) => x !== permission) : [...p, permission]
							)}
					>
						{permission}
					</Button>
				{/each}
			</div>
			<Button type="submit" class="h-full">Create</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
<!-- TODO add links table (list) -->
