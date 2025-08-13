import React, { useEffect, useContext, useState } from "react";
import { AddproductContext } from "./Addproduct.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { DropIcon } from "../../../../common/imagepath";
import Select from "react-select";
import { handleKeyDown, handleNumberRestriction } from "../../../../constans/globals";
import useFilePreview from "../hooks/useFilePreview";
import { ApiServiceContext } from "../../../../core/core-index";

const Addproduct = () => {
  const {
    addproductPageschema,
    // getskuCode,
    submitaddProductForm,
    discount,
    brand,
    units,
    taxData,
    categoryData,
  } = useContext(AddproductContext);
  const {
    handleSubmit,
    setValue,
    register,
    watch,
    control,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addproductPageschema) });
  const { getData } = useContext(ApiServiceContext);

  const [skuNumber, setskuNumber] = useState("");
  const [barcode, setbarcode] = useState("");
  const [imgerror, setImgError] = useState("");
  const file = watch("images");
  const [filePreview] = useFilePreview(file, setImgError);

  useEffect(() => {
    setValue("sku", skuNumber);
    clearErrors("sku");
    setValue("type", "product");
  }, [skuNumber]);

  // const getbarcode = async () => {
  //   try {
  //     setValue("sku", "");
  //     const barcodes = await getData("/products/getbarcode", false);
  //     if (barcodes.code === 200) {
  //       setbarcode(barcodes.data); // Use setValue to update the field value
  //       clearErrors("barcode");
  //     }
  //   } catch (error) {
  //     //
  //   }
  // };
  // const getskuCode = async () => {
  //   try {
  //     setValue("sku", "");
  //     const skuCoderes = await getData("/products/generateSKU", false);
  //     if (skuCoderes.code === 200) {
  //       setskuNumber(skuCoderes.data);
  //     }
  //   } catch (error) {
  //     //
  //   }
  // };
  const getbarcode = async () => {
    try {
      setValue("barcode", ""); // Clear the current barcode value
      const response = await getData("/products/getbarcode", false);

      if (response?.code === 200 && response?.data) {
        setbarcode(response.data);
        setValue("barcode", response.data); // Update the form field with the new barcode
        clearErrors("barcode");
      } else {
        console.error("Failed to generate barcode:", response?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  };

  const getskuCode = async () => {
    try {
      setValue("sku", ""); // Clear the current SKU value
      const response = await getData("/products/generateSKU", false);

      if (response?.code === 200 && response?.data) {
        setskuNumber(response.data);
        setValue("sku", response.data); // Update the form field with the new SKU code
        clearErrors("sku");
      } else {
        console.error("Failed to generate SKU code:", response?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error generating SKU code:", error);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Add Products</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card-body">
                <form onSubmit={handleSubmit(submitaddProductForm)}>
                  <div className="form-group-item">
                    <h5 className="form-title">Basic Details</h5>
                    <div className="row">
                      {/*<div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Item Type<span className="text-danger"> *</span>
                          </label>
                          <div className="align-center">
                            <div className="form-control me-3">
                              <label className="custom_radio me-3 mb-0">
                                <input
                                  {...register("type")}
                                  type="radio"
                                  value="product"
                                  id="product_type"
                                />
                                <span className="checkmark" /> Product
                              </label>
                            </div>
                            <div className="form-control">
                              <label className="custom_radio mb-0">
                                <input
                                  {...register("type")}
                                  type="radio"
                                  value="service"
                                  id="service_type"
                                />
                                <span className="checkmark" /> Service
                              </label>
                            </div>
                          </div>
                          <small>{errors?.type?.message}</small>
                        </div>
                      </div>*/}
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Product Name <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="name"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.name ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Product Name"
                                autoComplete="false"
                                
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.name?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group add-products input_text">
                          <label>
                            Product Code (SKU)
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="sku"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.sku ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Product Code"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <button
                            type="button"
                            onClick={() => getskuCode()}
                            className="btn btn-primary"
                          >
                            Generate Code
                          </button>
                          <small>{errors?.sku?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            HSN Code <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="hsnCode"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${errors?.hsnCode ? "error-input" : ""}`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter HSN Code"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.hsnCode?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group add-products input_text">
                          <label>
                            Generate Barcode <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="barcode"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${errors?.barcode ? "error-input" : ""}`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Barcode"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <button
                            type="button"
                            onClick={() => getbarcode()}
                            className="btn btn-primary"
                          >
                            Generate Code
                          </button>
                          <small>{errors?.barcode?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Brand {/*<span className="text-danger"> *</span>*/}
                          </label>
                          <Controller
                            name="brand"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`react-selectcomponent form-control ${
                                  errors?.brand ? "error-input" : ""
                                }`}
                                getOptionLabel={(option) => `${option.name}`}
                                getOptionValue={(option) => `${option._id}`}
                                options={brand}
                                isSearchable={true}
                                placeholder={`Select Brand`}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.brand?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Category<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`react-selectcomponent form-control ${
                                  errors?.category ? "error-input" : ""
                                }`}
                                getOptionLabel={(option) => `${option.name}`}
                                getOptionValue={(option) => `${option._id}`}
                                options={categoryData}
                                isSearchable={true}
                                placeholder={`Select Item category`}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.category?._id?.message}</small>
                        </div>
                      </div>
                      <h5 className="form-title">Weight Details</h5>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {/* Number of Packs for a Box */}
                        <div className="form-group input_text">
                          <label>
                            Number of items<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="numberOfPacks"
                            control={control}
                            rules={{
                              required: "Number of Packs is required",
                              min: { value: 1, message: "Must be at least 1" },
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                className={`form-control ${
                                  errors?.numberOfPacks ? "error-input" : ""
                                }`}
                                placeholder="Enter the number of packs"
                              />
                            )}
                          />
                          <small>{errors?.numberOfPacks?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {/* Master Case Type */}
                        <div className="form-group input_text">
                          <label>
                            Master Case Type
                          </label>
                          <Controller
                            name="masterCaseType"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${
                                  errors?.masterCaseType ? "error-input" : ""
                                }`}
                                placeholder="Enter master case type"
                              />
                            )}
                          />
                          <small>{errors?.masterCaseType?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {/* Slot */}
                        <div className="form-group input_text">
                          <label>
                            Slot
                          </label>
                          <Controller
                            name="slot"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${
                                  errors?.slot ? "error-input" : ""
                                }`}
                                placeholder="Enter slot"
                              />
                            )}
                          />
                          <small>{errors?.slot?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Weight <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="weight"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${errors?.weight ? "error-input" : ""}`}
                                type="number"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Weight"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.weight?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Units<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="units"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`react-selectcomponent form-control ${
                                  errors?.units ? "error-input" : ""
                                }`}
                                getOptionLabel={(option) => `${option.name}`}
                                getOptionValue={(option) => `${option._id}`}
                                options={units}
                                isSearchable={true}
                                placeholder={`Select Item Unit`}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.units?._id?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {/* Primary Unit */}
                        <div className="form-group input_text">
                          <label>
                            Primary Unit<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="primaryUnit"
                            control={control}
                            rules={{ required: "Primary Unit is required" }}
                            render={({ field }) => (
                              <select
                                {...field}
                                className={`form-control ${
                                  errors?.primaryUnit ? "error-input" : ""
                                }`}
                              >
                                <option value="">None</option>
                                <option value="Bag">BAGS (Bag)</option>
                                <option value="Btl">BOTTLES (Btl)</option>
                                <option value="Box">BOX (Box)</option>
                                <option value="Bdl">BUNDLES (Bdl)</option>
                                <option value="Can">CANS (Can)</option>
                                <option value="Ctn">CARTONS (Ctn)</option>
                                <option value="Dzn">DOZENS (Dzn)</option>
                                <option value="Gm">GRAMMES (Gm)</option>
                                <option value="Kg">KILOGRAMS (Kg)</option>
                                <option value="Ltr">LITRE (Ltr)</option>
                                <option value="Mtr">METERS (Mtr)</option>
                                <option value="Ml">MILLILITER (Ml)</option>
                                <option value="Nos">NUMBERS (Nos)</option>
                                <option value="Pac">PACKS (Pac)</option>
                                <option value="Prs">PAIRS (Prs)</option>
                                <option value="Pcs">PIECES (Pcs)</option>
                              </select>
                            )}
                          />
                          <small>{errors?.primaryUnit?.message}</small>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {/* Secondary Unit */}
                        <div className="form-group input_text">
                          <label>
                            Secondary Unit<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="secondaryUnit"
                            control={control}
                            rules={{ required: "Secondary Unit is required" }}
                            render={({ field }) => (
                              <select
                                  {...field}
                                  className={`form-control ${
                                    errors?.secondaryUnit ? "error-input" : ""
                                  }`}
                                >
                                <option value="">None</option>
                                <option value="Bag">BAGS (Bag)</option>
                                <option value="Btl">BOTTLES (Btl)</option>
                                <option value="Box">BOX (Box)</option>
                                <option value="Bdl">BUNDLES (Bdl)</option>
                                <option value="Can">CANS (Can)</option>
                                <option value="Ctn">CARTONS (Ctn)</option>
                                <option value="Dzn">DOZENS (Dzn)</option>
                                <option value="Gm">GRAMMES (Gm)</option>
                                <option value="Kg">KILOGRAMS (Kg)</option>
                                <option value="Ltr">LITRE (Ltr)</option>
                                <option value="Mtr">METERS (Mtr)</option>
                                <option value="Ml">MILLILITER (Ml)</option>
                                <option value="Nos">NUMBERS (Nos)</option>
                                <option value="Pac">PACKS (Pac)</option>
                                <option value="Prs">PAIRS (Prs)</option>
                                <option value="Pcs">PIECES (Pcs)</option>
                            </select>
                            )}
                          />
                          <small>{errors?.secondaryUnit?.message}</small>
                        </div>
                      </div>
                      
                      
                      
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Alert Quantity{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="alertQuantity"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.alertQuantity ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onKeyDown={(e) => handleKeyDown(e)}
                                onChange={onChange}
                                placeholder="Enter Alert Quantity"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.alertQuantity?.message}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group-item">
                    <h5 className="form-title">Pricing Details</h5>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Selling Price{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="sellingPrice"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.sellingPrice ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyDown={(e) => handleKeyDown(e)}
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Selling Price"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.sellingPrice?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Purchase Price{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="purchasePrice"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.purchasePrice ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onKeyDown={(e) => handleKeyDown(e)}
                                onKeyPress={handleNumberRestriction}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("sellingPrice");
                                }}
                                placeholder="Enter Purchase Price"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.purchasePrice?.message}</small>
                        </div>
                      </div>
                      {/* <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Wholesale Price <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="wholesalePrice"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${errors?.wholesalePrice ? "error-input" : ""}`}
                                type="number"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Wholesale Price"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.wholesalePrice?.message}</small>
                        </div>
                      </div> */}
                      {/*<div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Discount Value{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="discountValue"
                            type=" number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.discountValue ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter discount Value"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.discountValue?.message}</small>
                        </div>
                      </div>*/}
                      
                      
                      

                      
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Half Skit Quantity</label>
                          <Controller
                            name="halfSkitQty"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className="form-control"
                                type="number"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Half Skit Quantity"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Half Skit Price</label>
                          <Controller
                            name="halfSkitPrice"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className="form-control"
                                type="number"
                                step="0.01"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Half Skit Price"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Full Skit Quantity</label>
                          <Controller
                            name="fullSkitQty"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className="form-control"
                                type="number"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Full Skit Quantity"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Full Skit Price</label>
                          <Controller
                            name="fullSkitPrice"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className="form-control"
                                type="number"
                                step="0.01"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Full Skit Price"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Tax <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="tax"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`react-selectcomponent form-control ${
                                  errors?.tax ? "error-input" : ""
                                }`}
                                getOptionLabel={(option) =>
                                  `${option.name}`
                                }
                                getOptionValue={(option) => `${option._id}`}
                                options={taxData}
                                isSearchable={true}
                                placeholder={`Select item's Tax`}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.tax?._id?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Discount Type{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="discountType"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`react-selectcomponent form-control ${
                                  errors?.discountType ? "error-input" : ""
                                }`}
                                getOptionLabel={(option) => `${option.text}`}
                                getOptionValue={(option) => `${option.id}`}
                                options={discount}
                                isSearchable={true}
                                placeholder={`Select Item Discount Type`}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.discountType?.id?.message}</small>
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                        <div className="form-group">
                          <label>Product Image</label>
                          <div className="form-group service-upload mb-0">
                            <span>
                              <img src={DropIcon} alt="upload" />
                            </span>
                            <h6 className="drop-browse align-center">
                              Drop your files here or
                              <span className="text-primary ms-1">browse</span>
                            </h6>
                            <p className="text-muted">Maximum size: 50MB</p>

                            <Controller
                              name="images"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    type="file"
                                    multiple=""
                                    id="image_sign"
                                    {...register("images")}
                                  />
                                </>
                              )}
                            />
                            <div id="frames" />
                          </div>
                          {!imgerror && filePreview && (
                            <img
                              src={filePreview}
                              className="uploaded-imgs"
                              style={{
                                display: "flex",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="add-vendor-btns text-end">
                    <Link
                      to="/product-list"
                      className="btn btn-primary cancel me-2"
                    >
                      Cancel
                    </Link>
                    <button className="btn btn-primary" type="submit">
                      Add Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Addproduct;
