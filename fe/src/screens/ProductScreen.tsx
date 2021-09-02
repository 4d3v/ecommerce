import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import { listProductDetails } from '../actions/productActions'
import { IProductDetailsRdx } from '../type'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'

interface RouteParams {
  id: string
}

const ProductScreen = () => {
  const [qty, setQty] = useState(1)

  const dispatch = useDispatch()
  const params = useParams<RouteParams>()
  const history = useHistory()
  const productDetails = useSelector(
    (state: { productDetails: IProductDetailsRdx }) => state.productDetails
  )

  useEffect(() => {
    dispatch(listProductDetails(params.id))
  }, [dispatch, params.id])

  const addToCartHandler = () => {
    history.push(`/cart/${params.id}?qty=${qty}`)
  }

  return (
    <>
      {productDetails && productDetails.loading ? (
        <Loader />
      ) : productDetails && productDetails.error ? (
        <Message error={productDetails.error} />
      ) : (
        productDetails &&
        productDetails.product && (
          <div className='container u-txt-center'>
            <div className='prod-wrapper u-my-s'>
              <div className='prod-img-wrapper'>
                <img
                  src={`/images/${productDetails.product!.image}`}
                  alt={productDetails.product!.name}
                  className='prod-img'
                />
              </div>

              <div className='prod-opts-wrapper'>
                <ul className='prod-info'>
                  <li className='prod-info__item u-my-t u-txt-left'>
                    <h2>
                      {productDetails.product
                        ? productDetails.product.name
                        : 'null'}
                    </h2>
                  </li>
                  <li className='prod-info__item u-my-t u-txt-left'>
                    <Rating
                      value={
                        productDetails.product?.rating
                          ? productDetails.product.rating
                          : 0
                      }
                      text={`
                ${
                  productDetails.product?.num_reviews
                    ? productDetails.product.num_reviews
                    : 0
                }  reviews`}
                    />
                  </li>
                  <li className='prod-info__item u-my-t u-txt-left'>
                    <strong>Price: </strong>$
                    {productDetails.product?.price
                      ? productDetails.product.price
                      : -999}
                  </li>

                  <li className='prod-info__item u-my-t u-txt-left'>
                    <strong>Description: </strong>
                    {productDetails.product?.description &&
                      productDetails.product.description}
                  </li>

                  <Link to='/' className='btn u-my-s'>
                    Go Back
                  </Link>
                </ul>
              </div>

              <div className='prod-opts-wrapper'>
                <ul>
                  <li className='prod-info__item u-my-t u-txt-left'>
                    Price:{' '}
                    {productDetails.product?.price
                      ? productDetails.product.price
                      : -999}
                  </li>
                  <li className='prod-info__item u-my-t u-txt-left'>
                    Status:{' '}
                    {productDetails.product?.count_in_stock !== undefined &&
                    productDetails.product.count_in_stock > 0
                      ? 'In Stock'
                      : 'Out Of Stock'}
                  </li>
                  {productDetails.product.count_in_stock !== undefined &&
                    productDetails.product.count_in_stock > 0 && (
                      <li>
                        <div>Qty: {productDetails.product.count_in_stock}</div>
                        <select
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[
                            ...Array(productDetails.product.count_in_stock),
                          ].map((el, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </li>
                    )}
                  <li className='prod-info__item u-my-t'>
                    <button
                      className='btn'
                      onClick={addToCartHandler}
                      disabled={
                        productDetails.product?.count_in_stock !== undefined &&
                        productDetails.product.count_in_stock > 0
                          ? false
                          : true
                      }
                    >
                      Add To Cart
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default ProductScreen
