import { AnyAction } from 'redux'
import { productActions } from '../constants/productConstants'
import { RootState } from '../store'

interface IProducts {
  [products: string]: any[]
}

const initialState: IProducts = {
  products: [],
}

export const productListReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case productActions.PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] }
    case productActions.PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload }
    case productActions.PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
