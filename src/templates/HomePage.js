import React from 'react'
import { graphql } from 'gatsby'

import PageHeader from '../components/PageHeader'
import ContentBlock from '../components/ContentBlock'
import Layout from '../components/Layout'

// Export Template for use in CMS preview
export const HomePageTemplate = ({ header, sections, work }) => (
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
      button1={header.button1}
      button2={header.button2}
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
  </main>
)

// Export Default HomePage for front-end
const HomePage = ({ data: { page } }) => (
  <Layout meta={page.frontmatter.meta || false}>
    <HomePageTemplate {...page} {...page.frontmatter} body={page.html} />
  </Layout>
)

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
        }
      }
    }
  }
`
