import { plotlib } from "@antv/g2-extension-plot";
import { Runtime, corelib, extend } from "@antv/g2";
import { useEffect, useMemo, useRef } from "react";

const Chart = extend(Runtime, { ...corelib(), ...plotlib() });

const SunburstChart: React.FC = () => {
  const chartContainer = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!chartContainer.current) return;

    chartContainer.current.innerHTML = ""; // Clear previous chart

    const chart = new Chart({
      container: chartContainer.current,
      autoFit: true,
    });

    chart
      .sunburst()
      .data({
        value: values, // Use the modified hierarchical data
      })
      .encode("value", "weight") // Use weight as the value
      .encode("color", "name") // Different colors for items and products
      .coordinate({ type: "polar", innerRadius: 0.2 }) // Adjust inner radius
      .animate("enter", { type: "waveIn" });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [values]);

  return (
    <div className="rounded-lg bg-white">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-semibold">
          Khối lượng hàng hóa theo danh mục
        </h2>
      </div>
      <div ref={chartContainer} className="h-[400px] w-full" />
    </div>
  );
};

export default SunburstChart;
