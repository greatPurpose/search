import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const SET_SELL_CURRENCY = 'SET_SELL_CURRENCY';

export const constants = {
  SET_SELL_CURRENCY,
};

export const setSellCurrnecy = createAction(SET_SELL_CURRENCY, (value) => ({value}));

export const actions = {
  setSellCurrnecy,
};

export const reducers = {
  [SET_SELL_CURRENCY]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  },
};

export const initialState = () => Map({
});

export default handleActions(reducers, initialState());
