import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import isBetween from "dayjs/plugin/isBetween";
import { PRIMARY_COLOR, VIETNAM_TIMEZONE } from "./interfaces/common";

dayjs.locale("vi");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);
dayjs.tz.setDefault(VIETNAM_TIMEZONE);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: PRIMARY_COLOR,
        },
        components: {
          Table: {
            headerBg: PRIMARY_COLOR,
            headerColor: "#fff",
            headerSortActiveBg: PRIMARY_COLOR,
            headerSortHoverBg: PRIMARY_COLOR,
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} buttonPosition="bottom-left" />
        <AppRouter />
      </QueryClientProvider>
      <Toaster
        position="top-center"
        containerStyle={{
          marginTop: "0.25rem",
        }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 3000,
          },
          style: {
            fontSize: "1rem",
            padding: "0.75rem 1rem",
          },
        }}
      />
    </ConfigProvider>
  );
}
export default App;
