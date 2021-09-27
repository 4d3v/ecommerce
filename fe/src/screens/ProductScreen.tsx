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
import MainSideNav from '../components/MainSideNav'

interface RouteParams {
  id: string
}

interface IProps {
  leftNavToggled: boolean
  leftNavDefVis: boolean
}

const ProductScreen = ({ leftNavToggled, leftNavDefVis }: IProps) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(1)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [userReviewsHidden, setUserReviewsHidden] = useState(true)

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
    if (productReviewCreate.result && productReviewCreate.result.ok) {
      setRating(1)
      setName('')
      setComment('')
      dispatch({ type: productActions.PRODUCT_CREATE_REVIEW_RESET })
    }

    // name === '' means if we are coming from another page
    if (productReviewCreate && productReviewCreate.error && name === '')
      dispatch({ type: productActions.PRODUCT_CREATE_REVIEW_RESET })

    dispatch(listProductDetails(params.id))
    dispatch(listProductReviews(params.id))
  }, [dispatch, params.id, productReviewCreate, name])

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
    <div className='prod-details _mctt02'>
      <MainSideNav
        leftNavToggled={leftNavToggled}
        leftNavDefVis={leftNavDefVis}
      />

      {productDetails && productDetails.loading ? (
        <Loader />
      ) : productDetails && productDetails.error ? (
        <Message error={productDetails.error} />
      ) : (
        productDetails &&
        productDetails.product && (
          <div>
            <div className='content-title dki02'>
              <h2 className='u-txt-center'>PRODUCT DETAILS</h2>
            </div>

            <div className='content-wrapper'>
              <div className='prod-wrapper u-my-s'>
                <div className='prod-wrapper__details'>
                  <div className='prod-img-wrapper'>
                    <img
                      src={`/images/${productDetails.product.image}`}
                      alt={productDetails.product.name}
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
                          value={productDetails.product.rating}
                          text={`
                ${productDetails.product.num_reviews}  reviews`}
                        />
                      </li>
                      <li className='prod-info__item u-my-t u-txt-left'>
                        <strong>Brand: </strong>
                        {productDetails.product.brand}
                      </li>

                      <li className='prod-info__item u-my-t u-txt-left'>
                        <strong>Category: </strong>
                        {productDetails.product.category}
                      </li>

                      <li className='prod-info__item u-my-t u-txt-left'>
                        <strong>Description: </strong>
                        {productDetails.product?.description &&
                          productDetails.product.description}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='prod-wrapper__stats'>
                  <div className='prod-opts-wrapper'>
                    <ul>
                      <li className='prod-wrapper__info'>INFO</li>
                      <li className='prod-info__item u-txt-left'>
                        <div>Price</div>{' '}
                        <div>{productDetails.product.price}</div>
                      </li>
                      <li className='prod-info__item u-txt-left'>
                        <div> Status</div>
                        <div>
                          {productDetails.product?.count_in_stock !==
                            undefined &&
                          productDetails.product.count_in_stock > 0
                            ? 'In Stock'
                            : 'Out Of Stock'}
                        </div>
                      </li>
                      {productDetails.product.count_in_stock !== undefined &&
                        productDetails.product.count_in_stock > 0 && (
                          <li className='prod-info__item u-txt-left'>
                            <div>
                              Quantity: {productDetails.product.count_in_stock}{' '}
                              available
                            </div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}
                            >
                              {[
                                ...Array(productDetails.product.count_in_stock),
                              ].map((el, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1 === 1
                                    ? i + 1 + ' unit'
                                    : i + 1 + ' units'}
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
                            productDetails.product?.count_in_stock !==
                              undefined &&
                            productDetails.product.count_in_stock > 0
                              ? false
                              : true
                          }
                        >
                          Add To Cart
                        </button>
                      </li>

                      <li className='prod-info__item u-my-t'>
                        <Link to='/' className='btn u-my-s u-txt-center'>
                          Go Back
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='reviews-wrapper u-my-s'>
                <section className='section-reviews'>
                  {productReviewList && productReviewList.error ? (
                    <Message error={productReviewList.error} />
                  ) : productReviewList &&
                    productReviewList.reviews &&
                    productReviewList.reviews.length > 0 ? (
                    <div
                      className='section-reviews__wrapper'
                      onClick={() => setUserReviewsHidden((st) => !st)}
                    >
                      <div className='section-reviews__title'>
                        <i className='fas fa-star'></i>
                        <h2>Reviews</h2>
                        <i
                          className={`fas fa-arrow-${
                            userReviewsHidden ? 'down' : 'up'
                          }`}
                        ></i>
                      </div>
                      <div
                        className={`section-reviews__userreviews ${
                          userReviewsHidden
                            ? 'section-reviews__usrrevhid'
                            : 'section-reviews__usrrevvis'
                        }`}
                      >
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
                      </div>
                    </div>
                  ) : (
                    <div className='u-my-s'>
                      <Message error='No Reviews' />
                    </div>
                  )}
                </section>
              </div>

              <div>
                {userLogin && userLogin.userInfo ? (
                  <>
                    {productReviewCreate && productReviewCreate.error && (
                      <Message error={productReviewCreate.error} />
                    )}
                    <form
                      className='form'
                      onSubmit={createProductReviewHandler}
                    >
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
                  <Message error='Please login to post a review' />
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default ProductScreen
