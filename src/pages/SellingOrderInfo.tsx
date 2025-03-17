import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation, useParams } from "react-router-dom";
import Access from "../features/auth/Access";
import SellingOrderForm from "../features/booking/selling-order/components/SellingOrderForm";
import { Module, PERMISSIONS } from "../interfaces";
import { sellingOrderService } from "../services";
import { useDynamicTitle } from "../utils";

const SellingOrderInfo: React.FC = () => {
  const { sellingOrderId } = useParams<{
    sellingOrderId: string;
  }>();
  const mode = useLocation().search.split("=")[1];

  const { data: orderData, isLoading: isOrderLoading } = useQuery({
    queryKey: ["selling_order", sellingOrderId],
    queryFn: () => sellingOrderService.getSellingOrder(sellingOrderId || ""),
    select: (data) => data.payload,
  });

  // console.log("sellingOrderId", sellingOrderId);
  // console.log("mode", mode);
  // console.log("orderData", orderData);

  useDynamicTitle("Xem chi tiết đơn hàng " + sellingOrderId);

  return (
    <Access permission={PERMISSIONS[Module.SELLING_ORDERS].GET_BY_ID}>
      <div className="rounded-md bg-white p-6 pt-4">
        <Skeleton loading={isOrderLoading} active>
          <div className="mb-5 flex items-center gap-4">
            <div
              className="cursor-pointer rounded-md bg-white p-2 text-xl text-black shadow-[0px_0px_5px_1px_rgba(0,0,0,0.24)]"
              onClick={() => window.history.back()}
            >
              <IoMdArrowRoundBack />
            </div>
            <h2 className="text-xl font-semibold">
              {mode === "view"
                ? "Xem chi tiết đơn hàng"
                : "Chỉnh sửa trạng thái đơn hàng"}
            </h2>
          </div>

          <SellingOrderForm
            sellingOrderToUpdate={orderData}
            viewMode={mode === "view" ? true : false}
          />
        </Skeleton>
      </div>
    </Access>
  );
};

export default SellingOrderInfo;
