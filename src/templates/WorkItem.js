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
  slug,
  header,
  title,
  date,
  price,
  body,
  nextPostURL,
  prevPostURL,
  category,
  gallery,
  contact
}) => {
  const [popupOpen, setPopupOpen] = useState(true)
  console.log(slug)
  return (
    <main>
      <PageHeader
        large
        title={title}
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
                  date={date}
                >
                  {date}
                </time>
              )}
              {category && (
                <Fragment>
                  <span>|</span>
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
          (header ? header.backgroundImage : false) ||
          'https://ucarecdn.com/dad549d6-6efd-4ed0-98fb-cbecec73f43b/'
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
              <Content source={body} />
            </div>

            <Gallery images={gallery} />

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
        {popup && (
          <Popup open={popupOpen} setOpen={setPopupOpen}>
            <h3>Bestellen</h3>
            Ben je geintresseerd in <Link to={slug}>{title}</Link> en wil je een
            bestelling plaatsen? Laat dan hieronder jouw gegevens achter en ik
            neem zo snel mogelijk contact met je op. <br />
            Direct contact? Bel mij op:{' '}
            <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            <WorkForm />
          </Popup>
        )}
      </article>
    </main>
  )
}

// Export Default WorkItem for front-end
const WorkItem = ({ data: { post, allPosts, workPage, contact } }) => {
  const thisEdge = allPosts.edges.find(edge => edge.node.id === post.id)
  console.log(post)
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
        contact={get(contact, 'nodes[0].frontmatter')}
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
        date(formatString: "MMMM Do, YYYY")
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
      filter: { fields: { contentType: { eq: "work" } } }
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

    contact: allMarkdownRemark(
      filter: { fields: { slug: { eq: "/contact/" } } }
    ) {
      nodes {
        frontmatter {
          phone
        }
      }
    }
  }
`
