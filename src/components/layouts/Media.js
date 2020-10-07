import React from 'react'

export default function Media(props) {
  return <div className="single-media-element">
    <div className="single-media-element__wrapper">
      {(props.video) ? <video {...props} preload="none" /> : <img {...props} />}
    </div>
  </div>
}
