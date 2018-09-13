import * as React from 'react';
import '../App.css';

export class RadioButton extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="RadioButton">
        <form action="">
          <input type="radio" name="radio" value="option1" checked={this.props.radioOption == "option1"} 
            onChange={this.props.onChange}/> Option 1<br/>
          <input type="radio" name="radio" value="option2" checked={this.props.radioOption == "option2"}
            onChange={this.props.onChange}/> Option 2<br/>
          <input type="radio" name="radio" value="option3" checked={this.props.radioOption == "option3"}
            onChange={this.props.onChange}/> Option 3<br/>
        </form>
      </div>
    );
  }
}

export default RadioButton;
