/* eslint-disable react/prop-types */

import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  productupdateapi,
  dropdown_api,
  productViewapi,
  successToast,
  warningToast,
} from "../../../../core/core-index";
import { useParams, useNavigate } from "react-router-dom";

const EditproductPageschema = yup
  .object()
  .shape({
    discountType: yup.object({
      id: yup.string().required("Choose discount type"),
    }),
    discountValue: yup
      .number()
      .typeError("Discount Value is Required")
      .when(
        ["discountType", "sellingPrice"],
        (discountType, sellingPrice, schema) => {
          if (discountType.text === "Percentage") {
            return schema.max(99, "Discount Value Must Be Less Than 100");
          } else if (discountType.text === "Fixed") {
            return schema.lessThan(
              sellingPrice,
              "Discount Value Must Be Less Than The Selling Price"
            );
          }
          return schema;
        }
      ),
    tax: yup.object({
      _id: yup.string().required("Enter Tax"),
    }),
    units: yup.object({
      _id: yup.string().required("Choose Unit"),
    }),
    category: yup.object({
      _id: yup.string().required("Choose Category"),
    }),
    type: yup.string().typeError("Choose Any Type"),
    name: yup.string().required("Enter Product Name"),
    sku: yup.number().typeError("SKU Must Be a Number"),
    sellingPrice: yup
      .number()
      .typeError("Enter a valid Selling Price")
      .test(
        "valid-number",
        "Enter a valid Selling Price",
        (value) => typeof value === "number" && !/[eE+-]/.test(value?.toString())
      )
      .positive("Selling Price must be a positive number")
      .when("purchasePrice", (purchasePrice, schema) =>
        purchasePrice
          ? schema.moreThan(purchasePrice, "Selling Price must be greater than the Purchase Price")
          : schema
      )
      .required("Selling Price is required"),
    purchasePrice: yup
      .number()
      .typeError("Enter a valid Purchase Price")
      .test(
        "valid-number",
        "Enter a valid Purchase Price",
        (value) => typeof value === "number" && !/[eE+-]/.test(value?.toString())
      )
      .positive("Purchase Price must be a positive number")
      .required("Purchase Price is required"),
    alertQuantity: yup
      .number()
      .typeError("Enter Alert Quantity")
      .positive("Alert Quantity Must Be a Positive Number")
      .integer("Alert Quantity Must Be a Integer"),
    // Adding missing fields from Add Product
    hsnCode: yup.string().nullable(),
    brand: yup.object({
      _id: yup.string().nullable(),
    }).nullable(),
    weight: yup.number().typeError("Enter valid Weight").positive("Weight must be positive").nullable(),
    wholesalePrice: yup
      .number()
      .typeError("Enter valid Wholesale Price")
      .positive("Wholesale Price must be a positive number")
      .nullable(),
    primaryUnit: yup.string().nullable(),
    secondaryUnit: yup.string().nullable(),
    numberOfPacks: yup
      .number()
      .typeError("Enter Number Of Packs")
      .positive("Number Of Packs must be a positive number")
      .integer("Number Of Packs must be an integer")
      .nullable(),
    halfSkitQty: yup
      .number()
      .typeError("Enter Half Skit Quantity")
      .integer("Half Skit Quantity must be an integer")
      .positive("Must be a positive number")
      .nullable(),
    halfSkitPrice: yup
      .number()
      .typeError("Enter Half Skit Price")
      .positive("Must be a positive number")
      .nullable(),
    fullSkitQty: yup
      .number()
      .typeError("Enter Full Skit Quantity")
      .integer("Full Skit Quantity must be an integer")
      .positive("Must be a positive number")
      .nullable(),
    fullSkitPrice: yup
      .number()
      .typeError("Enter Full Skit Price")
      .positive("Must be a positive number")
      .nullable(),
    masterCaseType: yup.string().nullable(),
    slot: yup.string().nullable(),
  })
  .required();

const EditproductContext = createContext({
  EditproductPageschema: EditproductPageschema,
  UpdateForm: () => {},
});

