import React from 'react'
import { Link } from 'react-router-dom'
import { IProduct } from '../type'
import Rating from './Rating'

interface IProps {
  product: IProduct
}

const Product = ({ product }: IProps) => {
  return (
    <div className='card-prod u-m-all-m'>
      <Link to={`/product/${product.id}`}>
        <img
          src={`/images/${product.image}`}
          alt={product.name}
          className='card-prod__img'
        />

        <div className='card-prod__body'>
          <div>
            <strong>{product.name}</strong>
          </div>

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
      </Link>
    </div>
  )
}

export default Product
