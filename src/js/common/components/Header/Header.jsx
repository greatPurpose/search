import React, { PureComponent } from "react"
import { connect } from "react-redux"
import HamburgerMenu from "react-hamburger-menu"

import "./Header.scss"
import imgLogo from "../../../../assets/images/logo.png"

import { actions as ethereumActions } from "../../../redux/modules/ethereum"
import { actions as balanceActions } from "../../../redux/modules/balance"

import { getConcentratedAddr } from "../../services/helpers"
import { formatMoney } from "../../../common/services/helpers"
import { CurSpan, ShortCurSpan } from "../CurSpan/CurSpan"
import DropDownMenu from "../DropDownMenu"
import DropDownCaptionMenu from "../DropDownCaptionMenu/DropDownCaptionMenu"

const headerMenuItem = [
  { caption: "DAI", name: "dai" },
  { caption: "WETH", name: "weth" },
  { caption: "ZRX", name: "zrx" },
]
const menuItem = [
  { caption: "Create", link: "https://create.paradigm.market" },
  { caption: "Explore", link: "https://explore.paradigm.market" },
  { caption: "Search", link: "https://search.paradigm.market" },
  { caption: "Govern", link: "https://govern.paradigm.market" },
  { caption: "Account", link: "https://account.paradigm.market" },
]

const mapStateToProps = state => ({
  ethereum: state.ethereum,
  balance: state.balance,
  ticker: state.ticker,
  sellCurrency: state.sellCurrency,
})

