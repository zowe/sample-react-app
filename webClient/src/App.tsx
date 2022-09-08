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
import { withTranslation } from 'react-i18next';

class App extends React.Component<any, any> {
  private log: ZLUX.ComponentLogger;
  t: any;
  sessionEvents:any;
  autoSaveEvent:any;
  constructor(props){
    super(props);
    this.log = this.props.resources.logger;
    let metadata = this.props.resources.launchMetadata;
    if (metadata != null && metadata.data != null && metadata.data.type != null) {
      this.handleLaunchOrMessageObject(metadata.data);
    } else {
      this.state = this.getDefaultState();
    }
    this.sessionEvents = this.props.resources.sessionEvents;
    this.autoSaveEvent = this.sessionEvents.autosaveEmitter.subscribe((saveThis: any)=> {
      if (saveThis) {
        saveThis({'appData':{'requestText':this.state.parameters,'targetAppId':this.state.appId}});
      }
    });

  };

  private getDefaultState() {
    return {
      actionType: "Launch",
      appTarget: "PluginCreate",
      parameters: 
      `{ "type":"connect",
  "connectionSettings":{
      "host":"localhost",
      "port":23,
      "deviceType":5,
      "alternateHeight":60,
      "alternateWidth":132,
      "oiaEnabled": true,
      "security": {
          "type":0
      }
  }
}`,
      appId: "org.zowe.terminal.tn3270",
      status: 'status_will_appear_here',
      helloText: "",
      helloResponse: "",
      destination: ZoweZLUX.uriBroker.pluginRESTUri(this.props.resources.pluginDefinition.getBasePlugin(), 'hello',"")
    };
  }

  updateOrInitState(stateUpdate: any): void {
    if (!this.state) {
      this.state = Object.assign(this.getDefaultState(), stateUpdate);
    }
    else {
      this.setState(stateUpdate);
    }
  }

  handleLaunchOrMessageObject(data: any) {
    switch (data.type) {
    case 'setAppRequest':
      let actionType = data.actionType;
      let msg:string;
      if (actionType == 'Launch' || actionType == 'Message') {
        let mode = data.targetMode;
        if (mode == 'PluginCreate' || mode == 'PluginFindAnyOrCreate') {
          this.updateOrInitState({actionType: actionType,
                                  appTarget: mode,
                                  appId: data.appData.targetAppId,
                                  parameters: data.appData.requestText});
        } else {
          msg = `Invalid target mode given (${mode})`;
          this.log.warn(msg);
          this.updateOrInitState({status: msg});
        }
      } else {
        msg = `Invalid action type given (${actionType})`;
        this.log.warn(msg);
        this.updateOrInitState({status: msg});
      }
      break;
    default:
      this.log.warn(`Unknown command (${data.type}) given in launch metadata.`);
    }
  }

  /* I expect a JSON here*/
  zluxOnMessage(eventContext: any): Promise<any> {
    return new Promise((resolve,reject)=> {
      if (eventContext != null && eventContext.data != null && eventContext.data.type != null) {
        resolve(this.handleLaunchOrMessageObject(eventContext.data));
      } else {
        let msg = 'Event context missing or malformed';
        this.log.warn('onMessage '+msg);
        return reject(msg);
      }
    });
  }

  
  provideZLUXDispatcherCallbacks(): ZLUX.ApplicationCallbacks {
    return {
      onMessage: (eventContext: any): Promise<any> => {
        return this.zluxOnMessage(eventContext);
      }      
    }
  }  

  
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

  getDefaultsFromServer() {
    let plugin = this.props.resources.pluginDefinition.getBasePlugin();
    let appRequestUri = ZoweZLUX.uriBroker.pluginConfigUri(plugin, 'requests/app', undefined);
    fetch (appRequestUri, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res=> {
      if (res.status != 200) {
        this.log.warn(`Get defaults from server failed. Data missing or request invalid. Status=${res.status}`);
      }
      res.json().then((responseJson)=> {
        this.log.info(`JSON=${JSON.stringify(responseJson)}`);
        if (res.status == 200) {
          if (responseJson.contents.appid && responseJson.contents.parameters) {
            let paramData = responseJson.contents.parameters.data;
            this.setState({
              parameters: paramData.parameters,
              appTarget: paramData.appTarget,
              actionType: paramData.actionType,
              appId: responseJson.contents.appid.data.appId
            });
          } else {
            this.log.warn(`Incomplete data. AppID or Parameters missing.`);
          }
        }
      }).catch(e => {
        this.log.warn(`Response was not JSON`);
      });
    }).catch(e => {
      this.log.warn(`Error on getting defaults, e=${e}`);
      this.setState({status: this.t('Error_getting_defaults')});
    });
  }

