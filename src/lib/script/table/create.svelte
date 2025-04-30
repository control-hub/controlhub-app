<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { PlusCircle } from 'lucide-svelte';

	import { writable } from 'svelte/store';
	import { toastApi } from '$lib/utils';
	import { icon } from '$lib/config';

	import { scriptsStore, userStore } from '$lib/stores';

	export let username: string | undefined = undefined;

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

{#if $userStore?.username === username}
	<Dialog.Root bind:open={$scriptDialogOpen}>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					class="relative w-60 animate-fade-in-up text-center"
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
	{/if}