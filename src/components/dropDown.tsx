import * as React from 'react';
import '../App.css';


export class DropDown extends React.Component<any, any> {
  constructor(props){
    super(props);   
      this.state = {
        selectedValue: 'First'
      };
  };
    
  handleDropDownChange(e) {
    this.setState({selectedValue: e.target.value});
  };

  public render(): JSX.Element {
    return (
      <div className="DropDown">
          <select value={this.state.selectedValue} onChange={this.handleDropDownChange.bind(this)}>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
          </select>
      </div>
    );
  }
}

export default DropDown;