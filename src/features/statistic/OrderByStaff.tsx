import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import { TbReload } from "react-icons/tb";
import { staffService } from "../../services";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const OrderChart: React.FC = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["statistic", "order-by-staff"],
    queryFn: () => staffService.getStaffByOrderStatistic(),
    select: (data) =>
      data.payload?.sort((a, b) => a.staffName.localeCompare(b.staffName)),
  });

  // Chart.js data configuration
  const chartData = {
    labels: data?.map((item) => item.staffName),
    datasets: [
      {
        label: "Đã hoàn thành",
        data: data?.map((item) => item.processedOrders),
        backgroundColor: "#1F74E2",
        // borderColor: "",
        borderWidth: 1,
      },
      {
        label: "Số lần xử lí đơn hàng chậm",
        data: data?.map((item) => item.delayedOrders),
        backgroundColor: "#E42047",
        // borderColor: "",
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options
  const options = {
    plugins: {
      title: {
        display: true,
        // text: "",
      },
      legend: {
        position: "top" as const,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Nhân viên",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Đơn",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="rounded-lg bg-white">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-semibold">
          Thống kê đơn hàng theo nhân viên
        </h2>
        <Button type="primary" onClick={() => refetch()} loading={isLoading}>
          Làm mới <TbReload />
        </Button>
      </div>

      <div className="mx-auto max-w-4xl">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default OrderChart;
