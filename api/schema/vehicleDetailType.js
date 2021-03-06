import { GraphQLString, GraphQLFloat, GraphQLList, GraphQLEnumType, GraphQLInt, GraphQLBoolean } from 'graphql'
import { ProviderType } from './providers'

const VehicleTypeEnumType = new GraphQLEnumType({
  name: 'VehicleType',
  description: 'Kind of vehicle',
  values: {
    BIKE: { description: 'A bike, something with two wheel, a handlebar and a saddle' },
    SCOOTER: { description: 'A scooter, like a bike without saddle. ¯\\_(⊙︿⊙)_/¯' },
    MOTORSCOOTER: { description: 'A motor-scooter' },
    STATION: { description: 'A station of vehicles.' }
  }
})

const VehicleAttributeEnumType = new GraphQLEnumType({
  name: 'VehicleAttribute',
  description: "All vehicle's attributes",
  values: {
    GEARS: { description: 'This vehicle has gears' },
    ELECTRIC: { description: 'This vehicle is electric' },
    CHILD_SEAT: { description: 'This vehicle has a child seat' },
    CARGO: { description: 'This vehicle can handle heavy loads. Can have 3 wheels' },
    TANDEM: { description: "Bike for 2 or 3 peoples. Because it's funnier" }
  }
})

const vehicleInterfaceType = {
  id: { description: 'The provider id', type: GraphQLString },
  lat: { description: "The vehicle's latitude", type: GraphQLFloat },
  lng: { description: "The vehicle's longitude", type: GraphQLFloat },
  type: { description: "The object's type", type: VehicleTypeEnumType },
  attributes: { description: "The vehicle's attributes", type: new GraphQLList(VehicleAttributeEnumType) },
  provider: { type: ProviderType }
}

const stationInterfaceType = {
  available_vehicles: {
    deprecationReason: 'Use camelCase instead',
    description: 'Number of available vehicles',
    type: GraphQLInt
  },
  availableVehicles: { description: 'Number of available vehicles', type: GraphQLInt },
  available_stands: {
    deprecationReason: 'Use camelCase instead',
    description: 'Number of available free stands',
    type: GraphQLInt
  },
  availableStands: {
    description: 'Number of available free stands',
    type: GraphQLInt
  },
  total_stands: { deprecationReason: 'Use camelCase instead', description: 'Total of stands', type: GraphQLInt },
  totalStands: { description: 'Total of stands', type: GraphQLInt },
  isVirtual: {
    description:
      'Virtual station are not specific stand for this provider. Could be a simple bikes stand or just a zone',
    type: GraphQLBoolean
  },
  virtualRadius: { description: 'Radius of the virtual station. In meters.', type: GraphQLInt }
}

export { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType, stationInterfaceType }
