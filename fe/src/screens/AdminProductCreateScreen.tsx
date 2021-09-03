import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createProduct } from '../actions/productActions'
import Alert from '../components/Alert'
import Loader from '../components/Loader'
import Message from '../components/Message'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import { IAdminProductCreateRdx, ICreateProduct, IUserLoginRdx } from '../type'

interface HistoryParams {}

const AdminProductCreateScreen = () => {
  const history = useHistory<HistoryParams>()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(1)
  const [countInStock, setCountInStock] = useState(1)
  const [productCreated, setProductCreated] = useState(false)

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  const adminProductCreate = useSelector(
    (state: { adminProductCreate: IAdminProductCreateRdx }) =>
      state.adminProductCreate
  )

  useEffect(() => {
    if (
      (userLogin.userInfo &&
        userLogin.userInfo.user.role === UserRole.NORMAL) ||
      !userLogin.userInfo
    )
      history.push('/')
  }, [dispatch, history, userLogin.userInfo])

  const createProductHandler = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault()

    const product: ICreateProduct = {
      name: name,
      image: 'default-thumb.png',
      brand: brand,
      category: category,
      description: description,
      price: price,
      count_in_stock: countInStock,
    }

    dispatch(createProduct(product))

    setProductCreated(true)
    setTimeout(() => {
      setProductCreated(false)
      history.push('/admin/products')
    }, 2000)
  }

  return (
    <div className='container'>
      <div className='prof--sep u-my-s'>
        <SideNav
          isAdmin={
            userLogin.userInfo &&
            userLogin.userInfo.user.role !== UserRole.NORMAL
          }
        />

        <div className='prof--sep--r'>
          {adminProductCreate && adminProductCreate.loading && <Loader />}
          {adminProductCreate &&
            adminProductCreate.result &&
            adminProductCreate.result.ok &&
            productCreated && (
              <Alert type='success' msg={adminProductCreate.result.message} />
            )}
          {adminProductCreate && adminProductCreate.error && (
            <Message error={adminProductCreate.error} />
          )}

          <h1 className='u-txt-center u-my-s'>Create Product</h1>

          <form className='form' onSubmit={createProductHandler}>
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

            <button type='submit'>Create Product</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminProductCreateScreen
