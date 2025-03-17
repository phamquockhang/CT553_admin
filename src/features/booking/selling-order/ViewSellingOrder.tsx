import { EyeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useNavigate } from "react-router";

interface ViewOrderProps {
  sellingOrderId: string;
}

const ViewSellingOrder: React.FC<ViewOrderProps> = ({ sellingOrderId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/selling-orders/${sellingOrderId}?mode=view`);
  };

  return (
    <>
      <Tooltip title="Xem chi tiết">
        <EyeOutlined
          className="table-icon text-xl text-[#1677FF]"
          onClick={handleClick}
        />
      </Tooltip>
    </>
  );
};

export default ViewSellingOrder;
