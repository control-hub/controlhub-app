<script lang="ts">
	import { Play } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { ComputersResponse, ScriptsResponse } from '$lib/types';
	import { scriptsStore, userStore } from '$lib/stores';
	import { writable, type Writable, derived, type Readable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import Search from './search.svelte';
	import { toast } from 'svelte-sonner';

	let visible: boolean = false;
	export let dialogVisible: boolean = false;
	const value: Writable<string> = writable('');
	const selectedScript = derived([scriptsStore, value], ([$scriptsStore, $value]) => {
		return $scriptsStore.find((script) => script.id === $value) || undefined;
	});

	const dynamicVariablesRegexp = /\{\{(.+?)\}\}/g;
	const dynamicVariables = derived([selectedScript], ([$selectedScript]) => {
		if (!$selectedScript?.executable) return [];

		const matches = [];
		const text = $selectedScript.executable;
		let match;

		// Reset the regexp before using it
		dynamicVariablesRegexp.lastIndex = 0;

		while ((match = dynamicVariablesRegexp.exec(text)) !== null) {
			// match[1] contains the first capturing group (the content between {{ and }})
			matches.push(match[1]);
		}

		return Array.from(new Set(matches));
	});

	const dynamicVariablesForm = writable(new Map<string, string>());

	export let selectedComputers: Writable<ComputersResponse[]> = writable([]);

	const replaceExecutable = () => {
		let executable = $selectedScript?.executable || '';
		$dynamicVariables.forEach((variable) => {
			// @ts-ignore
			executable = executable.replace(`{{${variable}}}`, $dynamicVariablesForm[variable]);
		});
		return executable;
	};

	const executeScript = async () => {
		visible = false;
		const replacedExecutable = replaceExecutable();

		try {
			const promises = $selectedComputers.map((computer) => {
				return pb.collection('executions').create({
					completed: false,
					executable: replacedExecutable,
					computer: computer.id,
					script: $selectedScript?.id,
					user: $userStore?.id
				});
			});

			// await Promise.all(promises);
			toast.success('Script executed successfully');
		} catch (error) {
			toast.error('Error executing script, may be you do not have permission');
		}

		console.log(replacedExecutable);
	};
</script>

<Dialog.Root bind:open={visible}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<button
				class="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary/50 {dialogVisible
					? ''
					: 'opacity-0'}"
				{...props}
			>
				<Play class="size-5 py-[2px]" />
			</button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Execute command</Dialog.Title>
			<Dialog.Description>
				This action executes your command on selected computers
			</Dialog.Description>
		</Dialog.Header>
		<Search bind:value={$value} />
		<form class="grid grid-cols-2 gap-4" onsubmit={executeScript}>
			{#each $dynamicVariables as variable}
				<Input
					id={variable}
					placeholder={variable}
					bind:value={($dynamicVariablesForm as any)[variable]}
					required
				/>
			{/each}
			<Button class="col-span-2" type="submit">Execute</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
