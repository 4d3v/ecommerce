import { AnyAction } from 'redux'
import { productActions } from '../constants/productConstants'
import { IProduct } from '../type'

interface IProducts {
  products: IProduct[]
}

const products: IProduct[] = []

const initialState: IProducts = {
  products,
}

export const productListReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case productActions.PRODUCT_LIST_REQUEST:
      return { loading: true, products: initialState.products }
    case productActions.PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload }
    case productActions.PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

interface IProdTemp {
  product: IProduct | {}
}
const initState: IProdTemp = {
  product: {},
}

export const productDetailsReducer = (state = initState, action: AnyAction) => {
  switch (action.type) {
    case productActions.PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state }
    case productActions.PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload }
    case productActions.PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
