/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import * as React from 'react';
import { MemoryRouter, Route } from 'react-router';
import SamplePage from './SamplePage';

class App extends React.Component<any, any> {
  private log: ZLUX.ComponentLogger;
  constructor(props){
    super(props);
    this.log = this.props.resources.logger;
    this.state = {
      actionType: "Launch",
      appTarget: "PluginCreate",
      parameters: 
      `TODO`,
      appId: "TODO",
      status: "Status will appear here.",
      helloText: "",
      helloResponse: "",
      destination: ZoweZLUX.uriBroker.pluginRESTUri(this.props.resources.pluginDefinition.getBasePlugin(), 'hello',"")
    };
  };

  handleActionTypeChange(e) {
    this.setState({actionType: e.target.value});
  }

  handleAppTargetChange(e) {
    this.setState({appTarget: e.target.value});
  }

  handleParameterChange(e) {
    this.setState({parameters: e.target.value});
  }

  handleAppIdChange(e) {
    this.setState({appId: e.target.value});
  }

  handleHelloTextChange(e) {
    this.setState({helloText: e.target.value});
  }

  handleHelloResponseChange(e) {
    this.setState({helloResponse: e.target.value});
  }

  sayHello() {
    fetch(this.state.destination, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "_objectType": "org.zowe.zlux.sample.request.hello",
        "_metaDataVersion": "1.0.0",
        "messageFromClient": this.state.helloText
      }),
    })
      .then(res => {
        this.log.info(`Res =${res}`);
        res.json().then((responseJson)=> {
          if (responseJson != null && responseJson.serverResponse != null) {
            this.setState({helloResponse: 
                           `Server replied with 
                             
                             "${responseJson.serverResponse}"`});
          } else {
            this.setState({helloResponse:"<Empty Reply from Server>"});
          }
          this.log.info(`Res JSON=${JSON.stringify(responseJson)}`);
        }).catch((e)=> {
          let response = 'Error parsing JSON response from server';
          this.setState({helloResponse: response});
          this.log.warn(response);
        });
      });
  }

  sendAppRequest() {
    let message = 'Unimplemented!';
    this.log.warn(message);
    this.setState({status: message});
  }


  public render(): JSX.Element {
    return (
        <MemoryRouter
      initialEntries={[
        '/one'
      ]}>
        <div>
        <Route path="/one" 
      render={(props) => 
              <SamplePage {...props} 
              textArea={this.state.textArea}
              inputText={this.state.inputText}
              actionType={this.state.actionType}
              appTarget={this.state.appTarget}
              parameters={this.state.parameters}
              appId={this.state.appId}
              status={this.state.status}
              helloText={this.state.helloText}
              helloResponse={this.state.helloResponse}
              sayHello={this.sayHello.bind(this)}
              handleHelloTextChange={this.handleHelloTextChange.bind(this)}
              handelHelloResponseChange={this.handleHelloResponseChange.bind(this)}
              sendAppRequest={this.sendAppRequest.bind(this)}
              handleAppIdChange={this.handleAppIdChange.bind(this)}
              handleParameterChange={this.handleParameterChange.bind(this)}
              handleAppTargetChange={this.handleAppTargetChange.bind(this)}
              handleActionTypeChange={this.handleActionTypeChange.bind(this)}
              />} />
        </div>
        </MemoryRouter>
    );
  }
}

export default App;
