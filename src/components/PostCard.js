import React from 'react'
import { Link } from 'gatsby'

import Image from './Image'
import './PostCard.css'

const PostCard = ({
  title,
  slug,
  category,
  className = '',
  gallery,
  excerpt
}) => {
  return (
    <Link to={slug} className={`PostCard ${className}`}>
      {gallery && (
        <div className="PostCard--Image relative">
          <Image background src={gallery[0].image} alt={gallery[0].alt} />
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
