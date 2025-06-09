import { resRobotApiKey } from "./.config.js"

export const maxWalkTime = 15
export const maxMonthlyFee = 7000
export const excludedLocations = ['Hallonbergen']

export const resRobotExtIdTCentral = '740020749'

export const openStreetMapCoordinatesUrl =
  'https://nominatim.openstreetmap.org/search?q=__STREET_ADDRESS__&format=json'

export const resRobotTripUrl = `https://api.resrobot.se/v2.1/trip?originCoordLat=__CORD_LAT__&originCoordLong=__CORD_LONG__&destId=${resRobotExtIdTCentral}&date=__YYYY-MM-DD__&time=08%3A00&searchForArrival=0&viaWaitTime=0&numB=0&numF=5&maxChange=1&changeTimePercent=100&products=112&poly=0&passlist=0&unsharp=0&lang=sv&format=json&requestId=abc&accessId=${resRobotApiKey}`

export const hemnetForSaleUrl =
  'https://www.hemnet.se/bostader?balcony=1&deactivated_before_open_house_day=0&floor=exclude_bottom&price_max=2500000&rooms_max=3&rooms_min=3&location_ids%5B%5D=925962&location_ids%5B%5D=473374&location_ids%5B%5D=941046&location_ids%5B%5D=473360&location_ids%5B%5D=18042&location_ids%5B%5D=18028&location_ids%5B%5D=473440&location_ids%5B%5D=925971'
export const hemnetUpcomingUrl =
  'https://www.hemnet.se/kommande/bostader?balcony=1&deactivated_before_open_house_day=0&floor=exclude_bottom&price_max=2500000&rooms_max=3&rooms_min=3&location_ids%5B%5D=925962&location_ids%5B%5D=473374&location_ids%5B%5D=941046&location_ids%5B%5D=473360&location_ids%5B%5D=18042&location_ids%5B%5D=18028&location_ids%5B%5D=473440&location_ids%5B%5D=925971'

export const hemnetPages = [
  {
    url: hemnetForSaleUrl,
    tabName: 'Till salu',
  },
  {
    url: hemnetUpcomingUrl,
    tabName: 'Kommande',
  },
]