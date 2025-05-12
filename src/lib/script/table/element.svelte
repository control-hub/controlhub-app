<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button';
	import { DotsHorizontal } from 'svelte-radix';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import { shrinkString } from '$lib/utils';
	import { icon } from '$lib/config';
	// import { isOwner } from '$lib/store/team_store';

	import type { ScriptsResponse, UsersResponse } from '$lib/types';
	import { userStore } from '$lib/stores';

	export let script: ScriptsResponse;
</script>

<Card.Root class="relative col-[1/-1] animate-fade-in-up sm:col-auto">
	<div class="mx-6 my-4 flex min-w-[calc(100%-4rem)] min-h-[calc(100%-2rem)] max-h-[calc(100%-2rem)] items-center justify-between max-sm:items-start max-sm:flex-col gap-4">
		<div class="block max-w-[calc(100%-4rem)] max-sm:max-w-full">
			<Card.Header>
				<div class="flex items-baseline gap-4">
					<Card.Title class="mb-3">{shrinkString(script.name, 32)}</Card.Title>
					<Badge variant={script.public ? 'secondary' : 'outline'}
						>{script.public ? 'Public' : 'Private'}</Badge
					>
				</div>
			</Card.Header>
			<Card.Footer>
				<Card.Description>{shrinkString(script.description, 144)}</Card.Description>
			</Card.Footer>
		</div>
		<Badge variant="secondary" class="h-6 max-sm:ml-6">Executed:&nbsp;{script.executed}</Badge>
	</div>
	<a
		href="/scripts/{(script.expand as { user?: UsersResponse })?.user?.username ||
			$userStore?.username || ''}/{script.name}"
		aria-label={script.name}
	>
		<div class="absolute inset-0 z-10"></div>
	</a>
</Card.Root>
