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
  product: number
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

export interface IShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

export interface IOrder {
  postalCode: string
  address: string
  country: string
  city: string
  paymentMethod: int
  totalPrice: int
}

export type IPaymentMethod = string

// type DispatchType = (args: ArticleAction) => ArticleAction
