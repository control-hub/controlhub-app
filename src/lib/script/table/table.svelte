<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import { PlusCircle } from 'lucide-svelte';
	import { DotsHorizontal } from 'svelte-radix';

	import { writable, derived, type Writable } from 'svelte/store';
	import { toastApi, shrinkString } from '$lib/utils';
	import { icon } from '$lib/config';
	// import { isOwner } from '$lib/store/team_store';

	import { scriptsStore, teamStore, userStore } from '$lib/stores';
	import type { UsersResponse } from '$lib/types';

	export let filterPhrase: Writable<string>;
	export let showPublic: Writable<boolean> = writable(false);

	const filteredScriptsStore = derived(
		[scriptsStore, filterPhrase, showPublic],
		([$scriptsStore, $filterPhrase, $showPublic]) => {
			return $scriptsStore.filter((script) => {
				return (
					script.name.toLowerCase().includes($filterPhrase.toLowerCase()) &&
					($showPublic || script.user === $userStore?.id)
				);
			});
		}
	);

	const scriptDialogOpen = writable(false);
	const scriptForm = writable({
		name: '',
		description: '',
		public: false
	});

	async function createScript() {
		const result = scriptsStore.create({
			...$scriptForm,
			user: $userStore?.id as string
		});
		scriptDialogOpen.set(false);
		await result;
	}
</script>

<div
	class="grid grid-cols-2 gap-4 pb-6 max-lg:grid-cols-1"
	class:!grid-cols-1={$filteredScriptsStore.length === 0}
>
	<!-- {#if $isOwner} -->
	<Dialog.Root bind:open={$scriptDialogOpen}>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					class="relative h-[130px] w-full animate-fade-in-up text-center max-lg:h-[80px] sm:col-auto"
					variant="outline"
				>
					Create script
					<PlusCircle class={icon.left} />
				</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]" trapFocus={false}>
			<Dialog.Header>
				<Dialog.Title>Create script</Dialog.Title>
				<Dialog.Description>Enter your new script name.</Dialog.Description>
			</Dialog.Header>
			<form
				class="flex flex-col gap-2"
				on:submit|preventDefault={toastApi.execAsync(
					createScript,
					`Script ${$scriptForm.name} created.`,
					`Failed to create script ${$scriptForm.name}, my be this script already exists.`
				)}
			>
				<div class="flex w-full gap-2">
					<Input id="name" placeholder="Script name" bind:value={$scriptForm.name} required />
					<Button type="submit" class="h-full">Create <PlusCircle class={icon.left} /></Button>
				</div>
				<div class="grid w-full grid-cols-1 gap-2">
					<Input
						id="description"
						placeholder="Description"
						role="textbox"
						bind:value={$scriptForm.description}
					/>
				</div>
				<div class="flex w-full justify-end gap-2 align-middle">
					<label for="public" class="peer-disabled:opacity-70">Public</label>
					<Switch id="public" class="mt-1" bind:checked={$scriptForm.public} />
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Root>
	<!-- {/if} -->
	{#each $filteredScriptsStore as script (script.id)}
		<Card.Root class="relative col-[1/-1] h-[130px] animate-fade-in-up sm:col-auto">
			<div class="mx-6 my-4 flex max-w-full flex-wrap items-start justify-between align-middle">
				<div class="block max-w-[calc(100%-4rem)]">
					<Card.Header>
						<Card.Title class="mb-3 w-full">{shrinkString(script.name, 20)}</Card.Title>
					</Card.Header>
					<Card.Footer>
						<Card.Description>{script.description}</Card.Description>
					</Card.Footer>
				</div>
				<Button
					variant="outline"
					class="z-20 my-auto aspect-square flex-shrink-0 hover:bg-background"
					href="/scripts/{(script.expand as { user: UsersResponse }).user.username}/{script.name}"
				>
					<DotsHorizontal class={icon.default} />
				</Button>
			</div>
			<a
				href="/scripts/{(script.expand as { user: UsersResponse }).user.username}/{script.name}"
				aria-label={script.name}
			>
				<div class="absolute inset-0 z-10"></div>
			</a>
		</Card.Root>
	{/each}
</div>
