import { EditOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useNavigate } from "react-router";

interface UpdateSellingOrderProps {
  sellingOrderId: string;
}

const UpdateSellingOrder: React.FC<UpdateSellingOrderProps> = ({
  sellingOrderId,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/selling-orders/${sellingOrderId}?mode=update`);
  };

  return (
    <>
      <Tooltip title="Cập nhật trạng thái đơn hàng">
        <EditOutlined
          className="table-icon text-xl text-[#ffa500]"
          onClick={handleClick}
        />
      </Tooltip>
    </>
  );
};

export default UpdateSellingOrder;
