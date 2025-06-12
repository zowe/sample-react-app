import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function DemoPage(){
  return (
    <div className="DemoApp">
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
    <>
      <Routes>
        <Route path="/" index element={<DemoPage />} />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
