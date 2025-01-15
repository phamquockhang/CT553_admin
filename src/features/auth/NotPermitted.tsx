import { Button, Result } from "antd";
import { useNavigate } from "react-router";

const NotPermitted: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="Truy cập bị từ chối"
      subTitle="Xin lỗi, bạn không có quyền truy cập thông tin này."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Trở về trang chủ
        </Button>
      }
    />
  );
};

export default NotPermitted;
