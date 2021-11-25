import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const GET_BALANCE = 'GET_BALANCE';
const UPDATE_BALANCE = 'UPDATE_BALANCE';

export const constants = {
  GET_BALANCE,
  UPDATE_BALANCE,
};

export const getBalance = createAction(GET_BALANCE, (type, address) => ({ type, address, fetching: true }));
export const updateBalance = createAction(UPDATE_BALANCE, (res) => ({...res, fetching: false }));

export const actions = {
  getBalance,
  updateBalance,
};

export const reducers = {
  [ GET_BALANCE ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  },
  [ UPDATE_BALANCE ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  }, 
};

export const initialState = () => Map({
});

export default handleActions(reducers, initialState());
