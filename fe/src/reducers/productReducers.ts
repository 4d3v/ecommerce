import { AnyAction } from 'redux'
import { productActions } from '../constants/productConstants'
import { IProduct, IReview } from '../type'

export const productListReducer = (
  state: { result: { products: IProduct[]; data: { total_prods: number } } } = {
    result: { products: [], data: { total_prods: 0 } },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.PRODUCT_LIST_REQUEST:
      return {
        loading: true,
        result: {
          products: [...state.result.products],
          data: { total_prods: state.result.data.total_prods },
        },
      }

    case productActions.PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        result: {
          products: [...state.result.products, ...action.payload.products],
          data: action.payload.data,
        },
        success: true,
      }

    case productActions.PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload }

    case productActions.PRODUCT_LIST_RESET:
      return { result: { products: [], data: { total_prods: 0 } } }

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

export const productReviewListReducer = (
  state: { reviews: IReview[] } = { reviews: [] },
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.PRODUCT_REVIEW_LIST_REQUEST:
      return { loading: true, reviews: [] }
    case productActions.PRODUCT_REVIEW_LIST_SUCCESS:
      return { loading: false, reviews: action.payload }
    case productActions.PRODUCT_REVIEW_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productReviewCreateReducer = (
  state: { ok: boolean; message: string } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true }
    case productActions.PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, result: action.payload }
    case productActions.PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload }
    case productActions.PRODUCT_CREATE_REVIEW_RESET:
      return {}
    default:
      return state
  }
}

export const productUpdateCountInStockReducer = (
  state: { ok: boolean; message: string } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.PRODUCT_UPDATE_COUNT_IN_STOCK_REQUEST:
      return { loading: true }
    case productActions.PRODUCT_UPDATE_COUNT_IN_STOCK_SUCCESS:
      return { loading: false, result: action.payload }
    case productActions.PRODUCT_UPDATE_COUNT_IN_STOCK_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const admProductListReducer = (
  state: { result: { products: IProduct[]; data: { total_prods: number } } } = {
    result: { products: [], data: { total_prods: 0 } },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case productActions.ADM_PRODUCT_LIST_REQUEST:
      return {
        loading: true,
        result: {
          products: [],
          data: { total_prods: 0 },
        },
      }
    case productActions.ADM_PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        result: action.payload,
        success: true,
      }
    case productActions.ADM_PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
