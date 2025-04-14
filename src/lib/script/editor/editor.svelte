<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import CodeMirror from 'svelte-codemirror-editor';
	import { scriptStore } from '$lib/stores';
	import { githubLight } from '@fsegurai/codemirror-theme-github-light';
	import { githubDark } from '@fsegurai/codemirror-theme-github-dark';
	import { theme } from 'theme-selector';
	import { python, globalCompletion, localCompletionSource } from '@codemirror/lang-python';
	import { syntaxTree } from '@codemirror/language';
	import { linter, type Diagnostic } from '@codemirror/lint';
	import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
	import type { EditorView } from '@codemirror/view';
	import { writable, derived, get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import type { ScriptsResponse } from '$lib/types';
	import { pb } from '$lib/pocketbase/client';
	import { toastApi } from '$lib/utils';

	let customCompletions: any[] = [];

	// @ts-ignore
	onMount(async () => {
		try {
			const response = await fetch('/controlhub_completions.json');
			if (!response.ok) {
				throw new Error(`Не удалось загрузить completions: ${response.statusText}`);
			}
			const data = await response.json();
			// @ts-ignore
			customCompletions = data.map((item) => ({
				label: item.label.slice(0, item.label.length - 2),
				...item
			}));
			console.log('Загруженные completions:', customCompletions); // Дебаггинг
		} catch (error) {
			console.error('Ошибка загрузки completions:', error);
		}

		// Добавляем обработчик для закрытия вкладки/браузера
		const handleBeforeUnload = (e) => {
			if (hasUnsavedChanges()) {
				e.preventDefault();
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	// Начальный код
	export let value = writable($scriptStore?.executable);

	// Writable store для отслеживания критических ошибок
	export let hasCriticalErrors = writable(false);
	export let editable = true;

	// Переменная для хранения EditorView
	let view: EditorView;

	// Функция для проверки наличия несохраненных изменений
	const hasUnsavedChanges = () => {
		return editable && $scriptStore?.executable !== $value;
	};

	// Перехватывание навигации SvelteKit
	beforeNavigate(({ cancel }) => {
		if (hasUnsavedChanges()) {
			const shouldSave = confirm(
				'У вас есть несохраненные изменения. Хотите сохранить их перед уходом?'
			);

			if (shouldSave) {
				if (!$hasCriticalErrors) {
					updateScript()
						.then(() => {
							// Навигация продолжится после успешного сохранения
						})
						.catch((err) => {
							console.error('Ошибка при сохранении:', err);
							// Если пользователь хочет продолжить без сохранения
							if (!confirm('Ошибка при сохранении. Хотите продолжить без сохранения?')) {
								cancel();
							}
						});
				} else {
					alert('Невозможно сохранить скрипт из-за синтаксических ошибок.');
					// Если пользователь хочет продолжить без сохранения
					if (!confirm('Хотите продолжить без сохранения?')) {
						cancel();
					}
				}
			} else if (!confirm('Вы уверены, что хотите покинуть страницу без сохранения изменений?')) {
				// Отменяем навигацию, если пользователь не хочет уходить без сохранения
				cancel();
			}
		}
	});

	// Регулярные выражения для различных контекстов автодополнения
	const importRegex = /^import\s+(\w*)$/;
	const fromImportRegex = /^from\s+(\w+)\s+import\s+(\w*)$/;
	const fromRegex = /^from\s+(\w*)$/;

	// Источник автодополнения для импорта, from и controlhub
	const controlHubModuleCompletionSource = (context: CompletionContext) => {
		const line = context.state.doc.lineAt(context.pos);
		const textBefore = line.text.slice(0, context.pos - line.from);

		// Проверка для "import ..."
		const importMatch = textBefore.match(importRegex);
		if (importMatch) {
			return {
				from: context.pos - (importMatch[1]?.length || 0),
				options: [{ label: 'controlhub', type: 'module', detail: 'ControlHub automation module' }],
				validFor: /^\w*$/
			};
		}

		// Проверка для "from ..."
		const fromMatch = textBefore.match(fromRegex);
		if (fromMatch && !textBefore.includes('import')) {
			return {
				from: context.pos - (fromMatch[1]?.length || 0),
				options: [{ label: 'controlhub', type: 'module', detail: 'ControlHub automation module' }],
				validFor: /^\w*$/
			};
		}

		// Проверка для "from controlhub import ..."
		const fromImportMatch = textBefore.match(fromImportRegex);
		if (fromImportMatch && fromImportMatch[1] === 'controlhub') {
			return {
				from: context.pos - (fromImportMatch[2]?.length || 0),
				options: customCompletions,
				validFor: /^\w*$/
			};
		}

		// Проверка для обычного доступа "controlhub."
		const word = context.matchBefore(/[\w.]*/);
		if (!word || word.from == word.to) return null;

		const text = word.text;
		const isModuleAccess = text.startsWith('controlhub.');

		if (!isModuleAccess && !context.explicit) return null;

		if (isModuleAccess) {
			return {
				from: word.from + 'controlhub.'.length,
				options: customCompletions,
				validFor: /^\w*$/
			};
		}

		// Подсказка модуля controlhub
		if (!context.explicit && !textBefore.trim().match(/^(import|from)/)) {
			return {
				from: word.from,
				options: [{ label: 'controlhub', type: 'module', detail: 'ControlHub automation module' }],
				validFor: /^controlhub$/
			};
		}

		return null;
	};

	// Линтер для подсветки ошибок
	const syntaxLinter = linter((view) => {
		const tree = syntaxTree(view.state);
		const diagnostics: Diagnostic[] = [];
		const doc = view.state.doc.toString();

		tree.iterate({
			enter: (node) => {
				if (node.type.isError) {
					const errorLine = view.state.doc.lineAt(node.from).number;
					const errorText = doc.slice(node.from, node.to);
					diagnostics.push({
						from: node.from,
						to: node.to,
						severity: 'error',
						message: `Синтаксическая ошибка на строке ${errorLine}: "${errorText}"`
					});
				}
			}
		});

		hasCriticalErrors.set(diagnostics.length > 0);
		return diagnostics;
	});

	// Функция проверки синтаксических ошибок
	const checkSyntax = (view: EditorView) => {
		const tree = syntaxTree(view.state);
		const errors = [];

		tree.iterate({
			enter: (node) => {
				if (node.type.isError) {
					errors.push({
						from: node.from,
						to: node.to,
						message: 'Синтаксическая ошибка'
					});
				}
			}
		});

		hasCriticalErrors.set(errors.length > 0);
	};

	const updateScript = async () => {
		if ($hasCriticalErrors) {
			throw new Error('Syntax error in script!');
		}

		scriptStore.update((script) => {
			if (script) {
				script.executable = $value;
			}

			return script;
		});

		await pb.collection('scripts').update($scriptStore?.id as string, {
			executable: $value
		});
	};

	// Вычисляемое свойство для отображения статуса изменений
	const hasChanges = derived([value, scriptStore], ([$value, $scriptStore]) => {
		return $scriptStore?.executable !== $value;
	});
</script>

<div class="mb-2 flex items-center gap-2">
	{#if editable}
		<Button
			onclick={toastApi.execAsync(
				updateScript,
				`Script ${$scriptStore?.name} updated.`,
				`Failed to update script ${$scriptStore?.name}, check syntax error.`
			)}
			disabled={$hasCriticalErrors || !$hasChanges}
		>
			Save
		</Button>

		{#if $hasChanges}
			<span class="text-sm font-medium text-amber-500">* Unsaved changes</span>
		{/if}

		{#if $hasCriticalErrors}
			<span class="text-sm font-medium text-red-500">⚠️ Cannot save due to syntax errors</span>
		{/if}
	{/if}
</div>

<div class="overflow-hidden rounded-md">
	<CodeMirror
		bind:value={$value}
		lang={python()}
		theme={$theme == 'light' ? githubLight : githubDark}
		tabSize={4}
		{editable}
		extensions={[
			syntaxLinter,
			autocompletion({
				override: [controlHubModuleCompletionSource, globalCompletion, localCompletionSource]
			})
		]}
		styles={{
			'&': {
				width: '100%',
				maxWidth: '100%',
				height: '60rem'
			}
		}}
		on:ready={(e) => {
			view = e.detail;
			checkSyntax(view);
		}}
		on:change={() => {
			if (view) {
				checkSyntax(view);
			}
		}}
	/>
</div>
