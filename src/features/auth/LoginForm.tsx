import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Form, Input } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { ApiResponse, IAuthRequest, IAuthResponse } from "../../interfaces";
import { authService } from "../../services";

const LoginForm: React.FC = () => {
  const [loginForm] = Form.useForm<IAuthRequest>();
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem("access_token");

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const { mutate: login } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data: ApiResponse<IAuthResponse>) => {
      if (data.payload) {
        const { accessToken } = data.payload;
        window.localStorage.setItem("access_token", accessToken);
        navigate("/");
      }
    },
  });

  function onFinish(data: IAuthRequest): void {
    login(data, {
      onSuccess: () => {
        toast.success("Đăng nhập thành công");
      },
      onError: () => {
        toast.error("Đăng nhập thất bại");
      },
    });
  }

  return (
    <>
      <Form
        className="flex flex-col"
        onFinish={onFinish}
        form={loginForm}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email",
            },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            className="focus:shadow-outline mt-2 w-full rounded bg-blue-700 py-2 font-bold text-white hover:bg-blue-900 focus:outline-none"
          >
            Đăng nhập
          </button>
        </Form.Item>

        <div className="flex flex-col gap-5 text-center text-xs">
          <a
            href="#"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            Quên mật khẩu?
          </a>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
