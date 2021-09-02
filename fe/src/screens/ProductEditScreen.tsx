import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import Alert from '../components/Alert'
import Message from '../components/Message'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import {
  IAdminProductUpdateRdx,
  IProductDetailsRdx,
  IUserInfoRdx,
  IUserLoginRdx,
} from '../type'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { productActions } from '../constants/productConstants'
import axios from 'axios'
import { BASE_URL } from '../constants/endPoints'

interface HistoryParams {}

interface RouteParams {
  productid: string
}

interface ImageUploadedResult {
  ok: boolean
  message: string
  error: string
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
  const [image, setImage] = useState<File | null>(null)
  const [imageUploaded, setImageUploaded] =
    useState<ImageUploadedResult | null>(null)
  const [imgUploadAlertToggle, setImgUploadAlertToggle] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
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
      (userLogin.userInfo && userLogin.userInfo.user.role === UserRole.NORMAL)
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

  const imgOnChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setImage(e.target.files![0])
  }

  const imgSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!image) return

    const formData = new FormData()
    formData.append('image', image)
    setUploadingImg(true)

    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.patch(
        `${BASE_URL}/products/uploadimage/${params.productid}`,
        formData,
        config
      )

      console.log(data)
      setImgUploadAlertToggle(true)
      setTimeout(() => {
        setImgUploadAlertToggle(false)
      }, 2000)
      setUploadingImg(false)
      setImageUploaded(data)
    } catch (err) {
      console.error(err.response)
      setImageUploaded((st) => ({
        ok: false,
        message: '',
        error: err.response.data,
      }))
      setUploadingImg(false)
    }
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
          {adminProductUpdate && adminProductUpdate.error && (
            <Message error={adminProductUpdate.error} />
          )}

          {imageUploaded && imageUploaded.error && (
            <Message error={imageUploaded.error} />
          )}

          {imageUploaded && imageUploaded.ok && imgUploadAlertToggle && (
            <Alert type='success' msg={imageUploaded.message} />
          )}

          <h1 className='u-txt-center u-my-s'>Edit Product</h1>
          {productDetails.loading ||
          userLogin.loading ||
          (adminProductUpdate && adminProductUpdate.loading) ||
          uploadingImg ? (
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

                  <button type='submit'>Edit Product</button>
                </form>

                <form
                  className='form'
                  encType='multipart/form-data'
                  // action='/upload'
                  onSubmit={imgSubmitHandler}
                  // method='POST'
                >
                  <label htmlFor='image'>Image</label>
                  <input
                    type='file'
                    name='file'
                    onChange={imgOnChangeHandler}
                    multiple
                  />
                  <button type='submit'>Upload Image</button>
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
