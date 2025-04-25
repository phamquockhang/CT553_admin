import { motion } from "framer-motion";
import { HiArrowLeft, HiBadgeCheck } from "react-icons/hi";
import { useLoggedInUser } from "../features/auth/hooks/useLoggedInUser";
import OrderByStaff from "../features/statistic/OrderByStaff";
import OverviewStatistic from "../features/statistic/OverviewStatistic";
import ProductDistributionChart from "../features/statistic/ProductDistributionChart";
import { useDynamicTitle } from "../utils";

const Dashboard: React.FC = () => {
  useDynamicTitle("Trang chủ K-Seafood");
  const { user } = useLoggedInUser();
  const isManager = user?.role.roleId === 1;
  const fullName = user ? `${user.lastName} ${user.firstName}` : "bạn";

  return (
    <>
      {isManager ? (
        <div className="flex flex-col gap-2">
          <OverviewStatistic />
          <OrderByStaff />
          <ProductDistributionChart />
        </div>
      ) : (
        <>
          <div className="flex min-h-[630px] items-center justify-center">
            <motion.div
              className="relative flex min-h-[330px] w-full max-w-4xl items-center justify-center overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-800 to-cyan-400 opacity-60 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 opacity-40 blur-3xl" /> */}

              <div className="relative z-10 space-y-4 text-center">
                <HiBadgeCheck className="mx-auto h-12 w-12 text-blue-700" />
                <h1 className="text-3xl font-bold text-gray-800">
                  Chào mừng trở lại,{" "}
                  <span className="text-blue-700">{fullName}</span>!
                </h1>
                <p className="text-gray-500">
                  Chúc bạn một ngày làm việc thật hiệu quả ✨
                </p>

                <blockquote className="text-sm italic text-gray-400">
                  “Thành công không đến từ may mắn, mà từ nỗ lực từng ngày.”
                </blockquote>

                <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                  <button className="inline-flex items-center justify-center rounded-xl bg-blue-800 px-5 py-2 text-white transition hover:bg-blue-700">
                    <HiArrowLeft className="mr-2 h-5 w-5" /> Sử dụng với các
                    chức năng ở menu bên trái
                  </button>
                  {/* <button className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-50">
                    <HiBell className="mr-2 h-5 w-5" />
                    Xem thông báo
                  </button> */}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
