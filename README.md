This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.

# Sample React App

This branch acts as a tutorial, intended as a workshop session, which will teach you how to develop your own Zowe App from scratch.
This README contains code snippets and descriptions that you can piece together to complete the App that you will need to complete the tutorial.

By the end of this tutorial, you will:
1. Know how to create an App that shows up on the Desktop
1. Be introduced to Typescript programming
1. Be introduced to simple React web development

Further tutorials are present within this repository to expand upon what you learn here, adding new features to the App to teach about different aspects of Apps within Zowe.

**Note: This tutorial assumes you already have a Zowe installation ready to be run. If you do not, try setting one up via the README at [zlux-example-server](https://github.com/zowe/zlux-example-server) before continuing.**

So, let's get started!

1. [Constructing an App Skeleton](#constructing-an-app-skeleton)
1. [Defining your first Plugin](#defining-your-first-plugin)
1. [Constructing a Simple React UI](#constructing-a-simple-react-ui)
    1. [Introducing Zowe UI Resources](#introducing-zowe-ui-resources)
1. [Packaging Your Web App](#packaging-your-web-app)
1. [Adding Your App to the Desktop](#adding-your-app-to-the-desktop)

## Constructing an App Skeleton
If you look within this repository, you'll see that a few boilerplate files already exist to help you get your first App running quickly. The structure of this repository follows the guidelines for Zowe App filesystem layout, which you can read more about [on this wiki](https://github.com/zowe/zlux/wiki/ZLUX-App-filesystem-structure) if you need.


## Defining your first Plugin
So, where do you start when making an App? In the Zowe framework, An App is a Plugin of type Application. Every Plugin is bound by their **pluginDefinition.json** file, which describes what properties it has.
Let's start by creating this file.

Make a file, **pluginDefinition.json**, at the root of the **sample-react-app** folder.

The file should contain the following:
```json
{
  "identifier": "org.zowe.zlux.sample.react",
  "apiVersion": "1.0.0",
  "pluginVersion": "1.0.0",
  "pluginType": "application",
  "webContent": {
    "framework": "react",
    "launchDefinition": {
      "pluginShortNameKey": "samplereact",
      "pluginShortNameDefault": "React Sample",
      "imageSrc": "assets/icon.png"
    },
    "descriptionKey": "SampleReactPluginDescription",
    "descriptionDefault": "Sample App Showcasing React Adapter",
    "isSingleWindowApp": true,
    "defaultWindowStyle": {
      "width": 800,
      "height": 450,
      "x": 200,
      "y": 50
    }
  },
  "dataServices": [
    {
      "type": "import",
      "sourceName": "hello",
      "localName": "hello",
      "sourcePlugin": "org.zowe.zlux.sample.iframe"
    }
  ]
}
```

You might wonder why we chose the particular values that are put into this file. A description of each can again be found [in the wiki](https://github.com/zowe/zlux/wiki/Zlux-Plugin-Definition-&-Structure).

Of the many attributes here, you should be aware of the following:
* Our App has the unique identifier of `org.zowe.zlux.sample.react`, which can be used to refer to it when running Zowe
* The App has a `webContent` attribute, because it will have a UI component visible in a browser.
    * The `webContent` section states that the App's code will conform to Zowe's React App structure, due to it stating `"framework": "react"`
    * The App has certain characteristics that the user will see, such as:
        * The default window size (`defaultWindowStyle`), 
        * An App icon that we provided in `sample-react-app/webClient/src/assets/icon.png`, 
        * That we should see it in the browser as an App named `React Sample`, the value of `pluginShortNameDefault`.
        
## Constructing a Simple React UI
React Apps for Zowe are structured such that the source code exists within `webClient/src`. In here, you can create components and styles for your UI, branching off from the two files that help to hook the React content back into the Zowe UI: 
* index.tsx: This file hooks your React code into Zowe. It provides hooks on actions performed in React, and allows you to register your React code into the reactDOM.render() call to get started. The boilerplate you see already references an "App" tag which doesn't yet exist. It's an assumed default name and we'll built it out shortly.
* mvd-resources.ts: The Zowe UI has resources that makes App development easier and also helps Apps to co-exist in a multi-App environment. This file is a bit of typescript boilerplate to reference the resource objects that your React App can use. We'll explore those resources more soon.

For the App we are making, we'll start simple by adding a few files to `webClient/src`:
* App.tsx
* SamplePage.tsx
* App-css.js

In the Plugin's definition file, **pluginDefinition.json**, you can see that we defined a dataservice import. So, for our App, we'll just start off by displaying some simple content that can test a successful connection to that service.

Since the **index.tsx** file mentioned above already references an "App" tag and we don't have one yet, let's start by making a new file, **App.tsx**, with the following content:

```typescript
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
```

Let's stop here and inspect what we just did. If you're new to React, you might wonder how this is a valid file, as the bottom `render()` call appears to be mixing XML with scripting. 
React tries to make web development more convenient and organizable by structuring code such that the layout description of the UI is closely tied to the logic that controls it. 
Originally, React accomplished this by a unique type of file "JSX", which allowed you to easily write HTML within Javascript. But, Typescript is much preferred to Javascript for maintainable code... (a bit more on this here)[https://github.com/zowe/sample-app/blob/lab/step-1-hello-world/README.md#why-typescript]. So, instead, we've written a TSX file, which is the Typescript equivalent of a JSX file that React uses.

### Introducing Zowe Resources

In the constructor of the Component, App, you'll see that there's some objects being utilized here that you may be unfamiliar with.

```typescript
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
```

The Component is given a props object on creation, but what's **ZLUX.ComponentLogger**? This is one of a variety Zowe contextual objects provided by ZLUX - the Zowe UI framework.
From this constructor alone, you can see two types of interesitng Zowe-specific objects.
For the first type, the framework provides these contextual objects via `this.props.resources`, and you can see that two such objects are utilized here: the logger and the pluginDefinition.
You can see the full list of objects available via `this.props.resources` within (zlux-app-manager)[https://github.com/zowe/zlux-app-manager/blob/master/virtual-desktop/src/pluginlib/react-inject-resources.ts], the one of the repositories that comprises the Zowe UI framework. Some of these objects generate events, others present info, but all are unique to your individual App - and some unique to the individual instance of that App. So, these can be a great help to support your App in the Zowe environment as well as to act upon user actions.

The second interesting Zowe-specific object type you see is here:
```typescript
destination: ZoweZLUX.uriBroker.pluginRESTUri(this.props.resources.pluginDefinition.getBasePlugin(), 'hello',"")
```

ZoweZLUX is a global object: it can be accessed anywhere in the code as it does not pertain to any specific plugin or instance, but helps you do routine tasks easily. This one takes the plugin definition to accomplish a task specific to your plugin - returning a URI that can be used for a network request without having to hardcode it.




Now, back to React. When it comes to React development, you can reference one Component within another's render() call, and so what we've chosen to do here is to split most of the logic into one file, and most of the layout description into another - which is not at all required but is one way to organize React code. We've done this by referencing **SamplePage** in the `render()` call, and had included it up top via `import SamplePage from './SamplePage';`.

Let's add that file now. Simply create **SamplePage.tsx** with the following content:

```typescript
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

```

While this file is primarily being used for defining the layout of the App, you'll notice that elements have a "style" attribute, but that what is being referenced within does not appear to be either a css class or a string of inline css styling. 
Whenever writing a webpage, you must be careful about the dependencies that you pull in and how it effects the global namespace objects within the page: both Javascript globals and CSS class globals.
In the Zowe UI, this is even more important, since the webpage is not for your App alone; it is a multi-App environment and Apps should not be allowed to effect others except in structured manners via methods provided by Zowe frameworks.

The ZLUX framework's build and runtime technologies (webpack, typescript) help to isolate the scripting code such that the global namespace does not get polluted, but CSS is more framework-dependent. With Angular,
CSS can be encapsulated such that a style with a given name in one App does not impact another. However, in React accomplishing this is not as easy.
What we've done here is one way to accomplish isolation of CSS in React. SamplePage uses style attributes on elements, which allows for the inlining of CSS information without associating it to a named class - so that there will not be overlap with other classes. This is done by having the style written out as Objects rather than CSS, and merging these objects together as needed. The objects are pulled in via the Webpack script loader, loading a JS file here:

```typescript
import 'script-loader!./App-css.js';
```

So, let's add this file. Fill **App-css.js** with the following contents:

```javascript
var styles = {
  iframeFont :{
    fontFamily: "sans-serif",
    fontSize: "0.8em"
  },

  boldText :{
    fontWeight: "600"
  },

  biggerBoldText :{
    fontSize: "1.1em",
    fontWeight: "600"
  },

  divInput :{
    marginTop: "5px",
    marginBottom: "10px",
    paddingTop: "5px",
    paddingBottom: "5px",
    width: "300px"
  },

  divTextareaInput :{
    marginTop: "5px",
    marginBottom: "5px",
    paddingTop: "5px",
    paddingBottom: "5px",
    width: "95%"
  },

  iframeInput :{
    width: "100%",
    paddingLeft: "5px"
  },

  inputCorner :{
    borderRadius: "4px"
  },

  inputHeight :{
    height: "20px"
  },

  inputText :{
  },

  iframeButton :{
    borderRadius: "4px",
    margin: "0px 4px 0px 4px",
    fontWeight: "700"
  },

  rightAlign :{
    textAlign: "right",
    paddingRight: "50px"
  },

  shadowed :{
    boxShadow: "3px 3px 10px"
  },

  hideIt :{
    display: "none"
  },

  bottom10 :{
    marginBottom: "10px"
  },

  displayText :{
    borderRadius: "4px",
    border: "1px solid grey",
    backgroundColor: "white",
    height: "18px",
    width: "96%"
  },

  disableEffect :{
    color: "grey"
  },

  h1 :{
    textAlign: "center"
  },

  serverResponse :{
    width: "100%",
    height: "180px"
  },

  testPanel :{
    padding: "5px 5px 5px 5px"
  },

  testPanelContainer :{
    flexDirection: "row",
    display: "flex"
  },

  pluginTestPanel :{
    borderRight: "outset",
    flexGrow: "1"
  },

  dataserviceTestPanel :{
    borderLeft: "outset"
  }
};
```

The logic we see here isn't much altered from the CSS found in the other sample apps - css class naming has been altered to be camelCase, and the file structured as one Javascript Object, but the rest is as-is.


## Packaging Your Web App

At this time, we've made the source for a Zowe App that should open up in the Desktop with a greeting to the planet.
Before we're ready to use it however, we have to transpile the typescript and package the App. This will require a few build tools first. We'll make an NPM package in order to facilitate this.

Let's create a **package.json** file, within `sample-react-app/webClient` relative to your Zowe installation.
While a package.json can be created through other means such as `npm init` and packages can be added via commands such as `npm install --save-dev typescript@2.9.0`, we'll opt to save time by just pasting these contents in:

```json
{
  "name": "org.zowe.zlux.sample.react",
  "version": "1.0.0",
  "description": "A sample react showcasing react framework in Zowe App Framework",
  "license": "EPL-2.0",
  "dependencies": {
    "react": "~16.4.0",
    "react-dom": "~16.4.0",
    "react-router": "~4.3.1",
    "react-scripts-ts": "2.16.0"
  },
  "scripts": {
    "start": "webpack --progress --colors --watch",
    "build": "webpack --progress --colors",
    "test": "react-scripts-ts test --env=jsdom",
    "eject": "react-scripts-ts eject"
  },
  "devDependencies": {
    "@types/jest": "~23.0.2",
    "@types/react": "~16.3.17",
    "@types/react-dom": "~16.0.6",
    "copy-webpack-plugin": "~4.5.2",
    "css-loader": "~1.0.0",
    "exports-loader": "~0.7.0",
    "file-loader": "~1.1.11",
    "html-loader": "~0.5.5",
    "script-loader": "~0.7.2",
    "source-map-loader": "~0.2.3",
    "ts-loader": "~4.4.2",
    "typescript": "~2.9.0",
    "tslint": "~5.10.0",
    "url-loader": "~1.0.1",
    "webpack": "~4.0.0",
    "webpack-config": "~7.5.0",
    "webpack-cli": "~3.0.0"
  }
}
```


Now we're really ready to build.
There's two usual ways you can build an App for Zowe:
1. `npm run build` which builds the App once
1. `npm run start` which builds once, and then monitors your filesystem to quickly rebuild any time your source code is updated - so the build program does not end until you quit it. This is recommended for rapid development

Let's just build the App once for now, this time.
1. Open up a command prompt to `sample-react-app/webClient`
1. Set the environment variable MVD_DESKTOP_DIR to the location of `zlux-app-manager/virtual-desktop`. Such as `set MVD_DESKTOP_DIR=../../zlux-app-manager/virtual-desktop`. This is needed whenever building individual App web code due to the core configuration files being located in **virtual-desktop**
1. Execute `npm install`. This installs all the dependencies we put into the **package.json** file above
1. Execute `npm run build`


OK, after the first execution of the transpilation and packaging concludes, you should have `sample-react-app/web` populated with files that can be served by the Zowe App Server for the UI.


## Adding Your App to the Desktop
At this point, your sample-react-app folder contains files for an App that could be added to a Zowe instance. We'll add this to our own Zowe instance. First, ensure that the Zowe App server is not running. Then, navigate to the instance's root folder, `/zlux-example-server`.

Within, you'll see a folder, **plugins**. Take a look at one of the files within the folder. You can see that these are JSON files with the attributes **identifier** and **pluginLocation**. These files are what we call **Plugin Locators**, since they point to a Plugin to be included into the server.

Let's make one ourselves. Make a file `/zlux-example-server/plugins/org.zowe.zlux.sample.react.json`, with these contents:
```json
{
  "identifier": "org.zowe.zlux.sample.react",
  "pluginLocation": "../../sample-react-app"
}
```

When the server runs, it will check for these sorts of files in its `pluginsDir`, a location known to the server via its specification in the [server configuration file](https://github.com/zowe/zlux/wiki/Configuration-for-zLUX-Proxy-Server-&-ZSS#app-configuration). In our case, this is `/zlux-example-server/deploy/instance/ZLUX/plugins/`.

You could place the JSON directly into that location, but the recommended way to place content into the deploy area is via running the server deployment process.
Simply:
1. Open up a (second) command prompt to `zlux-build`
1. `ant deploy`

Now you're ready to run the server and see your App.
1. `cd /zlux-example-server/bin`
1. `./nodeCluster.sh` ... if you're testing this in an environment where the ZSS server is not on the same system as the Zowe App Server, you'll instead need to do `./nodeCluster.sh -h \<zss host\> -P \<zss port\>`
1. Open your browser to `https://hostname:port`, where the hsotname and port are for the Zowe App Server.
1. Login with your credentials
1. Open the App folder in the left corner of the toolbar, and open the React Sample App.

Do you see on the right side of the App an input area, a button to send your input, and a text area to receive a response? Do you get back a response showing that your input was accepted? If so, you're in good shape, and have completed the lab!
We'll fill in the logic for the left side of the App in the next lab, so please give that a try to learn more about the Zowe UI!


This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.
