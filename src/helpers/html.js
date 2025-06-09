export const parseFlatDetails = (html, tabName, cheerio) => {
  const $ = cheerio.load(html)
  const flats = []

  // get search count
  let searchCount = 0
  const segments = html.split(`${tabName} <!-- -->`)
  const sequence = segments[1]?.slice(0, 2) || '0'
  try {
    searchCount = parseInt(sequence)
  } catch {
    searchCount = parseInt(sequence[0])
  }

  console.log(`searchCount: ${searchCount}`)

  let index = 0
  $('div[class^="Content_content"]').each((i, el) => {
    if (index < searchCount) {
      const content = $(el)

      // Closest <a> wrapper for href
      const wrapper = content.closest('a')
      const href = wrapper.attr('href') || null

      // Address & location
      const address = content
        .find('.NestTitle_nestTitle__D7O_9 .Header_truncate__ebq7a')
        .text()
        .trim()
      const location = content
        .find('[data-testid="location-parsed-text"] span')
        .text()
        .trim()

      // Primary attributes
      const price = content
        .find('.ForSaleAttributes_askingPrice__ANshd')
        .text()
        .trim()
      const area = content
        .find(
          '.ForSaleAttributes_primaryAttributesContainer__658nL .hcl-flex--item:nth-child(2) span'
        )
        .text()
        .trim()
      const rooms = content
        .find(
          '.ForSaleAttributes_primaryAttributesContainer__658nL .hcl-flex--item:nth-child(3) span'
        )
        .text()
        .trim()
      const floor = content
        .find(
          '.ForSaleAttributes_primaryAttributesContainer__658nL .hcl-flex--item:nth-child(4) span'
        )
        .text()
        .trim()

      // Secondary attributes
      const monthlyCost = content
        .find(
          '.ForSaleAttributes_secondaryAttributesContainer__NdWZQ .hcl-flex--item:nth-child(1) span'
        )
        .text()
        .trim()

      // Description
      const description = content
        .find('.Description_descriptionContainer__Koh0A p')
        .text()
        .trim()

      // 🔍 Image src from sibling div, must start with 'https://bilder.hemnet.se/images'
      let image = null
      let swiper = content.parent().find('.swiper')

      const regex =
        /src="(https:\/\/bilder\.hemnet\.se\/images\/itemgallery_cut\/[^"]+)"/
      const match = swiper.text().match(regex)

      let hasSticky = false
      let stickyMessage = ''
      let segments = swiper.text().split('\>')
      let lastText = segments[segments.length - 1]
      if (lastText.length > 1) {
        hasSticky = true
        stickyMessage = lastText
      }

      if (match) {
        image = match[1]
      } else {
        console.log(`${address.split(',')[0]} NO IMAGE`)
      }

      flats.push({
        href: `https://hemnet.se${href}`,
        address: address.split(',')[0],
        location,
        price,
        area,
        rooms,
        floor,
        monthlyCost,
        description,
        image,
        hasSticky,
        stickyMessage,
      })
    }
    index++
  })

  return flats
}

export const getGalleryItemHtml = (apartment) => {
  let {
    href,
    address,
    location,
    price,
    area,
    rooms,
    floor,
    monthlyCost,
    description,
    image,
    walkTime,
    hasError,
    errorMessage,
    hasSticky,
    stickyMessage,
  } = apartment
  let imageSrc =
    image ||
    'https://sobharealty.com/sites/default/files/styles/webp/public/2024-08/1440x726_6.jpg.webp?itok=il-yFdNM'
  return `<a href="${href}" class="gallery-item">
      <div class="image-wrapper">
        <img src="${imageSrc}" alt="House 2">
        ${hasSticky ? `<div class="sticky-note">📅 ${stickyMessage}</div>` : ''}
      </div>
      <div class="item-details">
        <div class="street">${address}</div>
        <div class="location">${location}</div>
        <div class="info">${price} SEK - ${area} m² - ${rooms} - ${floor}</div>
        <div class="fee">${monthlyCost}</div>
        <div class="distance">${walkTime} minuter till tunnelbana</div>
        ${hasError ? `<div class="error">${errorMessage}</div>` : ''}
        <div class="description">${description}</div>
      </div>
    </a>`
}
