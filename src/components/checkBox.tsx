import * as React from 'react';
import '../App.css';

export class CheckBox extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="CheckBox">
        <input type="checkbox" name="check1" value="check1" 
          onChange={this.props.onCheck}/> Check 1<br/>
        <input type="checkbox" name="check2" value="check2"
          onChange={this.props.onCheck}/> Check 2<br/>
        <input type="checkbox" name="check3" value="check3"
          onChange={this.props.onCheck}/> Check 3<br/>
      </div>
    );
  }
}

export default CheckBox;
