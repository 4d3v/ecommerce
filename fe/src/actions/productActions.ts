import axios from 'axios'
import { BASE_URL } from '../constants/endPoints'
import { productActions } from '../constants/productConstants'
import { AppDispatch } from '../store'
import { ICreateProduct, IUpdateProduct } from '../type'
import { getFormErrors } from './actionsUtils'

export const listProducts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: productActions.PRODUCT_LIST_REQUEST })

    const { data } = await axios.get(`${BASE_URL}/products`)

    dispatch({
      type: productActions.PRODUCT_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const customError = getFormErrors(error)
    dispatch({
      type: productActions.PRODUCT_LIST_FAIL,
      payload: customError.length > 0 ? customError : error.message,
    })
  }
}

export const listProductDetails =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: productActions.PRODUCT_DETAILS_REQUEST })

      const { data } = await axios.get(`${BASE_URL}/products/${id}`)

      dispatch({
        type: productActions.PRODUCT_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: productActions.PRODUCT_DETAILS_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
    }
  }

export const createProduct =
  (product: ICreateProduct) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: productActions.PRODUCT_CREATE_REQUEST,
      })
      const { name, brand, category, description, price, count_in_stock } =
        product
      const img = 'default-thumb.png' // TEMP

      const { data } = await axios.post(
        `${BASE_URL}/admproducts`,
        `name=${name}&brand=${brand}&category=${category}&description=${description}
        &price=${price}&count_in_stock=${count_in_stock}&image=${img}`,
        {
          withCredentials: true,
        }
      )

      dispatch({
        type: productActions.PRODUCT_CREATE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: productActions.PRODUCT_CREATE_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }
export const updateProduct =
  (product: IUpdateProduct) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: productActions.PRODUCT_UPDATE_REQUEST,
      })
      const { name, brand, category, description, price, count_in_stock } =
        product
      const img = 'default-thumb.png' // TEMP

      const { data } = await axios.patch(
        `${BASE_URL}/admproducts/${product.id}`,
        `name=${name}&brand=${brand}&category=${category}&description=${description}
        &price=${price}&count_in_stock=${count_in_stock}&image=${img}`,
        {
          withCredentials: true,
        }
      )

      dispatch({
        type: productActions.PRODUCT_UPDATE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: productActions.PRODUCT_UPDATE_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const deleteProduct =
  (productId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: productActions.PRODUCT_DELETE_REQUEST,
      })

      const { data } = await axios.delete(
        `${BASE_URL}/admproducts/${productId}`,
        {
          withCredentials: true,
        }
      )

      dispatch({
        type: productActions.PRODUCT_DELETE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: productActions.PRODUCT_DELETE_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }
