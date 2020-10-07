import initialState from './state'

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CHECK_AUTH':
      return { ...state, shop: action.value }

    case 'LAYOUT_CHANGE':
      return { ...state, layout: { ...state.layout, default: action.value } }

    case 'TOOLS_CHANGE':
      return { ...state, layoutTools: action.value }

    case 'ADD_INSTAGRAM_KEYWORD':
      return { ...state, instagramKeywords: [...state.instagramKeywords, action.value] }

    case 'CREATE_NEW_GALLERY':
      return { ...state, gallery: action.value }

    case 'GET_GALLERIES':
      return { ...state, galleries: action.value }

    case 'GET_MEDIAS':
      return { ...state, edges: action.value }

    case 'CONNECTED_ACCOUNT':
      return { ...state, connectedAccounts: action.value }

    case 'GET_THEMES':
      return { ...state, themes: action.value }

    default:
      return state
  }
}
