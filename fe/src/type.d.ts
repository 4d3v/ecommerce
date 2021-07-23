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
  user: any // temp
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

export interface IUser {
  id: number
  name: string
  email: string
  role?: number
  created_at?: Date
  updated_at?: Date
  token?: string
}

// TODO change to match backend
export interface IShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

// TODO change to match backend
export interface ICreateOrder {
  postalCode: string
  address: string
  country: string
  city: string
  paymentMethod: int
  totalPrice: int
}

export interface IOrderDetails {
  id: number
  address: string
  city: string
  postal_code: string
  country: string
  payment_method: int
  total_price: int
  is_delivered: boolean
  delivered_at: string
  is_paid: false
  paid_at: string
  payment_method: number
  payment_result_status: number
  payment_result_update_time: string
  user_id: number
  created_at: string
  updated_at: string
}

export type IPaymentMethod = string

// type DispatchType = (args: ArticleAction) => ArticleAction
