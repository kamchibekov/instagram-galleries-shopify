import React from 'react'
import Media from './Media'

export function getMediaSrc(edge) {
  switch (edge.media_type) {
    case 'CAROUSEL_ALBUM':
      if (edge.children.length) {
        return edge.children[0].media_url
      }
      return null
    default:
      return edge.media_url
  }
}

export default function Grid(props) {
  const edges = props.edges ? props.edges.map((edge, i) => {
    if (i < (props.grid.columns_count * props.grid.rows_count)) {
      return <Media
        video={edge.media_type === 'VIDEO'}
        poster={edge.thumbnail_url}
        key={i}
        media_type={edge.media_type}
        permalink={edge.permalink}
        src={getMediaSrc(edge)}
        alt={edge.caption}
      />
    }
  }) : ''

  const styles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.grid.columns_count}, 1fr)`,
    gridTemplateRows: `repeat(${props.grid.rows_count}, 1fr)`,
    gridGap: `${props.grid.row_gap}px ${props.grid.column_gap}px`,
  }

  return <div className="grid-layout-component">
    <div className="grid-layout-component-wrapper"
      style={styles}>
      {edges}
    </div>
  </div>
}
