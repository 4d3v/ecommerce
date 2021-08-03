import axios from 'axios'
import { BASE_URL } from '../constants/endPoints'
import { orderActions } from '../constants/orderConstants'
import { AppDispatch } from '../store'
import { ICreateOrder } from '../type'
import { getFormErrors } from './actionsUtils'

export const createOrder =
  (order: ICreateOrder) => async (dispatch: AppDispatch, getState: any) => {
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
  (productId: number, orderId: number, qty: number) =>
  async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: orderActions.ORDERED_PRODS_CREATE_REQUEST,
      })

      const { data } = await axios.post(
        `${BASE_URL}/orderedprods`,
        `product_id=${productId}&order_id=${orderId}&qty=${qty}`,
        { withCredentials: true }
      )

      dispatch({
        type: orderActions.ORDERED_PRODS_CREATE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDERED_PRODS_CREATE_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const getOrderDetails =
  (orderId: number) => async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: orderActions.ORDER_DETAILS_REQUEST,
      })

      const { data } = await axios.get(`${BASE_URL}/orders/${orderId}`, {
        withCredentials: true,
      })

      dispatch({
        type: orderActions.ORDER_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDER_DETAILS_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const getOrderedProdsDetails =
  (orderId: number) => async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: orderActions.ORDERED_PRODS_DETAILS_REQUEST,
      })

      const { data } = await axios.get(`${BASE_URL}/orderedprods/${orderId}`, {
        withCredentials: true,
      })

      dispatch({
        type: orderActions.ORDERED_PRODS_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDERED_PRODS_DETAILS_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

// TEMP using any for paymentResult which is coming from paypal
export const payOrder =
  (
    orderId: number,
    paymentResult: {
      paymentResultId: string
      paymentResultStatus: string
      paymentResultUpdateTime: string
      paymentResultEmailAddress: string
    }
  ) =>
  async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: orderActions.ORDER_PAY_REQUEST,
      })

      const {
        paymentResultId,
        paymentResultStatus,
        paymentResultUpdateTime,
        paymentResultEmailAddress,
      } = paymentResult

      const { data } = await axios.patch(
        `${BASE_URL}/orders/${orderId}/pay`,
        `payment_result_id=${paymentResultId}&payment_result_status=${paymentResultStatus}
         &payment_result_update_time=${paymentResultUpdateTime}&payment_result_email_address=${paymentResultEmailAddress}`,
        { withCredentials: true }
      )

      dispatch({
        type: orderActions.ORDER_PAY_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDER_PAY_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }
