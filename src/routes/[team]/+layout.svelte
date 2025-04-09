<script lang="ts">
	import { teamStore, teamAccessStore, teamsStore } from '$lib/stores.js';
	import { beforeNavigateOut } from '$lib/utils';

	beforeNavigateOut(() => {
		teamAccessStore.set(undefined);
		teamStore.set(undefined);
		teamsStore.set([]);
	});
</script>

<slot />
