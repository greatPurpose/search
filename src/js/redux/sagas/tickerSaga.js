import { select, put, fork, takeLatest, call } from 'redux-saga/effects';
import { constants as tickerConstants, actions as tickerActions } from '../modules/ticker';
import axios from 'axios';
import { delay } from 'q';

// const api_url = 'https://cors.io/?https://api.cryptonator.com/api/ticker/';
const api_url = 'https://api.cryptonator.com/api/ticker/';

export function* getTicker() {
  while (true) {
    try {
      const weth = yield call(axios.get, api_url+'eth-usd');
      delay(2000);
      const dai = yield call(axios.get, api_url+'dai-usd');
      delay(2000);
      const zrx = yield call(axios.get, api_url+'zrx-usd');
      delay(2000);
      const result = {
        WETH: weth.data.ticker.price,
        DAI: dai.data.ticker.price,
        ZRX: zrx.data.ticker.price,
      }
      yield put(tickerActions.updateTicker(result));
    }
    catch(error) {
      console.log(error);
    }
    yield delay(600000)
  }
}

function* watchGetTicker() {
  yield takeLatest(tickerConstants.GET_TICKER, getTicker);
}

export const tickerSaga = [
  fork(watchGetTicker),
];
