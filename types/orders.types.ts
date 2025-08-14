export interface Order {
  _id: string
  user: {
    firstName: string
    lastName: string
    userName: string
    email: string
  }
  product: {
    _id: string
    name: string
    photo: string[]
    category: string
  }
  unit: string
  quantity: number
  pricePerUnit: number
  totalAmount: number
  status: 'Pending' | 'Ongoing' | 'Delivered'
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
}

export interface OrdersApiResponse {
  success: boolean
  message: string
  data: Order[]
  pagination?: {
    totalPages: number
    totalData: number
  }
}
