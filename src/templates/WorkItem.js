import React, { Fragment, useState } from 'react'
import get from 'lodash/get'
import { Link, graphql } from 'gatsby'
import { ChevronLeft } from 'react-feather'
import { ChevronRight } from 'react-feather'

import PageHeader from '../components/PageHeader'
import Content from '../components/Content'
import Layout from '../components/Layout'
import Gallery from '../components/Gallery'
import Popup from '../components/Popup'
import WorkForm from '../components/WorkForm'
import './WorkItem.css'

export const WorkItemTemplate = ({
  header,
  title,
  date,
  price,
  body,
  nextPostURL,
  prevPostURL,
  category,
  gallery,
  popup
}) => {
  const [popupOpen, setPopupOpen] = useState(false)
  const dateObject = date ? new Date(date) : false
  const dateString = dateObject
    ? `${dateObject.getDate()}-${dateObject.getMonth()}-${dateObject.getFullYear()}`
    : ''
  return (
    <main>
      <PageHeader
        large
        title={title || ''}
        buttons={[
          {
            type: 'primary',
            action: () => {
              setPopupOpen(true)
            },
            text: 'Bestellen'
          }
        ]}
        smallContent={
          <div className="WorkItem--Meta">
            <p>
              {date && (
                <time
                  className="WorkItem--Meta--Date"
                  itemProp="dateCreated pubdate datePublished"
                  date={dateString}
                >
                  {dateString}
                </time>
              )}
              {category && (
                <Fragment>
                  <span> | </span>
                  {category && (
                    <span key={category} className="WorkItem--Meta--Category">
                      {category}
                    </span>
                  )}
                </Fragment>
              )}
              {!!price && <span className="workItem--MetaPrice">{price}</span>}
            </p>
          </div>
        }
        backgroundImage={
          get(header, 'backgroundImage') ||
          'https://ucarecdn.com/6242ca40-21bc-4182-a275-d39962cdc7e6/'
        }
      />
      <article
        className="WorkItem section light"
        itemScope
        itemType="http://schema.org/BlogPosting"
      >
        <div className="container skinny">
          <Link className="WorkItem--BackButton" to="/mijn-werk/">
            <ChevronLeft /> Terug naar het overzicht
          </Link>
          <div className="WorkItem--Content relative">
            <div className="WorkItem--InnerContent">
              <Content source={body || ''} />
            </div>

            {gallery && <Gallery images={gallery} />}

            {(prevPostURL || nextPostURL) && (
              <div className="WorkItem--Pagination">
                {prevPostURL && (
                  <Link
                    className="WorkItem--Pagination--Link prev"
                    to={prevPostURL}
                  >
                    <ChevronLeft /> Vorige
                  </Link>
                )}
                {nextPostURL && (
                  <Link
                    className="WorkItem--Pagination--Link next"
                    to={nextPostURL}
                  >
                    Volgende <ChevronRight />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        {get(popup, 'html') && (
          <Popup open={popupOpen} setOpen={setPopupOpen}>
            <Content
              source={popup.html || ''}
              customReplaceSelectors={{
                project: <Link to="mijn-werk">{title || ''}</Link>
              }}
            />
            <WorkForm workItemName={title || ''} />
          </Popup>
        )}
      </article>
    </main>
  )
}

// Export Default WorkItem for front-end
const WorkItem = ({ data: { post, allPosts, workPage, popup } }) => {
  const thisEdge = allPosts.edges.find(edge => edge.node.id === post.id)
  return (
    <Layout
      meta={post.frontmatter.meta || false}
      title={post.frontmatter.title || false}
    >
      <WorkItemTemplate
        {...post}
        {...post.frontmatter}
        {...post.fields}
        header={workPage.nodes[0].frontmatter.header}
        body={post.html}
        nextPostURL={get(thisEdge, 'next.fields.slug')}
        prevPostURL={get(thisEdge, 'previous.fields.slug')}
        popup={get(popup, 'edges[0].node')}
      />
    </Layout>
  )
}

export default WorkItem

export const pageQuery = graphql`
  ## Query for WorkItem data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query WorkItem($id: String!) {
    post: markdownRemark(id: { eq: $id }) {
      ...Meta
      ...Gallery
      html
      id
      fields {
        slug
      }
      frontmatter {
        slug
        title
        template
        date
        price
        category
      }
    }

    workPage: allMarkdownRemark(
      filter: { fields: { slug: { eq: "/mijn-werk/" } } }
    ) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          header {
            backgroundImage
            title
            introText
            subtitle
          }
        }
      }
    }

    allPosts: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "werk" } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
        }
        next {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
        previous {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }

    popup: allMarkdownRemark(
      filter: {
        fields: { contentType: { eq: "popups" }, slug: {} }
        fileAbsolutePath: { regex: "/(popups)/(bestellen)\\\\.md$/" }
      }
    ) {
      edges {
        node {
          html
        }
      }
    }
  }
`
