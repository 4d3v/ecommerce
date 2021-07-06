import axios from 'axios'
import { userActions } from '../constants/userConstants'
import { AppDispatch } from '../store'

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: userActions.USER_LOGIN_REQUEST,
      })

      // const { data } = await axios.post(
      //   'http://localhost:8080/login',
      //   { email, password },
      //   { headers: { 'content-type': 'application/json' } }
      // )
      const { data } = await axios.post(
        'http://localhost:8080/login',
        `email=${email}&password=${password}`
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