const EditproductComponentController = (props) => {
  const { getData, putData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const [contentEditor, setContentEditor] = useState("");
  const navigate = useNavigate();
  const [productValues, setProductvalues] = useState([]);
  const [skuNumber, setskuNumber] = useState("");
  const [categoryData, setCategory] = useState([]);
  const toggleMobileMenu = () => setMenu(!menu);
  const [imgerror, setImgError] = useState("");
  const { id } = useParams();
  const [brand, setBrand] = useState([]);
  const [taxData, setTax] = useState([]);
  const [units, setUnits] = useState([]);
  const [discount, setDiscount] = useState([
    { id: 2, text: "Percentage" },
    { id: 3, text: "Fixed" },
  ]);

  const getskuCode = async () => {
    try {
      const skuCoderes = await getData("/products/generateSKU", false);
      if (skuCoderes.code === 200) {
        setskuNumber(skuCoderes.data);
      }
    } catch (error) {
      //
    }
  };

  const getmasterDetails = async () => {
    try {
      const Unitresponse = await getData(dropdown_api.unit_api);
      if (Unitresponse.code === 200) {
        setUnits(Unitresponse?.data);
      }

      const Brandresponse = await getData(dropdown_api.brand_api);
      if (Brandresponse.code === 200) {
        setBrand(Brandresponse?.data);
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

  const getProductDetails = async () => {
    const url = `${productViewapi}/${id}`;
    try {
      const response = await getData(url);
      if (response.code === 200) {
        setProductvalues(response?.data);
        setContentEditor(response?.data?.productDescription);
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    getProductDetails();
    getmasterDetails();
  }, []);

  const UpdateForm = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("sku", data.sku);
    formData.append("discountValue", data.discountValue);
    formData.append("barcode", data.barcode);
    formData.append("units", data.units?._id);
    formData.append("brand", data.brand?._id || "");
    formData.append("category", data.category?._id);
    formData.append("weight", data.weight || 0);
    formData.append("sellingPrice", data.sellingPrice);
    formData.append("purchasePrice", data.purchasePrice);
    formData.append("discountType", data.discountType?.id);
    formData.append("alertQuantity", data.alertQuantity);
    formData.append("tax", data.tax?._id == undefined ? "" : data.tax?._id);
    formData.append("productDescription", contentEditor);
    formData.append(
      "images",
      data.images?.[0] == undefined ? "" : data.images?.[0]
    );
    // Adding missing fields
    formData.append("hsnCode", data.hsnCode || "");
    formData.append("wholesalePrice", data.wholesalePrice || 0);
    formData.append("primaryUnit", data.primaryUnit || "");
    formData.append("secondaryUnit", data.secondaryUnit || "");
    formData.append("numberOfPacks", data.numberOfPacks || 0);
    formData.append("halfSkitQty", data.halfSkitQty || 0);
    formData.append("halfSkitPrice", data.halfSkitPrice || 0);
    formData.append("fullSkitQty", data.fullSkitQty || 0);
    formData.append("fullSkitPrice", data.fullSkitPrice || 0);
    formData.append("masterCaseType", data.masterCaseType || "");
    formData.append("slot", data.slot || "");
    formData.append("_id", id);

    try {
      const response = await putData(`${productupdateapi}/${id}`, formData);
      if (response.code == 200) {
        successToast("Product Updated Successfully");
        navigate("/product-list");
      }
    } catch (err) {
      //
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/^[a-zA-Z]+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      setImgError("");
    }
  }, [imgerror]);

  return (
    <EditproductContext.Provider
      value={{
        EditproductPageschema,
        skuNumber,
        setskuNumber,
        productValues,
        UpdateForm,
        discount,
        brand,
        units,
        taxData,
        categoryData,
        imgerror,
        setImgError,
        menu,
        toggleMobileMenu,
        contentEditor,
        setContentEditor,
        handleKeyPress,
        getskuCode,
      }}
    >
      {props.children}
    </EditproductContext.Provider>
  );
};

export { EditproductContext, EditproductComponentController };
