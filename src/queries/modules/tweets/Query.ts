import { gql } from '@apollo/client';

export const ITweetsQuery = gql`
  query tweetsPagination($page: Float!, $pageSize: Float!) {
    tweetsPagination(page: $page, pageSize: $pageSize) {
      tweets {
        _id
        author
        description
        createdAt
      }
      totalPages
    }
  }
`;
