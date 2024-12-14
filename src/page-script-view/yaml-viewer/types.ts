export interface RecordingStep {
    type: string;
    description: string;
    target?: any;
    source?: any;
    value?: any;
    parameters?: any;
    modal?: boolean;
    runtimeId?: string;
    invokeType?: string;
    icon?: string; // New property for visual icon
    children?: RecordingStep[]; // New property for nested steps
    caption?: string; // New property for extracted caption
}

export interface Recording {
    name: string;
    description: string;
    start: {
        profile: string;
    };
    steps: RecordingStep[];
}
