import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import "./SearchView.scss"
import Switch from "react-switch"
import { connect } from "react-redux"
import { Spinner } from "react-bootstrap"

import { orderType, ExchangeMenuItem } from "../../common/services/staticText"
import { isValidAddress } from "../../common/services/helpers"
import SpanWithTooltip from "../../common/components/SpanWithTooltip"
import DropDownMenu from "../../common/components/DropDownMenu"
import SearchTable from "../../common/components/SearchTable/SearchTable"

import imgSwitch from "../../../assets/images/switch.png"
import imgWarnning from "../../../assets/images/warning.svg"

import { actions as allowanceActions } from "../../redux/modules/allowance"
import { actions as searchActions } from "../../redux/modules/search"
import { actions as orderActions } from "../../redux/modules/order"
import ReactGA from "react-ga"

const mapStateToProps = state => ({
  allowance: state.allowance,
  ethereum: state.ethereum,
  search: state.search,
  order: state.order,
})
const mapDispatchToProps = {
  ...allowanceActions,
  ...searchActions,
  ...orderActions,
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class SearchView extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      selectedBuyMenuIndex: 2,
      selectedSellMenuIndex: 0,
      addressBuyCustom: "",
      addressSellCustom: "",

      selectedBidAsk: false,
    }
  }

  //---------------------------Functions----------------------------
  checkAllowance = (index, isBuy) => {
    const { getAllowance } = this.props
    const { addressBuyCustom, addressSellCustom } = this.state

    if (index !== 3) {
      getAllowance(ExchangeMenuItem[index].caption)
    } else {
      if (isBuy) {
        if (isValidAddress(addressBuyCustom)) {
          getAllowance("customBuy", addressBuyCustom)
        }
      } else {
        if (isValidAddress(addressSellCustom)) {
          getAllowance("customSell", addressSellCustom)
        }
      }
    }
  }
  setAllowance = isBuy => {
    const {
      addressBuyCustom,
      addressSellCustom,
      selectedBuyMenuIndex,
      selectedSellMenuIndex,
    } = this.state

    var type = "",
      address = ""

    if (isBuy) {
      if (selectedBuyMenuIndex !== 3) {
        type = ExchangeMenuItem[selectedBuyMenuIndex].caption
        address = ""
      } else {
        type = "customBuy"
        address = addressBuyCustom
      }
    } else {
      if (selectedSellMenuIndex !== 3) {
        type = ExchangeMenuItem[selectedSellMenuIndex].caption
        address = ""
      } else {
        type = "customSell"
        address = addressSellCustom
      }
    }
    this.props.setAllowance(type, address)
  }

  updateSearch = () => {
    const {
      selectedBuyMenuIndex,
      selectedSellMenuIndex,
      addressSellCustom,
      addressBuyCustom,
      selectedBidAsk,
    } = this.state

    const baseAddress =
      selectedBuyMenuIndex !== 3
        ? ExchangeMenuItem[selectedBuyMenuIndex].caption
        : isValidAddress(addressBuyCustom)
        ? addressBuyCustom
        : null

    const quoteAddress =
      selectedSellMenuIndex !== 3
        ? ExchangeMenuItem[selectedSellMenuIndex].caption
        : isValidAddress(addressSellCustom)
        ? addressSellCustom
        : null

    const side = selectedBidAsk ? "bid" : "ask"
    if (baseAddress && quoteAddress) {
      this.props.getSearch(baseAddress, quoteAddress, side)
    }
  }

  isAllowanced = isBuy => {
    const allowance = this.props.allowance.toJS()
    const { customBuy, customSell } = this.props.allowance.toJS()
    const { selectedBuyMenuIndex, selectedSellMenuIndex } = this.state

    return isBuy
      ? selectedBuyMenuIndex !== 3
        ? allowance[ExchangeMenuItem[selectedBuyMenuIndex].caption] !==
          undefined
          ? allowance[ExchangeMenuItem[selectedBuyMenuIndex].caption] != 0
            ? true
            : false
          : false
        : customBuy !== undefined
        ? customBuy != 0
          ? true
          : false
        : false
      : selectedSellMenuIndex !== 3
      ? allowance[ExchangeMenuItem[selectedSellMenuIndex].caption] !== undefined
        ? allowance[ExchangeMenuItem[selectedSellMenuIndex].caption] != 0
          ? true
          : false
        : false
      : customSell !== undefined
      ? customSell != 0
        ? true
        : false
      : false
  }

  getOrder = id => {
    this.props.getOrder(id)
  }

  fillOrder = item => {
    this.props.executeFill(item.orderId, item)
  }
  //-----------------------------EVENTS-----------------------------
  onSwitchBuySell = () => {
    const {
      selectedBuyMenuIndex,
      selectedSellMenuIndex,
      addressSellCustom,
      addressBuyCustom,
    } = this.state

    this.setState(
      {
        selectedBuyMenuIndex: selectedSellMenuIndex,
        selectedSellMenuIndex: selectedBuyMenuIndex,
        addressBuyCustom: addressSellCustom,
        addressSellCustom: addressBuyCustom,
      },
      this.updateSearch
    )
  }

  onBuyCurrIndexChange = index => {
    this.checkAllowance(index, true)
    if (index === 3 || index !== this.state.selectedSellMenuIndex) {
      this.setState(
        {
          selectedBuyMenuIndex: index,
        },
        this.updateSearch
      )
    } else {
      this.setState(
        {
          selectedBuyMenuIndex: index,
          selectedSellMenuIndex: this.state.selectedBuyMenuIndex,
        },
        this.updateSearch
      )
    }
  }

  onSellCurrIndexChange = index => {
    this.checkAllowance(index, false)
    if (index === 3 || index !== this.state.selectedBuyMenuIndex) {
      this.setState(
        {
          selectedSellMenuIndex: index,
        },
        this.updateSearch
      )
    } else {
      this.setState(
        {
          selectedBuyMenuIndex: this.state.selectedSellMenuIndex,
          selectedSellMenuIndex: index,
        },
        this.updateSearch
      )
    }
  }

  onChangeBidAsk = checked => {
    this.setState(
      {
        selectedBidAsk: checked,
      },
      this.updateSearch
    )
    this.updateSearch()
  }

  onBuyCustomAddressChange = event => {
    this.setState(
      {
        addressBuyCustom: String(event.target.value).toLowerCase(),
      },
      this.updateSearch
    )
  }

  onSellCustomAddressChange = event => {
    this.setState(
      {
        addressSellCustom: String(event.target.value).toLowerCase(),
      },
      this.updateSearch
    )
  }
  //----------------------Component Functions-----------------------
  OrderSource = () => {
    return (
      <div className="div-order-source div-col">
        <p className="item-title">Order source:</p>
        <div className="div-orders">
          {orderType.map((item, i) => {
            return <SpanWithTooltip key={i} item={item} id={i} />
          })}
        </div>
      </div>
    )
  }

  TokenPair = () => {
    const { selectedBuyMenuIndex, selectedSellMenuIndex } = this.state
    return (
      <div className="div-token div-col">
        <p className="item-title">Token pair:</p>
        <div className="div-tokens">
          <div className="div-token-input">
            <DropDownMenu
              headerMenuItem={ExchangeMenuItem}
              selectedMenuIndex={selectedBuyMenuIndex}
              onChange={this.onBuyCurrIndexChange}
              enabled={true}
              // enabled = { networkId && (networkId ==1) }
            />

            {selectedBuyMenuIndex === 3 && (
              <input
                className={`input-buy-custom ${
                  this.state.addressBuyCustom.length > 0 ? "valueEnabled" : ""
                }`}
                onChange={this.onBuyCustomAddressChange}
                value={this.state.addressBuyCustom}
                placeholder="Enter token …"
              />
            )}
          </div>

          <p>/</p>

          <div className="div-token-input">
            <DropDownMenu
              headerMenuItem={ExchangeMenuItem}
              selectedMenuIndex={selectedSellMenuIndex}
              onChange={this.onSellCurrIndexChange}
              enabled={true}
              // enabled = { networkId && (networkId ==1) }
            />

            {selectedSellMenuIndex === 3 && (
              <input
                className={`input-sell-custom ${
                  this.state.addressSellCustom.length > 0 ? " valueEnabled" : ""
                }`}
                onChange={this.onSellCustomAddressChange}
                value={this.state.addressSellCustom}
                placeholder="Enter token …"
              />
            )}
          </div>
          <img
            className="img-switch"
            src={imgSwitch}
            onClick={this.onSwitchBuySell}
          />
        </div>
      </div>
    )
  }

  BidAsk = () => {
    const { selectedBidAsk } = this.state
    return (
      <div className="div-type div-col">
        <p className="item-title"></p>
        <div className="div-types">
          <span className="item-title">Bid</span>
          <Switch
            className="switch-type"
            checked={selectedBidAsk}
            onChange={this.onChangeBidAsk}
            onColor="#ececec"
            offColor="#ececec"
            onHandleColor="#0bd080"
            offHandleColor="#0bd080"
            checkedIcon={false}
            uncheckedIcon={false}
            height={15}
            width={35}
          />
          <span className="item-title">Ask</span>
        </div>
      </div>
    )
  }

  AllowanceButton = () => {
    const { setting, type, fetching } = this.props.allowance.toJS()
    const {
      addressBuyCustom,
      addressSellCustom,
      selectedBuyMenuIndex,
      selectedSellMenuIndex,
    } = this.state
    const { connected } = this.props.ethereum.toJS()

    if (!connected || !type || fetching) {
      return null
    }

    if (setting) {
      return (
        <div className="div-button ">
          <span className="span-warnning">
            <img src={imgWarnning} />
            Set your allowances here to be able to take orders.
          </span>
          <button className={`btn-allowance ${type.slice(0, 6).toLowerCase()}`}>
            <Spinner
              className="loading"
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
            />
          </button>
        </div>
      )
    } else {
      if (!this.isAllowanced(true)) {
        const buyDisabled =
          selectedBuyMenuIndex !== 3 ? false : !isValidAddress(addressBuyCustom)
        return (
          <div className="div-button ">
            <span className="span-warnning">
              <img src={imgWarnning} />
              Set your allowances here to be able to take orders.
            </span>
            <button
              className={`btn-allowance ${
                ExchangeMenuItem[selectedBuyMenuIndex].name
              } ${buyDisabled ? "disabled" : ""}`}
              disabled={buyDisabled}
              onClick={() => this.setAllowance(true)}
            >
              {`Set ${ExchangeMenuItem[selectedBuyMenuIndex].caption} Allowance`}
            </button>
          </div>
        )
      }

      if (!this.isAllowanced(false)) {
        const sellDisabled =
          selectedSellMenuIndex !== 3
            ? false
            : !isValidAddress(addressSellCustom)
        return (
          <div className="div-button ">
            <span className="span-warnning">
              <img src={imgWarnning} />
              Set your allowances here to be able to take orders.
            </span>
            <button
              className={`btn-allowance ${
                ExchangeMenuItem[selectedSellMenuIndex].name
              } ${sellDisabled ? "disabled" : ""}`}
              disabled={sellDisabled}
              onClick={() => this.setAllowance(false)}
            >
              {`Set ${ExchangeMenuItem[selectedSellMenuIndex].caption} Allowance`}
            </button>
          </div>
        )
      }
      return null
    }
  }
  componentDidMount() {
    ReactGA.pageview(window.location.pathname)
  }
  render() {
    const { searchResult } = this.props.search.toJS()
    const { orderList } = this.props.order.toJS()
    console.log(orderList)
    return (
      <div className="SearchViewWrapper container">
        <h1>Search the Kosu Network</h1>

        <h2>Filter by</h2>
        <div className="row">
          {this.OrderSource()}
          {this.TokenPair()}
          {this.BidAsk()}
          {this.AllowanceButton()}
        </div>

        <h2>Results</h2>
        <SearchTable
          searchData={searchResult}
          orderList={orderList}
          isAllowanced={this.isAllowanced(true) && this.isAllowanced(false)}
          getOrder={this.getOrder}
          fillOrder={this.fillOrder}
        />
      </div>
    )
  }
}

export default SearchView
