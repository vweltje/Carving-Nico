import React from 'react'
import { graphql } from 'gatsby'

import PageHeader from '../components/PageHeader'
import Layout from '../components/Layout.js'
import ContentBlock from '../components/ContentBlock'

// Export Template for use in CMS preview
export const AboutPageTemplate = ({ header, aboutSection }) => (
  <main>
    <PageHeader
      large
      title={header.title}
      subtitle={header.subtitle}
      content={header.introText}
      backgroundImage={header.backgroundImage}
      buttons={[
        {
          type: 'primary',
          to: '/mijn-werk',
          text: 'Bekijk mijn werk'
        }
      ]}
    />
    <ContentBlock order="contentFirst" {...aboutSection} />
  </main>
)

const AboutPage = ({ data: { page } }) => (
  <Layout
    meta={page.frontmatter.meta || false}
    title={page.frontmatter.title || false}
  >
    <AboutPageTemplate {...page} {...page.frontmatter} body={page.html} />
  </Layout>
)

export default AboutPage

export const pageQuery = graphql`
  query AboutPage($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      ...Meta
      html
      frontmatter {
        header {
          backgroundImage
          title
          subtitle
          introText
        }
        aboutSection {
          title
          tekst
          image
          quote
        }
      }
    }
  }
`
