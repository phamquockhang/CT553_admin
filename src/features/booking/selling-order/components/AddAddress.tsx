import { useQuery } from "@tanstack/react-query";
import { Form, Input, Select } from "antd";
import { useState } from "react";
import { addressPublicApiService } from "../../../../services";
import { FormInstance } from "antd/lib";

interface AddAddressProps {
  form: FormInstance<any>;
}

const AddAddress: React.FC<AddAddressProps> = ({ form }) => {
  const [provinceId, setProvinceId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const [wardCode, setWardCode] = useState<string>();
  const [description, setDescription] = useState<string>();

  const { data: provinceData, isLoading: isLoadingProvince } = useQuery({
    queryKey: ["province"],
    queryFn: async () => {
      const response = await addressPublicApiService.getProvinces();
      return response.data;
    },
  });

  const provinceOptions = provinceData?.map((province) => ({
    value: province.ProvinceID,
    label: province.ProvinceName,
  }));

  const { data: districtData, isLoading: isLoadingDistrict } = useQuery({
    queryKey: ["district", provinceId],
    queryFn: async () => {
      const response = await addressPublicApiService.getDistricts(provinceId);
      return response.data;
    },
    enabled: Boolean(provinceId),
  });

  const districtOptions = districtData?.map((district) => ({
    value: district.DistrictID,
    label: district.DistrictName,
  }));

  const { data: wardData, isLoading: isLoadingWard } = useQuery({
    queryKey: ["ward", districtId],
    queryFn: async () => {
      const response = await addressPublicApiService.getWards(districtId);
      return response.data;
    },
    enabled: Boolean(districtId),
  });

  const wardOptions = wardData?.map((ward) => ({
    value: ward.WardCode,
    label: ward.WardName,
  }));

  console.log(provinceId, districtId, wardCode, description);

  return (
    <>
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Tỉnh/Thành phố"
          name="provinceId"
          rules={[
            {
              required: provinceId ? true : false,
              message: "Vui lòng chọn tỉnh/thành phố",
            },
          ]}
        >
          <Select
            loading={isLoadingProvince}
            allowClear
            showSearch
            placeholder="Chọn tỉnh/thành phố"
            options={provinceOptions}
            filterOption={(input, option) =>
              (
                option?.label
                  ?.normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase() ?? ""
              ).indexOf(
                input
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase(),
              ) >= 0
            }
            onSelect={(value: number) => {
              if (value !== provinceId) {
                setProvinceId(value);
                setDistrictId(undefined);
                setWardCode(undefined);
                form.setFieldsValue({
                  districtId: undefined,
                  wardCode: undefined,
                });
              }
            }}
            onClear={() => {
              setProvinceId(undefined);
              setDistrictId(undefined);
              setWardCode(undefined);
              form.setFieldsValue({
                districtId: undefined,
                wardCode: undefined,
              });
            }}
          />
        </Form.Item>

        <Form.Item
          className="flex-1"
          label="Quận/Huyện"
          name="districtId"
          rules={[
            {
              required: provinceId ? true : false,
              message: "Vui lòng chọn quận/huyện",
            },
          ]}
        >
          <Select
            loading={isLoadingDistrict}
            allowClear
            showSearch
            placeholder="Chọn quận/huyện"
            options={districtOptions}
            filterOption={(input, option) =>
              (
                option?.label
                  ?.normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase() ?? ""
              ).indexOf(
                input
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase(),
              ) >= 0
            }
            onSelect={(value: number) => {
              if (value !== districtId) {
                setDistrictId(value);
                setWardCode(undefined);
                form.setFieldsValue({
                  wardCode: undefined,
                });
              }
            }}
            onClear={() => {
              setDistrictId(undefined);
              setWardCode(undefined);
              form.setFieldsValue({
                wardCode: undefined,
              });
            }}
          />
        </Form.Item>
      </div>

      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Phường/Xã"
          name="wardCode"
          rules={[
            {
              required: provinceId ? true : false,
              message: "Vui lòng chọn phường/xã",
            },
          ]}
        >
          <Select
            loading={isLoadingWard}
            allowClear
            showSearch
            placeholder="Chọn phường/xã"
            options={wardOptions}
            filterOption={(input, option) =>
              (
                option?.label
                  ?.normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase() ?? ""
              ).indexOf(
                input
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase(),
              ) >= 0
            }
            onSelect={(value: string) => {
              setWardCode(value);
            }}
          />
        </Form.Item>

        <Form.Item
          className="flex-1"
          label="Địa chỉ chi tiết"
          name="description"
          rules={[
            {
              required: provinceId ? true : false,
              message: "Vui lòng nhập địa chỉ chi tiết",
            },
          ]}
        >
          <Input
            allowClear
            placeholder="Địa chỉ chi tiết"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>
    </>
  );
};

export default AddAddress;
