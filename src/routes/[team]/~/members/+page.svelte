<script lang="ts">
	import { teamStore } from '$lib/stores.js';
	import { toastApi } from '$lib/utils';

	async function sleep(ms: number): Promise<void> {
		return new Promise((resolve, reject) =>
			setTimeout(() => {
				resolve();
				reject();
			}, ms)
		);
	}
</script>

<div class="w-[100%] border-b border-input py-10 text-3xl font-medium">
	<span class="ml-[calc(min(10%,100px))]"> Members </span>
</div>
<button onclick={toastApi.execAsync(async () => sleep(1000), 'Done', 'Error')}>as</button>
{$teamStore?.name}
