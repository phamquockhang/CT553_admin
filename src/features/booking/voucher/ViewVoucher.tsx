import { EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { voucherService } from "../../../services/booking/voucher-service";
import ViewVoucherForm from "./components/ViewVoucherForm";

interface ViewVoucherProps {
  voucherId: number;
}

const ViewVoucher: React.FC<ViewVoucherProps> = ({ voucherId }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["voucher", voucherId],
    queryFn: () => voucherService.getVoucher(voucherId),
  });

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  // console.log(data);

  return (
    <>
      <Tooltip title="Xem chi tiết">
        <EyeOutlined
          className="table-icon text-xl text-[#1677FF]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        loading={isLoading}
        centered
        open={isOpenModal}
        width="50%"
        title={<span className="text-lg">Xem thông tin mã giảm giá</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <ViewVoucherForm voucherToUpdate={data?.payload} />
      </Modal>
    </>
  );
};

export default ViewVoucher;
