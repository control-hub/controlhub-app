<script lang="ts">
	import { ScriptsEditor } from '$lib/script';
	import { scriptStore, userStore } from '$lib/stores';
	import { derived, writable } from 'svelte/store';

	const editable = derived([scriptStore, userStore], ([$scriptStore, $userStore]) => {
		return $scriptStore?.user == $userStore?.id;
	});
</script>

<div class="grid grid-cols-1 gap-4">
	<ScriptsEditor editable={$editable}/>
</div>
