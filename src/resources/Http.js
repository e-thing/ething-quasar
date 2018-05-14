
import FormSchemaScope from '../plugins/formSchema/FormSchemaScope'
import EThing from 'ething-js'

export default {

  properties: {

    auth: {
      description: 'http authentication'
    },

    scope: {
      type: 'string',
      format: 'scope'
    },

    specification: {
      description: 'JSON Swagger specification. The specification object define all the available HTTP requests this device accepts.',
      type: 'json',
      required: true,
      get (resource) {
        return EThing.Device.Http.getSpecification(resource)
      },
      default: {
        "swagger": "2.0",
				"info": {
					"version": "unversioned",
					"title": "untitled"
				},
				"paths": {
					"/example": {
						"get": {
							"description": "An example of a GET request that returns plain text.",
							"produces": [
								"text/plain"
							],
							"responses": {
								"200": {
									"description": "200 response",
									"schema": {
										"type": "string"
									}
								},
								"400": {
									"description": "error"
								}
							}
						}
					}
				}
      }
    }
  }

}
