/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  addproductApi,
  successToast,
  dropdown_api,
  inventory_note
} from "../../../../core/core-index";


import {addproductPageschema} from './Addproductschema';

import {
  productViewapi
} from "../../../../core/core-index";

const AddproductContext = createContext({
  addproductPageschema: addproductPageschema,
  submitaddProductForm: () => {},
});

const AddproductComponentController = (props) => {
  const { postData, getData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);

  const [contentEditor, setContentEditor] = useState("");
  const toggleMobileMenu = () => setMenu(!menu);

  const navigate = useNavigate();

  const submitaddProductForm = async (data) => {


    const formData = new FormData();


    formData.append("mfgdate", data.mfgdate);  // Assuming it's in the correct date format
    formData.append("expdate", data.expdate);  // Assuming it's in the correct date format
    formData.append("box", data.box);  // Assuming it's a number


    formData.append("type", data.type);
    formData.append("name", data.name);
    formData.append("sku", data.sku);
    formData.append(
      "discountValue",
      data.discountValue ? data.discountValue : 0
    );
    formData.append("barcode", data.barcode);
    formData.append("units", data.units?._id);
    formData.append("category", data.category?._id);
    formData.append("sellingPrice", data.sellingPrice);
    formData.append("purchasePrice", data.purchasePrice);
    formData.append("units", data.units);
    formData.append(
      "discountType",
      data.discountType?.id == undefined ? "" : data.discountType?.id
    );
    formData.append("alertQuantity", data.alertQuantity);
    formData.append("tax", data.tax?._id == undefined ? "" : data.tax?._id);
    formData.append("productDescription", contentEditor);
    formData.append(
      "images",
      data.images[0] == undefined ? "" : data.images[0]
    );
    try {
      const response = await postData(inventory_note.Add, formData);
      if (response.code === 200) {
        successToast("Product Added successfully");
        navigate("/goods-invert-note");
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/^[a-zA-Z]+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  const [taxData, setTax] = useState([]);
  const [units, setUnits] = useState([]);
  const [categoryData, setCategory] = useState([]);
  const [discount, setDiscount] = useState([
    { id: 2, text: "Percentage" },
    { id: 3, text: "Fixed" },
  ]);
  const [ProductOptiondata, setProductOptiondata] = useState([]);
  const [productValues,setProductvalues] = useState([]);


  const getmasterDetails = async () => {
    try {

      const productresponse = await getData(dropdown_api.product_api);
      if (productresponse.code === 200) {
        let data = productresponse.data;
        let DDOPTData = data.map((item) => {
          return {
            ...item,
            value: item._id,
            label: item.name,
          };
        });
        setProductOptiondata(DDOPTData);
        // setproductsCloneData(DDOPTData);
      }

      const Unitresponse = await getData(dropdown_api.unit_api);
      if (Unitresponse.code === 200) {
        setUnits(Unitresponse?.data);
      }

      const categoryRes = await getData(dropdown_api.category_api);
      if (categoryRes.code === 200) {
        setCategory(categoryRes?.data);
      }

      const Taxresponse = await getData(dropdown_api.tax_api);
      if (Taxresponse.code === 200) {
        setTax(Taxresponse?.data);
      }
    } catch (error) {
      //
    }
  };

  const getProductDetails = async (id) => {

    console.log("product info called - ",id)

    const url = `${productViewapi}/${id}`;
    try {
      const response = await getData(url);
      if (response.code === 200) {
        setProductvalues(response?.data);
      }
    } catch {
      return false;
    }
  };

 

  useEffect(() => {
    getmasterDetails();
  }, []);

  return (
    <AddproductContext.Provider
      value={{
        addproductPageschema,
        setContentEditor,
        contentEditor,
        menu,
        submitaddProductForm,
        handleKeyPress,
        toggleMobileMenu,
        discount,
        units,
        taxData,
        categoryData,
        ProductOptiondata,
        getProductDetails,
        productValues
      }}
    >
      {props.children}
    </AddproductContext.Provider>
  );
};

export { AddproductContext, AddproductComponentController };
