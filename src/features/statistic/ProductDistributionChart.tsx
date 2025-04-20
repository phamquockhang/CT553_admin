import { Runtime, corelib, extend } from "@antv/g2";
import { plotlib } from "@antv/g2-extension-plot";
import { Button, Spin } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { TbReload } from "react-icons/tb";
import ProductList from "./components/ProductList";
import { useItemStatistics } from "./hooks/useItemStatistics";

const Chart = extend(Runtime, { ...corelib(), ...plotlib() });

const ProductDistributionChart: React.FC = () => {
  const chartContainer = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<number | null>(null);
  const chartRef = useRef<InstanceType<typeof Chart> | null>(null);
  const { itemStatisticsData, isLoading, refetch } = useItemStatistics();

  const values = useMemo(() => {
    if (!itemStatisticsData) return { name: "Items", children: [] };

    return {
      name: "Items",
      children: itemStatisticsData.map((item) => ({
        name: item.itemName,
        còn: " ", // Để giữ format
        children: item.products.map((product) => ({
          name: product.productName,
          còn: product.remainingQuantity,
        })),
      })),
    };
  }, [itemStatisticsData]);

  const renderChart = useCallback(() => {
    if (!chartContainer.current) return;

    // if (chartRef.current) {
    chartRef.current?.destroy();
    // }

    const newChart = new Chart({
      container: chartContainer.current,
      autoFit: true,
    });

    newChart
      .sunburst()
      .data({
        value: values,
      })
      .encode("value", "còn")
      .encode("color", "name")
      .coordinate({ type: "polar", innerRadius: 0.2 })
      .animate("enter", { type: "waveIn" });

    newChart.render();

    chartRef.current = newChart;
  }, [values]);

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
          renderChart();
        });
      }, 1000); // Debounce 1s
    });

    resizeObserver.observe(chartContainer.current);

    return () => resizeObserver.disconnect();
  }, [renderChart]);

  return (
    <div className="rounded-lg bg-white">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-semibold">
          Khối lượng hàng hóa hiện tại theo danh mục
        </h2>
        <Button type="primary" onClick={() => refetch()} loading={isLoading}>
          Làm mới <TbReload />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex min-h-96 items-center justify-center">
          <Spin />
        </div>
      ) : (
        <div className="flex">
          <div
            ref={chartContainer}
            // className="h-96"
          />

          <ProductList />
        </div>
      )}
    </div>
  );
};

export default ProductDistributionChart;
