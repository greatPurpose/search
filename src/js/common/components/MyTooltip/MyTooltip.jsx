import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

class MyTooltip extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false
    };
  }


  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  render () {
    const {id, text} = this.props;
    return (
        <Tooltip 
          placement='top' 
          isOpen={this.state.tooltipOpen} 
          target={id} 
          toggle={this.toggle}
        >
          {text}
        </Tooltip> 
    );
  }
}

export default MyTooltip;
