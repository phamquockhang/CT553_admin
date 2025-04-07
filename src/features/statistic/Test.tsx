import { Chart } from "@antv/g2";
import { useCallback, useEffect, useRef } from "react";

const data = [
  { "Nhân viên": "Nguyễn Văn A", "Số đơn đã xử lí": 2, "Số đơn xử lí chậm": 2 },
  { "Nhân viên": "Nguyễn Văn B", "Số đơn đã xử lí": 6, "Số đơn xử lí chậm": 3 },
  { "Nhân viên": "Nguyễn Văn C", "Số đơn đã xử lí": 2, "Số đơn xử lí chậm": 5 },
  {
    "Nhân viên": "Nguyễn Văn D",
    "Số đơn đã xử lí": 20,
    "Số đơn xử lí chậm": 1,
  },
  { "Nhân viên": "Nguyễn Văn E", "Số đơn đã xử lí": 2, "Số đơn xử lí chậm": 3 },
  { "Nhân viên": "Nguyễn Văn F", "Số đơn đã xử lí": 2, "Số đơn xử lí chậm": 1 },
  { "Nhân viên": "Nguyễn Văn G", "Số đơn đã xử lí": 1, "Số đơn xử lí chậm": 2 },
];

const Test: React.FC = () => {
  const chartContainer = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const resizeTimeout = useRef<number | null>(null);

  const renderChart = useCallback(() => {
    if (!chartContainer.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const newChart = new Chart({
      container: chartContainer.current,
      autoFit: true,
    });

    newChart.data(data);

    newChart
      .interval()
      .encode("x", "Nhân viên")
      .encode("y", "Số đơn đã xử lí")
      .encode("color", () => "Số đơn đã xử lí") // custom màu cho '"Số đơn đã xử lí"'
      .encode("series", () => "Số đơn đã xử lí");
    // .axis("y", { title: "Số đơn đã xử lí" });

    newChart
      .interval()
      .encode("x", "Nhân viên")
      .encode("y", "Số đơn xử lí chậm")
      .encode("color", () => "Số đơn xử lí chậm")
      .encode("series", () => "Số đơn xử lí chậm")
      // .scale("y", { independent: true })
      .axis("y", {
        // position: "right",
        // grid: null,
        title: "Số  đơn",
      });

    newChart.render();

    chartRef.current = newChart;
  }, []);

  useEffect(() => {
    renderChart();

    return () => {
      chartRef.current?.destroy();
    };
  }, [renderChart]);

  useEffect(() => {
    if (!chartContainer.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }

      resizeTimeout.current = window.setTimeout(() => {
        requestAnimationFrame(() => {
          chartRef.current?.forceFit();
        });
      }, 1000); // Debounce 1s
    });

    resizeObserver.observe(chartContainer.current);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
    };
  }, []);

  return (
    <div className="rounded-lg bg-white">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-semibold">
          Thống kê đơn hàng theo nhân viên
        </h2>
      </div>

      <div ref={chartContainer} className="" />
    </div>
  );
};

export default Test;
