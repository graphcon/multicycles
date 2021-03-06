import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { {{ properCase provider}}, client, mapVehicles } from '../controllers/providers/{{ totalyLower provider}}'

const {{ properCase provider}}FieldsType = new GraphQLObjectType({
  name: '{{ properCase provider}}Fields',
  description: 'Specific fields for {{ properCase provider}}',
  fields: {

  }
})

const {{ properCase provider}}Type = new GraphQLObjectType({
  name: '{{ properCase provider}}',
  description: 'A {{ properCase provider}} vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    {{ totalyLower provider}}FieldsType: { type: {{ properCase provider}}FieldsType },
    // @TODO Add custom types
  }
})

const {{ totalyLower provider}} = {
  type: new GraphQLList({{ properCase provider}}Type),
  description: 'Get {{ properCase provider}} vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, {{ properCase provider}}, client, mapVehicles)
  }
}

const provider = {{ properCase provider}}.getProviderDetails()

export { {{ properCase provider}}Type, {{ totalyLower provider}}, provider }
