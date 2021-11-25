import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const GET_ALLOWANCE = 'GET_ALLOWANCE';
const SET_ALLOWANCE = 'SET_ALLOWANCE';
const UPDATE_ALLOWANCE = 'UPDATE_ALLOWANCE';

export const constants = {
  GET_ALLOWANCE,
  SET_ALLOWANCE,
  UPDATE_ALLOWANCE,
};

export const getAllowance = createAction(GET_ALLOWANCE, (type, address) => ({ type, address, fetching: true }));
export const setAllowance = createAction(SET_ALLOWANCE, (type, address) => ({ type, address, setting: true }));
export const updateAllowance = createAction(UPDATE_ALLOWANCE, (res) => ({...res, fetching: false, setting: false }));

export const actions = {
  getAllowance,
  setAllowance,
  updateAllowance
};

export const reducers = {
  [ GET_ALLOWANCE ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  },
  [ SET_ALLOWANCE ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  },
  [ UPDATE_ALLOWANCE ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  }, 
};

export const initialState = () => Map({
});

export default handleActions(reducers, initialState());
