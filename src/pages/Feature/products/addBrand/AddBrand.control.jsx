import React, { createContext, useContext, useState } from "react";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { successToast } from "../../../../core/core-index";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addBrandSchema } from "./AddBrandSchema";

const AddBrandContext = createContext({
  addBrandSchema,
  SubmitBrandForm: () => {},
});

const AddBrandComponentController = (props) => {
  const { postData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const [fileImage, setFileImage] = useState([]);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    watch,
    trigger,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addBrandSchema),
  });

  const SubmitBrandForm = async (data) => {
    const { name, slug, image } = data;
    const finalImage = fileImage?.[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("image", image?.[0] || "");
    formData.append("type", "brand");
    try {
      const response = await postData(`${process.env.REACT_APP_BACKEND_URL}brand`, formData);
      reset();
      successToast("Brand Added successfully");
      navigate("/brand");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AddBrandContext.Provider
      value={{
        addBrandSchema,
        SubmitBrandForm,
        fileImage,
        menu,
        setFileImage,
        toggleMobileMenu,
        watch,
        handleSubmit,
        control,
        setValue,
        clearErrors,
        reset,
        trigger,
        register,
        formState: { errors },
      }}
    >
      {props.children}
    </AddBrandContext.Provider>
  );
};

export { AddBrandContext, AddBrandComponentController };
