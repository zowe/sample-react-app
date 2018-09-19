/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import * as React from 'react';
import './App.css';
import { MVDResources } from './mvd-resources';

class SamplePage extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="app-component">
        <div>
          <div className="app-component iframe-font test-panel-container">
            <div className="test-panel plugin-test-panel">
              <div className="bottom-10">
                <span className="bigger-bold-text">Plug-in Request Test</span>
                  {/* Tests the sending of requests to other plugins. Defaults to send a message
                  to itself (and responding) to show more parts of the API */}
                <button className="iframe-button shadowed" type="button" onClick={this.props.sendAppRequest}>Send App Request</button>
              </div>
              <span className="bold-text">Application Identifier: </span>
              <div>
                <div className="div-input">
                  <input className="iframe-input input-height input-corner input-text shadowed" type="text" value={this.props.appId} onChange={this.props.handleAppIdChange}/>
                </div>
                <div>
                  {/* Action types are used to determine what sort of Action is being taken on whatever App instance is the target. Launch simply creates a new instance with the context you provide, but Message can be used to communicate with an already open Instance to drive some action */}        
                  <label className="bold-text">Action Type: </label>
                  <input type="radio" value="Launch" checked={this.props.actionType == "Launch"} onChange={this.props.handleActionTypeChange}/>
                  <label htmlFor="actionLaunch">Launch</label>
                  <input type="radio" value="Message" checked={this.props.actionType == "Message"} onChange={this.props.handleActionTypeChange}/>
                  <label htmlFor="actionMessage">Message</label>
                </div>
                {/* App target modes are used to determine which instance of an App should be communicated with. You can create a new instance to send the Action to, or you could reuse an existing instance that is open. */}
                <div>
                  <label className="bold-text">App Target Mode: </label>
                  <input type="radio" value="PluginCreate" checked={this.props.appTarget == "PluginCreate"} onChange={this.props.handleAppTargetChange}/>
                  <label htmlFor="targetCreate">Create New</label>
                  <input type="radio" value="PluginFindAnyOrCreate" checked={this.props.appTarget == "PluginFindAnyOrCreate"} onChange={this.props.handleAppTargetChange}/>
                  <label htmlFor="targetReuse">Reuse Any Open</label>
                </div>      
                <span className="div-input bold-text">Parameters:</span>
                <div className="div-textarea-input">
                  {/* The text here is merely an example which provides some connection details for the terminal app. It could be anything so long as the receiving App supports it.
                  In this example App, the contents here will be put inside of a JSON with the contents as the "data" attribute. */}
                  <textarea className="iframe-input input-corner input-text shadowed" rows={10} cols={50} value={this.props.parameters} onChange={this.props.handleParameterChange}></textarea>
                </div>
                <div className="hundred-width">
                  <span>App Status or Message:</span>
                  <p className="display-text shadowed disable-effect" id="status">{this.props.status}</p>
                </div>
              </div>
            </div>
            <div className="test-panel dataservice-test-panel">
              <div className="bottom-10">
                <span className="bigger-bold-text">Dataservice Request Test</span>
              </div>
              <div>
                <input placeholder="Message" value={this.props.helloText} onChange={this.props.handleHelloTextChange}/>      
                <button onClick={this.props.sayHello}>Run</button>
              </div>
              <div>
                <label>Response</label>
                <textarea className="server-response" placeholder="Response" value={this.props.helloResponse} onChange={this.props.handleHelloResponseChange}></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SamplePage;
