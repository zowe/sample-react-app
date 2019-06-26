/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import * as React from 'react';
import 'script-loader!./App-css.js';
import { withTranslation } from 'react-i18next';
import { MVDResources } from './mvd-resources';

declare var styles: any;

function mergeStyles(...args: any[]) {
  let obj = {};
  for (let i = 0; i < args.length; i++) {
    Object.assign(obj, args[i]);
  }
  return obj;
}

class SamplePage extends React.Component<any, any> {
  public render(): JSX.Element {
    const { t } = this.props;

    return (
      <div style={styles.appComponent}>
        <div>
          <div style={mergeStyles(styles.appComponent, styles.iframeFont, styles.testPanelContainer)}>
            <div style={mergeStyles(styles.testPanel, styles.pluginTestPanel)}>
              <span style={styles.biggerBoldText}>Plug-in Request Test</span>
              <div style={styles.bottom10}>
                <span style={styles.biggerBoldText}>{t('plugin_request_test')}</span>
                  {/* Tests the sending of requests to other plugins. Defaults to send a message
                  to itself (and responding) to show more parts of the API */}
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.sendAppRequest}>{t('send_app_request')}</button>
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.getDefaultsFromServer}>{t('get_from_server')}</button>
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.saveToServer}>{t('save_to_server')}</button>        
              </div>
              <span style={styles.boldText}>{t('application_identifier')}</span>
              <div>
                <div style={styles.divInput}>
                  <input style={mergeStyles(styles.iframeInput, styles.inputHeight, styles.inputCorner, styles.inputText, styles.shadowed)} type="text" value={this.props.appId} onChange={this.props.handleAppIdChange}/>
                </div>
                <div>
                  {/* Action types are used to determine what sort of Action is being taken on whatever App instance is the target. Launch simply creates a new instance with the context you provide, but Message can be used to communicate with an already open Instance to drive some action */}        
                  <label style={styles.boldText}>{t('action_type')}</label>
                  <input type="radio" value="Launch" name="actionType" checked={this.props.actionType == "Launch"} onChange={this.props.handleActionTypeChange}/>
<<<<<<< Updated upstream
                  <label htmlFor="actionLaunch">{t('launch')}</label>
                  <input type="radio" value="Message" name="actionType" checked={this.props.actionType == "Message"} onChange={this.props.handleActionTypeChange}/>
                  <label htmlFor="actionMessage">{t('message')}</label>
=======
                  <label  style={styles.labelPadding} htmlFor="actionLaunch">Launch</label>
                  <input type="radio" value="Message" name="actionType" checked={this.props.actionType == "Message"} onChange={this.props.handleActionTypeChange}/>
                  <label  style={styles.labelPadding} htmlFor="actionMessage">Message</label>
                  <input type="radio" value="Maximize" name="actionType" checked={this.props.actionType == "Maximize"} onChange={this.props.handleActionTypeChange}/>
                  <label  style={styles.labelPadding} htmlFor="actionLaunch">Maximize</label>
                  <input type="radio" value="Minimize" name="actionType" checked={this.props.actionType == "Minimize"} onChange={this.props.handleActionTypeChange}/>
                  <label  style={styles.labelPadding} htmlFor="actionMessage">Minimize</label>

>>>>>>> Stashed changes
                </div>
                {/* App target modes are used to determine which instance of an App should be communicated with. You can create a new instance to send the Action to, or you could reuse an existing instance that is open. */}
                <div>
                  <label style={styles.boldText}>{t('app_target_mode')}</label>
                  <input type="radio" value="PluginCreate" name="targetMode" checked={this.props.appTarget == "PluginCreate"} onChange={this.props.handleAppTargetChange}/>
<<<<<<< Updated upstream
                  <label htmlFor="targetCreate">{t('create_new')}</label>
                  <input type="radio" value="PluginFindAnyOrCreate" name="targetMode" checked={this.props.appTarget == "PluginFindAnyOrCreate"} onChange={this.props.handleAppTargetChange}/>
                  <label htmlFor="targetReuse">{t('reuse_any_open')}</label>
=======
                  <label  style={styles.labelPadding} htmlFor="targetCreate">Create New</label>
                  <input type="radio" value="PluginFindAnyOrCreate" name="targetMode" checked={this.props.appTarget == "PluginFindAnyOrCreate"} onChange={this.props.handleAppTargetChange}/>
                  <label  style={styles.labelPadding} htmlFor="targetReuse">Reuse Any Open</label>
>>>>>>> Stashed changes
                </div>      
                <span style={mergeStyles(styles.divInput, styles.boldText)}>{t('parameters')}</span>
                <div style={styles.divTextareaInput}>
                  {/* The text here is merely an example which provides some connection details for the terminal app. It could be anything so long as the receiving App supports it.
                  In this example App, the contents here will be put inside of a JSON with the contents as the "data" attribute. */}
                  <textarea style={mergeStyles(styles.iframeInput, styles.inputCorner, styles.inputText, styles.shadowed)} rows={10} cols={50} defaultValue={this.props.parameters} onChange={this.props.handleParameterChange}></textarea>
                </div>
                <div style={styles.hundredWidth}>
                  <span>{t('app_status_or_message')}</span>
                  <p style={mergeStyles(styles.displayText, styles.shadowed, styles.disableEffect)} id="status">{this.props.status}</p>
                </div>
              </div>
            </div>
            <div style={mergeStyles(styles.testPanel, styles.dataserviceTestPanel)}>
              <div style={styles.bottom10}>
                <span style={styles.biggerBoldText}>{t('dataservice_request_test')}</span>
              </div>
              <div>
<<<<<<< Updated upstream
                <input placeholder={t('message')} value={this.props.helloText} onChange={this.props.handleHelloTextChange}/>      
                <button disabled={this.props.helloText === ''} onClick={this.props.sayHello}>{t('run')}</button>
              </div>
              <div>
                <label>{t('response')}</label>
                <textarea readOnly style={styles.serverResponse} placeholder={t('response')}
                  value={this.props.helloResponse} onChange={this.props.handleHelloResponseChange}></textarea>
=======
                <input placeholder="Message" value={this.props.helloText} style={styles.inputText}  onChange={this.props.handleHelloTextChange}/>      
                <button style={styles.runButton} onClick={this.props.sayHello}>Run</button>
              </div>
              <div>
                <label style={styles.responseLabel}>Response</label>
                <textarea style={styles.serverResponse} placeholder="Response" value={this.props.helloResponse} onChange={this.props.handleHelloResponseChange}></textarea>
>>>>>>> Stashed changes
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation('translation')(SamplePage);
