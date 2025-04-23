<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import { Button } from '$lib/components/ui/button';
	import { DotsHorizontal } from 'svelte-radix';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import { shrinkString } from '$lib/utils';
	import { icon } from '$lib/config';
	// import { isOwner } from '$lib/store/team_store';

	import type { ScriptsResponse, UsersResponse } from '$lib/types';

	export let script: ScriptsResponse;
</script>

<Card.Root class="relative col-[1/-1] h-[130px] animate-fade-in-up sm:col-auto">
	<div class="mx-6 my-4 flex max-w-full flex-wrap justify-between">
		<div class="block max-w-[calc(100%-4rem)]">
			<Card.Header>
				<div class="flex items-baseline gap-4">
					<Card.Title class="mb-3 w-full">{shrinkString(script.name, 20)}</Card.Title>
					<Badge variant={script.public ? 'secondary' : 'outline'}
						>{script.public ? 'Public' : 'Private'}</Badge
					>
				</div>
			</Card.Header>
			<Card.Footer>
				<Card.Description>{script.description}</Card.Description>
			</Card.Footer>
		</div>
		<Button
			variant="outline"
			class="z-20 my-auto aspect-square flex-shrink-0 hover:bg-background"
			href="/scripts/{(script.expand as { user?: UsersResponse })?.user?.username ||
				''}/{script.name}"
		>
			<DotsHorizontal class={icon.default} />
		</Button>
	</div>
	<a
		href="/scripts/{(script.expand as { user?: UsersResponse })?.user?.username ||
			's'}/{script.name}"
		aria-label={script.name}
	>
		<div class="absolute inset-0 z-10"></div>
	</a>
</Card.Root>
