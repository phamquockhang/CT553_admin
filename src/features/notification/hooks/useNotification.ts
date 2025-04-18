import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { messageService } from "../../../services";
import { NotificationFilterCriteria, SortParams } from "../../../interfaces";
import { useLoggedInUser } from "../../auth/hooks/useLoggedInUser";

export const useNotification = () => {
  const { user } = useLoggedInUser();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const query = undefined;
  const sort: SortParams = {
    sortBy: "createdAt",
    direction: user?.role.roleId === 2 ? "asc" : "desc",
  };
  const filter: NotificationFilterCriteria = {
    isRead: user?.role.roleId === 2 ? false : undefined,
    // staffEmail: user?.role.roleId === 2 ? user?.email : undefined,
    staffEmail: user?.email,
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "statistics",
      "notifications",
      { page, pageSize, query, sort, filter },
    ],
    queryFn: () =>
      messageService.getMessages({ page, pageSize }, query, filter, sort),
    select: (data) => data?.payload,
  });

  const notificationData = data?.data || [];
  const notificationMeta = data?.meta;

  return {
    notificationData,
    notificationMeta,
    isLoading,
    refetch,
    setPage,
    setPageSize,
  };
};
