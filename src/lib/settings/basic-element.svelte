<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { AsyncFunction } from '$lib/types';
	import { cn, toastApi } from '$lib/utils';

	let className: string = '';
	export { className as class };

	export let title: string = '';
	export let description: string = '';
	export let execute: AsyncFunction = async () => {};
	export let footer: string = '';
	export let destructive: boolean = false;
	export let useAlert: boolean = false;
	export let disabledSave: boolean = false;
	export let saveButtonText: string = 'Save';
	export let act = true;

	let openAlertDialog = false;
	const realFunction = async () => {
		await toastApi.execAsync(execute)();
		openAlertDialog = false;
	};
</script>

<Card.Root class={cn('w-[min(80%,90vw)]', destructive ? 'border-red-500/40' : className)}>
	<Card.Header class="gap-1">
		<Card.Title>{title}</Card.Title>
		<Card.Description>
			{description}
		</Card.Description>
	</Card.Header>

	<form on:submit|preventDefault={realFunction}>
		<Card.Content>
			<slot />
		</Card.Content>

		{#if act}
			<Card.Footer
				class={cn(
					'flex items-center justify-between border-t px-6 py-4',
					destructive ? 'bg-red-500/20' : 'bg-background/60'
				)}
			>
				<p class="text-sm text-muted-foreground">{footer}</p>

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
									This action cannot be undone. This will permanently change or delete your data
									from our servers.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<AlertDialog.Action onclick={realFunction}>Continue</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{/if}
			</Card.Footer>
		{/if}
	</form>
</Card.Root>
