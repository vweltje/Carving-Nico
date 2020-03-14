import React from 'react'
import { Link } from 'gatsby'

import Image from './Image'
import './PostCard.css'

const PostCard = ({
  title,
  slug,
  category,
  className = '',
  images,
  excerpt
}) => {
  console.log(images)
  return (
    <Link to={slug} className={`PostCard ${className}`}>
      {images && (
        <div className="PostCard--Image relative">
          <Image background src={images[0].image} alt={images[0].description} />
        </div>
      )}
      <div className="PostCard--Content">
        {title && <h3 className="PostCard--Title">{title}</h3>}
        <div className="PostCard--Category">{category}</div>
        {excerpt && <div className="PostCard--Excerpt">{excerpt}</div>}
      </div>
    </Link>
  )
}

export default PostCard
