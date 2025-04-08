<script lang="ts">
	import AudioWaveform from '@lucide/svelte/icons/audio-waveform';
	import { FileCode2 } from 'lucide-svelte';
	import Command from '@lucide/svelte/icons/command';
	import GalleryVerticalEnd from '@lucide/svelte/icons/gallery-vertical-end';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import SquareTerminal from '@lucide/svelte/icons/square-terminal';
	import type { User, NavPage, Team } from './sidebar-types';

	// This is sample data.
	let data: {
		user: User;
		teams: Team[];
		navMain: NavPage[];
	} = {
		user: {
			username: 'johndoe',
			email: 'Hl7oZ@example.com',
			avatar: 'https://github.com/shadcn.png'
		},
		teams: [
			{
				name: 'Acme Inc',
				plan: 'Enterprise'
			},
			{
				name: 'Acme Corp.',
				plan: 'Startup'
			},
			{
				name: 'Evil Corp.',
				plan: 'Free'
			}
		],
		navMain: [
			{
				title: 'Teams',
				url: '/teams',
				icon: SquareTerminal,
				items: [
					{
						title: 'Overview',
						url: '/teams'
					}
				]
			},
			{
				title: 'Scripts',
				url: '#',
				icon: FileCode2,
				items: [
					{
						title: 'Overview',
						url: '#'
					}
				]
			},
			{
				title: 'Settings',
				url: '#',
				icon: Settings2,
				items: [
					{
						title: 'General',
						url: '#'
					},
					{
						title: 'Team',
						url: '#'
					}
				]
			}
		]
	};

	import NavMain from '$lib/components/nav-main.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import TeamSwitcher from '$lib/components/team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		user,
		teams,
		activeTeam,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user: User;
		teams: Team[];
		activeTeam?: Team;
	} = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher {activeTeam} {teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
