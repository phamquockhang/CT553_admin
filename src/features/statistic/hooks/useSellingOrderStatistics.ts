import { useQuery } from "@tanstack/react-query";
import { sellingOrderService } from "../../../services";

export const useSellingOrderStatistics = () => {
  const {
    data: sellingOrderStatisticsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["selling-order-statistics"],
    queryFn: () => sellingOrderService.getSellingOrderStatistics(),
    select: (data) => data.payload,
  });

  return { sellingOrderStatisticsData, isLoading, refetch };
};
