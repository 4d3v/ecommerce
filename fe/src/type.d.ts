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

type DispatchType = (args: ArticleAction) => ArticleAction
