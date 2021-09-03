import axios from 'axios'
import { BASE_URL } from '../constants/endPoints'
import { orderActions } from '../constants/orderConstants'
import { userActions } from '../constants/userConstants'
import { AppDispatch } from '../store'
import { IUser } from '../type'
import { getAuthError, getFormErrors } from './actionsUtils'

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
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at,
            },
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

    dispatch({ type: userActions.USER_LOGOUT })
    dispatch({ type: userActions.USER_SIGNUP_RESET })
    dispatch({ type: orderActions.ORDER_LIST_USER_RESET })
    dispatch({ type: userActions.USER_LIST_RESET })

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

export const getUser = () => async (dispatch: AppDispatch, getState: any) => {
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

    // If we get the errror probably the jwt expired
    dispatch({
      type: userActions.USER_LOGOUT,
    })

    localStorage.removeItem('userInfo')
  }
}

export const updateUser = (user: IUser) => async (dispatch: AppDispatch) => {
  try {
    dispatch({
      type: userActions.USER_UPDATE_PROFILE_REQUEST,
    })

    const { data } = await axios.patch(
      `${BASE_URL}/updateme`,
      `name=${user.name}&email=${user.email}`,
      {
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
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            created_at: data.user.created_at,
            updated_at: data.user.updated_at,
          },
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

export const listUsers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch({
      type: userActions.USER_LIST_REQUEST,
    })

    const { data } = await axios.get(`${BASE_URL}/users`, {
      withCredentials: true,
    })

    dispatch({
      type: userActions.USER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    // TEMP maybe change getAuthError name or make another function in that case
    const customError = getAuthError(error)
    dispatch({
      type: userActions.USER_LIST_FAIL,
      payload: customError ? customError : error.message,
    })

    console.log(customError)
  }
}

export const deleteUser = (userId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch({
      type: userActions.USER_DELETE_REQUEST,
    })

    const { data } = await axios.delete(`${BASE_URL}/users/${userId}`, {
      withCredentials: true,
    })

    dispatch({
      type: userActions.USER_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    // TEMP maybe change getAuthError name or make another function in that case
    const customError = getAuthError(error)
    dispatch({
      type: userActions.USER_DELETE_FAIL,
      payload: customError ? customError : error.message,
    })

    console.log(customError)
  }
}

export const getUserById =
  (userId: number) => async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch({
        type: userActions.USER_DETAILS_REQUEST,
      })

      const { data } = await axios.get(`${BASE_URL}/me/${userId}`, {
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

      localStorage.removeItem('userInfo')
    }
  }

export const adminUpdateUser =
  (user: IUser) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: userActions.ADMIN_USER_UPDATE_PROFILE_REQUEST,
      })

      const { data } = await axios.patch(
        `${BASE_URL}/users/${user.id}`,
        `name=${user.name}&email=${user.email}&role=${user.role}&active=${user.active}`,
        {
          withCredentials: true,
        }
      )

      dispatch({
        type: userActions.ADMIN_USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const customError = getFormErrors(error)
      dispatch({
        type: userActions.ADMIN_USER_UPDATE_PROFILE_FAIL,
        payload: customError.length > 0 ? customError : error.message,
      })
    }
  }
