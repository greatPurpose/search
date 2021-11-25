import React, { PureComponent } from 'react';
import imgDown from '../../../../assets/images/down.png'
import './DropDownMenu.scss';

class DropDownMenu extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      selectedMenuIndex: 0,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  
  handleClickOutside = (event) => {
    if (this.DropdownButton && !this.DropdownButton.contains(event.target)) {
      this.setState({showMenu: false});
    }
  }
  
  onButtonClick = () => {
    this.setState({showMenu: !this.state.showMenu});
  }  

  onMenuClick = (i) => {
    this.setState({showMenu: false});
    this.props.onChange(i);
  }

  render () {
    const { showMenu } = this.state;
    const { headerMenuItem, selectedMenuIndex, enabled} = this.props;
    return (
      <div 
        className={`dropdown ${headerMenuItem[selectedMenuIndex].name} ${enabled?'':'disabled-span'}`}
        ref={(element) => { this.DropdownButton = element; }}
        onClick={this.onButtonClick}
      >
        <span>{headerMenuItem[selectedMenuIndex].caption}</span>
        <img className='img-down clickable dropbtn' src={imgDown} />
        {showMenu && (
          <div className="dropdown-content">
            {headerMenuItem.map((item,index) => {
              return (selectedMenuIndex !== index) 
                  && <div 
                      className={enabled? item.name : 'disabled-span'}
                      key={index} 
                      onClick={()=>this.onMenuClick(index)}
                    >
                      {item.caption}
                    </div>
            })}
          </div>)
        }
    </div>
    )
  }
}

export default DropDownMenu;
