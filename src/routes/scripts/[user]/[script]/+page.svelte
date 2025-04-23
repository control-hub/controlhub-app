<script lang="ts">
	import { ScriptsEditor } from '$lib/script/editor';
	import { scriptStore, userStore } from '$lib/stores';
</script>

<ScriptsEditor editable={$scriptStore?.user == $userStore?.id} />
