'use strict'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@shopify/polaris'
import { useHistory, useRouteMatch, useParams } from 'react-router-dom'
import { getMedias, deleteGallery } from '../redux/actions'
import Grid from './layouts/Grid'
import Slide from './layouts/Slide'
import Masonry from './layouts/Masonry'

export function GalleriesList(props) {
  const history = useHistory()
  const { url } = useRouteMatch()
  const dispatch = useDispatch()

  return <Card sectioned title="Galleries"
    actions={[
      {
        content: 'New gallery',
        onAction: () => history.push('/new-gallery'),
      },
    ]}
  >
    {props.galleries.map((gallery, i) => <Card.Section
      key={i}
      title={gallery.title}
      actions={[
        {
          content: 'Delete',
          destructive: true,
          onAction: () => dispatch(deleteGallery(gallery._id)),
        },
        {
          content: 'Edit',
          onAction: () => history.push(`${url}/gallery/${gallery._id}`),
        },
      ]}
    >
    </Card.Section>,
    )}

  </Card>
}

export function Gallery() {
  const dispatch = useDispatch()
  const { gallery_id } = useParams()

  useEffect(() => {
    dispatch(getMedias(gallery_id))
  }, [])

  const { gallery, layout, layoutTools, edges } = useSelector((state) => state)

  const media = edges[gallery_id]

  let content = <Grid grid={layoutTools.grid} edges={media} />

  if (layout === 'slide') {
    content = <Slide slide={layoutTools.slide} edges={media} />
  } else if (layout === 'masonry') {
    content = <Masonry masonry={layoutTools.masonry} edges={media} />
  }

  return <div className="container page-width">
    <div className={layout + ' layout'}>
      <h2 className="gallery--info-title title">
        {gallery ? gallery.title : ''}
      </h2>
      <div className="gallery--media">
        {content}
      </div>
    </div>
  </div>
}
