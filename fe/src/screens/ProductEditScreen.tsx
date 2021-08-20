import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import {
  IAdminProductUpdateRdx,
  IProductDetailsRdx,
  IUserInfoRdx,
} from '../type'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { productActions } from '../constants/productConstants'

interface HistoryParams {}

interface RouteParams {
  productid: string
}

const ProductEditScreen = () => {
  const params = useParams<RouteParams>()
  const history = useHistory<HistoryParams>()

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(1)
  const [countInStock, setCountInStock] = useState(1)
  //   const [image, setImage] = useState()

  const dispatch = useDispatch()

  const userLogin = useSelector(
    (state: { userLogin: IUserInfoRdx }) => state.userLogin
  )

  const productDetails = useSelector(
    (state: { productDetails: IProductDetailsRdx }) => state.productDetails
  )

  const adminProductUpdate = useSelector(
    (state: { adminProductUpdate: IAdminProductUpdateRdx }) =>
      state.adminProductUpdate
  )

  useEffect(() => {
    if (
      adminProductUpdate &&
      adminProductUpdate.result &&
      adminProductUpdate.result.ok
    ) {
      dispatch({ type: productActions.PRODUCT_DETAILS_RESET })
      dispatch({ type: productActions.PRODUCT_UPDATE_RESET })
      history.push('/admin/products')
    }

    if (
      !userLogin.userInfo ||
      (userLogin.userInfo && userLogin.userInfo.role === UserRole.NORMAL)
    ) {
      history.push('/login')
    } else if (
      !productDetails.product ||
      (productDetails.product &&
        productDetails.product.id !== Number(params.productid))
    ) {
      dispatch(listProductDetails(params.productid))
    } else {
      setName(productDetails.product.name)
      setBrand(productDetails.product.brand)
      setCategory(productDetails.product.category)
      setDescription(productDetails.product.description)
      setPrice(productDetails.product.price)
      setCountInStock(productDetails.product.count_in_stock)
    }
  }, [
    dispatch,
    history,
    userLogin.userInfo,
    productDetails,
    params.productid,
    adminProductUpdate,
  ])

  const updateProductDetails = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault()

    dispatch(
      updateProduct({
        id: Number(params.productid),
        name: name,
        brand: brand,
        category: category,
        description: description,
        price: price,
        count_in_stock: countInStock,
      })
    )
  }

  return (
    <div className='container'>
      <div className='prof--sep u-my-s'>
        <SideNav
          isAdmin={
            userLogin.userInfo && userLogin.userInfo.role !== UserRole.NORMAL
          }
        />

        <div className='prof--sep--r'>
          {adminProductUpdate && adminProductUpdate.error && (
            <Message error={adminProductUpdate.error} />
          )}

          <h1 className='u-txt-center u-my-s'>Edit Product</h1>
          {productDetails.loading ||
          userLogin.loading ||
          (adminProductUpdate && adminProductUpdate.loading) ? (
            <Loader />
          ) : productDetails.error ? (
            <Message error={productDetails.error} />
          ) : userLogin.error ? (
            <Message error={userLogin.error} />
          ) : (
            productDetails.product && (
              <>
                <form className='form' onSubmit={updateProductDetails}>
                  <label htmlFor='name'>Name</label>
                  <input
                    type='text'
                    placeholder='Enter name'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <label htmlFor='brand'>Brand</label>
                  <input
                    type='text'
                    placeholder='Enter brand'
                    name='brand'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />

                  <label htmlFor='category'>Category</label>
                  <input
                    type='text'
                    placeholder='Enter category'
                    name='category'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />

                  <label htmlFor='description'>Description</label>
                  <textarea
                    id='description'
                    name='description'
                    rows={4}
                    cols={50}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>

                  <label htmlFor='price'>Price</label>
                  <input
                    type='number'
                    min='1'
                    step='any'
                    placeholder='Enter price'
                    name='price'
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                  />

                  <label htmlFor='countinstock'>Count In Stock</label>
                  <input
                    type='number'
                    min='1'
                    step='any'
                    placeholder='Enter count in stock'
                    name='countinstock'
                    value={countInStock}
                    onChange={(e) => setCountInStock(Number(e.target.value))}
                    required
                  />

                  <label htmlFor='image'>
                    TODO: need to implement image upload (input type file)
                  </label>

                  <button type='submit'>Edit Product</button>
                </form>
              </>
            )
          )}

          <div className='u-txt-center'>
            <Link to='/admin/products' className='btn'>
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductEditScreen
