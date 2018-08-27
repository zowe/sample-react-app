import * as React from 'react';
import './App.css';
import { MVDResources } from './mvd-resources';

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code>, rebuild, and reload.
          <br/>
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
