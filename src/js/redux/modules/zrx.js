import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const INIT_ZEROEX = 'INIT_ZEROEX';
const UPDATE_ZEROEX = 'UPDATE_ZEROEX';

export const constants = {
  INIT_ZEROEX,
  UPDATE_ZEROEX,
};

export const initZeroEx = createAction(INIT_ZEROEX, () => ({ fetching: true }));
export const updateZeroEx = createAction(UPDATE_ZEROEX, (res) => ({...res, fetching: false }));

export const actions = {
  initZeroEx,
  updateZeroEx,
};

export const reducers = {
  [ INIT_ZEROEX ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  },
  [ UPDATE_ZEROEX ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  }, 
};

export const initialState = () => Map({
});

export default handleActions(reducers, initialState());
