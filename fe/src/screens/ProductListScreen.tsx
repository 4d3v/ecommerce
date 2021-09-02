import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { deleteProduct, listProducts } from '../actions/productActions'
import Alert from '../components/Alert'
import Loader from '../components/Loader'
import Message from '../components/Message'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import { IProduct, IProductListRdx, IUserInfoRdx, IUserLoginRdx } from '../type'

interface HistoryParams {}

const ProductListScreen = () => {
  const history = useHistory<HistoryParams>()
  const dispatch = useDispatch()

  const [productDeleted, setProductDeleted] = useState(false)

  const productList = useSelector(
    (state: { productList: IProductListRdx }) => state.productList
  )

  const adminProductDelete = useSelector(
    (state: { adminProductDelete: any }) => state.adminProductDelete
  )

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  useEffect(() => {
    if (
      (userLogin.userInfo &&
        userLogin.userInfo.user.role === UserRole.NORMAL) ||
      !userLogin.userInfo
    )
      history.push('/')
    else dispatch(listProducts())
  }, [dispatch, history, userLogin.userInfo, adminProductDelete])

  const deleteProductHandler = (productId: number) => {
    // TEMP temporarily using window.confirm
    if (window.confirm('Are you sure')) dispatch(deleteProduct(productId))

    setProductDeleted(true)
    setTimeout(() => {
      setProductDeleted(false)
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
          <h1 className='u-txt-center u-my-s'>Users</h1>

          <Link to='/admin/product/create' className='btn u-txt-center'>
            Create Product
          </Link>

          {adminProductDelete && adminProductDelete.loading && <Loader />}
          {adminProductDelete &&
            adminProductDelete.result &&
            adminProductDelete.result.ok &&
            productDeleted && (
              <Alert type='success' msg={adminProductDelete.result.message} />
            )}
          {adminProductDelete && adminProductDelete.error && (
            <Message error={adminProductDelete.error} />
          )}

          {productList.loading ? (
            <Loader />
          ) : productList.error ? (
            <Message error={productList.error} />
          ) : (
            productList.products && (
              <table className='orderstable'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {productList.products.map((product: IProduct) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <Link
                          to={`/admin/product/${product.id}`}
                          className='u-mx-ss u-mk-cursor-ptr'
                        >
                          <i className='fas fa-edit'></i>
                        </Link>
                        <button
                          className='u-mx-ss u-mk-cursor-ptr'
                          onClick={() => deleteProductHandler(product.id)}
                        >
                          <i className='fas fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductListScreen
