import { Button, Dropdown, Layout, Menu, theme } from "antd";
import Loading from "../common/components/Loading";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuProps } from "antd/lib";
import { useLoggedInUser } from "../features/auth/hooks/useLoggedInUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { FaKey, FaUserCircle, FaUserCog, FaUsers } from "react-icons/fa";
import { Module, PERMISSIONS } from "../interfaces";
import { MdDashboard } from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";

const { Header, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    location.pathname === "/"
      ? ["dashboard"]
      : location.pathname.slice(1).split("/"),
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);
  const { user, isLoading } = useLoggedInUser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      window.localStorage.removeItem("access_token");
      queryClient.removeQueries();
      navigate("/login");
    },
  });

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: (
        <span onClick={() => logout()} className="px-1">
          Đăng xuất
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (user?.role.permissions) {
      const permissions = user.role.permissions;

      const viewStaffs = permissions.find(
        (item) =>
          item.apiPath === PERMISSIONS[Module.STAFF].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.STAFF].GET_PAGINATION.method,
      );
      const viewCustomers = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.CUSTOMER].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.CUSTOMER].GET_PAGINATION.method,
      );
      const viewRoles = permissions.find(
        (item) =>
          item.apiPath === PERMISSIONS[Module.ROLES].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.ROLES].GET_PAGINATION.method,
      );
      const viewPermissions = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.PERMISSIONS].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.PERMISSIONS].GET_PAGINATION.method,
      );
      const hasAuthChildren: boolean = Boolean(
        viewStaffs || viewRoles || viewPermissions || viewCustomers,
      );

      const menuItems = [
        {
          label: (
            <NavLink className="" to="/">
              Trang chủ
            </NavLink>
          ),
          key: "dashboard",
          icon: <MdDashboard />,
        },
        ...(hasAuthChildren
          ? [
              {
                label: "Quyền hạn",
                key: "auth",
                icon: <IoShieldCheckmark />,
                children: [
                  ...(viewStaffs
                    ? [
                        {
                          label: <NavLink to="/staffs">Nhân viên</NavLink>,
                          key: "staffs",
                          icon: <FaUsers />,
                        },
                      ]
                    : []),
                  ...(viewCustomers
                    ? [
                        {
                          label: <NavLink to="/customers">Khách hàng</NavLink>,
                          key: "customers",
                          icon: <FaUsers />,
                        },
                      ]
                    : []),
                  ...(viewRoles
                    ? [
                        {
                          label: <NavLink to="/roles">Vai trò</NavLink>,
                          key: "roles",
                          icon: <FaUserCog />,
                        },
                      ]
                    : []),
                  ...(viewPermissions
                    ? [
                        {
                          label: <NavLink to="/permissions">Quyền hạn</NavLink>,
                          key: "permissions",
                          icon: <FaKey />,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
      ];

      setMenuItems(menuItems);
    }
  }, [user]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const checkScreenWidth = () => {
      const mdBreakpoint = 768;
      if (window.innerWidth < mdBreakpoint) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "fixed",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    scrollbarColor: "black",
    boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle: React.CSSProperties = {
    background: colorBgContainer,
    padding: 0,
    zIndex: 1,
    overflow: "auto",
    position: "fixed",
    insetInlineStart: collapsed ? 80 : 230,
    top: 0,
    right: 0,
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        style={siderStyle}
        width={230}
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
      >
        <div className="demo-logo-vertical flex flex-col items-center pb-6">
          <img src="logo_512.png" alt="Logo" className="w-36 p-3" />
          {!collapsed && <h1 className="font-bold">{user?.firstName}</h1>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={({ key }) => {
            setSelectedKeys([key]);
          }}
        />
      </Sider>
      <Layout
        className="transition-all duration-200"
        style={{ marginInlineStart: collapsed ? 80 : 230 }}
      >
        <Header
          style={headerStyle}
          className="shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <Button
              type="text"
              icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "20px",
              }}
            />
            <div className="relative mr-5 flex items-center gap-2">
              <Dropdown
                menu={{ items }}
                placement="bottom"
                overlayStyle={{
                  position: "absolute",
                  top: "50px",
                }}
              >
                <div className="flex items-center gap-2">
                  <p className="cursor-pointer">
                    {user ? `${user.lastName} ${user.firstName}` : ""}
                  </p>

                  <Button
                    type="text"
                    icon={<FaUserCircle />}
                    style={{
                      fontSize: "30px",
                    }}
                  />
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        <Layout.Content>
          <div className="m-2 mt-[70px]">
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
