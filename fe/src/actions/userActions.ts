import axios from 'axios'
import { BASE_URL } from '../constants/endPoints'
import { userActions } from '../constants/userConstants'
import { AppDispatch } from '../store'

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: userActions.USER_LOGIN_REQUEST,
      })

      // const { data } = await axios.post(
      // `${BASE_URL}/login`,
      //   { email, password },
      //   { headers: { 'content-type': 'application/json' } }
      // )
      const { data } = await axios.post(
        `${BASE_URL}/login`,
        `email=${email}&password=${password}`
        // { withCredentials: true }
      )

      dispatch({
        type: userActions.USER_LOGIN_SUCCESS,
        payload: data,
      })

      localStorage.setItem('userInfo', JSON.stringify({ userInfo: data }))
    } catch (error) {
      dispatch({
        type: userActions.USER_LOGIN_FAIL,
        payload: JSON.stringify(error),
        //   payload:
        //     error.response && error.response.data.message
        //       ? error.response.data.message
        //       : error.message,
      })
      console.log(error.response.data)
    }
  }

export const logout = () => (dispatch: AppDispatch) => {
  dispatch({ type: userActions.USER_LOGOUT })
  localStorage.removeItem('userInfo')
}

export const signup =
  (name: string, email: string, password: string, passwordConfirm: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: userActions.USER_SIGNUP_REQUEST,
      })

      const { data } = await axios.post(
        `${BASE_URL}/signup`,
        `name=${name}&email=${email}&password=${password}&password_confirm=${passwordConfirm}`
      )

      dispatch({
        type: userActions.USER_SIGNUP_SUCCESS,
        payload: data,
      })

      dispatch({
        type: userActions.USER_LOGIN_SUCCESS,
        payload: data,
      })

      // localStorage.setItem('userInfo', JSON.stringify({ userInfo: data }))
    } catch (error) {
      dispatch({
        type: userActions.USER_SIGNUP_FAIL,
        payload: JSON.stringify(error),
        //   payload:
        //     error.response && error.response.data.message
        //       ? error.response.data.message
        //       : error.message,
      })
      console.log(error.response.data)
    }
  }

export const getUser =
  (id: number) => async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: userActions.USER_DETAILS_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const { data } = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      dispatch({
        type: userActions.USER_LOGIN_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: userActions.USER_SIGNUP_FAIL,
        payload: JSON.stringify(error),
        //   payload:
        //     error.response && error.response.data.message
        //       ? error.response.data.message
        //       : error.message,
      })
      console.log(error.response.data)
    }
  }
