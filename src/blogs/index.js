/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import React from 'react';
import { graphql } from 'relay-runtime';
import Layout from '../common/Layout';

export default [
  {
    path: '/blogs',
    components: () => [import(/* webpackChunkName: 'news' */ './Blogs')],
    query: graphql`
      query blogsQuery {
        ...Layout_data
        ...Blogs_data
      }
    `,
    render: ([Blogs], data, { config }) => ({
      title: `Blogs • ${config.app.name}`,
      component: (
        <Layout data={data}>
          <Blogs data={data} />
        </Layout>
      ),
      chunks: ['news'],
    }),
  },
  {
    path: '/blogs/:slug',
    components: () => [import(/* webpackChunkName: 'story' */ './Blog')],
    query: graphql`
      query blogsBlogQuery($slug: String!) {
        ...Layout_data
        blog(slug: $slug) {
          ...Blog_blog
        }
      }
    `,
    render: ([Blog], data, ctx) => {
      if (data.story && data.story.slug !== ctx.params.slug) {
        return { status: 301, redirect: `/news/${data.blog.slug}` };
      } else if (data.blog) {
        return {
          title: data.blog.blogTitle,
          component: (
            <Layout data={data}>
              <Blog story={data.blogTitle} />
            </Layout>
          ),
          chunks: ['blog'],
        };
      }
    },
  },
];
