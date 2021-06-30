import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { IProduct } from '../type'

interface IProductList {
  products: IProduct[]
  loading: boolean
  error: string
}

const HomeScreen = () => {
  const dispatch = useDispatch()

  const productList: IProductList = useSelector(
    // (state: RootState) => state.productList
    (state: { productList: IProductList }) => state.productList
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

// const [prods, setProds] = useState<IProducts[]>([])
// useEffect(() => {
//   const fetchProducts = async () => {
//     const { data } = await axios.get('http://localhost:8080/products')
//     setProds(data)
//   }
//   fetchProducts()
// }, [])
// if (prods) console.log(prods)
