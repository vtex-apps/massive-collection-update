import { AuthenticationError, UserInputError } from '@vtex/api'
import { json } from 'co-body'

export async function auth(ctx: Context, next: () => Promise<void>) {
  const {
    header,
    clients: { vtexId, sphinx },
    state,
  } = ctx

  const appkey = header['x-vtex-api-appkey'] as string | undefined
  const apptoken = header['x-vtex-api-apptoken'] as string | undefined
  const authCookie = header.vtexidclientautcookie as string | undefined

  const requestList = await json(ctx.req)
  const errorList: any[] = []

  function requestValidator(request: UpdateRequest): void {
    const requestErrorList: UpdateResponse[] = []

    const {
      sku,
      subCollectionId
    } = request

    if (typeof sku !== 'number') {
      requestErrorList.push(errorResponseGenerator('sku'))
    }

    if (typeof subCollectionId !== 'string' && typeof subCollectionId !== 'number') {
      requestErrorList.push(errorResponseGenerator('subCollectionId'))
    }

    if (requestErrorList.length >= 1) {
      errorList.push(requestErrorList)
    }

    function errorResponseGenerator(field: string): UpdateResponse {
      return {
        sku,
        subCollectionId,
        success: 'false',
        error: 400,
        errorMessage: `The request is invalid: The '${field}' field is required.`,
      }
    }
  }

  try {
    for (const request of requestList) {
      requestValidator(request)
    }
  } catch (error) {
    throw new UserInputError(error)
  }

  if (errorList.length >= 1) {
    ctx.status = 400
    ctx.body = {
      failedResponses: {
        elements: errorList,
        quantity: errorList.length,
      },
    }

    return
  }

  ctx.state.validatedBody = requestList

  if (authCookie) {
    const authenticatedUser = await vtexId.getAuthenticatedUser(authCookie)

    // When the auth cookie is invalid, the API returns null
    if (authenticatedUser) {
      const isAdmin = await sphinx.isAdmin(authenticatedUser.user)

      const { user, userId } = authenticatedUser

      state.userProfile = {
        userId,
        email: user,
        role: isAdmin ? 'admin' : 'store-user',
      }

      if (isAdmin) {
        ctx.vtex.adminUserAuthToken = authCookie
      }
    }
  }

  if (appkey && apptoken) {
    // If appkey and apptoken are not valid, the method throws a 401 error
    const { token } = await vtexId.login({ appkey, apptoken })

    state.appkey = appkey
    ctx.vtex.adminUserAuthToken = token
  }

  const { userProfile, appkey: appKeyState } = state

  // Either userProfile or appKeyState must be on state to continue
  if (!userProfile && !appKeyState) {
    throw new AuthenticationError('Request failed with status code 401')
  }
  await next()
}