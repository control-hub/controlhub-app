<script lang="ts">
	import { Redirect } from '$lib/components/web/redirect';

	import { teamStore } from '$lib/stores.js';
	import { pb } from '$lib/pocketbase/client';

	import type { TeamsResponse, UsersResponse } from '$lib/types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data: { user: UsersResponse; cookie: string };

	if (browser) {
		(async () => {
			if ($teamStore) {
				goto('/' + $teamStore.name);
			} else {
				const teams: TeamsResponse[] = await pb.collection('teams').getFullList();

				if (teams.length > 0) {
					goto('/' + teams[0].name);
				} else {
					console.log('1');
					let i = 0;
					while (true) {
						try {
							const newTeamName = `${data.user.username}'s-team${i === 0 ? '' : '-' + i}`;
							console.log(newTeamName);
							const newTeam = await pb
								.collection('teams')
								.create({ name: newTeamName, owner: [data.user.id] });
							console.log(newTeam);

							await pb.collection('teams_access').create({
								team: newTeam.id,
								user: data.user.id,
								permissions: [
									'add_access',
									'delete_access',
									'edit_access',
									'delete_team',
									'edit_team',
									'add_region',
									'delete_region',
									'edit_region',
									'add_computer',
									'delete_computer',
									'edit_computer'
								]
							});

							goto('/' + newTeam.name);
							break;
						} catch (e) {
							console.log(e);
							i++;
						}
					}
				}
			}
		})();
	}
</script>

<Redirect />
