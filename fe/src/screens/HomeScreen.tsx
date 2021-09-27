import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import MainSideNav from '../components/MainSideNav'
import { IProductListRdx } from '../type'

interface IProps {
  leftNavToggled: boolean
  leftNavDefVis: boolean
}

const HomeScreen = ({ leftNavToggled, leftNavDefVis }: IProps) => {
  const dispatch = useDispatch()

  const productList: IProductListRdx = useSelector(
    (state: { productList: IProductListRdx }) => state.productList
  )

  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  return (
    <div className='home'>
      <MainSideNav
        leftNavToggled={leftNavToggled}
        leftNavDefVis={leftNavDefVis}
      />

      <div className='home__content'>
        <div className='content-title dki02'>
          <h2 className='u-txt-center'>NEWEST PRODUCTS</h2>
        </div>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message error={error} />
        ) : (
          <div className='prods-card-wrapper'>
            {products.map((prod) => (
              <Product key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeScreen
