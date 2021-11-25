import React, { PureComponent } from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import './SpanWithTooltip.scss';

class SpanWithTooltip extends PureComponent { 
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
    const {id, item} = this.props;
    return (
      <div className="SpanWithTooltipWrapper">
        <button className={item.type} id={'Tooltip-' + id}>{item.text}</button>
        {item.tooltipText.length ? <Tooltip 
          placement='top' 
          isOpen={this.state.tooltipOpen} 
          target={'Tooltip-' + id} 
          toggle={this.toggle}
        >
          {item.tooltipText}
        </Tooltip> : null}
      </div>
    );
  }
}

export default SpanWithTooltip;
