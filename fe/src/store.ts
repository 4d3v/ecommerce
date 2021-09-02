import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  adminProductCreateReducer,
  adminProductDeleteReducer,
  adminProductUpdateReducer,
  productDetailsReducer,
  productListReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import {
  adminUserUpdateProfileReducer,
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userLogoutReducer,
  userSignUpReducer,
  userUpdatePasswordReducer,
  userUpdateProfileReducer,
} from './reducers/userReducers'
import {
  adminOrderDeliverReducer,
  adminOrderListReducer,
  orderCreateReducer,
  orderDetailsReducer,
  orderedProdsCreateReducer,
  orderedProdsListReducer,
  orderListUserReducer,
  orderPayReducer,
} from './reducers/orderReducers'

const cartItemsJson = localStorage.getItem('cartItems'),
  cartItemsFromStorage = cartItemsJson !== null ? JSON.parse(cartItemsJson) : []

const shippingAddressJson = localStorage.getItem('shippingAddress'),
  shippingAddressFromStorage =
    shippingAddressJson !== null ? JSON.parse(shippingAddressJson) : {}

const paymentMethodJson = localStorage.getItem('paymentMethod'),
  paymentMethodFromStorage =
    paymentMethodJson !== null ? JSON.parse(paymentMethodJson) : ''

const userInfoJson = localStorage.getItem('userInfo'),
  userInfoFromStorage = userInfoJson !== null ? JSON.parse(userInfoJson) : {}

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    userLogin: userLoginReducer,
    userLogout: userLogoutReducer,
    userSignUp: userSignUpReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdatePassword: userUpdatePasswordReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    orderCreate: orderCreateReducer,
    orderedProdsCreate: orderedProdsCreateReducer,
    orderDetails: orderDetailsReducer,
    orderedProdsList: orderedProdsListReducer,
    orderpay: orderPayReducer,
    orderListUser: orderListUserReducer,
    adminUserUpdateProfile: adminUserUpdateProfileReducer,
    adminProductCreate: adminProductCreateReducer,
    adminProductUpdate: adminProductUpdateReducer,
    adminProductDelete: adminProductDeleteReducer,
    adminOrderList: adminOrderListReducer,
    adminOrderDeliver: adminOrderDeliverReducer,
    cart: cartReducer,
  }),
  initialState = {
    cart: {
      cartItems: cartItemsFromStorage,
      shippingAddress: shippingAddressFromStorage,
      paymentMethod: paymentMethodFromStorage,
    },
    userLogin: userInfoFromStorage,
  },
  middleware = [thunk],
  store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  )

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store

/**
 * redux-thunk allows usage of async functions
 */
