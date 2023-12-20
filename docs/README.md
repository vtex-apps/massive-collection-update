#  ⚠️ Maintenance ⚠️
*This application is not maintained by VTEX. This was developed as community gift by community members of VTEX. Feel free to use it at your own risk. This APP is a BETA, hence the 0.x version.*

# ---

# MASSIVE COLLECTION UPDATE

This application exposes an endpoint of massive collection updates. To add items or to remove items from subcollections. In order to get the subCollectionId from a Collection, you can refer to this endpoint.
[link](https://developers.vtex.com/docs/api-reference/catalog-api#get-/api/catalog/pvt/collection/-collectionId-/subcollection)

---

```shell
POST https://{{workspace}}--{{accountName}}.myvtex.com/_v/massive/collection/add

POST https://{{workspace}}--{{accountName}}.myvtex.com/_v/massive/collection/remove

```

## Curl

```shell
curl --location --request PUT 'https://{{workspace}}--{{accountName}}.myvtex.com/_v/massive/stock/add' \
--header 'VtexIdClientAutCookie: "" \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "sku": 1,
        "subCollectionId": 1
    }
]'
```

## Specification

### Headers

- Required
  - Accept : application/json
  - Content-Type : application/json; charset=utf-8
  - VtexIdclientAutCookie : `eyJhbGciOi...`
  OR 
  - X-VTEX-API-AppKey : `app key`
  - X-VTEX-API-AppToken : `app token`

### Path params

- Required
  - sku [int32]
  - subCollectionId [int32] || [string]

> Read the API information for more information [link](https://developers.vtex.com/docs/api-reference/catalog-api#post-/api/catalog/pvt/subcollection/-subCollectionId-/stockkeepingunit)

### Request body example

```json
[
  {
    "sku": 12,
    "subCollectionId": 47
  }
]
```

### Success Response body example

```json
{
  "successfulResponses": {
    "elements": [
      {
        "sku": 12,
        "success": true,
        "warehouseId": 47
      }
    ],
    "quantity": 1
  },
  "failedResponses": {
    "elements": [],
    "quantity": 0
  },
  "total": 1
}
```

### Error Response body example

```json
{
  "failedResponses": {
    "elements": [
      [
        {
          "sku": 145,
          "success": "false",
          "error": 400,
          "errorMessage": "The request is invalid: The 'subCollectionId' field is required."
        }
      ]
    ],
    "quantity": 1
  }
}
```

---

## Credentials

### What Header to use?

You can use the following headers:

- X-VTEX-API-AppKey
- X-VTEX-API-AppToken

Or

- VtexIdClientAutCookie

### Create appKey y appToken

To generate app keys in your account, you should follow the instructions seen in the [Application Keys](https://help.vtex.com/en/tutorial/application-keys--2iffYzlvvz4BDMr6WGUtet) article in our Help Center.

### Create role

[Create a role](https://help.vtex.com/en/tutorial/perfiles-de-acceso--7HKK5Uau2H6wxE1rH5oRbc) with the following resources and add your user to that role

- Catalog / Catalog access / Catalog full access

### Convert to JWT

Make a call with the credentials created. The result, if the credentials are valid, will return a token that will be used as the value in the header 'VtexIdclientAutCookie' requested by the massive-stock-update component.

```shell
>>>>>>> 91953ff0fc5154ad45335f9f2a8dbc6141fadf81
curl --location --request POST 'https://vtexid.vtexcommercestable.com.br/api/vtexid/apptoken/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "appkey": "...",
    "apptoken": "..."
}'
```


## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

@Fbenitez97
@Edyespinal

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
