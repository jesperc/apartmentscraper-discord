const axios = require('axios')
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cheerio = require('cheerio')

const {
  getNextMondayAsDateString,
  loadDb,
  saveDb,
  getItemFromDb,
  loadHtml,
  saveHtml,
} = require('./helpers/helpers')
const { parseFlatDetails, getGalleryItemHtml } = require('./helpers/html')
const {
  hemnetForSaleUrl,
  resRobotTripUrl,
  openStreetMapCoordinatesUrl,
  maxMonthlyFee,
  maxWalkTime,
  excludedLocations,
  hemnetPages,
} = require('./constants')
const { fetchHemnetData } = require('./puppeteer')
const { sortApartments } = require('./helpers/sorting')
const { log } = require('./helpers/logger')
const { getLogFilePath } = require('./helpers/helpers')

let loggerFilePath = ''

const main = async () => {
  loggerFilePath = getLogFilePath()
  fs.writeFileSync(loggerFilePath, "")
  log('reading db', loggerFilePath, fs)
  let db = loadDb(fs)

  let result = []
  for (let page of hemnetPages) {
    log(`reading html from hemnet: ${page.url}`, loggerFilePath, fs)
    const html = await fetchHemnetData(page.url, puppeteer, StealthPlugin)
    // const html = fs
    //     .readFileSync("../docs/hemnet-html-example2.html")
    //     .toString("utf8")

    log('parsing html', loggerFilePath, fs)
    const apartments = parseFlatDetails(html, page.tabName, cheerio)
    if (apartments.length <= 0) {
      throw 'NO APARTMENTS FOUND - HTML ISSUES PROLLY'
    }

    log(`found (${apartments.length}) apartments`, loggerFilePath, fs)
    for (let apartment of apartments) {
      let location = apartment.location.replace('Centrum', '')
      const key = apartment.address + ',' + location
      let existingItem = getItemFromDb(db, key)
      if (existingItem != null) {
        log(`${apartment.address}: already exists`, loggerFilePath, fs)
        existingItem = { ...existingItem, ...apartment }
        result.push(existingItem)
        continue
      }

      log(`${apartment.address}: new entry`, loggerFilePath, fs)
      let hasError = false

      // find longitude and latitude by address
      let lat = ''
      let long = ''
      let url = openStreetMapCoordinatesUrl.replace('__STREET_ADDRESS__', key)
      log(`${apartment.address}: coordinatesUrl=${url}`, loggerFilePath, fs)
      let response = await axios.get(url)
      if (response.data.length > 0) {
        lat = response.data[0].lat
        long = response.data[0].lon
      }
      log(`${apartment.address}: lat=${lat}`, loggerFilePath, fs)
      log(`${apartment.address}: long=${long}`, loggerFilePath, fs)

      // get trip by coordinates
      const date = getNextMondayAsDateString()
      let walkTime = ''
      let errorMessage = ''
      try {
        url = resRobotTripUrl
          .replace('__CORD_LAT__', lat)
          .replace('__CORD_LONG__', long)
          .replace('__YYYY-MM-DD__', date)
        log(`${apartment.address}: tripUrl=${url}`, loggerFilePath, fs)
        response = await axios.get(url)
        if (response.data.Trip.length > 0) {
          walkTime = response.data.Trip[0].LegList.Leg[0].GisRoute.durS
            .replace('PT', '')
            .replace('M', '')
        }
      } catch (error) {
        let errorText = error?.response?.statusText || 'UNKNOWN ERROR'
        errorText = error?.response?.data?.errorText || errorText
        errorMessage = errorText
        hasError = true
        walkTime = '999'
      }
      log(`${apartment.address}: walkTime=${walkTime}`, loggerFilePath, fs)

      result.push({
        ...apartment,
        key,
        lat,
        long,
        walkTime,
        hasError,
        errorMessage,
      })
    }
  }

  log('sorting apartments', loggerFilePath, fs)
  result = sortApartments(result)

  log('saving to db', loggerFilePath, fs)
  saveDb(result, fs)

  log(`total apartments: ${result.length}`, loggerFilePath, fs)
  let filter = true
  let before = result.length
  if (filter) {
    result = result.filter(
      (x) =>
        parseInt(x.monthlyCost.split('kr')[0].replace(/\s+/g, '')) <=
          maxMonthlyFee &&
        parseInt(x.walkTime) <= maxWalkTime &&
        !excludedLocations.some((area) => x.location.includes(area))
    )
  }
  log(`filtered out (${before - result.length}) apartment(s)`, loggerFilePath, fs)

  log('update html', loggerFilePath, fs)
  let page = loadHtml(fs)

  let galleryItemHtml = ''
  for (let item of result) {
    galleryItemHtml += getGalleryItemHtml(item)
  }
  page = page
    .replace('__GALLERY_ITEM__', galleryItemHtml)
    .replace('__HEMNET_FILTER_URL__', hemnetForSaleUrl)

  log('saving html', loggerFilePath, fs)
  saveHtml(page, fs)
}

main()
  .then(() => log('done!', loggerFilePath, fs))
  .catch((error) => log(error, loggerFilePath, fs))
