import { useQuery } from "@tanstack/react-query";
import { sellingOrderService } from "../../../services";
import { TimeRange } from "../../../interfaces";

export const useSellingOrderStatistics = (timeRange: TimeRange) => {
  const {
    data: sellingOrderStatisticsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["statistics", "selling-order", timeRange],
    queryFn: () => sellingOrderService.getSellingOrderStatistics(timeRange),
    enabled: !!timeRange,
    select: (data) => data.payload,
    refetchInterval: 1000 * 30,
  });

  return { sellingOrderStatisticsData, isLoading, refetch };
};
