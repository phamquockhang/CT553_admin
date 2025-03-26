import { plotlib } from "@antv/g2-extension-plot";
import { Runtime, corelib, extend } from "@antv/g2";
import { useCallback, useEffect, useMemo, useRef } from "react";

const Chart = extend(Runtime, { ...corelib(), ...plotlib() });

const SunburstChart: React.FC = () => {
  const chartContainer = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<number | null>(null);
  const chartRef = useRef<InstanceType<typeof Chart> | null>(null);

  const values = useMemo(
    () => ({
      name: "Items",
      children: [
        {
          name: "Electronics",
          weight: 6,
          children: [
            { name: "Laptop", weight: 3 },
            { name: "Smartphone", weight: 2 },
            { name: "Tablet", weight: 5 },
          ],
        },
        {
          name: "Furniture",
          weight: 9,
          children: [
            { name: "Chair", weight: 4 },
            { name: "Table", weight: 3 },
            { name: "Sofa", weight: 2 },
          ],
        },
      ],
    }),
    [],
  );

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
      .encode("value", "weight")
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
          Khối lượng hàng hóa theo danh mục
        </h2>
      </div>
      <div ref={chartContainer} className="" />
    </div>
  );
};

export default SunburstChart;
