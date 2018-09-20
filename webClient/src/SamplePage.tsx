/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import * as React from 'react';
import 'script-loader!./App-css.js';
declare var styles: any;

import { MVDResources } from './mvd-resources';

function mergeStyles(...args: any[]) {
  let obj = {};
  for (let i = 0; i < args.length; i++) {
    Object.assign(obj, args[i]);
  }
  return obj;
}

class SamplePage extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div style={styles.appComponent}>
        <div>
          <div style={mergeStyles(styles.appComponent, styles.iframeFont, styles.testPanelContainer)}>
            <div style={mergeStyles(styles.testPanel, styles.pluginTestPanel)}>
              <div style={styles.bottom10}>
                <span style={styles.biggerBoldText}>Plug-in Request Test</span>
                  {/* Tests the sending of requests to other plugins. Defaults to send a message
                  to itself (and responding) to show more parts of the API */}
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.sendAppRequest}>Send App Request</button>
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.getDefaultsFromServer}>Get Defaults From Server</button>
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.saveToServer}>Save to Server</button>        
              </div>
              <span style={styles.boldText}>Application Identifier: </span>
              <div>
                <div style={styles.divInput}>
                  <input style={mergeStyles(styles.iframeInput, styles.inputHeight, styles.inputCorner, styles.inputText, styles.shadowed)} type="text" value={this.props.appId} onChange={this.props.handleAppIdChange}/>
                </div>
                <div>
                  {/* Action types are used to determine what sort of Action is being taken on whatever App instance is the target. Launch simply creates a new instance with the context you provide, but Message can be used to communicate with an already open Instance to drive some action */}        
                  <label style={styles.boldText}>Action Type: </label>
                  <input type="radio" value="Launch" name="actionType" checked={this.props.actionType == "Launch"} onChange={this.props.handleActionTypeChange}/>
                  <label htmlFor="actionLaunch">Launch</label>
                  <input type="radio" value="Message" name="actionType" checked={this.props.actionType == "Message"} onChange={this.props.handleActionTypeChange}/>
                  <label htmlFor="actionMessage">Message</label>
                </div>
                {/* App target modes are used to determine which instance of an App should be communicated with. You can create a new instance to send the Action to, or you could reuse an existing instance that is open. */}
                <div>
                  <label style={styles.boldText}>App Target Mode: </label>
                  <input type="radio" value="PluginCreate" name="targetMode" checked={this.props.appTarget == "PluginCreate"} onChange={this.props.handleAppTargetChange}/>
                  <label htmlFor="targetCreate">Create New</label>
                  <input type="radio" value="PluginFindAnyOrCreate" name="targetMode" checked={this.props.appTarget == "PluginFindAnyOrCreate"} onChange={this.props.handleAppTargetChange}/>
                  <label htmlFor="targetReuse">Reuse Any Open</label>
                </div>      
                <span style={mergeStyles(styles.divInput, styles.boldText)}>Parameters:</span>
                <div style={styles.divTextareaInput}>
                  {/* The text here is merely an example which provides some connection details for the terminal app. It could be anything so long as the receiving App supports it.
                  In this example App, the contents here will be put inside of a JSON with the contents as the "data" attribute. */}
                  <textarea style={mergeStyles(styles.iframeInput, styles.inputCorner, styles.inputText, styles.shadowed)} rows={10} cols={50} value={this.props.parameters} onChange={this.props.handleParameterChange}></textarea>
                </div>
                <div style={styles.hundredWidth}>
                  <span>App Status or Message:</span>
                  <p style={mergeStyles(styles.displayText, styles.shadowed, styles.disableEffect)} id="status">{this.props.status}</p>
                </div>
              </div>
            </div>
            <div style={mergeStyles(styles.testPanel, styles.dataserviceTestPanel)}>
              <div style={styles.bottom10}>
                <span style={styles.biggerBoldText}>Dataservice Request Test</span>
              </div>
              <div>
                <input placeholder="Message" value={this.props.helloText} onChange={this.props.handleHelloTextChange}/>      
                <button onClick={this.props.sayHello}>Run</button>
              </div>
              <div>
                <label>Response</label>
                <textarea style={styles.serverResponse} placeholder="Response" value={this.props.helloResponse} onChange={this.props.handleHelloResponseChange}></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SamplePage;
