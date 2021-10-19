import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { adminListProducts, deleteProduct } from '../actions/productActions'
import Alert from '../components/Alert'
import Loader from '../components/Loader'
import MainSideNav from '../components/MainSideNav'
import Message from '../components/Message'
import Pagination from '../components/Pagination'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import {
  IMainNavProps,
  IProduct,
  IProductListRdx,
  IUserLoginRdx,
} from '../type'

interface HistoryParams {}

const AdminProductListScreen = ({
  leftNavToggled,
  leftNavDefVis,
}: IMainNavProps) => {
  const history = useHistory<HistoryParams>(),
    dispatch = useDispatch(),
    limit = 10,
    [page, setPage] = useState(0),
    [productDeleted, setProductDeleted] = useState(false)

  const admProductList = useSelector(
    (state: { admProductList: IProductListRdx }) => state.admProductList
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
    else dispatch(adminListProducts({ limit: limit, offset: page * limit }))
  }, [dispatch, history, userLogin.userInfo, adminProductDelete, page])

  const deleteProductHandler = (productId: number) => {
    // TEMP temporarily using window.confirm
    if (window.confirm('Are you sure')) dispatch(deleteProduct(productId))

    setProductDeleted(true)
    setTimeout(() => {
      setProductDeleted(false)
    }, 2000)
  }

  const handlePageClick = (pg: number) => {
    setPage(Number(pg))
  }

  return (
    <div className='_mctt02'>
      <MainSideNav
        leftNavToggled={leftNavToggled}
        leftNavDefVis={leftNavDefVis}
      />

      <div className='prof--sep'>
        <SideNav
          isAdmin={
            userLogin.userInfo &&
            userLogin.userInfo.user.role !== UserRole.NORMAL
          }
        />

        <div className='prof--sep--r'>
          <h2 className='u-txt-center u-my-s'>PRODUCTS</h2>

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

          {admProductList.loading ? (
            <Loader />
          ) : admProductList.error ? (
            <Message error={admProductList.error} />
          ) : (
            admProductList.result &&
            admProductList.result.products.length && (
              <>
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
                    {admProductList.result.products.map((product: IProduct) => (
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

                <div className='u-pagination-bar'>
                  {admProductList.result.data.total_prods > 0 && (
                    <Pagination
                      page={page}
                      limit={limit}
                      total_prods={admProductList.result.data.total_prods}
                      handlePageClick={handlePageClick}
                    />
                  )}
                </div>
              </>
            )
          )}

          <div className='u-txt-center'>
            <Link to='/admin/product/create' className='btn'>
              Create Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProductListScreen
