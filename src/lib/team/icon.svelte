<script lang="ts">
	import type { TeamsResponse } from '$lib/types';
	import {randintSeed} from '$lib/utils';
    import {
		Cuboid,
		Cylinder,
		Diameter,
		Eclipse,
		Radius,
		Box,
		Package,
		Bolt,
		Container,
		Pyramid,
		TriangleRight,
		Blend,
		Pentagon,
		Hexagon,
		CircleDot,
		CircleDotDashed,
		Cone,
		Square,
		Triangle,
		Tangent,
		Torus,
		SquareDashed
	} from 'lucide-svelte';

    let className: string = '';
    
    export let team: TeamsResponse | undefined = undefined;
    export { className as class };

    const logos = [
		Cuboid,
		Cylinder,
		Diameter,
		Eclipse,
		Radius,
		Box,
		Package,
		Bolt,
		Container,
		Pyramid,
		TriangleRight,
		Blend,
		Pentagon,
		Hexagon,
		CircleDot,
		CircleDotDashed,
		Cone,
		Square,
		Triangle,
		Tangent,
		Torus
	];
</script>

{#if team !== undefined}
    <svelte:component this={logos[randintSeed(team.id, 0, logos.length - 1)]} class={className}/>
{:else}
    <SquareDashed class={className}/>
{/if}