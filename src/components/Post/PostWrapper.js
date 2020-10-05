import styled from 'styled-components/macro';

const PostWrapper = styled.div`
  max-width: 1000px;
  min-width: 60%;
  overflow-x: hidden;
  margin: 0 auto 15px;
  padding: 0 7.5%;
  font-size: 18px;
  line-height: 1.45;

  @media (min-width: 768px) {
    max-width: 600px;
    font-size: 20px;
    margin: 30px auto;
    border-radius: 20px;
    background-color: #fff;
  }

  @media (min-width: 1024px) {
    max-width: 800px;
    /* font-size: 21px; */
  }

  & a {
    font-weight: 600;
  }
`;

export default PostWrapper;
