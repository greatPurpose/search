import {put, fork, takeLatest, call, take, select} from 'redux-saga/effects';
import Web3 from 'web3';
import { constants as web3Constants, actions as web3Actions } from '../modules/ethereum';
import { actions as zrxActions } from '../modules/zrx';
import { eventChannel } from 'redux-saga';

function* createAccountsChangedEventChannel() {
  return eventChannel((emit) => {
    window.ethereum.on('accountsChanged', () => {
      emit('accountsChanged');
    });

    return () => {};
  });

}
function* watchAccountsChanged() {
  const accountChangedChannel = yield createAccountsChangedEventChannel();
  while (true) {
    yield take(accountChangedChannel);
    yield put(web3Actions.updateCoinbase())
  }
}

export function* connectServer() {
  let web3;
  let coinbase;
  if (typeof window.ethereum !== 'undefined'
    || (typeof window.web3 !== 'undefined')) {
    if (typeof window.ethereum !== 'undefined') {
      const enabled = yield window.ethereum.enable().then(() => true).catch(() => false);
      if (!enabled) {
        yield put(web3Actions.connectFailure());
        return;
      }
    }

    // Web3 browser user detected. You can now use the provider.
    const provider = window.ethereum || window.web3.currentProvider;

    yield fork(watchAccountsChanged);

    web3 = new Web3(provider);
    coinbase = yield call(web3.eth.getCoinbase);
  } else {
    web3 = new Web3('https://ropsten.infura.io'); // TODO env variable for network
    coinbase = 'readonly';
  }

  const connection = {
    web3,
    coinbase,
    connected: true,
  };

  yield put(web3Actions.getConnection(connection));
  yield put(zrxActions.initZeroEx());
  
}

function* updateCoinbase() {
  const state = yield select();
  const ethereum = state.ethereum.toJS();
  const coinbase = yield call(ethereum.web3.eth.getCoinbase);

  yield put(web3Actions.coinbaseUpdated(coinbase));
}

function* watchConnecting() {
  yield takeLatest(web3Constants.WEB3_CONNECT, connectServer);
}

function* watchUpdateCoinbase() {
  yield takeLatest(web3Constants.ETHEREUM_UPDATE_COINBASE, updateCoinbase);
}

export const ethereumSaga = [
  fork(watchConnecting),
  fork(watchUpdateCoinbase),
];
