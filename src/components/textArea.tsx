import * as React from 'react';
import '../App.css';

export class TextArea extends React.Component<any, any> {
  constructor(props){
    super(props);   
      this.state = {
        textArea: "Input larger text here!"
    };
  };
    
  handleTextAreaChange(e) {
    this.setState({textArea: e.target.value});
  }

  public render(): JSX.Element {
    return (
      <div className="TextArea">
          <textarea rows={4} cols={50} value={this.state.textArea} onChange={this.handleTextAreaChange.bind(this)}>
          </textarea>
      </div>
    );
  }
}

export default TextArea;