import * as React from "react";
import * as ReactDOM from "react-dom";
import { Page } from "azure-devops-ui/Page";
import { Header } from "azure-devops-ui/Header";
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
    console.log("showRenderer called");
    return {
      renderContent: (rawContent: string, options: any) => {
        console.log("renderContent called with rawContent and options:", rawContent, options);
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

  public render(): JSX.Element {
    return (
      <Page className="flex-grow">
        <div className="content-container" style={{ textAlign: "center" }}>
          {this.state.parsedYaml ? (
            <StepsRenderer steps={this.state.parsedYaml.steps} />
          ) : (
            <div className="no-content">
              <h2>No valid Page Script content to display</h2>
            </div>
          )}
        </div>
      </Page>
    );
  }

}

ReactDOM.render(<PageScriptView />, document.getElementById("root"));
