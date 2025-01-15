import useDynamicTitle from "../hooks/useDynamicTitle";

const Dashboard: React.FC = () => {
  useDynamicTitle("Trang chủ K-Seafood");
  return <div>Hi. This is the dashboard.</div>;
};

export default Dashboard;
