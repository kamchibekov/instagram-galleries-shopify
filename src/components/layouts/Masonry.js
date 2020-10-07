import React from 'react'
import Media from './Media'
import { getMediaSrc } from './Grid'

export default function Masonry(props) {
  return <div className="masonry-layout-component">
    <div className="masonry-layout-component-wrapper">
      {props.edges.map((edge, i) =>
        <Media
          video={edge.media_type === 'VIDEO'}
          poster={edge.thumbnail_url}
          key={i}
          media_type={edge.media_type}
          permalink={edge.permalink}
          src={getMediaSrc(edge)}
          alt={edge.caption}
        />,
      )}
    </div>
  </div>
}
