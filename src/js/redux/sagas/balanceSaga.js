import { select, put, fork, takeLatest, call } from 'redux-saga/effects';
import { constants as balanceConstants, actions as balanceActions } from '../modules/balance';
import { getCommonTokenAddress } from '../../common/services/helpers';

export function* getBalance(action) {
  const state = yield select();
  const { type, address } = action.payload;
  const { contractWrappers } = state.zrx.toJS();  
  const { coinbase, web3 } = state.ethereum.toJS();

  let tokenAddress;
  if( type === 'WETH' || type === 'ZRX' || type ==='DAI' ) {
    const networkId = yield web3.eth.net.getId();
    tokenAddress = getCommonTokenAddress(networkId, type);
  } else {
    tokenAddress = address;
  }  
  try {
    const valueWei = yield contractWrappers.erc20Token.getBalanceAsync(
      tokenAddress,
      coinbase,
    ); 
    const value = web3.utils.fromWei(valueWei.toString());
    yield put(balanceActions.updateBalance({[type]:value}));

  } catch(error) {
    console.log(error);
  }
}

function* watchGetBalance() {
  yield takeLatest(balanceConstants.GET_BALANCE, getBalance);
}

export const balanceSaga = [
  fork(watchGetBalance),
];
