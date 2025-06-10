import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App(props: any) {

  const [logger, setLogger] = useState(props.resources.logger || undefined);

  useEffect(() => {
    let metadata = props.resources.launchMetadata;
    if (metadata != null && metadata.data != null && metadata.data.type != null) {
      // this.handleLaunchOrMessageObject(metadata.data);
      console.log("Received launch metadata:", metadata);
    } else {
      // this.state = this.getDefaultState();
    }
    if(logger){
      logger.info('yuuuuh');
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
