import qs from "query-string";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useSocket } from "@/providers/SocketProvider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
}

export const useReservationQuery = ({ queryKey, apiUrl }: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchSeats = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, status } = useQuery({
    queryKey: [queryKey],
    queryFn: fetchSeats,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? 1 : false,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    enabled: true,
  });

  return {
    data,
    status,
  };
};
