import { JanusClient } from '@vtex/api'
import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'


export default class collectionClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        VtexIdClientAutCookie: context.authToken
          },
    })
  }



  // eslint-disable-next-line max-params
  public async addItem(
    subCollectionId?: number | string,
    body?: any
  ): Promise<IOResponse<string>> {

    const url = `http://${this.context.account}.vtexcommercestable.com.br/api/catalog/pvt/subcollection/${subCollectionId}/stockkeepingunit`

    return this.http.post(url, body)
  }

  public async removeItem(
    subCollectionId?: number | string,
    skuId?: number | string,
  ): Promise<IOResponse<string>> {
    const url = `http://${this.context.account}.vtexcommercestable.com.br/api/catalog/pvt/subcollection/${subCollectionId}/stockkeepingunit/${skuId}`

    return this.http.delete(url)
  }
}
