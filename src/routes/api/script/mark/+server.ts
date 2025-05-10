import type { ExecutionsResponse, TypedPocketBase } from '$lib/types.js';

const countIncrements = (executions: ExecutionsResponse[]) => {
    let result = new Map<string, number>();

    for (const execution of executions) {
        if (!execution.script) continue;

        const script = result.get(execution.script) ?? 0;
        result.set(execution.script, script + 1);
    }

    return result;
}

const markScripts = async (scriptId: string, count: number, admin: TypedPocketBase) => {
    const script = await admin.collection('scripts').getOne(scriptId);
    await admin.collection('scripts').update(scriptId, { executed: script.executed + count });
}

const markExecutions = async (execution: ExecutionsResponse, admin: TypedPocketBase) => {
    await admin.collection('executions').update(execution.id, { marked: true });
};

export const POST = async ({ locals }) => {
    
    try {
        const executions = await locals.admin.collection('executions').getFullList({
            filter: `marked = false && user = "${locals.user?.id}"`,
            batch: 32768
        })
        
        const countIncrementMap = countIncrements(executions);
        const tasks = [];

        for (const [scriptId, count] of countIncrementMap) {
            tasks.push(markScripts(scriptId, count, locals.admin));
        }

        for (const execution of executions) {
            tasks.push(markExecutions(execution, locals.admin));
        }

        await Promise.all(tasks);
        return new Response(null, { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
    }
};
