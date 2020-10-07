export default {
  shop: {
    name: 'Shop name',
    url: 'shop url',
  },
  themes: [],
  connectedAccounts: [],
  gallery: null,
  galleries: [],
  layout: {
    default: 'grid',
    tabs: [
      {
        id: 'tad-grid',
        type: 'grid',
        content: 'Grid',
        body: '',
        panelID: 'all-customers-content',
      },
      {
        id: 'tab-slide',
        type: 'slide',
        content: 'Slide',
        body: '',
        panelID: 'accepts-marketing-content',
      },
      {
        id: 'tab-masonry',
        type: 'masonry',
        content: 'Masonry',
        body: '',
        panelID: 'accepts-marketing-content',
      },
    ],
  },
  layoutTools: {
    grid: {
      columns_count: 5,
      rows_count: 2,
      column_gap: 4,
      row_gap: 4,
    },
    slide: {
      columns_count: 5,
    },
    masonry: {
      mainImagePosition: 'right',
      rows_count: 2,
    },
  },
  edges: {},
}
