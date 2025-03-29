import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../../../services";
import { NotificationFilterCriteria, SortParams } from "../../../interfaces";
import { useLoggedInUser } from "../../auth/hooks/useLoggedInUser";

export const useNotification = () => {
  const { user } = useLoggedInUser();

  const pagination = {
    page: 1,
    pageSize: 10,
  };
  const query = undefined;
  const sort: SortParams = {
    sortBy: "",
    direction: "",
  };
  const filter: NotificationFilterCriteria = {
    isRead: user?.role.roleId === 2 ? false : undefined,
    staffEmail: user?.role.roleId === 2 ? user?.email : undefined,
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "statistics",
      "notification",
      pagination,
      query,
      sort,
      filter,
    ].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () =>
      notificationService.getNotifications(pagination, query, filter, sort),
    select: (data) => data?.payload,
  });

  const notificationData = data?.data;
  const notificationMeta = data?.meta;

  return { notificationData, notificationMeta, isLoading, refetch };
};
