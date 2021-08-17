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

export const userLogoutReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_LOGOUT_REQUEST:
      return { loading: true }
    case userActions.USER_LOGOUT_SUCCESS:
      return { loading: false, userInfo: {} }
    case userActions.USER_LOGOUT_FAIL:
      return { loading: false, error: action.payload }
    default:
      return {}
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
      return { ...state, loading: true }
    case userActions.USER_DETAILS_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case userActions.USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_DETAILS_RESET:
      return { userInfo: {} }
    default:
      return state
  }
}

export const userUpdateProfileReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_UPDATE_PROFILE_REQUEST:
      return { loading: true }
    case userActions.USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload }
    case userActions.USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_UPDATE_PROFILE_RESET:
      return {}
    default:
      return state
  }
}

export const userUpdatePasswordReducer = (
  state = userInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_UPDATE_PASSWORD_REQUEST:
      return { loading: true }
    case userActions.USER_UPDATE_PASSWORD_SUCCESS:
      return { loading: false, success: true }
    case userActions.USER_UPDATE_PASSWORD_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

const userListInitialState: { users: IUser[] | null } = {
  users: null,
}
export const userListReducer = (
  state = userListInitialState,
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_LIST_REQUEST:
      return { loading: true }
    case userActions.USER_LIST_SUCCESS:
      return { loading: false, users: action.payload }
    case userActions.USER_LIST_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_LIST_RESET:
      return { users: null }
    default:
      return state
  }
}

export const userDeleteReducer = (state = {}, action: AnyAction) => {
  switch (action.type) {
    case userActions.USER_DELETE_REQUEST:
      return { loading: true }
    case userActions.USER_DELETE_SUCCESS:
      return { loading: false, success: true }
    case userActions.USER_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

const adminUpdateUserInitState: {
  result: { ok: boolean; message: string } | null
} = {
  result: null,
}
export const adminUserUpdateProfileReducer = (
  state = adminUpdateUserInitState,
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.ADMIN_USER_UPDATE_PROFILE_REQUEST:
      return { loading: true }
    case userActions.ADMIN_USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, result: action.payload }
    case userActions.ADMIN_USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
