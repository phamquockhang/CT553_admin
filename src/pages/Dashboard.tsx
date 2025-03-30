import { useLoggedInUser } from "../features/auth/hooks/useLoggedInUser";
import OverviewStatistic from "../features/statistic/OverviewStatistic";
import SunburstChart from "../features/statistic/SunburstChart";
import Test from "../features/statistic/Test";
import { useDynamicTitle } from "../utils";
import { motion } from "framer-motion";

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
          <SunburstChart />
          <Test />
          <Test />
          <Test />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <motion.div
            className="flex w-full cursor-default flex-col items-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold">👋 Chào mừng, {fullName}!</h2>
            <p className="text-lg opacity-80">Chúc bạn một ngày tốt lành!</p>
          </motion.div>
          <motion.div
            className="cursor-default rounded-xl bg-white p-6 text-center shadow-md transition hover:shadow-xl"
            whileHover={{ scale: 1.01 }}
          >
            <p className="text-lg text-gray-700">
              Hãy chọn chức năng từ menu bên trái để bắt đầu!
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
