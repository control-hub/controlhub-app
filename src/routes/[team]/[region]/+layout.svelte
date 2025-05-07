<script lang="ts">
	import { teamStore, teamAccessStore } from '$lib/stores.js';
	import { beforeNavigateOut } from '$lib/utils';

	beforeNavigateOut(() => {
		teamAccessStore.set(undefined);
		teamStore.set(undefined);
	});
</script>

<slot />
