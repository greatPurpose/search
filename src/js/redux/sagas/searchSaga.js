import { select, put, fork, takeLatest, call } from 'redux-saga/effects';
import { constants as searchConstants, actions as searchActions } from '../modules/search';
import axios from 'axios';
import { getCommonTokenAddress } from '../../common/services/helpers';

// const api_url = 'https://cors.io/?https://api.cryptonator.com/api/ticker/';
// const api_url = 'https://search.zaidan.io/api/v1/search';
const api_url = 'http://localhost:3000/search';
// const api_url = process.env.api_url;


export function* getSearch(action) {
  const state = yield select();
  const { baseAsset, quoteAsset, side } = action.payload;
  const { web3 } = state.ethereum.toJS();
  const networkId = yield web3.eth.net.getId();

  const baseTokenAddress = (baseAsset === 'WETH' || baseAsset === 'ZRX' || baseAsset ==='DAI')
    ? getCommonTokenAddress(networkId, baseAsset)
    : baseAsset;
    
  const quoteTokenAddress = (quoteAsset === 'WETH' || quoteAsset === 'ZRX' || quoteAsset ==='DAI')
    ? getCommonTokenAddress(networkId, quoteAsset)
    : quoteAsset;

  try {
    const data = yield call(axios.get, api_url, 
      {
        params: {
          baseAsset: baseTokenAddress,
          quoteAsset: quoteTokenAddress,
          side: side,
        }
      }
    );
  
    const searchResult = {
      searchResult: {
        ...data.data,
        baseAssetName: baseAsset,
        quoteAssetName: quoteAsset
      }
    }
    
    yield put(searchActions.updateSearch(searchResult));
  }
  catch(error) {
    console.log(error);
  }
}

function* watchGetSearch() {
  yield takeLatest(searchConstants.GET_SEARCH, getSearch);
}

export const searchSaga = [
  fork(watchGetSearch),
];
