import React from 'react'
import { graphql } from 'gatsby'
import { Location } from '@reach/router'
import qs from 'qs'

import PageHeader from '../components/PageHeader'
import PostSection from '../components/PostSection'
import PostCategoriesNav from '../components/PostCategoriesNav'
import Layout from '../components/Layout'
import './WorkPage.css'

/**
 * Filter work by date. Feature dates will be fitered
 * When used, make sure you run a cronejob each day to show schaduled content. See docs
 *
 * @param {work} object
 */
export const byDate = work => {
  const now = Date.now()
  return work.filter(work => Date.parse(work.date) <= now)
}

/**
 * filter work by category.
 *
 * @param {work} object
 * @param {title} string
 * @param {contentType} string
 */
export const byCategory = (work, title, contentType) => {
  const isCategory = contentType === 'categorieen'
  const byCategory = work => work.category && work.category === title
  return isCategory ? work.filter(byCategory) : work
}

// Export Template for use in CMS preview
export const WorkPageTemplate = ({
  title,
  header,
  work = [],
  categorieen = [],
  enableSearch = true,
  contentType
}) => (
  <Location>
    {({ location }) => {
      let filteredWork =
        work && !!work.length
          ? byCategory(byDate(work), title, contentType)
          : []

      let queryObj = location.search.replace('?', '')
      queryObj = qs.parse(queryObj)

      if (enableSearch && queryObj.s) {
        const searchTerm = queryObj.s.toLowerCase()
        filteredWork = filteredWork.filter(work =>
          work.frontmatter.title.toLowerCase().includes(searchTerm)
        )
      }

      return (
        <main className="Work">
          {header ? (
            <PageHeader
              large
              title={header.title}
              subtitle={header.subtitle}
              content={header.introText}
              backgroundImage={header.backgroundImage}
              buttons={[
                {
                  type: 'primary',
                  to: '/contact?suggestie',
                  text: header.button1
                }
              ]}
            />
          ) : (
            <PageHeader
              large
              title={title}
              backgroundImage={header.backgroundImage}
            />
          )}

          {!!categorieen.length && (
            <section className="section thin PostCategoriesNav--Wrapper">
              <div className="container">
                <PostCategoriesNav enableSearch categories={categorieen} />
              </div>
            </section>
          )}

          {!!work.length && (
            <section className="section">
              <div className="container">
                <PostSection posts={filteredWork} />
              </div>
            </section>
          )}
        </main>
      )
    }}
  </Location>
)

// Export Default WorkPage for front-end
const WorkPage = ({ data: { page, work, categorieen } }) => {
  return (
    <Layout
      meta={page.frontmatter.meta || false}
      title={page.frontmatter.title || false}
    >
      <WorkPageTemplate
        {...page}
        {...page.fields}
        {...page.frontmatter}
        work={work.edges.map(work => ({
          ...work.node,
          ...work.node.frontmatter,
          ...work.node.fields
        }))}
        categorieen={categorieen.edges.map(work => ({
          ...work.node,
          ...work.node.frontmatter,
          ...work.node.fields
        }))}
      />
    </Layout>
  )
}

export default WorkPage

export const pageQuery = graphql`
  ## Query for WorkPage data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query WorkPage($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      ...Meta
      fields {
        contentType
      }
      frontmatter {
        title
        header {
          title
          introText
          backgroundImage
          subtitle
          button1
        }
        textSection
        workGridTitle
      }
    }

    work: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "werk" } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          ...Gallery
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date
            category
          }
        }
      }
    }
    categorieen: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "categorieen" } } }
      sort: { order: ASC, fields: [frontmatter___title] }
    ) {
      edges {
        node {
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
