import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { IProductListRdx } from '../type'

const HomeScreen = () => {
  const dispatch = useDispatch()

  const productList: IProductListRdx = useSelector(
    (state: { productList: IProductListRdx }) => state.productList
  )

  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  return (
    <div className='container u-py-s'>
      <h1>PRODUCTS</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message error={error} />
      ) : (
        <div className='prods-card-wrapper u-py-s'>
          {products.map((prod) => (
            <Product key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomeScreen
