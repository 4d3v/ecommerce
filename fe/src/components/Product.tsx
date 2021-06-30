import React from 'react'
import { Link } from 'react-router-dom'
import { IProduct } from '../type'
import Rating from './Rating'

interface IProps {
  product: IProduct
}

const Product = ({ product }: IProps) => {
  return (
    <div className='card-prod u-my-s'>
      <Link to={`/product/${product.id}`}>
        <img
          src={`/images/${product.image}`}
          alt={product.name}
          className='card-prod__img'
        />
      </Link>

      <div className='card-prod__body'>
        <Link to={`/product/${product.id}`}>
          <div>
            <strong>{product.name}</strong>
          </div>
        </Link>

        <div className='u-my-s'>
          <Rating
            value={product.rating}
            text={`${product.num_reviews} reviews`}
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
