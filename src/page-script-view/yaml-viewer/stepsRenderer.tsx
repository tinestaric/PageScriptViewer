import * as React from "react";
import { RecordingStep } from "./types";
import "./stepsRenderer.css"; // Import CSS for styling

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

    return (
        <div className="steps-container">
            <h2>Page Scripting Steps</h2>
            <ul className="steps-list">
                {renderSteps(steps)}
            </ul>
        </div>
    );
};

export default StepsRenderer;
