This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.

# Sample React App

This branch acts as a tutorial, intended as a workshop session, which will teach you how to make use of the ZLUX configuration dataservice within an App.
The code here is the completed version, and serves as a reference. To complete this tutorial, you should either build off of a sandbox you have been using to complete the prior tutorials in sequential order, or, you can just [clone the previous tutorial branch here](https://github.com/zowe/react-sample-app/tree/lab/step-3-app2app-complete) and work from that.

By the end of this tutorial you will:
1. Know how to load user preferences and default settings.
1. Know how to update user preferences for future use

So, let's get started!

1. [Purpose of Configuration Dataservice](#purpose-of-configuration-dataservice)
1. [Setting Up for Rapid Development](#setting-up-for-rapid-development)
1. [Adding Support to the App](#adding-support-to-the-app)
1. [Adding Settings Retrieval](#adding-settings-retrieval)
1. [Adding Settings Storing](#adding-settings-storing)


## Purpose of Configuration Dataservice

When using a multi-user, hosted environment, there's often a need to save and retrieve settings for future use. And beyond that, it's also important that the settings that you save can be distinct from the settings of another user. Yet, such hosted environments are often administrated in a way to provide default settings either to be overridden, or not, dependent upon policy.

ZLUX, the framework for the Zowe UI, provides a solution for these requirements, called the Configuration Dataservice.
This dataservice takes advantage of the knowledge the framework has of Plugins, such as Apps, that are installed, to provide convenient use to developers and security and flexibility for administrators in that
the dataservice acts upon established authorization rules and resource definitions of Plugins in order to allow access to what you need as easily and securely as possible.

We'll now explore some simple use of the dataservice, but there are more features than we will touch on here, so if you are interested to learn more don't hesitate to check the wiki: [Configuration Dataservice](https://github.com/zowe/zlux/wiki/Configuration-Dataservice)

## Setting Up for Rapid Development

Before we get to implementing new features into this App, you should set up your environment to quickly build any changes you put in.
When building web content for ZLUX, Apps are packaged via Webpack, which can automatically scan for file changes on code to quickly repackage only what has changed.
To do this, you would simply run `npm run start`, but you may need to do a few tasks prior:

1. Open up a command prompt to `sample-angular-app/webClient`
1. Set the environment variable MVD_DESKTOP_DIR to the location of `zlux-app-manager/virtual-desktop`. Such as `set MVD_DESKTOP_DIR=../../zlux-app-manager/virtual-desktop`. This is needed whenever building individual App web code due to the core configuration files being located in **virtual-desktop**
1. Execute `npm install`. This installs all the dependencies we put into the **package.json** file above
1. Execute `npm run start`

## Adding Support to the App

The Configuration Dataservice allows for access to settings storage according to what a Plugin declares as being a **resource**. That is to say, the developer is able to determine what is a valid storage item such that unintended access to storage is avoided.

**Resources** are organized into a tree structure, where only leaf **resources** or **sub-resources** can have content stored within. Trying to access a non-leaf resource may instead allow for an aggregated action done on the subresources.

Let's add a definition for the **Resources** that we want to work with, by putting a new attribute into the App's **pluginDefinition.json**. Simply, add the following into `sample-react-app/pluginDefinition.json`:

```json
  "configurationData": {
    "resources": {
      "requests": {
        "aggregationPolicy": "override",
        "subResources": {
          "app": {
            "aggregationPolicy": "override"
          }
        }
      }
    }
  }
```

The full JSON should now be:

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
  ],
  "configurationData": {
    "resources": {
      "requests": {
        "aggregationPolicy": "override",
        "subResources": {
          "app": {
            "aggregationPolicy": "override"
          }
        }
      }
    }
  }
}
```

After doing this, be sure to restart the ZLUX server, as these properties are only read when adding an App, such as at startup.

## Adding Settings Retrieval

At this point, the server should be able to support accessing & modifying settings for your App, but your App doesn't yet have any way to invoke these commands! Let's start by adding a way for the user to get preferences.

First, open and edit `sample-react-app/webClient/src/SamplePage.tsx` to add a new button:

```typescript
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.sendAppRequest}>Send App Request</button> // this was already here
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.getDefaultsFromServer}>Get from Server</button> //add this!
```

We'll tie some logic to that button by then editing `App.tsx` in the same folder, adding a new method to the App Component, **getDefaultsFromServer**

```typescript
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
      this.setState({status: 'Error getting defaults'});
    });
  }
