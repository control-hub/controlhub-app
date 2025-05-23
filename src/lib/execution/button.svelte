<script lang="ts">
	import { Play } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { ComputersResponse } from '$lib/types';
	import { scriptsStore, userStore } from '$lib/stores';
	import { getUserDefaultSearch } from '$lib/utils';
	import { writable, type Writable, type Readable, derived, readable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import Search from './search.svelte';
	import { toast } from 'svelte-sonner';

	const generateDefault = (variable: string): { key: string; default: string } => {
		if (!variable.includes('or')) {
			return { key: variable, default: '' };
		} else {
			return { key: variable.split('or')[0].trim(), default: variable.split('or')[1].trim() };
		}
	};

	let visible: boolean = false;
	const value: Writable<string> = writable('');
	const defaultSearchInput = getUserDefaultSearch($userStore) + '/';
	const searchInput = writable(defaultSearchInput);

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
	export let selectedComputers: Readable<ComputersResponse[]> = readable([]);

	dynamicVariables.subscribe((variables) => {
		dynamicVariablesForm.update((form) => {
			variables.forEach((variable) => {
				(form as any)[variable] = generateDefault(variable).default;
			});

			return form;
		});
	});

	const replaceExecutable = () => {
		let executable = $selectedScript?.executable || '';
		$dynamicVariables.forEach((variable) => {
			// @ts-ignore
			executable = executable.replace(`{{${variable}}}`, $dynamicVariablesForm[variable]);
		});

		let includeComputers = false;

		executable.split('\n').forEach((line) => {
			if (line.replaceAll(' ', '').toLowerCase() == '#computers') {
				includeComputers = true;
			}
		});

		const computersPart = includeComputers
			? 'import json\ncomputers = json.loads("' +
				JSON.stringify(
					$selectedComputers.map((computer) => {
						return { ...computer, token: '' };
					})
				)
					.replaceAll('\\', '\\\\')
					.replaceAll('"', '\\"') +
				'")\n'
			: '';

		return computersPart + executable;
	};

	const createExecution = async (computer: ComputersResponse, replacedExecutable: string) => {
		await pb.collection('executions').create({
			completed: false,
			executable: replacedExecutable,
			computer: computer.id,
			script: $selectedScript?.id,
			user: $userStore?.id
		});
	};

	const executeScript = async () => {
		visible = false;
		const replacedExecutable = replaceExecutable();

		try {
			const promises: Promise<any>[] = [];

			for (const computer of $selectedComputers) {
				if (computer.status !== '0') {
					promises.push(createExecution(computer, replacedExecutable));
				}
			}

			await Promise.all(promises);
			await fetch('/api/script/mark/', { method: 'POST' });

			searchInput.set(defaultSearchInput);
			value.set('');

			scriptsStore.updateOptions({
				filter: `user.username = "${$searchInput.split('/')[0]}"`,
				sort: '-executed,-created',
				autoSubGetData: false
			});

			toast.success('Script started successfully');
		} catch (error) {
			toast.error('Error executing script, may be you do not have permission');
		}
	};
</script>

<Dialog.Root bind:open={visible}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<button class="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary/50" {...props}>
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
		<Search {value} {searchInput} previousSearchInput={defaultSearchInput} />
		<form class="grid grid-cols-2 gap-4" onsubmit={executeScript}>
			{#each $dynamicVariables as variable (variable)}
				<Input
					id={variable}
					class="col-span-2"
					placeholder={generateDefault(variable).key}
					bind:value={($dynamicVariablesForm as any)[variable]}
					required
				/>
			{/each}
			<Button class="col-span-2" type="submit">Execute</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
