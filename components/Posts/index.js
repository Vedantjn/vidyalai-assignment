import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      const [postResponse, userResponse] = await Promise.all([
        axios.get('/api/v1/posts', { params: { start: 0, limit: isSmallerDevice ? 5 : 10 } }),
        axios.get('/api/v1/users')
      ]);

      setPosts(postResponse.data);
      setUsers(userResponse.data);
    };

    fetchPostsAndUsers();
  }, [isSmallerDevice]);

  const handleClick = async () => {
    setIsLoading(true);
    const { data: newPosts } = await axios.get('/api/v1/posts', {
      params: { start: posts.length, limit: isSmallerDevice ? 5 : 10 }
    });
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setIsLoading(false);
  };

  const getUserById = (userId) => users.find(user => user.id === userId);

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} user={getUserById(post.userId)} />
        ))}
      </PostListContainer>

      {posts.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
