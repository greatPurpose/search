import { all } from 'redux-saga/effects';
import { exampleSaga } from './exampleSaga';
import { ethereumSaga } from './ethereumSaga';
import { balanceSaga } from './balanceSaga';
import { allowanceSaga } from './allowanceSaga';
import { tickerSaga } from './tickerSaga';
import { zrxSaga } from './zrxSaga';
import { searchSaga } from './searchSaga';
import { orderSaga } from './orderSaga';


export default function* sagas() {
  yield all([...exampleSaga]);
  yield all([...ethereumSaga]);
  yield all([...balanceSaga]);
  yield all([...allowanceSaga]);
  yield all([...zrxSaga]);
  yield all([...tickerSaga]);
  yield all([...searchSaga]);
  yield all([...orderSaga]);
}
