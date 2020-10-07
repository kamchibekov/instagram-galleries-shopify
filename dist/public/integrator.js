(($) => {
  const galleryContainer = $('.nomad-developers__gallery-media')

  if (!galleryContainer) return

  const galleryId = galleryContainer.data('gallery_id')

  if (!galleryId) return

  $(galleryContainer).html(`Loading...`)

  $.post('/apps/nomad/graphql', {
    query: ` query {
        get_medias(gallery_id: "${galleryId}") {
            media_type,
            media_url,
            caption,
            owner_id,
            permalink,
            shortcode,
            username,
            thumbnail_url,
            children {
                media_type,
                media_url,
                permalink
              }
        }
    }` }, (response) => {
    let content = ''
    response.data.get_medias.forEach((media) => {
      if (media.media_type === 'VIDEO') {
        content += `<video controls src ="${media.media_url}" preload="none"></video>`
      } else {
        content += `<img src="${media.media_url}">`
      }
    })
    $(galleryContainer).html(content)
  })
  // eslint-disable-next-line no-undef
})($)
