<script lang="ts">
	import { tabsConfig } from '$lib/config.js';
	import { tabsStore } from '$lib/stores.js';

	tabsStore.set(tabsConfig.team);
</script>

<slot />
