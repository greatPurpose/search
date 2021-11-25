import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const GET_SEARCH = 'GET_SEARCH';
const UPDATE_SEARCH = 'UPDATE_SEARCH';

export const constants = {
  GET_SEARCH,
  UPDATE_SEARCH,
};

export const getSearch = createAction(GET_SEARCH, (baseAsset, quoteAsset, side) => ({baseAsset, quoteAsset, side, fetching: true }));
export const updateSearch = createAction(UPDATE_SEARCH, (res) => ({...res, fetching: false }));

export const actions = {
  getSearch,
  updateSearch,
};

export const reducers = {
  [ GET_SEARCH ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  },
  [ UPDATE_SEARCH ]: (state, { payload }) => {
    return state.merge({
      ...payload,
    })
  }, 
};

export const initialState = () => Map({
});

export default handleActions(reducers, initialState());
