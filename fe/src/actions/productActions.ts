import axios from 'axios'
import { BASE_URL } from '../constants/endPoints'
import { productActions } from '../constants/productConstants'
import { AppDispatch } from '../store'
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
