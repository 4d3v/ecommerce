export interface IUser {
  id: number
  name: string
  email: string
  role?: number
  created_at?: Date
  updated_at?: Date
  token?: string
}

export interface IProduct {
  id: number
  name: string
  image: string
  brand: string
  category: string
  description: string
  rating: number
  num_reviews: number
  price: number
  count_in_stock: number
  user_id: number
  user: IUser
  created_at: Date
  updated_at: Date
}

export interface ICart {
  productId: number
  name: string
  image: string
  price: number
  count_in_stock: number
  qty: number
}

// TODO change to match backend
export interface IShippingAddress {
  address: string
  city: string
  postal_code: string
  country: string
}

// TODO change to match backend
export interface ICreateOrder {
  postal_code: string
  address: string
  country: string
  city: string
  payment_method: int
  total_price: int
}

export interface IOrderDetails {
  id: number
  address: string
  city: string
  postal_code: string
  country: string
  total_price: int
  is_delivered: boolean
  delivered_at: string
  is_paid: false
  paid_at: string
  payment_method: number
  payment_result_id: string
  payment_result_status: string
  payment_result_update_time: string
  payment_result_email_address: string
  user_id?: number
  user: IUser
  created_at: string
  updated_at: string
}

export type IPaymentMethod = string

// SCREENS
export interface IProductListRdx {
  products: IProduct[]
  loading: boolean
  error: string
}

export interface IProductDetailsRdx {
  product: IProduct
  loading: boolean
  error: string
}

export interface IUserInfoRdx {
  loading: boolean
  userInfo: IUser
  error: string
}

export interface IUserUpdateProfileRdx {
  loading: boolean
  success: boolean
  userInfo: IUser
  error: string
}

export interface IUserUpdatePasswordRdx {
  loading: boolean
  success: boolean
  error: string
}

export interface ICartItemsRdx {
  cartItems: ICart[]
  shippingAddress: IShippingAddress
  paymentMethod: IPaymentMethod
}

export interface IOrderCreateRdx {
  loading: boolean
  success: boolean
  error: string
  order: {
    ok: boolean
    message: string
    data: { order_id: number }
    // error: string
    // errors: string[]
  }
}

export interface IOrderDetailsRdx {
  loading: boolean
  error?: { ok: boolean; errorMsg: string }
  orderItem: IOrderDetails
}

interface IOrderedProd {
  prod_brand: string
  prod_count_in_stock: number
  prod_qty: number
  prod_image: string
  prod_name: string
  prod_price: number
  user_id: string
  order_id: number
  op_created_at: string
  op_updated_at: string
}

export interface IOrderedProdsRdx {
  loading: boolean
  error: string
  orderedProds: IOrderedProd[]
}

export interface IOrderPayRdx {
  loading: boolean
  success: boolean
  error: string
}

export interface IPaypalPaymentResult {
  paymentResultId: string
  paymentResultStatus: string
  paymentResultUpdateTime: string
  paymentResultEmailAddress: string
}

// type DispatchType = (args: ArticleAction) => ArticleAction
