interface AuthValidationResponse {
  authStatus: string
  token: string
  expires: number
}

interface UserProfile {
  email: string
  userId: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'store-user'
}