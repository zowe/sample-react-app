import * as React from 'react';
import './App.css';
import { MemoryRouter, Route } from 'react-router';
import SamplePage from './SamplePage';

class App extends React.Component<any, any> {
  constructor(props){
    super(props);   
      this.state = {
        actionType: "Launch",
        appTarget: "PluginCreate",
        parameters: 
        `{"type":"connect",
        "connectionSettings":{
        "host":"localhost",
        "port":23,
        "deviceType":5,
        "alternateHeight":24,
        "alternateWidth":80,
        "oiaEnabled": true,
        "security": {
          "type":0
        }
      }}`,
        appId: "com.rs.mvd.tn3270",
        status: "Status will appear here.",
        helloText: "",
        helloResponse: "",
        destination: RocketMVD.uriBroker.pluginRESTUri(this.props.resources.pluginDefinition.getBasePlugin(), 'hello',"")
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

  sendAppRequest() {
    var requestText = this.state.parameters;
    var parameters = null;
    /*Parameters for Actions could be a number, string, or object. The actual event context of an Action that an App recieves will be an object with attributes filled in via these parameters*/
    try {
      if (requestText !== undefined && requestText.trim() !== "") {
        parameters = JSON.parse(requestText);
      }
    } catch (e) {
      //requestText was not JSON
    }
  
    let appId = this.state.appId;  
    if (appId) {
      let message = '';
      /* JS within an iframe can reference objects of the page it is embedded in via window.parent.
         With ZLUX, there's a global called RocketMVD which holds useful tools. So, a site
         Can determine what actions to take by knowing if it is or isnt embedded in ZLUX via IFrame.
      */
      let mvdWindow = window;
      if (mvdWindow && RocketMVD) {
        console.log((message = 'IFrame is within MVD'));
        /* PluginManager can be used to find what Plugins (Apps are a type of Plugin) are part of the current ZLUX instance.
           Once you know that the App you want is present, you can execute Actions on it by using the Dispatcher.
        */
        let dispatcher = RocketMVD.dispatcher;
        let pluginManager = RocketMVD.PluginManager;
        let plugin = pluginManager.getPlugin(appId);
        if (plugin) {
          let type;
          type = dispatcher.constants.ActionType[this.state.actionType];
          let mode;
          mode = dispatcher.constants.ActionTargetMode[this.state.appTarget];
  
          if (type != undefined && mode != undefined) {
            let actionTitle = 'Launch app from sample iframe';
            let actionID = 'com.rs.sampleiframe.launch';
            let argumentFormatter = {data: {op:'deref',source:'event',path:['data']}};
            /*Actions can be made ahead of time, stored and registered at startup, but for example purposes we are making one on-the-fly.
              Actions are also typically associated with Recognizers, which execute an Action when a certain pattern is seen in the running App.
            */
            let action = dispatcher.makeAction(actionID, actionTitle, mode,type,appId,argumentFormatter);
            let argumentData = {'data':(parameters ? parameters : requestText)};
            console.log((message = 'App request succeeded'));        
            this.setState({status: message});
            /*Just because the Action is invoked does not mean the target App will accept it. We've made an Action on the fly,
              So the data could be in any shape under the "data" attribute and it is up to the target App to take action or ignore this request*/
            dispatcher.invokeAction(action,argumentData);
          } else {
            console.log((message = 'Invalid target mode or action type specified'));        
          }
        } else {
          console.log((message = 'Could not find App with ID provided'));
        }
      }
      this.setState({status: message});
    }
  }

  sayHello() {
    fetch(this.state.destination, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "_objectType": "com.rs.mvd.sampleapp.request.hello",
        "_metaDataVersion": "1.0.0",
        "messageFromClient": this.state.helloText
      }),
    })
    .then(res => {
      console.log(res);
      const responseJson: any = res.json();
      if (responseJson != null && responseJson.serverResponse != null) {
        this.setState({helloResponse: 
        `Server replied with 
        
        "${responseJson.serverResponse}"`});
      } else {
        this.setState({helloResponse:"<Empty Reply from Server>"});
      }
      console.log(responseJson);
    });
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
