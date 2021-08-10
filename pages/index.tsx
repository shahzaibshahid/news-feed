import Head from "next/head";
import Layout from "components/Layout";
import FellowshipFilters from "components/FellowshipFilters";
import { useState } from "react";
import NewsFeed from "components/NewsFeed";

const FILTERS: string[] = ["all", "founders", "angels", "writers"];

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <Layout>
      <Head>
        <title>News Feed</title>
      </Head>
      <h1>News Feed</h1>
      <FellowshipFilters
        selectedFilter={selectedFilter}
        filters={FILTERS}
        onClick={handleFilterClick}
      />
      
      <NewsFeed selectedFilter={selectedFilter}/>
    </Layout>
  );
}
