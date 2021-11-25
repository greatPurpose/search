import { select, put, fork, takeLatest,takeEvery, call } from 'redux-saga/effects';
import { constants as allowanceConstants, actions as allowanceActions } from '../modules/allowance';

import { getCommonTokenAddress } from '../../common/services/helpers';


export function* getAllowance(action) {

  const state = yield select();
  const { contractWrappers } = state.zrx.toJS();
  const { coinbase, web3 } = state.ethereum.toJS();
  const { type, address } = action.payload;
  let tokenAddress;
  if( type === 'WETH' || type === 'ZRX' || type ==='DAI' ) {
    const networkId = yield web3.eth.net.getId();
    tokenAddress = getCommonTokenAddress(networkId, type);
  } else {
    tokenAddress = address;
  }
  try {
    const allowance = yield contractWrappers.erc20Token.getProxyAllowanceAsync(
      tokenAddress,
      coinbase,
    );
    yield put(allowanceActions.updateAllowance({[type]: allowance}));
  } catch(error) {
    console.log(error);
    yield put(allowanceActions.updateAllowance({[type]: false}));
  }
}

export function* setAllowance(action) {

  const state = yield select();
  const { contractWrappers, web3Wrapper  } = state.zrx.toJS();
  const { coinbase, web3 } = state.ethereum.toJS();
  const { type, address } = action.payload;
  let tokenAddress;
  if( type === 'WETH' || type === 'ZRX' || type ==='DAI' ) {
    const networkId = yield web3.eth.net.getId();
    tokenAddress = getCommonTokenAddress( networkId, type );
  } else {
    tokenAddress = address;
  }

  try {
    const txId = yield contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      tokenAddress,
      coinbase,
    );
    if (!/^0x[a-fA-F0-9]{64}$/.test(txId)) {
      yield put(allowanceActions.updateAllowance({[type]: false}));
      return;
    }
    yield web3Wrapper.awaitTransactionSuccessAsync( txId );
    yield put(allowanceActions.updateAllowance({[type]: true}));
  } catch(error) {
    console.log(error);
    yield put(allowanceActions.updateAllowance({[type]: false}));
  }
}

function* watchGetAllowance() {
  yield takeEvery(allowanceConstants.GET_ALLOWANCE, getAllowance);
}

function* watchSetAllowance() {
  yield takeLatest(allowanceConstants.SET_ALLOWANCE, setAllowance);
}

export const allowanceSaga = [
  fork(watchGetAllowance),
  fork(watchSetAllowance),
];
