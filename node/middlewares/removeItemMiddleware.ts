export async function removeItemMiddleware(
    ctx: Context,
    next: () => Promise<any>
  ) {
    const {
      clients: { collectionClient },
      state: { validatedBody },
    } = ctx
  
    const responseList: UpdateResponse[] = []
  
    try {
      const expected = await operationRetry(
        await Promise.all(
          validatedBody.map(async (item) => {
            return removeItem(item)
          })
        )
      )
  
      if (expected) {
        const successfulResponses: UpdateResponse[] = responseList.filter((e) => {
          return e.success !== 'false'
        })
  
        const failedResponses: UpdateResponse[] = responseList.filter((e) => {
          return e.success === 'false'
        })
  
        ctx.status = 200
        ctx.body = {
          successfulResponses: {
            elements: successfulResponses,
            quantity: successfulResponses.length,
          },
          failedResponses: {
            elements: failedResponses,
            quantity: failedResponses.length,
          },
          total: responseList.length,
        }
  
        await next()
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = error
      await next()
    }
  
    async function removeItem(
      updateRequest: UpdateRequest
    ): Promise<UpdateResponse> {
      const {
        subCollectionId,
        sku
      } = updateRequest

      try {
  
        const updateCollectionClientResponse = await collectionClient.removeItem(
          subCollectionId,
          sku
        )
  
        const removeItemMiddlewareResponse: UpdateResponse = {
          sku: updateRequest.sku,
          success: updateCollectionClientResponse.data,
          subCollectionId: updateRequest.subCollectionId
        }
  
        return removeItemMiddlewareResponse
      } catch (error) {
        const data = error.response ? error.response.data : ''
        const updateCollectionClientErrorResponse = {
          sku: updateRequest.sku,
          success: 'false',
          subCollectionId: updateRequest.subCollectionId,
          error: error.response ? error.response.status : 500,
          errorMessage: data.error ? data.error.message : data,
        }
  
        if (error.response && error.response.status === 429) {
            updateCollectionClientErrorResponse.errorMessage = error.response
            ? error.response.headers['ratelimit-reset']
            : '0'
        }
  
        return updateCollectionClientErrorResponse
      }
    }
  
    async function operationRetry(
      updateResponseList: UpdateResponse[]
    ): Promise<any> {
      addResponsesSuccessfulUpdates(updateResponseList)
  
      const response = await findStoppedRequests(updateResponseList)
  
      return response
    }
  
    async function findStoppedRequests(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      responseList: UpdateResponse[]
    ): Promise<any> {
      const retryList: UpdateRequest[] = []
      let value = '0'
  
      if (responseList.length >= 1) {
        for (const index in responseList) {
          const response = responseList[index]
  
          if (response.error && response.error === 429) {
            if (response.errorMessage && response.errorMessage > value) {
              value = response.errorMessage
            }
  
            if (value === '0') {
              value = '20'
            }
  
            retryList.push({
              sku: response.sku,
              subCollectionId: response.subCollectionId
            })
          }
        }
      }
  
      if (retryList.length >= 1) {
        let retryOperation: UpdateResponse[] = []
  
        const awaitTimeout = (delay: string) =>
          new Promise((resolve) => setTimeout(resolve, parseFloat(delay) * 1000))
  
        await awaitTimeout(value)
  
        retryOperation = await Promise.all(
          retryList.map(async (item) => {
            return removeItem(item)
          })
        )
  
        return operationRetry(retryOperation)
      }
  
      return true
    }
  
    function addResponsesSuccessfulUpdates(
      updateResponseList: UpdateResponse[]
    ): void {
      for (const index in updateResponseList) {
        const updateResponse = updateResponseList[index]
  
        if (updateResponse.error !== 429) {
          responseList.push(updateResponse)
        }
      }
    }
  }