import { useQuery } from "@tanstack/react-query";
import { Input, Tooltip } from "antd";
import { IAddress } from "../../../../interfaces";
import { addressPublicApiService } from "../../../../services";
import { formatAddressName } from "../../../../utils";
import { FaCheckCircle } from "react-icons/fa";

interface AddressItemProps {
  address: IAddress;
}

const AddressItem: React.FC<AddressItemProps> = ({ address }) => {
  const { data: provinceData } = useQuery({
    queryKey: ["province"],
    queryFn: async () => {
      const response = await addressPublicApiService.getProvinces();
      return response.data;
    },
  });

  const { data: districtData } = useQuery({
    queryKey: ["district", address.provinceId],
    queryFn: async () => {
      const response = await addressPublicApiService.getDistricts(
        address.provinceId,
      );
      return response.data;
    },
  });
  const { data: wardData } = useQuery({
    queryKey: ["ward", address.districtId],
    queryFn: async () => {
      const response = await addressPublicApiService.getWards(
        address.districtId,
      );
      return response.data;
    },
  });

  function formattedAddress() {
    return formatAddressName(
      address.provinceId,
      address.districtId,
      address.wardCode,
      address.description,
      provinceData,
      districtData,
      wardData,
    );
  }

  return (
    <Input
      className="my-1"
      addonAfter={
        address.isDefault ? (
          <>
            <Tooltip title="Địa chỉ mặc định">
              <FaCheckCircle className="text-green-600" />
            </Tooltip>
          </>
        ) : (
          ""
        )
      }
      readOnly={true}
      value={formattedAddress()}
    />
  );
};

export default AddressItem;
