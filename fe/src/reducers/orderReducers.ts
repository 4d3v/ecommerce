import { AnyAction } from 'redux'
import { orderActions } from '../constants/orderConstants'
import { IOrderDetails, IOrderedProd } from '../type'

export const orderCreateReducer = (
  state: {
    ok: boolean
    message: string
    data: { order_id: number }
  } | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_CREATE_REQUEST:
      return { loading: true }
    case orderActions.ORDER_CREATE_SUCCESS:
      return { loading: false, result: action.payload }
    case orderActions.ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case orderActions.ORDER_CREATE_RESET:
      return null
    default:
      return state
  }
}

export const orderedProdsCreateReducer = (
  state: { orderedProd: { ok: boolean; message: string } } | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDERED_PRODS_CREATE_REQUEST:
      return { loading: true }
    case orderActions.ORDERED_PRODS_CREATE_SUCCESS:
      return { loading: false, result: action.payload }
    case orderActions.ORDERED_PRODS_CREATE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const orderDetailsReducer = (
  state: { orderItem: IOrderDetails } | null = null,
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

export const orderedProdsListReducer = (
  state: { orderedProds: IOrderedProd[] } = { orderedProds: [] },
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

export const orderListUserReducer = (
  state: {
    result: { orders: IOrderDetails[]; data: {} }
  } = {
    result: { orders: [], data: {} },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_LIST_USER_REQUEST:
      return {
        loading: true,
        result: {
          orders: [...state.result.orders],
          data: {},
        },
      }

    case orderActions.ORDER_LIST_USER_SUCCESS:
      return { loading: false, result: action.payload }

    case orderActions.ORDER_LIST_USER_FAIL:
      return { loading: false, error: action.payload }

    case orderActions.ORDER_LIST_USER_RESET:
      return {}

    default:
      return state
  }
}

export const adminOrderListReducer = (
  state: {
    result: { orders: IOrderDetails[]; data: { admin_total_orders: number } }
  } = {
    result: { orders: [], data: { admin_total_orders: 0 } },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_LIST_REQUEST:
      return {
        loading: true,
        result: {
          orders: [...state.result.orders],
          data: { total_prods: state.result.data.admin_total_orders },
        },
      }

    case orderActions.ORDER_LIST_SUCCESS:
      return { loading: false, result: action.payload }

    case orderActions.ORDER_LIST_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

export const adminOrderDeliverReducer = (
  state: { ok: boolean; msg: string } | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_DELIVER_REQUEST:
      return { loading: true }
    case orderActions.ORDER_DELIVER_SUCCESS:
      return { loading: false, result: action.payload }
    case orderActions.ORDER_DELIVER_FAIL:
      return { loading: false, error: action.payload }
    case orderActions.ORDER_DELIVER_RESET:
      return {}
    default:
      return state
  }
}
