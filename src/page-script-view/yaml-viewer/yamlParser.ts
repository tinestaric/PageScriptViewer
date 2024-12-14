import { parse } from 'yaml';
import { Recording, RecordingStep } from './types';

export class YamlParseError extends Error {
    constructor(message: string, public originalError?: Error) {
        super(message);
        this.name = 'YamlParseError';
    }
}

function extractCaption(description: string): string | undefined {
    const match = description.match(/<caption>(.*?)<\/caption>/);
    return match ? match[1] : undefined;
}

function nestSteps(steps: RecordingStep[]): RecordingStep[] {
    const nestedSteps: RecordingStep[] = [];
    const stack: RecordingStep[] = [];

    steps.forEach(step => {
        step.caption = extractCaption(step.description);
        while (stack.length > 0 && stack[stack.length - 1].source?.page === step.source?.page && step.type === 'page-closed') {
            stack.pop();
        }
        if (stack.length > 0) {
            const parent = stack[stack.length - 1];
            parent.children = parent.children || [];
            parent.children.push(step);
        } else {
            nestedSteps.push(step);
        }
        if (step.type === 'page-shown') {
            stack.push(step);
        }
    });

    return nestedSteps;
}

export function parseYaml<T = unknown>(content: string): T {
    if (!content || typeof content !== 'string') {
        throw new YamlParseError('Invalid input: content must be a non-empty string');
    }

    try {
        const parsed = parse(content);
        if (parsed === null || parsed === undefined) {
            throw new YamlParseError('Parsing resulted in null or undefined');
        }
        if (parsed.steps) {
            parsed.steps = nestSteps(parsed.steps);
        }
        return parsed as T;
    } catch (error) {
        if (error instanceof YamlParseError) {
            throw error;
        }
        throw new YamlParseError(
            `Failed to parse YAML: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error instanceof Error ? error : undefined
        );
    }
}
