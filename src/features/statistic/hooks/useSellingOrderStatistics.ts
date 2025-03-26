import { useQuery } from "@tanstack/react-query";
import { sellingOrderService } from "../../../services";

export const useSellingOrderStatistics = () => {
  const {
    data: sellingOrderStatisticsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["statistics", "selling-order"],
    queryFn: () => sellingOrderService.getSellingOrderStatistics(),
    select: (data) => data.payload,
    refetchInterval: 1000 * 10,
  });

  return { sellingOrderStatisticsData, isLoading, refetch };
};
