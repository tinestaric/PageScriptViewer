import * as React from "react";
import { createRoot } from "react-dom/client"; // Correct import for createRoot method
import { Page } from "azure-devops-ui/Page";
import { Orientation } from "azure-devops-ui/Components/Page/Page.Props"; // Import Orientation
import { parseYaml } from "./yaml-viewer/yamlParser";
import { Recording } from "./yaml-viewer/types";
import StepsRenderer from "./yaml-viewer/stepsRenderer";
import * as SDK from "azure-devops-extension-sdk";

interface IPageScriptViewState {
  parsedYaml: Recording | null;
}

class PageScriptView extends React.Component<{}, IPageScriptViewState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      parsedYaml: null,
    };
  }

  public componentDidMount() {
    SDK.init();
    SDK.register("showRenderer", this.showRenderer);
  }

  private showRenderer = () => {
    return {
      renderContent: (rawContent: string, options: any) => {
        try {
          const parsedYaml = parseYaml<Recording>(rawContent);
          if (parsedYaml.steps) {
            this.setState({ parsedYaml });
          } else {
            this.setState({ parsedYaml: null });
          }
        } catch (error) {
          console.error("Failed to parse YAML content:", error);
          this.setState({ parsedYaml: null });
        }
      }
    };
  };

  public render(): React.JSX.Element {
    const { parsedYaml} = this.state;
    const pageContent = (
        <div className="content-container" style={{ textAlign: "center" }}>
        {parsedYaml ? (
          <StepsRenderer steps={parsedYaml.steps} />
          ) : (
            <div className="no-content">
              <h2>No valid Page Script content to display</h2>
            </div>
          )}
        </div>
    );

    return (
      <Page 
        className={`flex-grow`} 
        orientation={Orientation.Vertical}
        {...{ children: pageContent } as any}
      >
      </Page>
    );
  }
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<PageScriptView />);
}
