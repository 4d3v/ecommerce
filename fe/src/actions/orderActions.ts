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
  (productId: number, orderId: number) =>
  async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: orderActions.ORDERED_PRODS_CREATE_REQUEST,
      })

      const { data } = await axios.post(
        `${BASE_URL}/orderedprods`,
        `product_id=${productId}&order_id=${orderId}`,
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
