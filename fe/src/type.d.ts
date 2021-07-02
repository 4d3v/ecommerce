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

export type ProductsState = {
  products: IProduct
}

export interface ICart {
  product: number
  name: string
  image: string
  price: number
  count_in_stock: number
  qty: number
}

// type DispatchType = (args: ArticleAction) => ArticleAction