const mapDispatchToProps = {
  ...ethereumActions,
  ...balanceActions,
}
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Header extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedItemIndex: 0,
      menuOpen: false,
    }
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (this.DropdownButton && !this.DropdownButton.contains(event.target)) {
      this.setState({ menuOpen: false })
    }
  }
  componentWillReceiveProps(nextProps) {
    // const { value } = nextProps.sellCurrency.toJS();
    // const v = value ? value : 0;
    // if (this.state.selectedItemIndex != v) {
    //   this.onCurrencyChange(v);
    // }
  }
  onCurrencyChange = index => {
    const { getBalance } = this.props
    getBalance(headerMenuItem[index].caption)
    this.setState({ selectedItemIndex: index })
  }
  onConnectToMetamask = () => {
    this.props.connectServer()
  }
  firstText = v => {
    if (v === undefined || v == 0 || v == null) {
      return "000000"
    } else {
      let s = formatMoney(v)
      s = s.replace(".", "")
      if (s.length > 6) return ""
      return "0".repeat(6 - s.length)
    }
  }
  secondText = v => {
    if (v === undefined || v == 0 || v == null) {
      return ""
    } else {
      return formatMoney(v)
    }
  }
  Balance = () => {
    const bal = this.props.balance.toJS()
    const ticker = this.props.ticker.toJS()
    const type = headerMenuItem[this.state.selectedItemIndex].caption
    return (
      <div className="div-val">
        <p className="first">{this.firstText(bal[type] ? bal[type] : 0)}</p>
        <p className="second">{this.secondText(bal[type] ? bal[type] : 0)}</p>
        <div className="div-exval">
          <span>USD</span>
          <p>
            {ticker[type] && bal[type]
              ? formatMoney(bal[type] * ticker[type])
              : "0"}
          </p>
        </div>
      </div>
    )
  }
  ConnectionState = () => {
    const { connecting, connected, coinbase } = this.props.ethereum.toJS()
    const { fetching } = this.props.balance.toJS()
    const { selectedItemIndex } = this.state
    if (connecting) {
      return (
        <div className="div-disconnected">
          <div className="circle orange" />
          <p className="nohover">Connecting MetaMask... </p>
        </div>
      )
    } else if (connected) {
      // if(networkId == 1) {
      return (
        <React.Fragment>
          <div className="div-connected">
            <div className="circle green" />
            <div className="address">{getConcentratedAddr(coinbase)}</div>
          </div>

          <div className="div-dropdown">
            <DropDownMenu
              headerMenuItem={headerMenuItem}
              selectedMenuIndex={selectedItemIndex}
              onChange={this.onCurrencyChange}
              enabled={true}
            />
          </div>
          {this.Balance()}
        </React.Fragment>
      )
      // } else {
      //   return (<div className="div-disconnected">
      //     <div className="circle red"/>
      //      <p className="nohover">Connect to main net</p>
      //   </div>)
      // }
    } else {
      // if (!error) {
      return (
        <div className="div-disconnected">
          <div className="circle orange" />
          <p onClick={this.onConnectToMetamask}>Click to Connect MetaMask</p>
        </div>
      )
      // } else if (networkId != 50) {
      //   return (<div className="div-disconnected">
      //     <div className="circle red" />
      //     <p className="nohover" onClick={this.onConnectToMetamask}>Connect to main net</p>
      //   </div>)
      // } else if (error === 'user denied site access') {
      //   return (<div className="div-disconnected">
      //     <div className="circle red" />
      //     <p className="nohover">Connect to main net</p>
      //   </div>)
      // } else if (error === "non-ethereum browser detected") {
      //   return (
      //     <div className="div-disconnected">
      //       <div className="circle orange" />
      //       <p onClick={this.onConnectToMetamask}>Click to Connect MetaMask</p>
      //     </div>
      //   )
      // }
    }
  }

  MobileConnectionState = () => {
    const { connecting, connected, coinbase } = this.props.init.toJS()
    const { fetching } = this.props.balance.toJS()
    const { selectedItemIndex } = this.state
    if (connecting) {
      return (
        <div className="div-disconnected">
          <p>Connecting MetaMask</p>
        </div>
      )
    } else if (connected) {
      // if(networkId == 1) {
      return (
        <React.Fragment>
          <div className="div-connected">
            <div className="circle green" />
            <div className="address">{getConcentratedAddr(coinbase)}</div>
          </div>
        </React.Fragment>
      )
      // } else {
      //   return (<div className="div-disconnected">
      //     <div className="circle orange"/>
      //       <p className="nohover">Connect to Ethereum Main Net</p>
      //   </div>)
      // }
    } else {
      // if (!error) {
      return (
        <div className="div-disconnected">
          <div className="circle orange" />
          <p onClick={this.onConnectToMetamask}>Click to Connect MetaMask</p>
        </div>
      )
      // } else if (networkId != 50) {
      //   return (<div className="div-disconnected">
      //     <div className="circle red" />
      //     <p onClick={this.onConnectToMetamask}>Connect to main net</p>
      //   </div>)

      // } else if (error === "user denied site access") {
      //   return (<div className="div-disconnected">
      //     <div className="circle red" />
      //     <p>Connect to main net</p>
      //   </div>)
      // } else if (error === "non-ethereum browser detected") {
      //   return (
      //     <div className="div-disconnected">
      //       <div className="circle orange" />
      //       <p onClick={this.onConnectToMetamask}>Click to Connect MetaMask</p>
      //     </div>
      //   )
      // }
    }
  }

  hamburgerMenu = () => {
    const { menuOpen } = this.state
    return (
      <div
        className="hamburger-menu"
        ref={element => {
          this.DropdownButton = element
        }}
      >
        <HamburgerMenu
          isOpen={menuOpen}
          menuClicked={this.handleMenuClick}
          width={18}
          height={12}
          strokeWidth={3}
          rotate={0}
          color="#4a4a4a"
          borderRadius={0}
          animationDuration={0.5}
        />
        {menuOpen && (
          <div
            className={menuOpen ? "dropdown-content show" : "dropdown-content"}
          >
            <ul>
              {menuItem.map(item => (
                <li key={item.caption}>
                  <a href={item.link}>{item.caption}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  handleMenuClick = () => {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  render() {
    return (
      <header className="globalHeader container-fluid">
        <div className="row">
          <div className="div-logo ">
            <img className="img-logo disabled" src={imgLogo} />
            <span className="span-title">Search</span>
            <DropDownCaptionMenu menuItem={menuItem} />
          </div>
          <div className="div-bal ">{this.ConnectionState()}</div>
          {this.hamburgerMenu()}
        </div>
      </header>
    )
  }
}

export default Header
