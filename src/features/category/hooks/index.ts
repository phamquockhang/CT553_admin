import { useMutation } from "@tanstack/react-query";
import {
  itemService,
  productImageService,
  productPriceService,
  productService,
  productWeightService,
} from "../../../services";
import {
  IBuyingPrice,
  IItem,
  IProduct,
  ISellingPrice,
  IWeight,
} from "../../../interfaces";
import toast from "react-hot-toast";

interface UpdateItemArgs {
  itemId: number;
  updatedItem: IItem;
}

interface UpdateProductArgs {
  productId: number;
  updatedProduct: IProduct;
}

export const useItemService = () => {
  const { mutate: createItem, isPending: isCreatingItem } = useMutation({
    mutationFn: itemService.create,

    onSuccess: (data) => {
      if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: updateItem, isPending: isUpdatingItem } = useMutation({
    mutationFn: ({ itemId, updatedItem }: UpdateItemArgs) => {
      return itemService.update(itemId, updatedItem);
    },

    onSuccess: (data) => {
      if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  return { createItem, isCreatingItem, updateItem, isUpdatingItem };
};

export const useProductService = () => {
  const { mutate: createProduct, isPending: isCreatingProduct } = useMutation({
    mutationFn: productService.create,

    onSuccess: (data) => {
      if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: ({ productId, updatedProduct }: UpdateProductArgs) => {
      return productService.update(productId, updatedProduct);
    },

    onSuccess: (data) => {
      if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: createBuyingPrice } = useMutation({
    mutationFn: ({
      productId,
      newBuyingPrice,
    }: {
      productId: number;
      newBuyingPrice: Omit<IBuyingPrice, "buyingPriceId">;
    }) => {
      return productPriceService.createBuyingPrice(productId, newBuyingPrice);
    },

    onSuccess: (data) => {
      if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: createSellingPrice } = useMutation({
    mutationFn: ({
      productId,
      newSellingPrice,
    }: {
      productId: number;
      newSellingPrice: Omit<ISellingPrice, "sellingPriceId">;
    }) => {
      return productPriceService.createSellingPrice(productId, newSellingPrice);
    },

    onSuccess: (data) => {
      if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: createWeight } = useMutation({
    mutationFn: ({
      productId,
      newWeight,
    }: {
      productId: number;
      newWeight: Omit<IWeight, "weightId">;
    }) => {
      return productWeightService.createWeightOfProduct(productId, newWeight);
    },

    onSuccess: (data) => {
      if (data && !data.success) {
        toast.error(data?.message || "Operation failed");
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: createProductImage, isPending: isCreatingProductImage } =
    useMutation({
      mutationFn: (formData: FormData) => {
        return productImageService.create(formData);
      },

      onSuccess: (data) => {
        if (data && !data.success) {
          toast.error(data?.message || "Operation failed");
        }
      },

      onError: (error) => {
        console.log(error);
      },
    });

  const { mutate: updateProductImage, isPending: isUpdatingProductImage } =
    useMutation({
      mutationFn: ({
        productId,
        formData,
      }: {
        productId: number;
        formData: FormData;
      }) => {
        return productImageService.update(productId, formData);
      },

      onSuccess: (data) => {
        if (data && !data.success) {
          toast.error(data?.message || "Operation failed");
        }
      },

      onError: (error) => {
        console.log(error);
      },
    });

  return {
    createProduct,
    isCreatingProduct,
    updateProduct,
    isUpdatingProduct,
    createBuyingPrice,
    createSellingPrice,
    createWeight,
    createProductImage,
    isCreatingProductImage,
    updateProductImage,
    isUpdatingProductImage,
  };
};