```

And, let's tie together the logic and layout code by editing the `render()` method:

```typescript
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
              getDefaultsFromServer={this.getDefaultsFromServer.bind(this)} //our new function
              handleAppIdChange={this.handleAppIdChange.bind(this)}
              handleParameterChange={this.handleParameterChange.bind(this)}
              handleAppTargetChange={this.handleAppTargetChange.bind(this)}
               handleActionTypeChange={this.handleActionTypeChange.bind(this)}
               />} />
         </div>
         </MemoryRouter>
     );
   }
```

At this point, the App will have a new button that when pressed, will try to grab contents from the server to set the **parameters** and **app ID** inputs that are on the App.
The way it does this is here:

```typescript
    let plugin = this.props.resources.pluginDefinition.getBasePlugin();
    let appRequestUri = ZoweZLUX.uriBroker.pluginConfigUri(plugin, 'requests/app', undefined);
    fetch (appRequestUri, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res=> {
```

ZLUX is providing a convenient object, the [**UriBroker**](https://github.com/zowe/zlux/wiki/URI-Broker), off of the global `ZoweZLUX`, which allows you to get a URI that you can use to access the storage for this App.
The **UriBroker** has several methods for different types of access, but the one you see here is for accessing the resource requested for this App, and to search by the scope of the current user.
When working from the user scope, you'll get the settings that were either saved by the user, or if not found, by some broader scope such as administratively set settings, or App defaults.

If you want to ensure that your App is always getting settings set by an administrator instead of by the user, an alternative URI you could have used could be generated via

`ZoweZLUX.uriBroker.pluginConfigForScopeUri(plugin, instance, 'requests/app', undefined);`

This would have instead retrieved settings that were set for the entire Zowe instance, rather than just the current user.

Now, if you try this button we added for getting settings, you'll see we are not done yet! There's nothing saved to begin with, so you'll get an error about there being no content to retrieve.
If you want to store some content, there's different ways you could do this:
1. Place the setting on the filesystem manually... you shouldn't need to do this, but if you ever did, you'd see that the Configuration Dataservice stores content within the **deploy** directories of the server, such as **instanceDir** or **productDir**. Within one, the configuration dataservice places content into `ZLUX/pluginStorage/\<pluginid\>/\<resource\>`
1. Programmatically allow for saving data... let's do this!

## Adding Settings Storing

Since we need to add storing after having added retrieving, we need to add another button, method, and attach the two as we did before.

Add a new button to `SamplePage.tsx`:

```typescript
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.sendAppRequest}>Send App Request</button> // this was already here
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.getDefaultsFromServer}>Get from Server</button> //we added this a moment ago
                <button style={mergeStyles(styles.iframeButton, styles.shadowed)} type="button" onClick={this.props.saveToServer}>Save to Server</button> //add this!
```

Now add a new method in `App.tsx` to the App Component. We'll name it  **saveToServer**

```typescript
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
          this.setState({status: 'Error saving App ID'});
        });
      } else {
        this.log.warn(`Error on saving parameters, response status=${res.status}`);
      }
    }).catch(e => {
      this.log.warn(`Error on saving parameters, e=${e}`);
      this.setState({status: 'Error saving parameters'});
    });
  }
```

And, let's tie together the logic and layout code by editing the `render()` method one last time:

```typescript
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
```

For demonstration purpose, the content is actually being saved slightly differently than it is being retrieved.
You can see we retrieve via a URI we get from calling:

```typescript
    let appRequestUri = ZoweZLUX.uriBroker.pluginConfigUri(plugin, 'requests/app', undefined);
```

While, we save by getting two different URIs:

```typescript
    let parameterUri = ZoweZLUX.uriBroker.pluginConfigUri(plugin, 'requests/app', 'parameters');
    let appIdUri = ZoweZLUX.uriBroker.pluginConfigUri(plugin, 'requests/app', 'appid');
```

On the retrieval, the name of the object being retrieved is left as undefined. In this case, it means that the App will be retrieving not a leaf resource, but the parent of leafs.
This is known because when the App is saving data, it is saving `parameters` and `appid` as two JSON files.
Because the content stored in the configuration dataservice is JSON, it is able to aggregate certain things for convenience and also reduce the number of calls needed between the client and server.
So, the App is saving parameters and appid individually, but is retrieving the parent resource of both, and therefore the response from retrieval actually **includes** both **parameters** and **appid**, so only one call was needed.


OK, at this point the App should be able to save and retrieve settings by using the configuration dataservice! 
Go ahead and try it out, and you should see that if you save something to the server via the **Save to Server** button, that when changing the contents of **parameters** and the **App ID** fields, you can restore them to what you saved earlier by pressing **Get from Server**



This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.
