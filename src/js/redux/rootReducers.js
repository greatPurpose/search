import { combineReducers } from 'redux'
import example from './modules/example'
import ethereum from './modules/ethereum'
import balance from './modules/balance'
import allowance from './modules/allowance'
import ticker from './modules/ticker'
import zrx from './modules/zrx'
import search from './modules/search'
import order from './modules/order'
import sellCurrency from './modules/sellCurrency'

export default combineReducers({
  example,
  ethereum,
  balance,
  allowance,
  search,
  ticker,
  zrx,
  order,
  sellCurrency
})
