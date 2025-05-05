<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	import { DotsHorizontal } from 'svelte-radix';

	// import { CollectionStore } from 'pocketbase-store';
	import { shrinkString } from '$lib/utils';
	import { icon } from '$lib/config';
	// import type { LinksResponse, TeamsResponse } from '$lib/types';
	// import { isOwner } from '$lib/store/team_store';

	import CreateLink from './create.svelte';
	import { teamsLinkStore } from '$lib/stores';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';

	let host: string = '';

	if (browser) {
		host = window.location.host;
	}

	const copyLink = async (link: any) => {
		await navigator.clipboard.writeText(host + '/invite/' + link.token);
		toast.success('Link copied to clipboard');
	};
</script>

<div class="grid grid-cols-1 gap-4 pb-6" class:!grid-cols-1={$teamsLinkStore.length === 0}>
	<CreateLink />
	<!-- {/if} -->
	{#each $teamsLinkStore as link (link.id)}
		<Card.Root class="relative col-[1/-1] h-full animate-fade-in-up sm:col-auto">
			<div class="mx-6 my-4 flex max-w-full flex-wrap items-start justify-between align-middle">
				<div class="block max-w-[calc(100%-4rem)]">
					<Card.Header>
						<Card.Title class="notranslate mb-3 w-full">{shrinkString(link.token, 20)}</Card.Title>
					</Card.Header>
					<Card.Footer>
						<Card.Description class="flex flex-col gap-2">
							<div class="flex max-w-full flex-row flex-wrap gap-2">
								<span>Permissions:</span>
								{#each link.permissions as permission}
									<Badge>{permission}</Badge>
								{/each}
							</div>
                            <div class="flex max-w-full flex-row flex-wrap gap-2">
                                <span>Joined: {link.joined.length}</span>
                            </div>
						</Card.Description>
					</Card.Footer>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="z-20 my-auto aspect-square flex-shrink-0 hover:bg-background"
								{...props}
							>
								<DotsHorizontal class={icon.default} />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
							<DropdownMenu.Separator />
							<DropdownMenu.Item onclick={() => copyLink(link)}>Copy link</DropdownMenu.Item>
							<DropdownMenu.Item>Delete</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<span>
				<div class="absolute inset-0 z-10"></div>
			</span>
		</Card.Root>
	{/each}
</div>
