import { Chart } from "@antv/g2";
import { useCallback, useEffect, useRef } from "react";

const data = [
  { TIME: "10:10", call: 4, waiting: 2, people: 2 },
  { TIME: "10:15", call: 2, waiting: 6, people: 3 },
  { TIME: "10:20", call: 13, waiting: 2, people: 5 },
  { TIME: "10:25", call: 9, waiting: 9, people: 1 },
  { TIME: "10:30", call: 5, waiting: 2, people: 3 },
  { TIME: "10:35", call: 8, waiting: 2, people: 1 },
  { TIME: "10:40", call: 13, waiting: 1, people: 2 },
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
      .encode("x", "TIME")
      .encode("y", "waiting")
      .encode("color", () => "waiting")
      .encode("series", () => "waiting")
      .axis("y", { title: "Waiting" });

    newChart
      .interval()
      .encode("x", "TIME")
      .encode("y", "people")
      .encode("color", () => "people")
      .encode("series", () => "people")
      .scale("y", { independent: true })
      .axis("y", { position: "right", grid: null, title: "People" });

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
        <h2 className="text-xl font-semibold">Test</h2>
      </div>

      <div ref={chartContainer} className="" />
    </div>
  );
};

export default Test;
