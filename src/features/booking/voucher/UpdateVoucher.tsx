import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { voucherService } from "../../../services/booking/voucher-service";
import UpdateVoucherForm from "./components/UpdateVoucherForm";

interface UpdateVoucherProps {
  voucherId: number;
}

const UpdateVoucher: React.FC<UpdateVoucherProps> = ({ voucherId }) => {
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
      <Tooltip title="Chỉnh sửa">
        <EditOutlined
          className="table-icon text-xl text-[#ffa500]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        loading={isLoading}
        centered
        open={isOpenModal}
        width="50%"
        title={<span className="text-lg">Chỉnh sửa thông tin mã giảm giá</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateVoucherForm
          voucherToUpdate={data?.payload}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default UpdateVoucher;
