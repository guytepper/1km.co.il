import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { posts } from '../../views/Posts';
import PostWrapper from './PostWrapper';

const Post = () => {
  const { slug = '404' } = useParams();

  const postData = posts.find((post) => post.slug === slug);

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
