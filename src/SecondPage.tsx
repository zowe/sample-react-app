import * as React from 'react';
import './App.css';
import { MVDResources } from './mvd-resources';

class SecondPage extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="SecondPage">
        <header className="App-header">
          <h1 className="App-title">React Sample App Page 2</h1>
        </header>
        <p className="App-intro">
          <br/>
          <button onClick={() => this.props.history.go(-1)}>Go Back</button>
          <br/>
          <label>You selected {this.props.selectedValue} in the dropdown menu</label>
          <br/>
          <label>You typed {this.props.inputText} in the textbox</label>
          <br/>
          <label>You selected {this.props.radioOption} in the radio button options</label>
          <br />
          <label>You typed {this.props.textArea} in the large text area</label>
          <MVDResources.Consumer>
            {resources => (
              <>
                <button onClick={resources.windowActions.maximize}>Maximize</button>
                <button onClick={resources.windowActions.restore}>Restore</button>
              </>
            )}
          </MVDResources.Consumer>
        </p>
      </div>
    );
  }
}

export default SecondPage;
