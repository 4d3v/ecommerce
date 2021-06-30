import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { listProductDetails } from '../actions/productActions'
import { IProduct } from '../type'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'

// interface MatchParams {
//   id: string
// }
// interface MatchProps extends RouteComponentProps<MatchParams> {}

interface RouteParams {
  id: string
}

interface IProductDetails {
  product: IProduct
  loading: boolean
  error: string
}

const ProductScreen = () => {
  const dispatch = useDispatch()
  const params = useParams<RouteParams>()
  const productDetails = useSelector(
    (state: { productDetails: IProductDetails }) => state.productDetails
  )
  const { product, loading, error } = productDetails

  useEffect(() => {
    dispatch(listProductDetails(params.id))
  }, [dispatch, params.id])

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message error={error} />
      ) : (
        <div className='container u-txt-center'>
          <div className='prod-wrapper u-my-s'>
            <div className='prod-img-wrapper'>
              <img
                src={`/images/${product!.image}`}
                alt={product!.name}
                className='prod-img'
              />
            </div>

            <div className='prod-opts-wrapper'>
              <ul className='prod-info'>
                <li className='prod-info__item u-my-t u-txt-left'>
                  <h2>{product ? product.name : 'null'}</h2>
                </li>
                <li className='prod-info__item u-my-t u-txt-left'>
                  <Rating
                    value={product?.rating ? product.rating : 0}
                    text={`
                ${product?.num_reviews ? product.num_reviews : 0}  reviews`}
                  />
                </li>
                <li className='prod-info__item u-my-t u-txt-left'>
                  <strong>Price: </strong>$
                  {product?.price ? product.price : -999}
                </li>

                <li className='prod-info__item u-my-t u-txt-left'>
                  <strong>Description: </strong>
                  {product?.description && product.description}
                </li>

                <Link to='/' className='btn u-my-s'>
                  Go Back
                </Link>
              </ul>
            </div>

            <div className='prod-opts-wrapper'>
              <ul>
                <li className='prod-info__item u-my-t u-txt-left'>
                  Price: {product?.price ? product.price : -999}
                </li>
                <li className='prod-info__item u-my-t u-txt-left'>
                  Status:{' '}
                  {product?.count_in_stock !== undefined &&
                  product.count_in_stock > 0
                    ? 'In Stock'
                    : 'Out Of Stock'}
                </li>
                <li className='prod-info__item u-my-t'>
                  <button
                    className='btn'
                    disabled={
                      product?.count_in_stock !== undefined &&
                      product.count_in_stock > 0
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
      )}
    </>
  )
}

export default ProductScreen
