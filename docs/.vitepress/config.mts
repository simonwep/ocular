import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Ocular',
  base: '/ocular/',
  description: 'Ocular - A simplistic, straight-forward budgeting app. Self-hosted, privacy-focused, and easy to use.',
  head: [
    // SEO
    [
      'meta',
      {
        name: 'keywords',
        content: 'ocular, budgeting, budget planner, self-hosted, privacy, docker, PWA, simonwep'
      }
    ],
    [
      'meta',
      {
        name: 'description',
        content: 'Ocular - A simplistic, straight-forward budgeting app. Self-hosted, privacy-focused, and easy to use.'
      }
    ],
    ['meta', { name: 'subject', content: 'Budgeting software' }],
    ['meta', { name: 'topic', content: 'Budgeting software' }],
    [
      'meta',
      {
        name: 'summary',
        content: 'Ocular - A simplistic, straight-forward budgeting app. Self-hosted, privacy-focused, and easy to use.'
      }
    ],
    ['meta', { name: 'copyright', content: 'Simon Reinisch' }],
    ['meta', { name: 'owner', content: 'Simon Reinisch' }],
    ['meta', { name: 'author', content: 'Simon Reinisch' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'url', content: 'https://simonwep.github.io/ocular' }],
    ['meta', { name: 'revisit-after', content: '7 days' }],

    // Open Graph
    ['meta', { property: 'og:url', content: 'https://simonwep.github.io/ocular' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Ocular' }],
    ['meta', { property: 'og:title', content: 'Ocular' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://github.com/simonwep/ocular/assets/30767528/2cbd76cd-adfb-4183-a69a-15784c4dccb6'
      }
    ],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:height', content: '150' }],
    ['meta', { property: 'og:image:width', content: '150' }],
    [
      'meta',
      {
        property: 'og:image:alt',
        content: 'Ocular logo featuring the name and tagline.'
      }
    ],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Ocular - A simplistic, straight-forward budgeting app. Self-hosted, privacy-focused, and easy to use.'
      }
    ],

    // Analytics
    [
      'script',
      {
        defer: 'true',
        src: 'https://numai.reinisch.io/script.js',
        'data-website-id': 'efc379ab-744b-48d9-a1cd-72133f3f36e3'
      }
    ],

    // Icons
    ['link', { rel: 'icon', href: '/ocular/favicon.ico', sizes: '32x32' }],
    [
      'link',
      {
        rel: 'icon',
        href: '/ocular/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ],
    ['link', { rel: 'apple-touch-icon', href: '/ocular/apple-touch-icon.png' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'FAQs', link: '/pages/faq' },
      { text: 'Quickstart', link: '/pages/quickstart' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Quickstart', link: '/pages/quickstart' },
          { text: 'Deployment', link: '/pages/deploy' },
          { text: 'Deployment (legacy)', link: '/pages/deploy-legacy' },
          { text: 'FAQs', link: '/pages/faq' }
        ]
      },
      {
        text: 'More',
        items: [
          {
            text: 'Release Notes',
            link: 'https://github.com/simonwep/ocular/releases/latest'
          },
          {
            text: 'Live Demo',
            link: 'https://simonwep.github.io/ocular/demo#demo'
          },
          {
            text: 'GitHub',
            link: 'https://github.com/simonwep/ocular'
          },
          {
            text: 'Support',
            link: 'https://github.com/sponsors/simonwep'
          }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/simonwep/ocular' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Simon Reinisch'
    }
  }
});
