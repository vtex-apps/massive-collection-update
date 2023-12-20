interface UpdateRequest {
    sku: number
    subCollectionId?: number | string
  }

  interface UpdateResponse {
    sku: number
    subCollectionId?: number | string
    success: string
    error?: number | string
    errorMessage?: string
  }
