import { PropsWithChildren, useEffect, useState } from "react";
import { useLoggedInUser } from "./hooks/useLoggedInUser";
import NotPermitted from "./NotPermitted";

interface AccessProps extends PropsWithChildren {
  hideChildren?: boolean;
  permission: { apiPath: string; method: string };
}

const Access: React.FC<AccessProps> = ({
  children,
  hideChildren = false,
  permission,
}) => {
  //hideChildren = false: check quyền và hiển thị children, nếu không sẽ hiển thị NotPermitted
  //hideChildren = true: check quyền và hiển thị children, nếu không sẽ không hiển thị gì cả
  const [isAllowed, setIsAllowed] = useState<boolean>(true);
  const { user } = useLoggedInUser();
  useEffect(() => {
    if (user) {
      const { permissions } = user.role;
      const isAllowed = permissions.some(
        (p) =>
          p.apiPath === permission.apiPath && p.method === permission.method,
      );
      setIsAllowed(isAllowed);
    }
  }, [user, permission]);
  return <>{isAllowed ? children : hideChildren ? null : <NotPermitted />}</>;
};

export default Access;
