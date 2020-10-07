import axios from 'axios'

export const checkAuth = () => async (dispatch) => {
  if (window.SHOP) {
    dispatch({
      type: 'CHECK_AUTH',
      value: window.SHOP,
    })
  }
}

export const install = async (shop) => {
  const response = await axios.get(`/shopify/install?shop=${shop}`)
  location = response.data.url
}

export const createNewGallery = (gallery, history) => async (dispatch) => {
  const response = await axios.post('/graphql', {
    query: `query createNewGallery($title: String, $description: String, $instagramAccounts: [String], $hashtags: [String]){
            create_new_gallery(title: $title, description: $description, instagramAccounts: $instagramAccounts, hashtags: $hashtags ) {
                _id,
                title,
                description,
                instagramAccounts,
                hashtags
            }
        }`,
    variables: gallery,

  })

  dispatch({
    type: 'CREATE_NEW_GALLERY',
    value: response.data.data.create_new_gallery,
  })

  history.push('/dashboard')
}

export const getGalleries = () => async (dispatch) => {
  const response = await axios.post('/graphql', {
    query: `{
            get_galleries {
                _id,
                title,
                description,
                instagramAccounts,
                hashtags,
                shop_id,
                status
              }
        }`,
  })

  dispatch({
    type: 'GET_GALLERIES',
    value: response.data.data.get_galleries,
  })
}

export const getMedias = (gallery_id) => async (dispatch, getState) => {
  const response = await axios.post('/graphql', {
    query: `{
            get_medias(gallery_id: '"${gallery_id}"') {
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
        }`,
  })

  if (response.data.data.get_medias) {
    const newEdges = getState().edges || {}
    newEdges[gallery_id] = response.data.data.get_medias
    dispatch({
      type: 'GET_MEDIAS',
      value: newEdges,
    })
  }
}

export const getConnectedAccounts = () => async (dispatch) => {
  const response = await axios.post('/graphql', {
    query: `{
            get_connected_accounts {
                _id,
                ig_id,
                name,
                username,
                profile_picture_url
            }
        }`,
  })

  if (response.data.data.get_connected_accounts) {
    dispatch({
      type: 'CONNECTED_ACCOUNT',
      value: response.data.data.get_connected_accounts,
    })
  }
}

export const getThemes = () => async (dispatch) => {
  const response = await axios.post('/graphql', {
    query: `{
            get_themes {
             id,
             name,
             role,
             theme_store_id
           }
        }`,
  })

  if (response.data.data.get_themes) {
    dispatch({
      type: 'GET_THEMES',
      value: response.data.data.get_themes,
    })
  }
}

export const getSections = async (theme_id) => {
  const response = await axios.post('/graphql', {
    query: `{
            get_sections(theme_id: "${theme_id}")
        }`,
  })
  return response.data.data.get_sections
}

export const integrate = async (theme_id, section) => {
  const response = await axios.post('/graphql', {
    query: `{
            integrate(theme_id: "${theme_id}", section: "${section}")
        }`,
  })
  return response.data.data.integrate
}

// @todo use redux on delete
export const deleteGallery = (gallery_id) => async (dispatch) => {
  const response = await axios.post('/graphql', {
    query: `{
            delete_gallery(gallery_id: '"${gallery_id}'")
        }`,
  })
  return response.data.data.integrate
}
