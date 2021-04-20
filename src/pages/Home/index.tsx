import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { FiChevronLeft, FiChevronRight, FiSend } from 'react-icons/fi';

import { IQueryData, ITweet } from '../../queries/models/Tweet';
import { ITweetsQuery } from '../../queries/modules/tweets';

import {
  Container,
  Left,
  Right,
  InputContainer,
  Input,
  ProfileList,
  Profile,
  Content,
  ButtonsContainer,
} from './styles';

type IUpdatePageParams = {
  page: -1 | 1;
};

const Home = () => {
  const [data, setData] = useState<ITweet[]>([]);
  const [currentPage, seCurrentPage] = useState(0);
  const [tweet, setTweet] = useState('');

  const { data: apolloData, refetch } = useQuery(ITweetsQuery, {
    variables: {
      page: currentPage,
      pageSize: 4,
    },
  });

  const handleSubmit = () => {
    console.log('Submit');
  };

  const handleUpdatePage = useCallback(
    ({ page }: IUpdatePageParams) => {
      const newPage = currentPage + page;
      seCurrentPage(newPage);
    },
    [currentPage]
  );

  const showNextButton = useMemo(() => {
    if (apolloData?.tweetsPagination?.totalPages !== undefined) {
      if (currentPage + 1 < apolloData?.tweetsPagination?.totalPages) {
        return true;
      }
      return false;
    }

    return false;
  }, [apolloData, currentPage]);

  useEffect(() => {
    const formattedTweets = apolloData?.tweetsPagination?.tweets.map(
      (tweetData: ITweet) => ({
        ...tweetData,
        formattedDate: `a ${formatDistance(
          new Date(tweetData.createdAt),
          new Date(),
          {
            locale: ptBR,
          }
        )}`,
      })
    ) as ITweet[];

    setData(formattedTweets);
  }, [apolloData]);

  useEffect(() => {
    async function fetchData() {
      await refetch({
        page: currentPage,
      });
    }

    fetchData();
  }, [currentPage, refetch]);

  return (
    <Container>
      <Left>
        <h1>TweetsQl</h1>
        <h3>
          The new and the fast way to
          <br />
          tweet using Apollo e GraphQl
        </h3>
      </Left>
      <Right>
        <form
          onSubmit={handleSubmit}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <InputContainer>
            <Input
              placeholder="What's happening?"
              onChange={(e) => setTweet(e.target.value)}
              value={tweet}
            />
            <button type="submit">
              <FiSend size={22} color="#fff" />
              Tweet
            </button>
          </InputContainer>
        </form>

        <ProfileList>
          {data?.map((item, index) => (
            <Profile key={item._id}>
              <Content>
                <h2>{item.description}</h2>
                <p>{item.author}</p>
                <p>{item.formattedDate}</p>
              </Content>
            </Profile>
          ))}
        </ProfileList>

        <ButtonsContainer>
          <button
            type="button"
            onClick={() => handleUpdatePage({ page: -1 })}
            style={{ display: currentPage <= 0 ? 'none' : 'flex' }}
          >
            <FiChevronLeft size={25} color="#55409C" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => handleUpdatePage({ page: 1 })}
            style={{ display: showNextButton ? 'flex' : 'none' }}
          >
            Next
            <FiChevronRight size={25} color="#55409C" />
          </button>
        </ButtonsContainer>
      </Right>
    </Container>
  );
};

export default Home;
