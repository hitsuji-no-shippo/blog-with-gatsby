const { toPairs } = require('ramda');
const {
  author,
  site: {
    pathPrefix,
    title,
    description,
    siteUrl,
    manifestShortName,
    disqusShortName = '',
    lang = 'en',
  },
  repository,
} = require('./config');
const supportedLanguages = require('./config').supportedLanguages;

module.exports = {
  pathPrefix,
  siteMetadata: {
    title,
    author: author.name,
    description,
    siteUrl,
    articlesDirectoryUrl: process.env.ARTICLES_REPOSITORY
      ? `${process.env.GIT_HOST || 'https://github.com'
         }/${process.env.ARTICLES_REPOSITORY}`
      : `${repository.url}/content/blog`,
    social: {
      twitter: author.twitter || '',
    },
    disqusShortName,
    lang,
    langsEntries: toPairs(supportedLanguages),
  },
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-eslint',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: 'blog',
        ignore: ['**/_includes', '**/CHANGELOG.adoc', '**/README.adoc'],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    'gatsby-plugin-catch-links',
    {
      resolve: `@hitsuji_no_shippo/gatsby-transformer-asciidoc`,
      options: {
        attributes: {
          values: {
            'site-name@': title,
            'site-url@': siteUrl,
            'author@': author.name,
            ...Object.entries({
              'email': author.email,
              'page-author-url': author.url,
              'page-author-twitter': author.twitter
            }).reduce((attributes, [name, value]) => {
              if (value) {
                attributes[`${name}@`] = value
              }

              return attributes;
            }, {})
          },
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: manifestShortName || 'Gatsby Blog',
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: '@hitsuji_no_shippo/gatsby-plugin-i18n',
      options: {
        langKeyDefault: lang,
        useLangKeyLayout: false,
        pagesPaths: ['/content/blog/'],
        lightweightMarkup: {
          language: "Asciidoc",
          fileAbsolutePathField: "paths.absolute.file",
        }
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
        {
          site {
             siteMetadata {
               title
               description
               siteUrl
             }
          }
        }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allAsciidoc } }) => {
              return allAsciidoc.edges.map(edge => {
                return {
                  title: edge.node.document.title,
                  description: edge.node.document.description,
                  date: edge.node.revision.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                }
              })
            },
            query: `
              {
                allAsciidoc(
                  sort: { order: DESC, fields: [revision___date] },
                ) {
                  edges {
                    node {
                      html
                      fields { slug }
                      document {
                        title
                        description
                      }
                      revision {
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title
          },
        ],
      },
    },
    `gatsby-plugin-pnpm`,
  ],
};
