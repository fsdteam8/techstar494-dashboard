export type User = {
  _id: string
  firstName: string | null
  lastName: string | null
  userName: string
  email: string
  phone: string | null
  isVerified: boolean
  ageVerification: boolean
  country: string | null
  state: string | null
  city: string | null
  address: string | null
  texId: string | null
  points: number
  imageLink: string | null
  resetPasswordOtp: string | null
  resetPasswordOtpExpires: string | null
  role: string
  createdAt: string // ISO Date
  updatedAt: string // ISO Date
}

export type UsersApiResponse = {
  success: boolean
  message: string
  data: User[]
  pagination?: {
    totalPages: number
    totalData: number
    currentPage: number
    limit: number
  }
}
