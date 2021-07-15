import React, { useEffect } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { ICart, IShippingAddress } from '../type'

interface RouteParams {
  id: string
}

interface LocationParams {
  pathname: string
  search: string
}

interface HistoryParams {}

interface ICartItems {
  cartItems: ICart[]
  shippingAddress: IShippingAddress
}

export const CartScreen = () => {
  const params = useParams<RouteParams>()
  const location = useLocation<LocationParams>()
  const history = useHistory<HistoryParams>()
  const productId = params.id
  const qty: number = location.search
    ? Number(location.search.split('=')[1])
    : 1

  const dispatch = useDispatch()
  const cart = useSelector((state: { cart: ICartItems }) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id: number) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    // If user is not logged in so go to login otherwise go to shipping
    history.push('/login?redirect=shipping')
  }

  return (
    <div className='container'>
      <h1>Shopping Cart</h1>
      <div className='cart-items-wrapper u-py-s'>
        {cartItems.length === 0 ? (
          <Message info='Your cart is empty' />
        ) : (
          <>
            <ul className='cart-itemslist'>
              {cartItems.map((item) => (
                <li
                  className='cart-itemslist__li u-py-s u-my-s'
                  key={item.product}
                >
                  {' '}
                  {/* item.product is the id */}
                  <div className='cart-itemslist__imgwrapper'>
                    <img
                      className='cart-itemslist__imgwrapper--img'
                      src={`/images/${item.image}`}
                      alt={item.name}
                    />
                  </div>
                  <div className='cart-itemslist__linkwrapper'>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>
                  <div>${item.price}</div>
                  <div>
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(
                            String(item.product),
                            Number(e.target.value)
                          )
                        )
                      }
                    >
                      {[...Array(item.count_in_stock)].map((el, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button onClick={() => removeFromCartHandler(item.product)}>
                      <i className='fas fa-trash'></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className='cart-itemsstats'>
              <ul className='cart-itemsstats__card'>
                <li className='cart-itemsstats__details'>
                  <h2 className='u-txt-center'>
                    Subtotal (
                    {cartItems.reduce(
                      (acc: number, cur: ICart) => acc + cur.qty,
                      0
                    )}
                    ) items
                  </h2>
                  <small className='u-txt-center'>
                    $
                    {cartItems.reduce(
                      (acc: number, cur: ICart) => acc + cur.qty * cur.price,
                      0
                    )}
                  </small>
                </li>
                <li className='cart-itemsstats__checkout'>
                  <button
                    className='btn'
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Checkout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartScreen
