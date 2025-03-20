import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Layout, Menu, theme, Tooltip } from "antd";
import { MenuProps } from "antd/lib";
import { useEffect, useState } from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { BiSolidCategory } from "react-icons/bi";
import {
  FaKey,
  FaSitemap,
  FaUserCircle,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";
import {
  IoIosNotifications,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from "react-icons/io";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdCategory, MdDashboard } from "react-icons/md";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Loading from "../common/components/Loading";
import { useLoggedInUser } from "../features/auth/hooks/useLoggedInUser";
import { Module, PERMISSIONS } from "../interfaces";
import { authService } from "../services";
import { FaBoxesStacked } from "react-icons/fa6";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { GiTakeMyMoney } from "react-icons/gi";

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
    {
      key: "profile",
      label: (
        <NavLink to="/profile" className="px-1">
          Thông tin cá nhân
        </NavLink>
      ),
    },
  ];

  useEffect(() => {
    const newKeys =
      location.pathname === "/"
        ? ["dashboard"]
        : location.pathname.slice(1).split("/");

    setSelectedKeys(newKeys);
  }, [location.pathname]);

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
      //////////////
      const hasAuthChildren: boolean = Boolean(
        viewStaffs || viewRoles || viewPermissions || viewCustomers,
      );

      //////////////////////////////////////////
      const viewItems = permissions.find(
        (item) =>
          item.apiPath === PERMISSIONS[Module.ITEMS].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.ITEMS].GET_PAGINATION.method,
      );
      const viewProducts = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.PRODUCTS].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.PRODUCTS].GET_PAGINATION.method,
      );
      //////////////
      const hasCategoryChildren: boolean = Boolean(viewItems || viewProducts);

      //////////////////////////////////////////
      const viewOrders = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.SELLING_ORDERS].GET_PAGINATION.apiPath &&
          item.method ===
            PERMISSIONS[Module.SELLING_ORDERS].GET_PAGINATION.method,
      );
      //////////////
      const hasOrderChildren: boolean = Boolean(viewOrders);

      //////////////////////////////////////////
      const viewTransactions = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.TRANSACTIONS].GET_PAGINATION.apiPath &&
          item.method ===
            PERMISSIONS[Module.TRANSACTIONS].GET_PAGINATION.method,
      );
      //////////////
      const hasTransactionChildren: boolean = Boolean(viewTransactions);

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
        ...(hasCategoryChildren
          ? [
              {
                label: "Danh mục",
                key: "categories",
                icon: <BiSolidCategory />,
                children: [
                  ...(viewItems
                    ? [
                        {
                          label: <NavLink to="/items">Mặt hàng</NavLink>,
                          key: "items",
                          icon: <FaSitemap />,
                        },
                      ]
                    : []),
                  ...(viewProducts
                    ? [
                        {
                          label: <NavLink to="/products">Sản phẩm</NavLink>,
                          key: "products",
                          icon: <MdCategory />,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...(hasOrderChildren
          ? [
              {
                label: "Đơn hàng",
                key: "orders",
                icon: <FaBoxesStacked />,
                children: [
                  ...(viewOrders
                    ? [
                        {
                          label: (
                            <NavLink to="/selling-orders">Đơn bán</NavLink>
                          ),
                          key: "selling-orders",
                          icon: <BsFillBoxSeamFill />,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...(hasTransactionChildren
          ? [
              // {
              //   label: "Giao dịch",
              //   key: "transactions",
              //   icon: <FaBoxesStacked />,
              //   children: [
              //     ...(viewTransactions
              //       ? [
              //           {
              //             label: (
              //               <NavLink to="/transactions">Giao dịch</NavLink>
              //             ),
              //             key: "transactions",
              //             icon: <GiTakeMyMoney />,
              //           },
              //         ]
              //       : []),
              //   ],
              // },
              ...(viewTransactions
                ? [
                    {
                      label: <NavLink to="/transactions">Giao dịch</NavLink>,
                      key: "transactions",
                      icon: <GiTakeMyMoney />,
                    },
                  ]
                : []),
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
          <img src="/src/assets/logo_512.png" alt="Logo" className="w-36 p-3" />
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
        className="bg-slate-200/65 transition-all duration-200"
        style={{ marginInlineStart: collapsed ? 80 : 230 }}
      >
        <Header
          style={headerStyle}
          className="max-w-screen-2xl shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tooltip title={collapsed ? "Mở menu" : "Đóng menu"}>
                <Button
                  type="text"
                  icon={
                    collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "20px",
                  }}
                />
              </Tooltip>
              <Tooltip title="Quay lại">
                <IoMdArrowDropleft
                  className="text-2xl"
                  onClick={() => window.history.back()}
                />
              </Tooltip>
              <Tooltip title="Đi tới">
                <IoMdArrowDropright
                  className="text-2xl"
                  onClick={() => window.history.forward()}
                />
              </Tooltip>
            </div>

            <div className="relative mr-5 flex items-center gap-3">
              <Tooltip title="Thông báo">
                <NavLink to="/notifications">
                  <div className="flex items-center gap-1">
                    <IoIosNotifications className="text-2xl" />
                  </div>
                </NavLink>
              </Tooltip>

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

        <Layout.Content className="max-w-screen-2xl">
          <div className="m-2 mt-[70px]">
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
