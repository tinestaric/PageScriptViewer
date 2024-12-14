import { gzip } from 'pako';
import { Buffer } from 'buffer';
import { RecordingStep } from './types'; // Correct the import path

export const generateShareableLink = (steps: RecordingStep[], environment: string): string => {
    const yamlContent = JSON.stringify(steps); // Convert steps to JSON string
    const compressed = gzip(yamlContent); // Compress the content using gzip
    const base64Encoded = Buffer.from(compressed).toString('base64'); // Encode the compressed content in base64
    return `https://businesscentral.dynamics.com/${environment}/do#open-replaylog=${base64Encoded}&zip=1&base64=1`; // Build the URL
};

export default generateShareableLink; // Ensure default export
