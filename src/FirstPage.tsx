import * as React from 'react';
import './App.css';
import { MVDResources } from './mvd-resources';
import { DropDown } from './components/dropDown';
import { TextBox } from './components/textBox';
import { RadioButton } from './components/radioButton';
import { CheckBox } from './components/checkBox';
import { TextArea } from './components/textArea';

class FirstPage extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="FirstPage">
        <header className="App-header">
          <h1 className="App-title">React Sample App</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code>, rebuild, and reload.
          <br/>
          <DropDown selectedValue={this.props.selectedValue} onChange={this.props.handleDropDownChange}/>
          <br/>
          <TextBox inputText={this.props.inputText} onChange={this.props.handleInputTextChange}/>
          <br/>
          <RadioButton radioOption={this.props.radioOption} onChange={this.props.handleRadioChange}/>
          <br/>
          <CheckBox selectedCheckBoxes={this.props.selectedCheckBoxes} onCheck={this.props.handleCheckBoxChange}/>
          <br/>
          <TextArea textArea={this.props.textArea} onChange={this.props.handleTextAreaChange}/>
          <br/>
          <button onClick={() => this.props.history.push('/two')}>Next Page</button>
          <MVDResources.Consumer>
            {resources => (
              <>
                <button onClick={resources.windowActions.maximize}>Maximize</button>
                <button onClick={resources.windowActions.restore}>Restore</button>
              </>
            )}
          </MVDResources.Consumer>
        </p>
      </div>
    );
  }
}

export default FirstPage;
