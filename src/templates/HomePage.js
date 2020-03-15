import React from 'react'
import { graphql, Link } from 'gatsby'

import PageHeader from '../components/PageHeader'
import ContentBlock from '../components/ContentBlock'
import Layout from '../components/Layout'
import PostSection from '../components/PostSection'

// Export Template for use in CMS preview
export const HomePageTemplate = ({ header, sections, work, workItems }) => (
  <main className="Home">
    <PageHeader
      large
      title={header.title}
      subtitle={header.subtitle}
      content={header.introText}
      buttons={[
        {
          type: 'primary',
          to: '/mijn-werk',
          text: header.button1
        },
        {
          type: 'secondary',
          to: '/over-mij',
          text: header.button2
        }
      ]}
      backgroundImage={header.backgroundImage}
    />
    {sections &&
      sections.map((section, index) => {
        if (index === 0) {
          section.button = {
            type: 'primary',
            text: 'Mijn werk',
            to: '/mijn-werk'
          }
        } else if (index === 1) {
          section.button = {
            type: 'primary',
            text: 'Meer over mij',
            to: '/over-mij'
          }
        }
        return (
          <ContentBlock
            key={index}
            order={index % 2 === 0 ? 'contentFirst' : 'imageFirst'}
            {...section}
          />
        )
      })}
    <section className="section">
      <div className="container skinnier">
        {!!work.title && <h2 className="taCenter">{work.title}</h2>}
        {!!work.tekst && <p className="taCenter">{work.tekst}</p>}
      </div>
      <div className="container">
        <PostSection posts={workItems} />
        <div className="section thin container taCenter">
          {work.button1 && (
            <Link className="Button Button-primary" to="/mijn-werk">
              {work.button1}
            </Link>
          )}
        </div>
      </div>
    </section>
  </main>
)

// Export Default HomePage for front-end
const HomePage = ({ data: { page, workItems } }) => {
  return (
    <Layout meta={page.frontmatter.meta || false}>
      <HomePageTemplate
        {...page}
        {...page.frontmatter}
        body={page.html}
        workItems={workItems.nodes.map(work => ({
          ...work,
          ...work.frontmatter,
          ...work.fields
        }))}
      />
    </Layout>
  )
}

export default HomePage

export const pageQuery = graphql`
  ## Query for HomePage data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query HomePage($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      ...Meta
      html
      frontmatter {
        header {
          title
          subtitle
          introText
          button1
          button2
          backgroundImage
        }
        sections {
          title
          tekst
          image
        }
        work {
          title
          tekst
          button1
        }
      }
    }
    workItems: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "werk" } } }
      limit: 3
      sort: { order: DESC, fields: frontmatter___date }
    ) {
      nodes {
        excerpt
        frontmatter {
          gallery {
            image
            title
            alt
          }
          title
          category
        }
        fields {
          slug
        }
      }
    }
  }
`
