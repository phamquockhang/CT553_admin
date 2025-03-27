import { useQuery } from "@tanstack/react-query";
import { itemService } from "../../../services";

export const useItemStatistics = () => {
  const {
    data: itemStatisticsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["statistics", "item"],
    queryFn: () => itemService.getItemStatistics(),
    select: (data) => data.payload,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  return { itemStatisticsData, isLoading, refetch };
};
