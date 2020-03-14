import React from 'react'
import { graphql } from 'gatsby'

import PageHeader from '../components/PageHeader'
import Content from '../components/Content.js'
import Layout from '../components/Layout.js'
import Accordion from '../components/Accordion'
import BackgroundVideo from '../components/BackgroundVideo'
import Gallery from '../components/Gallery'
import Popup from '../components/Popup'

// Export Template for use in CMS preview
export const AboutPageTemplate = ({ header }) => (
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
