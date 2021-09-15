import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import {
  createProductReview,
  listProductDetails,
  listProductReviews,
} from '../actions/productActions'
import {
  IProductDetailsRdx,
  IProductReviewListRdx,
  IUserLoginRdx,
} from '../type'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { productActions } from '../constants/productConstants'

interface RouteParams {
  id: string
}

const ProductScreen = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const params = useParams<RouteParams>()
  const history = useHistory()

  const productDetails = useSelector(
    (state: { productDetails: IProductDetailsRdx }) => state.productDetails
  )

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  const productReviewCreate = useSelector(
    (state: { productReviewCreate: any }) => state.productReviewCreate
  )

  const productReviewList = useSelector(
    (state: { productReviewList: IProductReviewListRdx }) =>
      state.productReviewList
  )

  useEffect(() => {
    if (productReviewCreate && productReviewCreate.success) {
      setRating(0)
      setName('')
      setComment('')
      dispatch({ type: productActions.PRODUCT_CREATE_REVIEW_RESET })
    }

    if (productReviewCreate && productReviewCreate.error) {
      setTimeout(() => {
        dispatch({ type: productActions.PRODUCT_CREATE_REVIEW_RESET })
      }, 2000)
    }

    dispatch(listProductDetails(params.id))
    dispatch(listProductReviews(params.id))
  }, [dispatch, params.id, productReviewCreate])

  const addToCartHandler = () => {
    history.push(`/cart/${params.id}?qty=${qty}`)
  }

  const createProductReviewHandler = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault()
    dispatch(
      createProductReview({
        name,
        rating,
        comment,
        userId: userLogin.userInfo.user.id,
        productId: Number(params.id),
      })
    )
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
          <div className='container u-txt-center prod-details'>
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

                  <li className='prod-info__item u-my-t u-txt-left'>
                    <Link to='/' className='btn u-my-s u-txt-center'>
                      Go Back
                    </Link>
                  </li>
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

            <div>
              <h2>Reviews</h2>
              {productReviewList && productReviewList.error && (
                <Message error={productReviewList.error} />
              )}
              {productReviewList &&
              productReviewList.reviews &&
              productReviewList.reviews.length > 0 ? (
                <ul className='user-reviews'>
                  {productReviewList.reviews.map((review) => (
                    <li key={review.id}>
                      <div className='user-reviews__top'>
                        <div>{review.created_at}</div>
                        <Rating value={review.rating} color='yellow' />
                      </div>
                      <div>{review.username}</div>
                      <div>
                        <strong>Title:</strong> {review.name}
                      </div>
                      <div>
                        <strong>Review:</strong>
                        {review.comment}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='u-my-s'>
                  <Message info='No Reviews' />
                </div>
              )}
            </div>

            <div>
              {userLogin && userLogin.userInfo ? (
                <>
                  {productReviewCreate && productReviewCreate.error && (
                    <Message error={productReviewCreate.error} />
                  )}
                  <form className='form' onSubmit={createProductReviewHandler}>
                    <h3>Write a customer review</h3>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      placeholder='Enter name'
                      name='name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <label htmlFor='comment'>Review</label>
                    <textarea
                      id='comment'
                      name='comment'
                      placeholder='Post your review'
                      rows={4}
                      cols={50}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Fair</option>
                      <option value={3}>3 - Good</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>

                    <button type='submit'>Submit</button>
                  </form>
                </>
              ) : (
                <Message info='Please login to post a review' />
              )}
            </div>
          </div>
        )
      )}
    </>
  )
}

export default ProductScreen
