import { useSocket } from "@/providers/SocketProvider";
import { ConcertWithSeat } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface ReservationSocketProps {
  queryKey: string;
}
const useReservationSocket = ({ queryKey }: ReservationSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(queryKey, (seat: ConcertWithSeat) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: ConcertWithSeat) => {
              if (item.id === seat.id) return seat;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(queryKey);
    };
  }, [queryClient, queryKey, socket]);
};

export default useReservationSocket;
