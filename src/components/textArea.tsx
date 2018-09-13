import * as React from 'react';
import '../App.css';

export class TextArea extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="TextArea">
          <textarea rows={4} cols={50} value={this.props.textArea} onChange={this.props.onChange}>
          </textarea>
      </div>
    );
  }
}

export default TextArea;
