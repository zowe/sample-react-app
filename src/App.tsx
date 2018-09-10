import * as React from 'react';
import './App.css';
import { MVDResources } from './mvd-resources';
import { DropDown } from './components/dropDown';
import { TextBox } from './components/textBox';
import { RadioButton } from './components/radioButton';
import { CheckBox } from './components/checkBox';
import { TextArea } from './components/textArea';

class App extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Sample App</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code>, rebuild, and reload.
          <br/>
          <DropDown />
          <br/>
          <TextBox />
          <br/>
          <RadioButton />
          <br/>
          <CheckBox />
          <br/>
          <TextArea />
          <br/>
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

export default App;
