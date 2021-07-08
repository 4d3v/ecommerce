import { AnyAction } from 'redux'
import { userActions } from '../constants/userConstants'
import { IUser } from '../type'

const userInitialState: { userInfo: IUser | null } = {
  userInfo: null,
}

export const userLoginReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_LOGIN_REQUEST:
      return { loading: true }
    case userActions.USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case userActions.USER_LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const userSignUpReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_SIGNUP_REQUEST:
      return { loading: true }
    case userActions.USER_SIGNUP_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case userActions.USER_SIGNUP_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userDetailsReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_DETAILS_REQUEST:
      return { loading: true }
    case userActions.USER_DETAILS_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case userActions.USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
