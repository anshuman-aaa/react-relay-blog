/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { createFragmentContainer, graphql } from 'react-relay';

import Link from '../common/Link';

const useStyles = makeStyles(theme => ({
  root: {
    ...theme.mixins.content,
  },
}));

function Blog(props) {
  const {
    blog: { blogTitle, blogDesc },
  } = props;

  const s = useStyles();

  return (
    <div className={s.root}>
      <Typography variant="h3" gutterBottom>
        {blogTitle}
      </Typography>
      {blogDesc &&
        blogDesc.split('\n').map((x, i) => (
          <Typography key={i} gutterBottom>
            {x}
          </Typography>
        ))}
      <div style={{ marginTop: 10, textAlign: 'right' }}>
        <Button component={Link} href="/blogs">
          Go back
        </Button>
      </div>
    </div>
  );
}

export default createFragmentContainer(Blog, {
  blog: graphql`
    fragment Blog_blog on Blog {
      id
      categoryId
      blogDesc
      blogTitle
      blogLogo
      createdAt(format: "MMM Do, YYYY")
    }
  `,
});
