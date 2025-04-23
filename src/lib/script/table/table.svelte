<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';

	import ScriptCard from '$lib/script/table/element.svelte';

	import { writable, derived, type Writable } from 'svelte/store';
	import { toastApi } from '$lib/utils';
	import { icon } from '$lib/config';
	// import { isOwner } from '$lib/store/team_store';

	import { scriptsStore, teamStore, userStore } from '$lib/stores';

	export let filterPhrase: Writable<string>;
	export let showPublic: Writable<boolean> = writable(false);

	const filteredScriptsStore = derived(
		[scriptsStore, filterPhrase, showPublic],
		([$scriptsStore, $filterPhrase]) => {
			return $scriptsStore.filter((script) => {
				return (
					script.name.toLowerCase().includes($filterPhrase.toLowerCase()) &&
					script.user === $userStore?.id
				);
			});
		}
	);

	const otherPublicScriptsStore = derived(
		[scriptsStore, filterPhrase, showPublic],
		([$scriptsStore, $filterPhrase, $showPublic]) => {
			return $showPublic
				? $scriptsStore.filter((script) => {
						return (
							script.name.toLowerCase().includes($filterPhrase.toLowerCase()) &&
							script.user !== $userStore?.id
						);
					})
				: [];
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
			<form
				class="flex flex-col gap-2"
				on:submit|preventDefault={toastApi.execAsync(
					createScript,
					`Script ${$scriptForm.name} created.`,
					`Failed to create script ${$scriptForm.name}, my be this script already exists.`
				)}
			>
				<Dialog.Header>
					<Dialog.Title>Create script</Dialog.Title>
					<Dialog.Description>Enter your new script name.</Dialog.Description>
				</Dialog.Header>

				<div class="flex w-full gap-2">
					<Input id="name" placeholder="Script name" bind:value={$scriptForm.name} required />
					<Checkbox id="public" class="" bind:checked={$scriptForm.public} />
				</div>
				<div class="grid w-full grid-cols-1 gap-2">
					<Input
						id="description"
						placeholder="Description"
						role="textbox"
						bind:value={$scriptForm.description}
					/>
				</div>
				<Dialog.Footer>
					<Button type="submit" class="mt-4">Create <PlusCircle class={icon.left} /></Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
	<!-- {/if} -->
	{#each $filteredScriptsStore as script (script.id)}
		<ScriptCard {script} />
	{/each}
</div>

{#if $otherPublicScriptsStore.length > 0}
	<Separator class="animate-fade-in-up" />

	<div
		class="grid animate-fade-in-up grid-cols-2 gap-4 py-6 max-lg:grid-cols-1"
		class:!grid-cols-1={$filteredScriptsStore.length === 0}
	>
		{#each $otherPublicScriptsStore as script (script.id)}
			<ScriptCard {script} />
		{/each}
	</div>
{/if}
