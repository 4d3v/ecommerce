import axios from 'axios'
import { useCookies } from 'react-cookie'
import { BASE_URL } from '../constants/endPoints'
import { userActions } from '../constants/userConstants'
import { AppDispatch } from '../store'
import { IUser } from '../type'
import { getFormErrors } from './actionsUtils'

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: userActions.USER_LOGIN_REQUEST,
      })

      const { data } = await axios.post(
        `${BASE_URL}/login`,
        `email=${email}&password=${password}`,
        { withCredentials: true }
      )

      dispatch({
        type: userActions.USER_LOGIN_SUCCESS,
        payload: data,
      })

      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          userInfo: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            created_at: data.created_at,
            updated_at: data.updated_at,
          },
        })
      )
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: userActions.USER_LOGIN_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
    }
  }

export const logout = () => async (dispatch: AppDispatch) => {
  try {
    dispatch({ type: userActions.USER_LOGOUT_REQUEST })

    const { data } = await axios.get(`${BASE_URL}/logout`, {
      withCredentials: true,
    })

    dispatch({
      type: userActions.USER_LOGOUT_SUCCESS,
      payload: data,
    })

    dispatch({
      type: userActions.USER_LOGOUT,
      payload: data,
    })

    localStorage.removeItem('userInfo')
  } catch (error) {
    const customError = getFormErrors(error)
    dispatch({
      type: userActions.USER_LOGOUT_FAIL,
      payload: customError.length > 0 ? customError : error.message,
    })
  }
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
        `name=${name}&email=${email}&password=${password}&password_confirm=${passwordConfirm}`,
        { withCredentials: true }
      )

      dispatch({
        type: userActions.USER_SIGNUP_SUCCESS,
        payload: data,
      })

      dispatch({
        type: userActions.USER_LOGIN_SUCCESS,
        payload: data,
      })

      dispatch({
        type: userActions.USER_DETAILS_SUCCESS,
        payload: data,
      })

      localStorage.setItem('userInfo', JSON.stringify({ userInfo: data }))
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: userActions.USER_SIGNUP_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
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

      const {
        data,
        config: { headers },
      } = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true,
      })

      dispatch({
        type: userActions.USER_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: userActions.USER_DETAILS_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
    }
  }

export const updateUser =
  (user: IUser) => async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: userActions.USER_UPDATE_PROFILE_REQUEST,
      })

      // const {
      //   userLogin: { userInfo },
      // } = getState()
      // console.log(userInfo)

      const { data } = await axios.patch(
        `${BASE_URL}/updateme`,
        `name=${user.name}&email=${user.email}`,
        {
          // headers: {
          //   Authorization: `Bearer ${userInfo.token}`,
          // },
          withCredentials: true,
        }
      )

      dispatch({
        type: userActions.USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      })

      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          userInfo: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            created_at: data.created_at,
            updated_at: data.updated_at,
          },
        })
      )
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: userActions.USER_UPDATE_PROFILE_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
    }
  }

export const updateUserPass =
  (curPassword: string, newPassword: string, newPasswordConfirm: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: userActions.USER_UPDATE_PASSWORD_REQUEST,
      })

      const { data } = await axios.patch(
        `${BASE_URL}/updatepassword`,
        `cur_password=${curPassword}&password=${newPassword}&password_confirm=${newPasswordConfirm}`,
        {
          // headers: {
          //   Authorization: `Bearer ${userInfo.token}`,
          // },
          withCredentials: true,
        }
      )

      dispatch({
        type: userActions.USER_UPDATE_PASSWORD_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: userActions.USER_UPDATE_PASSWORD_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
      console.log(customError)
    }
  }
