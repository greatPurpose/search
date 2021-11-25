import { select, put, fork, takeEvery, call } from 'redux-saga/effects';
import { constants as orderConstants, actions as orderActions } from '../modules/order';
import { BigNumber } from "0x.js";
import axios from 'axios';

// const api_url = 'https://search.zaidan.io/api/v1/order';
const api_url = 'http://localhost:3000/order';
// const api_url = process.env.api_url;

export const getGasPrice = async (web3) => {
  // get a reasonable gas price, use 10 if API fails
  const rawRes = await fetch("https://ethgasstation.info/json/ethgasAPI.json");
  const parsed = await rawRes.json();
  const gasPriceGwei = parsed["safeLow"] ? parsed["safeLow"].toString() : "10";
  return new BigNumber(web3.utils.toWei(gasPriceGwei, "Gwei"));
} 

export function* getOrder(action) {
  const { id } = action.payload;
  const state = yield select();
  const { contractWrappers } = state.zrx.toJS();
  const { coinbase } = state.ethereum.toJS();
  try {
    //get Order
    const ret = yield call(axios.get, api_url, {params: {
      id: id
    }});
    const order = ret.data.order;

    // Check Order status
    const info = yield contractWrappers.exchange.getOrderInfoAsync(order);
    if (info.orderStatus !== 2) {
      const result = {
        ...ret.data,
        validation: false,
      }  
      yield put(orderActions.updateOrder(result));
      return;
    }
    // verify fill
    const takerAmount = new BigNumber(order.takerAssetAmount);
    yield contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(
      order,
      takerAmount,
      coinbase
    );

    const result = {
      ...ret.data,
      validation: true,
    }

    yield put(orderActions.updateOrder(result));
  }
  catch(error) {
    console.log(error);

    const result = {
      id: id,
      validation: false,
    }  
    yield put(orderActions.updateOrder(result));    
  }
}

export function* executeFill(action) {
  const { id, order } = action.payload;
  const state = yield select();
  const { contractWrappers } = state.zrx.toJS();
  const { web3, coinbase } = state.ethereum.toJS();
  let hash;
  const takerAmount = new BigNumber(order.takerAssetAmount);

  try {
    const gasPrice = yield getGasPrice(web3); 
    hash = yield contractWrappers.exchange.fillOrderAsync(
      order,
      takerAmount,
      coinbase,
      {
        gasPrice: gasPrice
      },
    );    

    const result = {
      id: id,
      execution: true,
      txId : hash,
    }
    
    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      const result = {
        id: id,
        execution: false,
        txId : hash,
      }
      yield put(orderActions.updateExecute(result));
      return;
    }
    yield web3Wrapper.awaitTransactionSuccessAsync( hash );

    yield put(orderActions.updateExecute(result));     
  }
  catch(err) {
    console.log(err);
    const result = {
      id: id,
      execution: false,
      txId : hash,
    }
    yield put(orderActions.updateExecute(result));     
  }
}

function* watchGetOrder() {
  yield takeEvery(orderConstants.GET_ORDER, getOrder);
}

function* watchExecuteFill() {
  yield takeEvery(orderConstants.EXECUTE_FILL, executeFill);
}
export const orderSaga = [
  fork(watchGetOrder),
  fork(watchExecuteFill)
];
