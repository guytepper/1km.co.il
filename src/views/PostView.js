import React from 'react';
import { Post } from '../components';
const PostView = (props) => {
  // Create post slug from the url path
  const overrideSlug = props.location.pathname.substr(1);
  return <Post {...props} overrideSlug={overrideSlug} />;
};

export default PostView;
