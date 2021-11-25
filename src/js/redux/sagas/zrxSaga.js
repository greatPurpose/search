import { select, put, fork, takeEvery, delay, takeLatest, call } from 'redux-saga/effects';
import { constants as zrxConstants, actions as zrxActions } from '../modules/zrx';

import { Web3Wrapper } from "@0x/web3-wrapper";
import { ContractWrappers } from "0x.js";
import { actions as searchActions } from '../modules/search';
import { actions as balanceActions } from '../modules/balance';
import { actions as allowanceActions } from '../modules/allowance';


export function* initZeroEx() {
  const state = yield select();
  const { web3 } = state.ethereum.toJS();
  try {
    const networkId = yield web3.eth.net.getId();
    const web3Wrapper = new Web3Wrapper(web3.currentProvider);
    const contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId });
    const zrx = {
      web3Wrapper,
      contractWrappers
    }
    yield put(zrxActions.updateZeroEx(zrx));
    yield put(balanceActions.getBalance('DAI'));
    yield put(allowanceActions.getAllowance('WETH'));
    yield put(allowanceActions.getAllowance('DAI'));
    yield put(searchActions.getSearch('WETH','DAI','bid'));
  }
  catch(error) {
    console.log(error);
  }
}

function* watchInitZeroEx() {
  yield takeLatest(zrxConstants.INIT_ZEROEX, initZeroEx);
}

export const zrxSaga = [
  fork(watchInitZeroEx),
];
