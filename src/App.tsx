import * as React from 'react';
import './App.css';
import { MemoryRouter, Route } from 'react-router';
import SecondPage from './SecondPage';
import FirstPage from './FirstPage';

class App extends React.Component<any, any> {
  constructor(props){
    super(props);   
      this.state = {
        selectedCheckBoxes: new Set(),
        selectedValue: 'First',
        textArea: "Input larger text here!",
        inputText: "Input Text Here",
        radioOption: "option1"
    };
  };

  handleDropDownChange(e) {
    this.setState({selectedValue: e.target.value});
  };

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

  handleInputTextChange(e) {
    this.setState({inputText: e.target.value});
  }

  handleRadioChange(e) {
    this.setState({radioOption: e.target.value});
  }
  
  public render(): JSX.Element {
    return (
      <MemoryRouter
      initialEntries={[
        '/one',
        '/two'
      ]}>
      <div>
        <Route path="/one" 
               render={(props) => 
              <FirstPage {...props} 
              selectedCheckBoxes={this.state.selectedCheckBoxes}
              selectedValue={this.state.selectedValue}
              textArea={this.state.textArea}
              inputText={this.state.inputText}
              radioOption={this.state.radioOption}
              handleDropDownChange={this.handleDropDownChange.bind(this)}
              handleCheckBoxChange={this.handleCheckBoxChange.bind(this)}
              handleTextAreaChange={this.handleTextAreaChange.bind(this)}
              handleInputTextChange={this.handleInputTextChange.bind(this)}
              handleRadioChange={this.handleRadioChange.bind(this)}
              />} />
        <Route path="/two" 
               render={(props) => 
              <SecondPage {...props} 
              selectedCheckBoxes={this.state.selectedCheckBoxes}
              selectedValue={this.state.selectedValue}
              textArea={this.state.textArea}
              inputText={this.state.inputText}
              radioOption={this.state.radioOption}
              />}/>
      </div>
    </MemoryRouter>

    );
  }
}

export default App;
