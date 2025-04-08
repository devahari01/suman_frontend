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
import { getConfirmLocale } from "antd/es/modal/locale";
import DatePickerComponent from "../../datePicker/DatePicker";

const Addproduct = () => {


  const {
    addproductPageschema,
    // getskuCode,
    submitaddProductForm,
    discount,
    units,
    taxData,
    categoryData,
    ProductOptiondata,
    getProductDetails,
    productValues
  } = useContext(AddproductContext);

  const defaultValues = productValues
  ? {
      discountType: { id: productValues.discountType, text: "" }, // Assume `text` is set dynamically
      discountValue: productValues.discountValue,
      tax: productValues.tax ? { _id: productValues.tax._id } : null,
      units: productValues.units ? { _id: productValues.units._id } : null,
      category: productValues.category ? { _id: productValues.category._id } : null,
      type: productValues.type || "",
      name: productValues.name || "",
      sku: productValues.sku || "",
      sellingPrice: productValues.sellingPrice || "",
      purchasePrice: productValues.purchasePrice || "",
      alertQuantity: productValues.alertQuantity || "",
    }
  : {}; 

  const {
    handleSubmit,
    setValue,
    register,
    watch,
    control,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addproductPageschema),
    defaultValues
  });

  const { getData } = useContext(ApiServiceContext);

  const [skuNumber, setskuNumber] = useState("");
  const [imgerror, setImgError] = useState("");
  const file = watch("images");
  const [filePreview] = useFilePreview(file, setImgError);

  useEffect(() => {
    setValue("sku", skuNumber);
    clearErrors("sku");
  }, [skuNumber]);

  const getskuCode = async () => {
    try {
      setValue("sku", "");
      const skuCoderes = await getData("/products/generateSKU", false);
      if (skuCoderes.code === 200) {
        setskuNumber(skuCoderes.data);
      }
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    if (productValues?.type) {
      setValue("type", productValues.type);
    }
    if (productValues?.name) {
      setValue("name", productValues.name);
    }

    if(productValues){
      // setValue("type", productValues?.type);
      // setValue("name", productValues?.name);
      setValue("sku", productValues?.sku);
      setValue("discountValue", productValues?.discountValue);
      setValue("barcode", productValues?.barcode);
      setValue("units", productValues?.units);
      setValue("category", productValues?.category);
      setValue("tax", productValues?.tax);
      setValue("sellingPrice", productValues?.sellingPrice);
      setValue("purchasePrice", productValues?.purchasePrice);

      let discountType = discount.find(
        (data) => data.id == productValues?.discountType
      );
      setValue("discountType", discountType);
      setValue("alertQuantity", productValues?.alertQuantity);
    }
  }, [productValues, setValue]);

  useEffect(() => {
    console.log("product info in add product file",{productValues});
  }, [productValues]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Add Products / Inward</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card-body">
                <form onSubmit={handleSubmit(submitaddProductForm)}>

                  <div className="form-group-item">
                    <h5 className="form-title">Basic Details</h5>
                    <div className="row">

                     <div className="col-lg-12 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Select Product{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="products"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`react-selectcomponent form-control ${
                                  errors?.discountType ? "error-input" : ""
                                }`}
                                getOptionLabel={(option) => `${option.name}`}
                                getOptionValue={(option) => `${option._id}`}
                                options={ProductOptiondata}
                                isSearchable={true}
                                placeholder={`Select Item Discount Type`}
                                classNamePrefix="select_kanakku"
                                onChange={(e) => {
                                  console.log({e});
                                  getProductDetails(e.value);
                                }}
                              />
                            )}
                          />
                          <small>{errors?.discountType?.id?.message}</small>
                        </div>
                      </div>

                      {/* <div className="col-lg-4 col-md-6 col-sm-12">
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
                                  defaultChecked={productValues?.type === "product"} 
                                  disabled
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
                                  defaultChecked={productValues?.type === "service"} 
                                  disabled
                                />
                                <span className="checkmark" /> Service
                              </label>
                            </div>
                          </div>
                          <small>{errors?.type?.message}</small>
                        </div>
                      </div> */}

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
                                disabled={true}
                                
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
                                disabled
                              />
                            )}
                            defaultValue=""
                          />
                          {/*<button
                            type="button"
                            onClick={() => getskuCode()}
                            className="btn btn-primary"
                          >
                            Generate Code
                          </button>*/}
                          <small>{errors?.sku?.message}</small>
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
                                isDisabled={true} 
                                
                              />
                            )}
                          />
                          <small>{errors?.category?._id?.message}</small>
                        </div>
                      </div>

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
                                disabled
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
                                disabled
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.purchasePrice?.message}</small>
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
                                isDisabled={true}
                              />
                            )}
                          />
                          <small>{errors?.units?._id?.message}</small>
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
                                isDisabled={true}
                              />
                            )}
                          />
                          <small>{errors?.discountType?.id?.message}</small>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
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
                                disabled
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.discountValue?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text add-products">
                          <label>Generate Barcode</label>
                          <Controller
                            name="barcode"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.barcode ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter the Barcode"
                                autoComplete="false"
                                disabled
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.barcode?.message}</small>
                          
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
                                disabled
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.alertQuantity?.message}</small>
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
                                  `${option.name} (${option.taxRate}%)`
                                }
                                getOptionValue={(option) => `${option._id}`}
                                options={taxData}
                                isSearchable={true}
                                placeholder={`Select item's Tax`}
                                classNamePrefix="select_kanakku"
                                isDisabled={true}
                              />
                            )}
                          />
                          <small>{errors?.tax?._id?.message}</small>
                        </div>
                      </div>

                      
                      <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group date-form-group">
                            <label>Manufacture Date</label>
                            <Controller
                              control={control}
                              className={`datetimepicker form-control ${
                                errors?.mfgdate ? "error-input" : ""
                              }`}
                              name="mfgdate"
                              render={({ field: { value, onChange, ref } }) => (
                                <DatePickerComponent
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </div>
                       </div>

                       <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group date-form-group">
                            <label>Expire Date</label>
                            <Controller
                              control={control}
                              className={`datetimepicker form-control ${
                                errors?.expdate ? "error-input" : ""
                              }`}
                              name="expdate"
                              render={({ field: { value, onChange, ref } }) => (
                                <DatePickerComponent
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </div>
                       </div>

                       <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Box Count{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="box"
                            type=" number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.box ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter box Count"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.discountValue?.message}</small>
                        </div>
                      </div>

                  
                    </div>

                    

                  </div>
                  <div className="form-group-item">
                    <div className="row">
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
