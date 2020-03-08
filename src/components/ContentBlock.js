import React from 'react'
import PropTypes from 'prop-types'
import Image from './Image'
import Content from '../components/Content'
import { Link } from 'gatsby'

import './ContentBlock.css'

const ContentBlockContent = ({ title, content, button }) => (
  <div className="ContentBlock--Content">
    <h2>{title}</h2>
    <Content source={content} />
    {button && (
      <Link className={`Button ${`Button-${button.type}`}`} to={button.to}>
        {button.text}
      </Link>
    )}
  </div>
)

const ContentBlockImage = ({ src, alt }) => (
  <div className="ContentBlock--Image">
    <div className="ContentBlock--ImageWrapper">
      <Image background resolutions="large" src={src} alt={alt} size="cover" />
    </div>
  </div>
)

const ContentBlock = ({ order, title, tekst, button, image }) => {
  return (
    <div className={`ContentBlock ${`ContentBlock-${order}`} container`}>
      {order === 'contentFirst' ? (
        <>
          <ContentBlockContent title={title} content={tekst} button={button} />
          <ContentBlockImage src={image} alt={title} />
        </>
      ) : (
        <>
          <ContentBlockImage src={image} alt={title} />
          <ContentBlockContent title={title} content={tekst} button={button} />
        </>
      )}
    </div>
  )
}

ContentBlock.propTypes = {
  order: PropTypes.oneOf(['contentFirst', 'imageFirst']),
  title: PropTypes.string,
  text: PropTypes.string,
  image: PropTypes.string,
  button: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.oneOf(['primary', 'secondary']),
    to: PropTypes.string
  })
}

ContentBlock.defaultProps = {
  order: 'contentFirst'
}

export default ContentBlock
