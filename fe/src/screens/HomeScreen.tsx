import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { RootState } from '../store'

interface IProds {
  products: any[]
  loading: boolean
  error: string
}

const Home = () => {
  const dispatch = useDispatch()

  const productList: IProds = useSelector(
    (state: RootState) => state.productList
  )
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  console.log(productList)

  // const [prods, setProds] = useState<IProducts[]>([])
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await axios.get('http://localhost:8080/products')
  //     setProds(data)
  //   }

  //   fetchProducts()
  // }, [])

  // if (prods) console.log(prods)

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

export default Home
