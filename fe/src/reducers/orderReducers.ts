import { AnyAction } from 'redux'
import { orderActions } from '../constants/orderConstants'
import { ICreateOrder, IOrderDetails, IShippingAddress } from '../type'

const userInitialState: {
  order: ICreateOrder | null
  orderItem: IOrderDetails | null
  orderedProds: any // TEMP
  shippingAddress: IShippingAddress | {}
} = {
  order: null,
  orderItem: null,
  orderedProds: [],
  shippingAddress: {},
}

export const orderCreateReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_CREATE_REQUEST:
      return { loading: true }
    case orderActions.ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload }
    case orderActions.ORDER_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload }
    default:
      return state
  }
}

export const orderedProdsCreateReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDERED_PRODS_CREATE_REQUEST:
      return { loading: true }
    case orderActions.ORDERED_PRODS_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload }
    case orderActions.ORDERED_PRODS_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload }
    default:
      return state
  }
}

export const orderDetailsReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case orderActions.ORDER_DETAILS_SUCCESS:
      return { loading: false, orderItem: action.payload }
    case orderActions.ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const orderedProdsDetailsReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case orderActions.ORDERED_PRODS_DETAILS_REQUEST:
      return { ...state, loading: true }
    case orderActions.ORDERED_PRODS_DETAILS_SUCCESS:
      return { loading: false, orderedProds: action.payload }
    case orderActions.ORDERED_PRODS_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
