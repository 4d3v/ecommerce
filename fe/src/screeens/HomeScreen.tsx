import React from 'react'
import Product from '../components/Product'
import products from '../products'

const Home = () => {
  return (
    <div className='container u-py-s'>
      <h1>PRODUCTS</h1>
      <div className='prods-card-wrapper u-py-s'>
        {products.map((prod) => (
          <Product key={prod._id} product={prod} />
        ))}
      </div>
    </div>
  )
}

export default Home
