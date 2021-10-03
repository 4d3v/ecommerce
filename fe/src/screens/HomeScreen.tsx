import React, { useCallback, useEffect, useRef } from 'react'
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

  const observer = useRef<any>() // TEMP using any

  const lastProdEl = useCallback(
    (node) => {
      if (productList.loading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        // entries[0] cause we are only observing one entrie (node)
        if (
          entries[0].isIntersecting &&
          productList.success &&
          productList.result.products.length <
            productList.result.data.total_prods
        ) {
          const lastProdIdx = productList.result.products.length - 1
          dispatch(
            listProducts({
              lt: productList.result.products[lastProdIdx].created_at,
            })
          )
        }
      })

      if (node) observer.current.observe(node)
    },
    [
      dispatch,
      productList.loading,
      productList.success,
      productList.result.products,
      productList.result.data.total_prods,
    ]
  )

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
        {productList && productList.loading && <Loader />}
        {productList && productList.error ? (
          <Message error={productList.error} />
        ) : (
          productList &&
          productList.result &&
          productList.result.products.length > 0 && (
            <div className='prods-card-wrapper'>
              {productList.result.products.map((prod, idx) =>
                productList.result.products.length === idx + 1 ? (
                  <div key={prod.id} ref={lastProdEl}>
                    <Product product={prod} />
                  </div>
                ) : (
                  <div key={prod.id}>
                    <Product product={prod} />
                  </div>
                )
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default HomeScreen
