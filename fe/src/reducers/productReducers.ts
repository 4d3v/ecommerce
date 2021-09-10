import { AnyAction } from 'redux'
import { productActions } from '../constants/productConstants'
import { IProduct } from '../type'

export const productListReducer = (
  state: { products: IProduct[] } = { products: [] },
  action: AnyAction
) => {
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

export const productDetailsReducer = (
  state: { product: IProduct } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state }
    case productActions.PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload }
    case productActions.PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case productActions.PRODUCT_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

export const adminProductCreateReducer = (
  state: { ok: boolean; message: string } | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.PRODUCT_CREATE_REQUEST:
      return { loading: true }
    case productActions.PRODUCT_CREATE_SUCCESS:
      return { loading: false, result: action.payload }
    case productActions.PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case productActions.PRODUCT_CREATE_RESET:
      return null
    default:
      return state
  }
}

export const adminProductUpdateReducer = (
  state: { ok: boolean; message: string } | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.PRODUCT_UPDATE_REQUEST:
      return { loading: true }
    case productActions.PRODUCT_UPDATE_SUCCESS:
      return { loading: false, result: action.payload }
    case productActions.PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case productActions.PRODUCT_UPDATE_RESET:
      return null
    default:
      return state
  }
}

export const adminProductDeleteReducer = (
  state: { ok: boolean; message: string } | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.PRODUCT_DELETE_REQUEST:
      return { loading: true }
    case productActions.PRODUCT_DELETE_SUCCESS:
      return { loading: false, result: action.payload }
    case productActions.PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
