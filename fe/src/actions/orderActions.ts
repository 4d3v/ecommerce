import axios from 'axios'
import { BASE_URL } from '../constants/endPoints'
import { orderActions } from '../constants/orderConstants'
import { AppDispatch } from '../store'
import { IOrder } from '../type'
import { getFormErrors } from './actionsUtils'

export const createOrder =
  (order: IOrder) => async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: orderActions.ORDER_CREATE_REQUEST,
      })

      const { postalCode, address, country, city, paymentMethod, totalPrice } =
        order

      const { data } = await axios.post(
        `${BASE_URL}/orders`,
        `postal_code=${postalCode}&address=${address}&country=${country}
         &city=${city}&payment_method=${paymentMethod}&total_price=${totalPrice}`,
        { withCredentials: true }
      )

      dispatch({
        type: orderActions.ORDER_CREATE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDER_CREATE_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const createOrderedProds =
  (productId: number, orderId: number) =>
  async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: orderActions.ORDERED_PROD_CREATE_REQUEST,
      })

      const { data } = await axios.post(
        `${BASE_URL}/orderedprods`,
        `product_id=${productId}&order_id=${orderId}`,
        { withCredentials: true }
      )
      console.log(data)

      dispatch({
        type: orderActions.ORDERED_PROD_CREATE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDERED_PROD_CREATE_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }
