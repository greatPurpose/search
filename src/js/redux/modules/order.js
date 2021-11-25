import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const GET_ORDER = 'GET_ORDER';
const UPDATE_ORDER = 'UPDATE_ORDER';

const CHECK_FILL = 'CHECK_FILL';
const UPDATE_CHECK = 'UPDATE_CHECK';
const VERIFY_FILL = 'VERIFY_FILL';
const UPDATE_VERIFY = 'UPDATE_VERIFY';

const EXECUTE_FILL = 'EXECUTE_FILL';
const UPDATE_EXECUTE = 'UPDATE_EXECUTE';

export const Status = { NONE: 0, DOING: 1, DONE: 2}
export const constants = {
  GET_ORDER,
  UPDATE_ORDER,
  // CHECK_FILL,
  // UPDATE_CHECK,
  // VERIFY_FILL,
  // UPDATE_VERIFY,
  EXECUTE_FILL,
  UPDATE_EXECUTE,
};

export const getOrder = createAction(GET_ORDER, (id) => ({id, fetching: true }));
export const updateOrder = createAction(UPDATE_ORDER, (res) => ({...res, fetching: false }));

// export const checkFill = createAction(CHECK_FILL, (order) => ({order, fetching: true }));
// export const updateCheck = createAction(UPDATE_CHECK, (res) => ({...res, fetching: false }));
// export const verifyFill = createAction(VERIFY_FILL, (order) => ({order, fetching: true }));
// export const updateVerify = createAction(UPDATE_VERIFY, (res) => ({...res, fetching: false }));

export const executeFill = createAction(EXECUTE_FILL, (id, order) => ({id, order, fetching: true }));
export const updateExecute = createAction(UPDATE_EXECUTE, (res) => ({...res, fetching: false }));

export const actions = {
  getOrder,
  updateOrder,
  // checkFill,
  // updateCheck,
  // verifyFill,
  // updateVerify,
  executeFill,
  updateExecute,
};

export const reducers = {
  [ GET_ORDER ]: (state, { payload }) => {
    let orderList;
    if (state.toJS().orderList) {
      orderList = [...state.toJS().orderList];
    } else {
      orderList = [];
    }
    const newOrder = {
      id: payload.id,
      validation: false,
      validationStatus: Status.DOING
    }
    orderList.push(newOrder);
    return state.merge({
      orderList,
    })
  },
  [ UPDATE_ORDER ]: (state, { payload }) => {
    let orderList;
    if (state.toJS().orderList) {
      orderList = [...state.toJS().orderList];
    } else {
      orderList = [];
    }
    const index = orderList.map(item => item.id).indexOf(payload.id);
    orderList[index].order = payload.order;
    orderList[index].validation = payload.validation;
    orderList[index].validationStatus = Status.DONE;

    return state.merge({
      orderList,
    })
  }, 
  [ EXECUTE_FILL ]: (state, { payload }) => {
    let orderList;
    if (state.toJS().orderList) {
      orderList = [...state.toJS().orderList];
    } else {
      orderList = [];
    }
    console.log(orderList);
    console.log(payload);
    const index = orderList.map(item => item.id).indexOf(payload.id);
    console.log(index);
    orderList[index].executionStatus = Status.DOING;

    return state.merge({
      orderList,
    })
  },
  [ UPDATE_EXECUTE ]: (state, { payload }) => {
    let orderList;
    if (state.toJS().orderList) {
      orderList = [...state.toJS().orderList];
    } else {
      orderList = [];
    }
    const index = orderList.map(item => item.id).indexOf(payload.id);
    orderList[index].executionStatus = Status.DONE;
    orderList[index].execution = payload.execution;
    orderList[index].txId = payload.txId;
    return state.merge({
      orderList
    })
  },   
};

export const initialState = () => Map({
});

export default handleActions(reducers, initialState());
