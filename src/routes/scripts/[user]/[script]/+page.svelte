<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	import { ScriptsEditor } from '$lib/script/editor';
	import { scriptStore, userStore } from '$lib/stores';
	import { derived, writable } from 'svelte/store';

	const editable = derived([scriptStore, userStore], ([$scriptStore, $userStore]) => {
		return $scriptStore?.user == $userStore?.id;
	});
</script>

<div class="grid grid-cols-1 gap-4">
	<ScriptsEditor editable={$editable}/>
</div>
