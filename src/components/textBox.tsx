import * as React from 'react';
import '../App.css';


export class TextBox extends React.Component<any, any> {
  constructor(props){
    super(props);   
      this.state = {
        inputText: "Input Text Here"
      };
  };
    
  handleInputTextChange(e) {
    this.setState({inputText: e.target.value});
  };

  public render(): JSX.Element {
    return (
      <div className="TextBox">
          <input type="text" value={this.state.inputText} onChange={this.handleInputTextChange.bind(this)}/>
      </div>
    );
  }
}

export default TextBox;