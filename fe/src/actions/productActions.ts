import axios from 'axios'
import { productActions } from '../constants/productConstants'
import { AppDispatch } from '../store'

// redux-thunk allows usage of async functions
export const listProducts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: productActions.PRODUCT_LIST_REQUEST })

    const { data } = await axios.get('http://localhost:8080/products')

    dispatch({
      type: productActions.PRODUCT_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: productActions.PRODUCT_LIST_FAIL,
      payload: JSON.stringify(error),
      //   payload:
      //     error.response && error.response.data.message
      //       ? error.response.data.message
      //       : error.message,
    })
  }
}

export const listProductDetails =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: productActions.PRODUCT_DETAILS_REQUEST })

      const { data } = await axios.get(`http://localhost:8080/products/${id}`)

      dispatch({
        type: productActions.PRODUCT_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: productActions.PRODUCT_DETAILS_FAIL,
        payload: JSON.stringify(error),
        //   payload:
        //     error.response && error.response.data.message
        //       ? error.response.data.message
        //       : error.message,
      })
      console.log(error.response.data.error)
    }
  }
