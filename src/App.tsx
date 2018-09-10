import * as React from 'react';
import './App.css';
import { MVDResources } from './mvd-resources';

class App extends React.Component<any, any> {
  constructor(props){
    super(props);   
    this.state = {
          selectedValue: 'First',
          inputText: "Input Text Here",
          radioOption: "option1",
          selectedCheckBoxes: new Set(),
          textArea: "Input larger text here!"
        };
  };
  
  handleDropDownChange(e) {
    this.setState({selectedValue: e.target.value});
  };

  handleInputTextChange(e) {
    this.setState({inputText: e.target.value});
  };

  handleRadioChange(e) {
    this.setState({radioOption: e.target.value});
  }

  handleCheckBoxChange(e) {
    if (this.state.selectedCheckBoxes.has(e.target.value)) {
      this.state.selectedCheckBoxes.delete(e.target.value);
    } else {
      this.state.selectedCheckBoxes.add(e.target.value);
    }
  }

  handleTextAreaChange(e) {
    this.setState({textArea: e.target.value});
  }


  public render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Sample App</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code>, rebuild, and reload.
          <br/>
          <select value={this.state.selectedValue} onChange={this.handleDropDownChange.bind(this)}>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
          </select>
          <br/>
          <input type="text" value={this.state.inputText} onChange={this.handleInputTextChange.bind(this)}/>
          <br/>
          <form action="">
            <input type="radio" name="radio" value="option1" checked={this.state.radioOption == "option1"} 
              onChange={this.handleRadioChange.bind(this)}/> Option 1<br/>
            <input type="radio" name="radio" value="option2" checked={this.state.radioOption == "option2"}
              onChange={this.handleRadioChange.bind(this)}/> Option 2<br/>
            <input type="radio" name="radio" value="option3" checked={this.state.radioOption == "option3"}
              onChange={this.handleRadioChange.bind(this)}/> Option 3<br/>
          </form>
          <br/>
            <input type="checkbox" name="check1" value="check1" 
              onChange={this.handleCheckBoxChange.bind(this)}/> Check 1<br/>
            <input type="checkbox" name="check2" value="check2"
              onChange={this.handleCheckBoxChange.bind(this)}/> Check 2<br/>
            <input type="checkbox" name="check3" value="check3"
              onChange={this.handleCheckBoxChange.bind(this)}/> Check 3<br/>
          <br/>
          <textarea rows={4} cols={50} value={this.state.textArea} onChange={this.handleTextAreaChange.bind(this)}>
          </textarea>
          <br/>
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

export default App;
