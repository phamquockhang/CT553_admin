import { useQuery } from "@tanstack/react-query";
import { customerService } from "../../../services";

export const useUserInfomation = (customerId: string) => {
  const { data: getUserInfomation } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customerService.getCustomerById(customerId!),
    select: (data) => data.payload,
    enabled: !!customerId,
  });

  return {
    getUserInfomation,
  };
};
