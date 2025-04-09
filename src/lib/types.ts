/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
	Commands = 'commands',
	Computers = 'computers',
	Regions = 'regions',
	Teams = 'teams',
	TeamsAccess = 'teams_access',
	Test = 'test',
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

export enum CommandsLangOptions {
	'python' = 'python',
	'cmd' = 'cmd',
	'system' = 'system'
}
export type CommandsRecord = {
	description?: HTMLString;
	exec?: HTMLString;
	lang?: CommandsLangOptions;
	name?: string;
	user?: RecordIdString;
};

export enum ComputersStatusOptions {
	'E2' = '2',
	'E1' = '1',
	'E0' = '0'
}
export type ComputersRecord = {
	active?: RecordIdString;
	logs?: string;
	mac?: string;
	name: string;
	region: RecordIdString;
	status: ComputersStatusOptions;
};

export type RegionsRecord = {
	name: string;
	team: RecordIdString;
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

export enum TestFieldOptions {
	'a' = 'a',
	'b' = 'b',
	'abo' = 'abo'
}
export type TestRecord = {
	field?: TestFieldOptions[];
};

export type UsersRecord = {
	avatar?: string;
	name?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type CommandsResponse<Texpand = unknown> = Required<CommandsRecord> &
	BaseSystemFields<Texpand>;
export type ComputersResponse<Texpand = unknown> = Required<ComputersRecord> &
	BaseSystemFields<Texpand>;
export type RegionsResponse<Texpand = unknown> = Required<RegionsRecord> &
	BaseSystemFields<Texpand>;
export type TeamsResponse<Texpand = unknown> = Required<TeamsRecord> & BaseSystemFields<Texpand>;
export type TeamsAccessResponse<Texpand = unknown> = Required<TeamsAccessRecord> &
	BaseSystemFields<Texpand>;
export type TestResponse<Texpand = unknown> = Required<TestRecord> & BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	commands: CommandsRecord;
	computers: ComputersRecord;
	regions: RegionsRecord;
	teams: TeamsRecord;
	teams_access: TeamsAccessRecord;
	test: TestRecord;
	users: UsersRecord;
};

export type CollectionResponses = {
	commands: CommandsResponse;
	computers: ComputersResponse;
	regions: RegionsResponse;
	teams: TeamsResponse;
	teams_access: TeamsAccessResponse;
	test: TestResponse;
	users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'commands'): RecordService<CommandsResponse>;
	collection(idOrName: 'computers'): RecordService<ComputersResponse>;
	collection(idOrName: 'regions'): RecordService<RegionsResponse>;
	collection(idOrName: 'teams'): RecordService<TeamsResponse>;
	collection(idOrName: 'teams_access'): RecordService<TeamsAccessResponse>;
	collection(idOrName: 'test'): RecordService<TestResponse>;
	collection(idOrName: 'users'): RecordService<UsersResponse>;
};

// Other non generated types

export type Tab = {
	name: string;
	href: string;
};

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;
