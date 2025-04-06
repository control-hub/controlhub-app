<script lang="ts">
	import { tabsConfig } from '$lib/config';
	import { tabsStore } from '$lib/stores.js';

	tabsStore.set(tabsConfig.region);
</script>

<slot />
