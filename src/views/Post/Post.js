import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { posts } from '../Posts';
import PostWrapper from './PostWrapper';

const Post = ({ overrideSlug = '404' }) => {
  const { slug = overrideSlug } = useParams();
  let postData = posts.find((post) => post.slug === slug) ?? posts.find((post) => post.slug === '404');

  useEffect(() => {
    const currentTitle = document.title;
    document.title = postData.title;

    return () => {
      document.title = currentTitle;
    };
  }, []);

  return <PostWrapper>{postData.text}</PostWrapper>;
};

export default Post;
