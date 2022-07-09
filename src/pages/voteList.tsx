import { Stack, Divider } from "@mui/material";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import BotInfo from "./components/BotInfo";
import ListLayout from "./components/ListLayout";
import { DiriAPI, DiriAPIBotlist, DiriAPIError } from "../@type";

export default function VoteBotList() {
  const [error, setError] = useState('');

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<DiriAPI<DiriAPIBotlist>, unknown, DiriAPI<DiriAPIBotlist>, string>({
    queryKey: "infiniteCharacters",
    queryFn: async ({ pageParam = 1, meta }) => {
      const result = await fetch(`/api/v2/list/bots/votes?page=${pageParam}`);

      console.log(meta);
      console.log(result);

      return result.json().then((value: DiriAPI<DiriAPIBotlist>) => {
        console.log(value);
        if(result.status === 200) {
          setError(() => '');
        }
        else {
          setError(() => (value as unknown as DiriAPIError).message);
        }
        
        return value;
      });
    },
    getNextPageParam: (lastPage, pages) => {
      if(pages.length < lastPage.data?.totalPage ?? 0) return pages.length + 1;
    }
  });

  return (
    <ListLayout index={0}>
      <InfiniteScroll
        dataLength={(data?.pages.length ?? 0) * 20}
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
        loader={<h4>Loading...</h4>}
      >
        <Stack 
          direction='column' 
          spacing={2} 
          justifyContent="flex-start" 
          alignItems="stretch" 
          divider={<Divider flexItem />}
          m='20px'
          mt='80px'
        >
        {data?.pages.map((data) => data.data?.data.map(bot => (<BotInfo bot={bot}/>)))}
        </Stack>
      </InfiniteScroll>
    </ListLayout>
  )
}