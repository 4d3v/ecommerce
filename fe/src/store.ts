import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  productDetailsReducer,
  productListReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import {
  userDetailsReducer,
  userLoginReducer,
  userSignUpReducer,
} from './reducers/userReducers'

const cartItemsJson = localStorage.getItem('cartItems'),
  cartItemsFromStorage = cartItemsJson !== null ? JSON.parse(cartItemsJson) : []

const userInfoJson = localStorage.getItem('userInfo'),
  userInfoFromStorage = userInfoJson !== null ? JSON.parse(userInfoJson) : {}

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    userLogin: userLoginReducer,
    userSignUp: userSignUpReducer,
    userDetails: userDetailsReducer,
    cart: cartReducer,
  }),
  initialState = {
    cart: { cartItems: cartItemsFromStorage },
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
