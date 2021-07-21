import { AnyAction } from 'redux'
import { orderActions } from '../constants/orderConstants'
import { IOrder } from '../type'

const userInitialState: { order: IOrder | null } = {
  order: null,
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
