/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
	Computers = 'computers',
	Executions = 'executions',
	Regions = 'regions',
	Scripts = 'scripts',
	Teams = 'teams',
	TeamsAccess = 'teams_access',
	TeamsLink = 'teams_link',
	Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString;
	created: IsoDateString;
	updated: IsoDateString;
	collectionId: string;
	collectionName: Collections;
	expand?: T;
};

export type AuthSystemFields<T = never> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export enum ComputersStatusOptions {
	'E2' = '2',
	'E1' = '1',
	'E0' = '0'
}
export type ComputersRecord<Tdata = unknown> = {
	data?: null | Tdata;
	ip?: string;
	mac?: string;
	name: string;
	region: RecordIdString;
	status: ComputersStatusOptions;
	token: string;
};

export enum ExecutionsStatusOptions {
	'E0' = '0',
	'E1' = '1',
	'E2' = '2',
	'E3' = '3'
}
export type ExecutionsRecord = {
	computer: RecordIdString;
	duration?: number;
	executable?: HTMLString;
	logs?: HTMLString;
	invisible?: boolean;
	marked?: boolean;
	script?: RecordIdString;
	status?: ExecutionsStatusOptions;
	user?: RecordIdString;
};

export type RegionsRecord = {
	name: string;
	team: RecordIdString;
};

export type ScriptsRecord = {
	name?: string;
	description?: HTMLString;
	executable?: HTMLString;
	executed: number;
	public?: boolean;
	user?: RecordIdString;
};

export type TeamsRecord = {
	name: string;
	owner: RecordIdString;
};

export enum TeamsAccessPermissionsOptions {
	'add_access' = 'add_access',
	'delete_access' = 'delete_access',
	'edit_access' = 'edit_access',
	'delete_team' = 'delete_team',
	'edit_team' = 'edit_team',
	'add_region' = 'add_region',
	'delete_region' = 'delete_region',
	'edit_region' = 'edit_region',
	'add_computer' = 'add_computer',
	'delete_computer' = 'delete_computer',
	'edit_computer' = 'edit_computer'
}
export type TeamsAccessRecord = {
	permissions?: TeamsAccessPermissionsOptions[];
	team?: RecordIdString;
	user?: RecordIdString;
};

export enum TeamsLinkPermissionsOptions {
	'add_access' = 'add_access',
	'delete_access' = 'delete_access',
	'edit_access' = 'edit_access',
	'delete_team' = 'delete_team',
	'edit_team' = 'edit_team',
	'add_region' = 'add_region',
	'delete_region' = 'delete_region',
	'edit_region' = 'edit_region',
	'add_computer' = 'add_computer',
	'delete_computer' = 'delete_computer',
	'edit_computer' = 'edit_computer'
}
export type TeamsLinkRecord = {
	joined?: RecordIdString[];
	permissions?: TeamsLinkPermissionsOptions[];
	token?: string;
	team: RecordIdString;
};

export type UsersRecord = {
	avatar?: string;
	name?: string;
	defaultSearch?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type ComputersResponse<Tdata = unknown, Texpand = unknown> = Required<
	ComputersRecord<Tdata>
> &
	BaseSystemFields<Texpand>;
export type ExecutionsResponse<Texpand = unknown> = Required<ExecutionsRecord> &
	BaseSystemFields<Texpand>;
export type RegionsResponse<Texpand = unknown> = Required<RegionsRecord> &
	BaseSystemFields<Texpand>;
export type ScriptsResponse<Texpand = unknown> = Required<ScriptsRecord> &
	BaseSystemFields<Texpand>;
export type TeamsResponse<Texpand = unknown> = Required<TeamsRecord> & BaseSystemFields<Texpand>;
export type TeamsAccessResponse<Texpand = unknown> = Required<TeamsAccessRecord> &
	BaseSystemFields<Texpand>;
export type TeamsLinkResponse<Texpand = unknown> = Required<TeamsLinkRecord> &
	BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	computers: ComputersRecord;
	executions: ExecutionsRecord;
	regions: RegionsRecord;
	scripts: ScriptsRecord;
	teams: TeamsRecord;
	teams_access: TeamsAccessRecord;
	teams_link: TeamsLinkRecord;
	users: UsersRecord;
};

export type CollectionResponses = {
	computers: ComputersResponse;
	executions: ExecutionsResponse;
	regions: RegionsResponse;
	scripts: ScriptsResponse;
	teams: TeamsResponse;
	teams_access: TeamsAccessResponse;
	teams_link: TeamsLinkResponse;
	users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'computers'): RecordService<ComputersResponse>;
	collection(idOrName: 'executions'): RecordService<ExecutionsResponse>;
	collection(idOrName: 'regions'): RecordService<RegionsResponse>;
	collection(idOrName: 'scripts'): RecordService<ScriptsResponse>;
	collection(idOrName: 'teams'): RecordService<TeamsResponse>;
	collection(idOrName: 'teams_access'): RecordService<TeamsAccessResponse>;
	collection(idOrName: 'teams_link'): RecordService<TeamsLinkResponse>;
	collection(idOrName: 'users'): RecordService<UsersResponse>;
};

// Other types

export type Tab = {
	name: string;
	href: string;
};

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;
