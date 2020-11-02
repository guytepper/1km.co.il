import styled from 'styled-components/macro';

const PostWrapper = styled.div`
  overflow-x: hidden;
  margin: 0 auto 15px;
  padding: 0px 8%;
  font-size: 18px;
  line-height: 1.45;

  @media (min-width: 580px) {
    max-width: 580px;
    font-size: 19px;
    margin: 30px auto;
    border-radius: 20px;
    background-color: #fff;
  }

  @media (min-width: 1024px) {
    max-width: 760px;
    padding-top: 10px;
    font-size: 20px;
  }

  & a {
    font-weight: 600;
  }

  & h2 {
    margin-top: 20px;
    font-weight: 600;
    text-align: center;
  }
`;

export default PostWrapper;
