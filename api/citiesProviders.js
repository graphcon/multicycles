import db from './db'
import { reverseGeocode } from './geolocation'
import { allProviders } from './utils'

function flat(arr) {
  return arr.reduce((r, a) => [...r, ...a])
}

function getCities() {
  return db('cities')
    .select('*')
    .select(db.raw('ST_AsGeoJSON(bbox) as geojson'))
}

function getProviders({ lat, lng }, defaultToAll) {
  return db('cities')
    .whereRaw(`ST_Intersects(bbox, ST_Point(${lng}, ${lat}))`)
    .then(
      cities => (cities.length ? [...new Set(flat(cities.map(c => c.providers)))] : defaultToAll ? allProviders : [])
    )
}

function saveProvidersToCity(city, providers) {
  return db('cities')
    .where({
      id: city.id
    })
    .update({
      providers: [...new Set(city.providers.concat(providers))]
    })
}

function updateCity(city) {
  if (!city.providers || !city.providers.length) {
    return Promise.resolve()
  }

  return db('cities')
    .whereRaw(`ST_Intersects(bbox, ST_Point(${city.lng}, ${city.lat}))`)
    .then(cities => {
      if (cities.length) {
        return Promise.all(cities.map(c => saveProvidersToCity(c, city.providers)))
      } else {
        return reverseGeocode({
          lat: city.lat,
          lng: city.lng
        }).then(geocode => {
          if (!geocode.city || !geocode.country || !geocode.bbox) {
            console.error('Can reverse geocode', city, geocode)
            return Promise.resolve()
          }

          return db('cities')
            .insert({
              city: geocode.city,
              country: geocode.country,
              bbox: db.raw(`ST_MakeEnvelope(${geocode.bbox.join(',')})`),
              providers: city.providers
            })
            .catch(err => {
              console.log('err', city, geocode)
            })
        })
      }
    })
}

async function updateCities(cities) {
  for (let index = 0; index < cities.length; index++) {
    await updateCity(cities[index])
  }
}

export { getProviders, updateCities, getCities }
