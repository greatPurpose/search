import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const GET_TICKER = 'GET_TICKER';
const UPDATE_TICKER = 'UPDATE_TICKER';

export const constants = {
  GET_TICKER,
  UPDATE_TICKER,
};

export const getTicker = createAction(GET_TICKER, () => ({ fetching: true }));
export const updateTicker = createAction(UPDATE_TICKER, (res) => ({...res, fetching: false }));

export const actions = {
  getTicker,
  updateTicker,
};

export const reducers = {
  [ GET_TICKER ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  },
  [ UPDATE_TICKER ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  }, 
};

export const initialState = () => Map({
});

export default handleActions(reducers, initialState());
