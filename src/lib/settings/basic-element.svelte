<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { AsyncFunction } from '$lib/types';
	import { cn } from '$lib/utils';

	let className: string = '';
	export { className as class };

	export let title: string = '';
	export let description: string = '';
	export let execute: AsyncFunction = async () => {};
	export let footer: string = '';
	export let destructive: boolean = false;
	export let useAlert: boolean = false;
	export let alertMessage: string =
		'This action cannot be undone. This will permanently change or delete your data from our servers.';
	export let disabledSave: boolean = false;
	export let saveButtonText: string = 'Save';
	export let act = true;
	export let putSlotInHeader: boolean = false;

	let openAlertDialog = false;
	const realFunction = async () => {
		await execute();
		openAlertDialog = false;
	};
</script>

<Card.Root class={cn('w-[min(100%,60rem)]', destructive ? 'border-red-500/40' : '', className)}>
	{#if !putSlotInHeader}
		<Card.Header class="gap-1">
			<Card.Title class="text-lg">{title}</Card.Title>
			<Card.Description>
				{description}
			</Card.Description>
		</Card.Header>
	{:else}
		<Card.Header class="flex flex-row justify-between pb-6">
			<div class="flex flex-col gap-1 mr-4">
				<Card.Title class="text-lg">{title}</Card.Title>
				<Card.Description>
					{description}
				</Card.Description>
			</div>
			<slot />
		</Card.Header>
	{/if}

	<form on:submit|preventDefault={realFunction}>
		{#if !putSlotInHeader}
			<Card.Content>
				<slot />
			</Card.Content>
		{/if}

		<Card.Footer
			class={cn(
				'flex items-center justify-between border-t px-6 py-4',
				destructive ? 'bg-red-500/20 border-red-500/40' : 'bg-background/60'
			)}
		>
			<p class="text-sm text-muted-foreground">{footer}</p>

			{#if act}
				{#if !useAlert}
					<Button
						type="submit"
						variant={destructive ? 'destructive' : 'default'}
						disabled={disabledSave}>{saveButtonText}</Button
					>
				{:else}
					<AlertDialog.Root bind:open={openAlertDialog}>
						<AlertDialog.Trigger>
							{#snippet child({ props })}
								<Button
									variant={destructive ? 'destructive' : 'default'}
									disabled={disabledSave}
									{...props}>{saveButtonText}</Button
								>
							{/snippet}
							<Button variant={destructive ? 'destructive' : 'default'}>{saveButtonText}</Button>
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
								<AlertDialog.Description>
									{alertMessage}
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<AlertDialog.Action onclick={realFunction}>Continue</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{/if}
			{/if}
		</Card.Footer>
	</form>
</Card.Root>
