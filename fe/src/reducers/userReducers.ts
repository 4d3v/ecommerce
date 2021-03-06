import { AnyAction } from 'redux'
import { userActions } from '../constants/userConstants'
import { IUser } from '../type'

export const userLoginReducer = (
  state: { ok: boolean; message: string; user: IUser } | {} = {},
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
  state: { ok: boolean; message: string } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_LOGOUT_REQUEST:
      return { loading: true }
    case userActions.USER_LOGOUT_SUCCESS:
      return { loading: false, result: action.payload }
    case userActions.USER_LOGOUT_FAIL:
      return { loading: false, error: action.payload }
    default:
      return {}
  }
}

export const userSignUpReducer = (
  state: { ok: boolean; message: string; user: IUser } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_SIGNUP_REQUEST:
      return { loading: true }
    case userActions.USER_SIGNUP_SUCCESS:
      return { loading: false, result: action.payload }
    case userActions.USER_SIGNUP_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_SIGNUP_RESET:
      return {}
    default:
      return state
  }
}

export const userDetailsReducer = (
  state: { userInfo: IUser | null } = { userInfo: null },
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
  state: { ok: boolean; message: string; user: IUser } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_UPDATE_PROFILE_REQUEST:
      return { loading: true }
    case userActions.USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, result: action.payload }
    case userActions.USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_UPDATE_PROFILE_RESET:
      return {}
    default:
      return state
  }
}

export const userUpdatePasswordReducer = (
  state: { ok: boolean; message: string; user: IUser } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_UPDATE_PASSWORD_REQUEST:
      return { loading: true }
    case userActions.USER_UPDATE_PASSWORD_SUCCESS:
      return { loading: false, success: true, result: action.payload }
    case userActions.USER_UPDATE_PASSWORD_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_UPDATE_PASSWORD_RESET:
      return {}
    default:
      return state
  }
}

export const userForgotPasswordReducer = (
  state: { ok: boolean; message: string } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_FORGOT_PASSWORD_REQUEST:
      return { loading: true }
    case userActions.USER_FORGOT_PASSWORD_SUCCESS:
      return { loading: false, result: action.payload }
    case userActions.USER_FORGOT_PASSWORD_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_FORGOT_PASSWORD_RESET:
      return {}
    default:
      return state
  }
}

export const userResetPasswordReducer = (
  state: { ok: boolean; message: string } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_RESET_PASSWORD_REQUEST:
      return { loading: true }
    case userActions.USER_RESET_PASSWORD_SUCCESS:
      return { loading: false, result: action.payload }
    case userActions.USER_RESET_PASSWORD_FAIL:
      return { loading: false, error: action.payload }
    case userActions.USER_RESET_PASSWORD_RESET:
      return {}
    default:
      return state
  }
}

export const userListReducer = (
  state: { result: { users: IUser[]; data: { total_users: number } } } = {
    result: { users: [], data: { total_users: 0 } },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_LIST_REQUEST:
      return {
        loading: true,
        result: {
          users: [...state.result.users],
          data: { total_prods: state.result.data.total_users },
        },
      }

    case userActions.USER_LIST_SUCCESS:
      return { loading: false, result: action.payload }

    case userActions.USER_LIST_FAIL:
      return { loading: false, error: action.payload }

    case userActions.USER_LIST_RESET:
      return {
        loading: true,
        result: {
          users: [],
          data: { total_users: 0 },
        },
      }

    default:
      return state
  }
}

export const userDeleteReducer = (
  state: { ok: boolean; message: string } | {} = {},
  action: AnyAction
) => {
  switch (action.type) {
    case userActions.USER_DELETE_REQUEST:
      return { loading: true }
    case userActions.USER_DELETE_SUCCESS:
      return { loading: false, success: true, result: action.payload }
    case userActions.USER_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const adminUserUpdateProfileReducer = (
  state: { ok: boolean; message: string } | {} = {},
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
