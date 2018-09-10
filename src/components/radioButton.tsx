import * as React from 'react';
import '../App.css';


export class RadioButton extends React.Component<any, any> {
  constructor(props){
    super(props);   
      this.state = {
        radioOption: "option1"
    };
  };
    
  handleRadioChange(e) {
    this.setState({radioOption: e.target.value});
  }

  public render(): JSX.Element {
    return (
      <div className="RadioButton">
        <form action="">
          <input type="radio" name="radio" value="option1" checked={this.state.radioOption == "option1"} 
            onChange={this.handleRadioChange.bind(this)}/> Option 1<br/>
          <input type="radio" name="radio" value="option2" checked={this.state.radioOption == "option2"}
            onChange={this.handleRadioChange.bind(this)}/> Option 2<br/>
          <input type="radio" name="radio" value="option3" checked={this.state.radioOption == "option3"}
            onChange={this.handleRadioChange.bind(this)}/> Option 3<br/>
        </form>
      </div>
    );
  }
}

export default RadioButton;