export type Subscriber = {
  _id: string
  email: string
  isActive: boolean
  subscribedAt: string
  createdAt: string
  updatedAt: string
}

export type SubscribersApiResponse = {
  success: boolean
  message: string
  data: Subscriber[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalSubscribers: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
