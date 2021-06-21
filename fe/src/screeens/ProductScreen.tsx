import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Rating from '../components/Rating'
import products from '../products'

// export interface IProdRouteParams {
//   id: string
// }
// const { userId, userName } = useParams<IUserPublicProfileRouteParams>()

const Product = () => {
  const { id }: any = useParams()
  const product = products.find((prod) => prod._id === id)

  return (
    <div className='container u-txt-center'>
      <div className='prod-wrapper u-my-s'>
        <div className='prod-img-wrapper'>
          <img src={product!.image} alt={product!.name} className='prod-img' />
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
                ${product?.numReviews ? product.numReviews : 0}  reviews`}
              />
            </li>
            <li className='prod-info__item u-my-t u-txt-left'>
              <strong>Price: </strong>${product?.price ? product.price : -999}
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
              {product?.countInStock !== undefined && product.countInStock > 0
                ? 'In Stock'
                : 'Out Of Stock'}
            </li>
            <li className='prod-info__item u-my-t'>
              <button
                className='btn'
                disabled={
                  product?.countInStock !== undefined &&
                  product.countInStock > 0
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
}

export default Product
