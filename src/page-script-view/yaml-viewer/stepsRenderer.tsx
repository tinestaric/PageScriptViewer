import * as React from "react";
import { RecordingStep } from "./types";
import "./stepsRenderer.css"; // Import CSS for styling
import { FaShareAlt } from 'react-icons/fa'; // Import share icon
import generateShareableLink from './linkUtils'; // Import the utility function

interface StepsRendererProps {
    steps: RecordingStep[];
}

const StepsRenderer: React.FC<StepsRendererProps> = ({ steps }) => {
    const renderDescription = (description: string) => {
        const parts = description.split(/(<caption>|<\/caption>|<value>|<\/value>)/g);
        return parts.map((part, index) => {
            if (part === "<caption>" || part === "</caption>") {
                return null;
            }
            if (part === "<value>" || part === "</value>") {
                return null;
            }
            if (parts[index - 1] === "<caption>" && parts[index + 1] === "</caption>") {
                return <em key={index} className="caption">{part}</em>;
            }
            if (parts[index - 1] === "<value>" && parts[index + 1] === "</value>") {
                return <strong key={index} className="value">{part}</strong>;
            }
            return part;
        });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "navigate":
                return "🧭";
            case "page-shown":
                return "📄";
            case "invoke":
                return "⚙️";
            case "page-closed":
                return "❌";
            case "input":
                return "⌨️";
            case "focus":
                return "🔍";
            default:
                return "❓";
        }
    };

    const renderSteps = (steps: RecordingStep[], parentCaption?: string): JSX.Element[] => {
        return steps.map((step, index) => (
            <React.Fragment key={index}>
                <li className="step-item">
                    <div className="step-icon">{getIcon(step.type)}</div>
                    <div className="step-description">
                        {renderDescription(step.description)}
                        <span className="parent-caption">
                            {parentCaption ? `Parent: ${parentCaption}` : ''}
                        </span>
                    </div>
                </li>
                {step.children && step.children.length > 0 && (
                    <ul className="nested-steps-list">
                        {renderSteps(step.children, step.caption)}
                    </ul>
                )}
            </React.Fragment>
        ));
    };

    const handleGenerateShareableLink = () => {
        const environment = prompt("Please enter the environment (e.g., Production, Sandbox):", "Production"); // Prompt the user for the environment
        if (environment) {
            const shareableLink = generateShareableLink(steps, environment); // Use the utility function with the environment
            try {
                navigator.clipboard.writeText(shareableLink).then(() => {
                    alert(`Shareable link copied to clipboard: ${shareableLink}`); // Notify the user that the link has been copied
                }).catch(err => {
                    console.error('Failed to copy the link: ', err);
                    displayShareableLink(shareableLink); // Fallback to displaying the link in an input field
                });
            } catch (err) {
                console.error('Clipboard API not available: ', err);
                displayShareableLink(shareableLink); // Fallback to displaying the link in an input field
            }
        }
    };

    const displayShareableLink = (link: string) => {
        const linkContainer = document.getElementById('shareable-link-container');
        if (linkContainer) {
            linkContainer.innerHTML = `
                <div>
                    <p>Shareable link:</p>
                    <input type="text" value="${link}" readonly style="width: 100%;">
                </div>
            `;
        }
    };

    return (
        <div className="steps-container">
            <div className="header">
            <h2>Page Scripting Steps</h2>
                <button onClick={handleGenerateShareableLink} className="share-button">
                    <FaShareAlt />
                </button>
            </div>
            <div id="shareable-link-container"></div> {/* Container for the shareable link */}
            <ul className="steps-list">
                {renderSteps(steps)}
            </ul>
        </div>
    );
};

export default StepsRenderer;
