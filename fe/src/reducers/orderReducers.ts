import { AnyAction } from 'redux'
import { orderActions } from '../constants/orderConstants'
import { ICreateOrder, IOrderDetails, IOrderedProd } from '../type'

const orderCreateInitSt: { order: ICreateOrder | null } = { order: null }
export const orderCreateReducer = (
  state = orderCreateInitSt,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_CREATE_REQUEST:
      return { loading: true }
    case orderActions.ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload }
    case orderActions.ORDER_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload }
    case orderActions.ORDER_CREATE_RESET:
      return null
    default:
      return state
  }
}

const orderedProdsCreateInitSt: { orderedProd: IOrderedProd | null } = {
  orderedProd: null,
}
export const orderedProdsCreateReducer = (
  state = orderedProdsCreateInitSt,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDERED_PRODS_CREATE_REQUEST:
      return { loading: true }
    case orderActions.ORDERED_PRODS_CREATE_SUCCESS:
      return { loading: false, success: true, orderedProd: action.payload }
    case orderActions.ORDERED_PRODS_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload }
    default:
      return state
  }
}

const orderDetailsInitSt: { orderItem: IOrderDetails | null } = {
  orderItem: null,
}
export const orderDetailsReducer = (
  state = orderDetailsInitSt,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case orderActions.ORDER_DETAILS_SUCCESS:
      return { loading: false, orderItem: action.payload }
    case orderActions.ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case orderActions.ORDER_DETAILS_RESET:
      return null
    default:
      return state
  }
}

const orderedProdsListInitSt: { orderedProds: IOrderedProd[] } = {
  orderedProds: [],
}
export const orderedProdsListReducer = (
  state = orderedProdsListInitSt,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDERED_PRODS_LIST_REQUEST:
      return { ...state, loading: true }
    case orderActions.ORDERED_PRODS_LIST_SUCCESS:
      return { loading: false, orderedProds: action.payload }
    case orderActions.ORDERED_PRODS_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const orderPayReducer = (state = {}, action: AnyAction) => {
  switch (action.type) {
    case orderActions.ORDER_PAY_REQUEST:
      return { loading: true }
    case orderActions.ORDER_PAY_SUCCESS:
      return { loading: false, success: true }
    case orderActions.ORDER_PAY_FAIL:
      return { loading: false, error: action.payload }
    case orderActions.ORDER_PAY_RESET:
      return {}
    default:
      return state
  }
}

const orderListInitSt: { orders: IOrderDetails[] } = {
  orders: [],
}
export const orderListUserReducer = (
  state = orderListInitSt,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_LIST_USER_REQUEST:
      return { loading: true }
    case orderActions.ORDER_LIST_USER_SUCCESS:
      return { loading: false, orders: action.payload }
    case orderActions.ORDER_LIST_USER_FAIL:
      return { loading: false, error: action.payload }
    case orderActions.ORDER_LIST_USER_RESET:
      return { orders: [] }
    default:
      return state
  }
}

export const adminOrderListReducer = (
  state = orderListInitSt,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_LIST_REQUEST:
      return { loading: true }
    case orderActions.ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload }
    case orderActions.ORDER_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
