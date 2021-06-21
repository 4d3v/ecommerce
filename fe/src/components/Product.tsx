import React from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'

interface IProps {
  product: {
    _id: string
    name: string
    image: string
    description: string
    brand: string
    category: string
    price: number
    countInStock: number
    rating: number
    numReviews: number
  }
}

const Product = ({ product }: IProps) => {
  return (
    <div className='card-prod u-my-s'>
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className='card-prod__img'
        />
      </Link>

      <div className='card-prod__body'>
        <Link to={`/product/${product._id}`}>
          <div>
            <strong>{product.name}</strong>
          </div>
        </Link>

        <div className='u-my-s'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>

        <div>
          <h3 className='card-prod__price u-my-s'>${product.price}</h3>
        </div>
      </div>
    </div>
  )
}

export default Product
