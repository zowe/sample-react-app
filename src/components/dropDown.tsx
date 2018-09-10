import * as React from 'react';
import '../App.css';

export class DropDown extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <div className="DropDown">
          <select value={this.props.selectedValue} onChange={this.props.onChange}>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
          </select>
      </div>
    );
  }
}

export default DropDown;
