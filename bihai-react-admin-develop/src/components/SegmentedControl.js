import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SegmentedControl extends Component{
  static propTypes = {
    onValueChange: PropTypes.func,
    options: PropTypes.array,
    mainColor: PropTypes.string,
    unSelectColor: PropTypes.string
  };
  static defaultProps = {
    onValueChange: () => null,
    options: [],
    mainColor: 'rgb(161,63,36)',
    unSelectColor: 'rgb(216,88,64)'
  };
  render(){
    let { value, mainColor, onValueChange, unSelectColor, options } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row', height: 40, border: `1px solid ${mainColor}`, borderRadius: 3 }}>
        {
          options.map(option => {
            let isSelected = value === option.value;
            return (
              <a
                key={option.value}
                onClick={() => {onValueChange(option.value)}}
                style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isSelected ? mainColor : unSelectColor, color: isSelected ? 'white' : mainColor}}>
                <span>{option.label}</span>
              </a>
            );
          })
        }
      </div>
    );
  }
}
