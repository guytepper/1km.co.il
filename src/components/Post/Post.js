import React from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { posts } from '../../views/Posts';
import PostWrapper from './PostWrapper';

const Post = ({ overrideSlug = '404' }) => {
  const location = useLocation();
  const history = useHistory();
  const { slug = overrideSlug } = useParams();

  let postData = posts.find((post) => post.slug === slug);

  if (!postData) postData = posts.find((post) => post.slug === '404');

  if (postData.permalink && postData.permalink !== location.pathname) {
    history.replace(postData.permalink);
  }

  return <PostWrapper>{postData.text}</PostWrapper>;
};

export default Post;
