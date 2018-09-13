import * as React from 'react';
import '../App.css';

export class TextBox extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="TextBox">
          <input type="text" value={this.props.inputText} onChange={this.props.onChange}/>
      </div>
    );
  }
}

export default TextBox;
