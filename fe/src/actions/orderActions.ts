import axios from 'axios'
import { BASE_URL } from '../constants/endPoints'
import { orderActions } from '../constants/orderConstants'
import { AppDispatch } from '../store'
import { ICreateOrder, IPaypalPaymentResult } from '../type'
import { getAuthError, getFormErrors } from './actionsUtils'

export const createOrder =
  (order: ICreateOrder) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: orderActions.ORDER_CREATE_REQUEST,
      })

      const {
        postal_code,
        address,
        country,
        city,
        payment_method,
        total_price,
      } = order

      const { data } = await axios.post(
        `${BASE_URL}/orders`,
        `postal_code=${postal_code}&address=${address}&country=${country}
         &city=${city}&payment_method=${payment_method}&total_price=${total_price}`,
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
  async (dispatch: AppDispatch) => {
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
  (orderId: number) => async (dispatch: AppDispatch) => {
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
      const customError = getAuthError(error)
      dispatch({
        type: orderActions.ORDER_DETAILS_FAIL,
        payload: customError ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const getOrderedProds =
  (orderId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: orderActions.ORDERED_PRODS_LIST_REQUEST,
      })

      const { data } = await axios.get(`${BASE_URL}/orderedprods/${orderId}`, {
        withCredentials: true,
      })

      dispatch({
        type: orderActions.ORDERED_PRODS_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)

      dispatch({
        type: orderActions.ORDERED_PRODS_LIST_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const payOrder =
  (orderId: number, paymentResult: IPaypalPaymentResult) =>
  async (dispatch: AppDispatch) => {
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

export const adminSetOrderAsDelivered =
  (orderId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: orderActions.ORDER_DELIVER_REQUEST,
      })

      const { data } = await axios.patch(
        `${BASE_URL}/adminorders/delivered/${orderId}`,
        {},
        { withCredentials: true }
      )

      dispatch({
        type: orderActions.ORDER_DELIVER_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDER_DELIVER_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const listMyOrders =
  (query?: { limit: number; offset: number }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: orderActions.ORDER_LIST_USER_REQUEST,
      })

      const { data } = await axios.get(`${BASE_URL}/orders`, {
        params: {
          limit: query && query.limit ? query.limit : 10,
          offset: query && query.offset ? query.offset : 0,
        },
        withCredentials: true,
      })

      dispatch({
        type: orderActions.ORDER_LIST_USER_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDER_LIST_USER_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const adminListOrders =
  (query?: { limit: number; offset: number }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: orderActions.ORDER_LIST_REQUEST,
      })

      const { data } = await axios.get(`${BASE_URL}/adminorders`, {
        params: {
          limit: query && query.limit ? query.limit : 10,
          offset: query && query.offset ? query.offset : 0,
        },
        withCredentials: true,
      })

      dispatch({
        type: orderActions.ORDER_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: orderActions.ORDER_LIST_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const adminGetOrderDetails =
  (orderId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: orderActions.ORDER_DETAILS_REQUEST,
      })

      const { data } = await axios.get(`${BASE_URL}/adminorders/${orderId}`, {
        withCredentials: true,
      })

      dispatch({
        type: orderActions.ORDER_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getAuthError(error)
      dispatch({
        type: orderActions.ORDER_DETAILS_FAIL,
        payload: customError ? customError : error.message,
      })
      console.log(error.response)
    }
  }

export const adminGetOrderedProds =
  (orderId: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: orderActions.ORDERED_PRODS_LIST_REQUEST,
      })

      const { data } = await axios.get(
        `${BASE_URL}/adminorderedprods/${orderId}`,
        {
          withCredentials: true,
        }
      )

      dispatch({
        type: orderActions.ORDERED_PRODS_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)

      dispatch({
        type: orderActions.ORDERED_PRODS_LIST_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(error.response)
    }
  }
