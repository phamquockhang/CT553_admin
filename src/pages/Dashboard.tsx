import OverviewStatistic from "../features/statistic/OverviewStatistic";
import SunburstChart from "../features/statistic/SunburstChart";
import Test from "../features/statistic/Test";
import { useDynamicTitle } from "../utils";

const Dashboard: React.FC = () => {
  useDynamicTitle("Trang chủ K-Seafood");

  return (
    <div className="flex flex-col gap-2">
      <OverviewStatistic />
      <SunburstChart />
      <Test />
      <Test />
      <Test />
    </div>
  );
};

export default Dashboard;
