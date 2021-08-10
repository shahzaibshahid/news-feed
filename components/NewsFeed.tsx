import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

export type NewsFeedRow = {
  id: number;
  title: string;
  description: string;
  fellowship: "founders" | "angels" | "writers" | "all";
  created_ts: Date;
  updated_ts: Date;
}

const NewsFeedSummaryCard = styled.div`
  padding: 16px;
  border-bottom: 1px solid #ccc;
`;

const NewsFeedSummaryCardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  .title {
    margin-right: 6px;
    font-size: 18px;
  }

  .type {
    background: #ccc;
    padding: 4px 8px;
    text-transform: capitalize;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    margin-right: 8px;
  }
`;

const NewsFeedSummaryCardBody = styled.div``;

const NEWSFEED_QUERY = gql`
  query newsfeed($filter: String!, $limit: Int!, $offset: Int!) {
    newsfeed(filter: $filter, limit: $limit, offset: $offset) {
      hasNextPage
      newsfeed {
        title
        description
        fellowship
        type
        created_ts
      }
    }
  }
`;

type Props = {
  selectedFilter: string
}

function NewsFeed(props: Props) {
  const { selectedFilter } = props;
  const [newsFeed, setNewsFeed] = useState([] as NewsFeedRow[]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const {
    data = {},
    loading,
    error,
    refetch,
    fetchMore,
  } = useQuery(NEWSFEED_QUERY, {
    variables: {
      filter: selectedFilter,
      limit: 10,
      offset: 0,
    },
  });

  useEffect(() => {
    if (data && data.newsfeed) {
      setNewsFeed(data.newsfeed.newsfeed);
      setHasNextPage(data.newsfeed.hasNextPage);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [selectedFilter]);

  const handleFetchMore = () => {
    fetchMore({
      query: NEWSFEED_QUERY,
      variables: {
        filter: selectedFilter,
        limit: 10,
        offset: newsFeed.length,
      },
      updateQuery: (previousResult: any, { fetchMoreResult }) => {
        let stat = [...newsFeed, ...fetchMoreResult.newsfeed.newsfeed];
        setNewsFeed(stat);
        setHasNextPage(fetchMoreResult.newsfeed.hasNextPage);
      },
    });
  };

  return (
    <InfiniteScroll
      dataLength={newsFeed.length} 
      next={handleFetchMore}
      hasMore={hasNextPage}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: "center", marginTop: '8px' }}>
          <b>That's all folks</b>
        </p>
      }
    >
      {newsFeed.map((newsfeedData: any, key: number) => {
        return (
          <NewsFeedSummaryCard key={key}>
            <NewsFeedSummaryCardHeader>
              <div className="title">{newsfeedData.title}</div>
              <div className="type">{newsfeedData.type}</div>
            </NewsFeedSummaryCardHeader>

            <NewsFeedSummaryCardBody>
              {newsfeedData.description}
            </NewsFeedSummaryCardBody>
          </NewsFeedSummaryCard>
        );
      })}
    </InfiniteScroll>
  );
}

export default NewsFeed;
