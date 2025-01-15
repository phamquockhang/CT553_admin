import { useQuery } from "@tanstack/react-query";
import { staffService } from "../../../services";

export function useLoggedInUser() {
  const { data, isLoading } = useQuery({
    queryKey: ["staff, logged-in"],
    queryFn: staffService.getLoggedInStaff,
  });
  return { user: data?.payload, isLoading };
}
