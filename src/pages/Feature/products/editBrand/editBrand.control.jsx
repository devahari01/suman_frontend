import React, { useState, useEffect, createContext, useContext } from "react";
import { brandApi } from "../../../../constans/apiname";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ApiServiceContext, successToast } from "../../../../core/core-index";

const addBrandSchema = yup.object().shape({
  name: yup.string().required("Enter Name"),
  slug: yup.string().max(20, "Maximum length exceeded").required("Enter Slug"),
});

const EditBrandContext = createContext();

const EditBrandComponentController = ({ children }) => {
  const [brandDetail, setBrandDetail] = useState([]);
  const [fileImage, setFileImage] = useState([]);
  const { getData, putData } = useContext(ApiServiceContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getBrandDetails();
  }, [id]);

  const getBrandDetails = async () => {
    try {
      const response = await getData(`${process.env.REACT_APP_BACKEND_URL}brand/${id}`);
      if (response?.data?.brand_details) {
        setBrandDetail(response.data.brand_details);
      }
    } catch {
      return false;
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("logo", fileImage?.[0] || brandDetail?.logo);

    try {
      const response = await putData(`${process.env.REACT_APP_BACKEND_URL}brand/${brandDetail?._id}`, formData);
      if (response) {
        successToast("Brand Updated successfully");
        navigate("/brand");
      }
    } catch {
      return false;
    }
  };

  return (
    <EditBrandContext.Provider
      value={{
        addBrandSchema,
        brandDetail,
        setBrandDetail,
        fileImage,
        setFileImage,
        onSubmit,
      }}
    >
      {children}
    </EditBrandContext.Provider>
  );
};

export { EditBrandComponentController, EditBrandContext };
