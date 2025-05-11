<script lang="ts">
	import { type WithChildren } from 'bits-ui';
	import { useImageCropperTrigger } from './image-cropper.svelte.js';

	let { children }: WithChildren = $props();

	const triggerState = useImageCropperTrigger();
</script>

<label for={triggerState.rootState.id} class="hover:cursor-pointer">
	{@render children?.()}
</label>