  saveToServer() {
    let plugin = this.props.resources.pluginDefinition.getBasePlugin();
    let parameterUri = ZoweZLUX.uriBroker.pluginConfigUri(plugin, 'requests/app', 'parameters');
    let appIdUri = ZoweZLUX.uriBroker.pluginConfigUri(plugin, 'requests/app', 'appid');
    fetch(parameterUri, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({parameters: this.state.parameters,
                            appTarget: this.state.appTarget,
                            actionType: this.state.actionType})
    }).then(res => {
      this.log.info(`Saved parameters with HTTP status=${res.status}`);
      if (res.status == 200 || res.status == 201) {
        fetch (appIdUri, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({appId: this.state.appId})
        }).then(res => {
          this.log.info(`Saved App ID with HTTP status=${res.status}`);
        }).catch(e => {
          this.log.warn(`Error on saving App ID, e=${e}`);
          this.setState({status: this.t('Error_saving_App_ID')});
        });
      } else {
        this.log.warn(`Error on saving parameters, response status=${res.status}`);
      }
    }).catch(e => {
      this.log.warn(`Error on saving parameters, e=${e}`);
      this.setState({status: this.t('Error_saving_parameters')});
    });
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
              `${this.t('server_replied_with')}
                "${responseJson.serverResponse}"`});
          } else {
            this.setState({helloResponse: this.t('empty_reply_from_server')});
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
         With ZLUX, there's a global called ZoweZLUX which holds useful tools. So, a site
         Can determine what actions to take by knowing if it is or isnt embedded in ZLUX via IFrame.
      */
      /* PluginManager can be used to find what Plugins (Apps are a type of Plugin) are part of the current ZLUX instance.
         Once you know that the App you want is present, you can execute Actions on it by using the Dispatcher.
      */              
      let dispatcher = ZoweZLUX.dispatcher;
      let pluginManager = ZoweZLUX.pluginManager;
      let plugin = pluginManager.getPlugin(appId);
      if (plugin) {
        let type;
        type = dispatcher.constants.ActionType[this.state.actionType];
        let mode;
        mode = dispatcher.constants.ActionTargetMode[this.state.appTarget];
        
        if (type != undefined && mode != undefined) {
          let actionTitle = 'Launch app from sample app';
          let actionID = 'org.zowe.zlux.sample.launch';
          let argumentFormatter = {data: {op:'deref',source:'event',path:['data']}};
          /*Actions can be made ahead of time, stored and registered at startup, but for example purposes we are making one on-the-fly.
            Actions are also typically associated with Recognizers, which execute an Action when a certain pattern is seen in the running App.
          */
          let action = dispatcher.makeAction(actionID, actionTitle, mode,type,appId,argumentFormatter);
          let argumentData = {'data':(parameters ? parameters : requestText)};
          this.log.info((message = this.t('request_succeeded')));
          this.setState({status: message});
          /*Just because the Action is invoked does not mean the target App will accept it. We've made an Action on the fly,
            So the data could be in any shape under the "data" attribute and it is up to the target App to take action or ignore this request*/
          dispatcher.invokeAction(action,argumentData);
        } else {
          this.log.warn((message = 'Invalid target mode or action type specified'));        
        }
      } else {
        this.log.warn((message = this.t('could_not_find_app_with_id_provided')));
      }
      this.setState({status: message});
    }
  }


  public render(): JSX.Element {
    const { t } = this.props;
    this.t = t;
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
              status={t(this.state.status)}
              helloText={this.state.helloText}
              helloResponse={this.state.helloResponse}
              sayHello={this.sayHello.bind(this)}
              handleHelloTextChange={this.handleHelloTextChange.bind(this)}
              handleHelloResponseChange={this.handleHelloResponseChange.bind(this)}
              sendAppRequest={this.sendAppRequest.bind(this)}
              saveToServer={this.saveToServer.bind(this)}
              getDefaultsFromServer={this.getDefaultsFromServer.bind(this)}
              handleAppIdChange={this.handleAppIdChange.bind(this)}
              handleParameterChange={this.handleParameterChange.bind(this)}
              handleAppTargetChange={this.handleAppTargetChange.bind(this)}
              handleActionTypeChange={this.handleActionTypeChange.bind(this)}
              />} />
        </div>
        </MemoryRouter>
    );
  }

  componentWillUnmount(){
    this.autoSaveEvent.unsubscribe();
 }
}

export default withTranslation('translation')(App);
