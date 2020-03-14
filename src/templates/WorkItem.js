import React, { Fragment } from 'react'
import _get from 'lodash/get'
import kebabCase from 'lodash/kebabCase'
import { Link, graphql } from 'gatsby'
import { ChevronLeft } from 'react-feather'

import PageHeader from '../components/PageHeader'
import Content from '../components/Content'
import Layout from '../components/Layout'
import Gallery from '../components/Gallery'
import './WorkItem.css'

export const WorkItemTemplate = ({
  slug,
  header,
  title,
  date,
  body,
  nextPostURL,
  prevPostURL,
  category,
  gallery
}) => {
  console.log()
  return (
    <main>
      <PageHeader
        large
        title={title}
        buttons={[
          {
            type: 'primary',
            to: `/contact?project=${kebabCase(title)}`,
            text: 'Bestellen'
          }
        ]}
        smallContent={
          <div className="WorkItem--Meta">
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
            <div className="workItem--MetaPrice">€145,-</div>
          </div>
        }
        backgroundImage={header.backgroundImage}
      />
      <article
        className="WorkItem section light"
        itemScope
        itemType="http://schema.org/BlogPosting"
      >
        <div className="container skinny">
          <Link className="WorkItem--BackButton" to="/blog/">
            <ChevronLeft /> BACK
          </Link>
          <div className="WorkItem--Content relative">
            <div className="WorkItem--InnerContent">
              <Content source={body} />
            </div>

            <Gallery images={gallery} />

            <div className="WorkItem--Pagination">
              {prevPostURL && (
                <Link
                  className="WorkItem--Pagination--Link prev"
                  to={prevPostURL}
                >
                  Previous Post
                </Link>
              )}
              {nextPostURL && (
                <Link
                  className="WorkItem--Pagination--Link next"
                  to={nextPostURL}
                >
                  Next Post
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

// Export Default WorkItem for front-end
const WorkItem = ({ data: { post, allPosts, workPage } }) => {
  const thisEdge = allPosts.edges.find(edge => edge.node.id === post.id)
  console.log(workPage)
  return (
    <Layout
      meta={post.frontmatter.meta || false}
      title={post.frontmatter.title || false}
    >
      <WorkItemTemplate
        {...post}
        {...post.frontmatter}
        header={workPage.nodes[0].frontmatter.header}
        body={post.html}
        nextPostURL={_get(thisEdge, 'next.fields.slug')}
        prevPostURL={_get(thisEdge, 'previous.fields.slug')}
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
      frontmatter {
        slug
        title
        template
        date(formatString: "MMMM Do, YYYY")
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
      filter: { fields: { contentType: { eq: "posts" } } }
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
  }
`
