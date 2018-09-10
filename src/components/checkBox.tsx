import * as React from 'react';
import '../App.css';

export class CheckBox extends React.Component<any, any> {
  constructor(props){
    super(props);   
      this.state = {
        selectedCheckBoxes: new Set()
    };
  };
    
  handleCheckBoxChange(e) {
    if (this.state.selectedCheckBoxes.has(e.target.value)) {
      this.state.selectedCheckBoxes.delete(e.target.value);
    } else {
      this.state.selectedCheckBoxes.add(e.target.value);
    }
  }

  public render(): JSX.Element {
    return (
      <div className="CheckBox">
        <input type="checkbox" name="check1" value="check1" 
          onChange={this.handleCheckBoxChange.bind(this)}/> Check 1<br/>
        <input type="checkbox" name="check2" value="check2"
          onChange={this.handleCheckBoxChange.bind(this)}/> Check 2<br/>
        <input type="checkbox" name="check3" value="check3"
          onChange={this.handleCheckBoxChange.bind(this)}/> Check 3<br/>
      </div>
    );
  }
}

export default CheckBox;