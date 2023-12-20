import { IOClients, Sphinx } from '@vtex/api'

import collectionClient from './collectionClient'
import { VtexId } from './vtexId'

export class Clients extends IOClients {
  public get collectionClient() {
    return this.getOrSet('collectionClient', collectionClient)
  }

  public get vtexId() {
    return this.getOrSet('vtexId', VtexId)
  }

  public get sphinx() {
    return this.getOrSet('sphinx', Sphinx)
  }
}
