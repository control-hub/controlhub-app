import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { browser } from '$app/environment';
import { toast } from 'svelte-sonner';
import { cubicOut } from 'svelte/easing';
import type { Tab, AsyncFunction, UsersResponse, TeamsResponse, TeamsRecord } from '$lib/types';
import type { AuthProviderInfo } from 'pocketbase';
import { beforeNavigate } from '$app/navigation';
import type { TransitionConfig } from 'svelte/transition';
import type { CollectionStore } from 'pocketbase-store';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const shield = (str: string) => {
	return str.replace('"', '\\"');
};

export const compareProviders = (
	a: AuthProviderInfo,
	b: AuthProviderInfo,
	compareList: string[]
) => {
	const aIndex = compareList.indexOf(a.name) + 1;
	const bIndex = compareList.indexOf(b.name) + 1;

	return (aIndex > 0 ? aIndex : 0) - (bIndex > 0 ? bIndex : 0);
};

export const sortProviders = (providers: AuthProviderInfo[], compareList: string[]) => {
	compareList.reverse();
	providers.sort((a, b) => compareProviders(a, b, compareList));
	providers.reverse();
};

export const answer = (data: any, status = 200) => {
	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		status: status
	});
};

export type CheckPasswordAnswer =
	| { success: true; error: undefined }
	| { success: false; error: string };

export const checkPassword = (
	password: string,
	passwordConfirm: string | undefined = undefined
): CheckPasswordAnswer => {
	passwordConfirm = passwordConfirm || password;

	if (password !== passwordConfirm) {
		return { success: false, error: 'Passwords do not match' };
	} else if (password.length < 8) {
		return {
			success: false,
			error: 'Password must be at least 8 characters'
		};
	} else if (password.match(/^\d+$/)) {
		return { success: false, error: 'Password must contain letters' };
	} else if (password !== password.trim()) {
		return {
			success: false,
			error: 'Password must not contain leading or trailing spaces'
		};
	} else if (password == password.toLowerCase()) {
		return {
			success: false,
			error: 'Password must contain at least one lowercase letter'
		};
	} else if (password == password.toUpperCase()) {
		return {
			success: false,
			error: 'Password must contain at least one uppercase letter'
		};
	} else {
		return { success: true, error: undefined };
	}
};

export const makeAsync = (func: Function): AsyncFunction => {
	return () =>
		new Promise((resolve, reject) => {
			try {
				resolve(func());
			} catch (e) {
				reject(e);
			}
		});
};

export const toastApi = {
	post: async (
		url: string,
		data: any = {},
		onSuccess: () => void = () => {},
		onError: () => void = () => {}
	) => {
		const response = await post(url, data);

		if (response.status >= 303) {
			onError();
			toast.error(response.data.message);
		} else {
			onSuccess();
			toast.success(response.data.message);
		}

		return response;
	},

	exec: (
		func: Function,
		onSuccess: string = 'Success',
		onError: string = 'Error',
		onLoading: string = 'Processing...'
	): Function => {
		return toastApi.execAsync(makeAsync(func), onSuccess, onError, onLoading);
	},

	execAsync: (
		func: AsyncFunction,
		onSuccess: string = 'Success',
		onError: string = 'Error',
		onLoading: string = 'Processing...'
	): AsyncFunction => {
		async function wrapper(...args: any[]) {
			const promise = func(...args);

			toast.promise(promise, {
				loading: onLoading,
				success: onSuccess,
				error: onError
			});

			return await promise;
		}

		return wrapper;
	}
};

export const post = async (url: string, data: any = {}) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(data)
	});

	return { status: response.status, data: await response.json() };
};

export const shrinkString = (text: string, length: number) => {
	if (text.length > length) {
		return text.slice(0, length - 3) + '...';
	} else {
		return text;
	}
};

export const toPOJO = <T>(obj: T): T | undefined => {
	return obj ? JSON.parse(JSON.stringify(obj)) : undefined;
};

export const generateTabUrl = (
	currentUrl: string,
	additionalUrl: Tab,
	additionalUrls: Tab[]
): string => {
	for (let i = 0; i < additionalUrls.length; i++) {
		if (currentUrl.endsWith(additionalUrls[i].href) && additionalUrls[i].href !== '') {
			return currentUrl.replace(additionalUrls[i].href, additionalUrl.href);
		}
	}
	return currentUrl + additionalUrl.href;
};

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const ls = {
	set: (key: string, value: any): void => {
		if (browser) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	},

	get: (key: string): any | undefined => {
		if (browser) {
			const item = localStorage.getItem(key);
			return item === null ? undefined : JSON.parse(item);
		}
	},

	remove: (key: string): void => {
		if (browser) {
			localStorage.removeItem(key);
		}
	}
};

export const createTeam = async (teamsStore: CollectionStore<TeamsResponse>, team: TeamsRecord) => {
	const result = teamsStore.create({
		...team
	});

	const createdTeam = await result;

	await teamsStore.pb.collection('teams_access').create({
		team: createdTeam.id,
		user: createdTeam.owner,
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

	return createdTeam;
};

export const randintSeed = (str: string, min: number, max: number): number => {
	// Конвертируем seed-строку в 32битное число (простейший хэш)
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) | 0; // умножение + сдвиг
	}

	// Псевдослучайное на базе хэша
	const pseudoRand = Math.abs(Math.sin(hash) * 10000) % 1;

	return Math.floor(pseudoRand * (max - min + 1)) + min;
};

export const beforeNavigateOut = (func: Function) => {
	beforeNavigate(({ to, from }) => {
		const nextPath = from?.url.pathname || '';
		const currentPath = to?.url.pathname.split('/').slice(0, 2).join('/') || '';

		if (!nextPath.startsWith(currentPath)) {
			func();
		}
	});
};
