<script lang="ts">
	import Cropper, { type CropperProps } from 'svelte-easy-crop';
	import { useImageCropperCropper } from './image-cropper.svelte.js';

	let {
		cropShape = 'round',
		aspect = 1,
		showGrid = false,
		...rest
	}: Omit<Partial<CropperProps>, 'oncropcomplete' | 'image'> = $props();

	const cropperState = useImageCropperCropper();
</script>

<!-- This needs to be relative https://github.com/ValentinH/svelte-easy-crop#basic-usage -->
<div class="relative h-full w-full">
	<Cropper
		{...rest}
		{cropShape}
		{aspect}
		{showGrid}
		image={cropperState.rootState.tempUrl}
		oncropcomplete={cropperState.onCropComplete}
	/>
</div>
