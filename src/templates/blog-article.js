import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';

import Bio from 'components/Bio';
import Layout from 'components/Layout';
import SEO from 'components/SEO';
import RelativePosts from 'components/RelativePosts';
import { DisqusEmbed } from 'components/Disqus';
import Article from 'components/Article';
import NavigationBar from 'components/NavigationBar';

import { rhythm } from 'utils/typography';
import {
  articleQuery as articleQueryPropTypes,
  createPagesQuery as createPagesQueryPropTypes,
  translationsLink as translationsLinkPropTypes,
  location as locationPropTypes,
} from 'utils/propTypes';
import { useLang } from 'context/LanguageContext';

function BlogArticleTmeplate({ data, pageContext, location }) {
  const article = data.asciidoc;
  const { previous, next, previousInSameTag, nextInSameTag, translationsLink } = pageContext;
  const languageContexts = useLang();

  return (
    <Layout
      pathname={location.pathname}
      title={data.site.siteMetadata.title}
      breadcrumbs={[{ text: article.document.title }]}
    >
      <SEO
        title={article.document.title}
        description={article.document.description}
        slug={pageContext.slug}
        articleAuthor={{
          name: article.author.fullName,
          twitter: article.pageAttributes.author_twitter,
        }}
      />
      <Article
        article={article}
        slug={pageContext.slug}
        translationsLink={translationsLink}
        homeUrl={languageContexts.homeLink}
      />

      {!article.pageAttributes.page && (
        <RelativePosts
          postNodes={[previousInSameTag, nextInSameTag]}
          lang={languageContexts.lang}
        />
      )}

      <hr style={{ marginBottom: rhythm(1), }} />
      <Bio />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
          marginLeft: 0,
        }}
      >
        <li>
          {!article.pageAttributes.page && previous && (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.document.title}
            </Link>
          )}
        </li>
        <li><Link to={`${languageContexts.homeLink}`}>HOME</Link></li>
        <li>
          {!article.pageAttributes.page && next && (
            <Link to={next.fields.slug} rel="next">
              {next.document.title} →
            </Link>
          )}
        </li>
      </ul>

      {article.pageAttributes.disqus !== false &&
        <DisqusEmbed
          identifier={article.id}
          title={article.document.title}
          slug={pageContext.slug}
        />
      }

      <NavigationBar />
    </Layout>
  );
}

BlogArticleTmeplate.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired
      })
    }).isRequired,
    asciidoc: articleQueryPropTypes.isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    previous: createPagesQueryPropTypes,
    next: createPagesQueryPropTypes,
    previousInSameTag: createPagesQueryPropTypes,
    nextInSameTag: createPagesQueryPropTypes,
    translationsLink: translationsLinkPropTypes.isRequired,
  }).isRequired,
  location: locationPropTypes.isRequired,
};

export default BlogArticleTmeplate;

export const pageQuery = graphql`
  query BlogArticleBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        lang
      }
    }
    asciidoc(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      internal {
        type
      }
      author {
        fullName
      }
      document {
        title
        description
      }
      revision {
        updateDateStr: date
        number
        remark
      }
      pageAttributes {
        tags
        disqus
        author_twitter
        author_url
        page
        creationDateStr: creation_date
      }
      paths {
        from {
          source {
            full
          }
        }
      }
    }
  }
`;
