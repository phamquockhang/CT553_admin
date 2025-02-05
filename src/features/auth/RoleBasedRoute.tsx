import { PropsWithChildren } from "react";
import { useLoggedInUser } from "./hooks/useLoggedInUser";
import Loading from "../../common/components/Loading";
import NotPermitted from "./NotPermitted";

const RoleBasedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useLoggedInUser();
  const isBlockedUser =
    user?.role.isActivated === false ||
    user?.isActivated === false ||
    user === undefined;

  if (isLoading) {
    return <Loading />;
  }

  if (isBlockedUser) {
    localStorage.removeItem("access_token");
    return <NotPermitted />;
  }
  return <>{children}</>;
};

export default RoleBasedRoute;
