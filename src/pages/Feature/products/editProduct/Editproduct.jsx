import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { DropIcon } from "../../../../common/imagepath";
import { EditproductContext } from "./Editproduct.control";
import useFilePreview from "../hooks/useFilePreview";
import { handleKeyDown, handleNumberRestriction } from "../../../../constans/globals";
import { warningToast } from "../../../../core/core-index";

const Editproduct = () => {
  const {
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
    contentEditor,
    setContentEditor,
    getskuCode,
  } = useContext(EditproductContext);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    clearErrors,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditproductPageschema)
  });

  const [files, setFile] = useState([]);
  const file = watch("images");
  const [filePreview] = useFilePreview(file, setImgError);

  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      resetField("images");
      setImgError("");
    }
  }, [imgerror]);

  useEffect(() => {
    if (filePreview) setFile(filePreview);
  }, [filePreview]);

  useEffect(() => {
    setValue("sku", skuNumber);
    clearErrors("sku");
  }, [skuNumber]);

  useEffect(() => {
    if (productValues && Object.keys(productValues).length > 0) {
      setskuNumber(productValues?.sku);
      setFile(productValues?.images);
      setValue("type", productValues?.type);
      setValue("name", productValues?.name);
      setValue("sku", productValues?.sku);
      setValue("discountValue", productValues?.discountValue);
      setValue("barcode", productValues?.barcode);
      setValue("units", productValues?.units);
      setValue("category", productValues?.category);
      setValue("weight", productValues?.weight);
      setValue("tax", productValues?.tax);
      setValue("sellingPrice", productValues?.sellingPrice);
      setValue("purchasePrice", productValues?.purchasePrice);
      
      let discountType = discount.find(
        (data) => data.id == productValues?.discountType
      );
      setValue("discountType", discountType);
      setValue("alertQuantity", productValues?.alertQuantity);
      
      // Setting missing fields
      setValue("hsnCode", productValues?.hsnCode);
      setValue("brand", productValues?.brand);
      setValue("wholesalePrice", productValues?.wholesalePrice);
      setValue("primaryUnit", productValues?.primaryUnit);
      setValue("secondaryUnit", productValues?.secondaryUnit);
      setValue("numberOfPacks", productValues?.numberOfPacks);
      setValue("halfSkitQty", productValues?.halfSkitQty);
      setValue("halfSkitPrice", productValues?.halfSkitPrice);
      setValue("fullSkitQty", productValues?.fullSkitQty);
      setValue("fullSkitPrice", productValues?.fullSkitPrice);
      setValue("masterCaseType", productValues?.masterCaseType);
      setValue("slot", productValues?.slot);
    }
  }, [productValues, discount]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Edit</h4>
              <h6>Update your product</h6>
            </div>
          </div>
          <form onSubmit={handleSubmit(UpdateForm)}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input
                        type="text"
                        {...register("name")}
                        className={`form-control ${errors?.name ? "error-input" : ""}`}
                      />
                      <small>{errors?.name?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Category</label>
                      <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`react-selectcomponent ${errors?.category ? "error-border" : ""}`}
                            options={categoryData}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option._id}
                            placeholder="Choose Category"
                          />
                        )}
                      />
                      <small>{errors?.category?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Brand</label>
                      <Controller
                        control={control}
                        name="brand"
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`react-selectcomponent ${errors?.brand ? "error-border" : ""}`}
                            options={brand}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option._id}
                            placeholder="Choose Brand"
                            isClearable
                          />
                        )}
                      />
                      <small>{errors?.brand?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Unit</label>
                      <Controller
                        control={control}
                        name="units"
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`react-selectcomponent ${errors?.units ? "error-border" : ""}`}
                            options={units}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option._id}
                            placeholder="Choose Unit"
                          />
                        )}
                      />
                      <small>{errors?.units?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>SKU</label>
                      <input
                        type="text"
                        {...register("sku")}
                        className={`form-control ${errors?.sku ? "error-input" : ""}`}
                      />
                      <small>{errors?.sku?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>HSN Code</label>
                      <input
                        type="text"
                        {...register("hsnCode")}
                        className={`form-control ${errors?.hsnCode ? "error-input" : ""}`}
                        placeholder="Enter HSN Code"
                      />
                      <small>{errors?.hsnCode?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Barcode</label>
                      <input
                        type="text"
                        {...register("barcode")}
                        className="form-control"
                        placeholder="Enter Barcode"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Weight</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("weight")}
                        className={`form-control ${errors?.weight ? "error-input" : ""}`}
                        placeholder="Enter Weight"
                        onKeyDown={handleKeyDown}
                      />
                      <small>{errors?.weight?.message}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing Section */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Purchase Price</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("purchasePrice")}
                        className={`form-control ${errors?.purchasePrice ? "error-input" : ""}`}
                        onKeyDown={handleKeyDown}
                      />
                      <small>{errors?.purchasePrice?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Selling Price</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("sellingPrice")}
                        className={`form-control ${errors?.sellingPrice ? "error-input" : ""}`}
                        onKeyDown={handleKeyDown}
                      />
                      <small>{errors?.sellingPrice?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Wholesale Price</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("wholesalePrice")}
                        className={`form-control ${errors?.wholesalePrice ? "error-input" : ""}`}
                        placeholder="Enter Wholesale Price"
                        onKeyDown={handleKeyDown}
                      />
                      <small>{errors?.wholesalePrice?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Discount Type</label>
                      <Controller
                        control={control}
                        name="discountType"
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`react-selectcomponent ${errors?.discountType ? "error-border" : ""}`}
                            options={discount}
                            getOptionLabel={(option) => option.text}
                            getOptionValue={(option) => option.id}
                            placeholder="Choose Discount Type"
                          />
                        )}
                      />
                      <small>{errors?.discountType?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Discount Value</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("discountValue")}
                        className={`form-control ${errors?.discountValue ? "error-input" : ""}`}
                        onKeyDown={handleKeyDown}
                      />
                      <small>{errors?.discountValue?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Tax</label>
                      <Controller
                        control={control}
                        name="tax"
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`react-selectcomponent ${errors?.tax ? "error-border" : ""}`}
                            options={taxData}
                            getOptionLabel={(option) => `${option.name} (${option.percentage}%)`}
                            getOptionValue={(option) => option._id}
                            placeholder="Choose Tax"
                          />
                        )}
                      />
                      <small>{errors?.tax?.message}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Units and Packing Section */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Primary Unit</label>
                      <input
                        type="text"
                        {...register("primaryUnit")}
                        className={`form-control ${errors?.primaryUnit ? "error-input" : ""}`}
                        placeholder="Enter Primary Unit"
                      />
                      <small>{errors?.primaryUnit?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Secondary Unit</label>
                      <input
                        type="text"
                        {...register("secondaryUnit")}
                        className={`form-control ${errors?.secondaryUnit ? "error-input" : ""}`}
                        placeholder="Enter Secondary Unit"
                      />
                      <small>{errors?.secondaryUnit?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Number of Packs</label>
                      <input
                        type="number"
                        {...register("numberOfPacks")}
                        className={`form-control ${errors?.numberOfPacks ? "error-input" : ""}`}
                        placeholder="Enter Number of Packs"
                        onKeyDown={handleNumberRestriction}
                      />
                      <small>{errors?.numberOfPacks?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Alert Quantity</label>
                      <input
                        type="number"
                        {...register("alertQuantity")}
                        className={`form-control ${errors?.alertQuantity ? "error-input" : ""}`}
                        onKeyDown={handleNumberRestriction}
                      />
                      <small>{errors?.alertQuantity?.message}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skit Section */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Half Skit Quantity</label>
                      <input
                        type="number"
                        {...register("halfSkitQty")}
                        className={`form-control ${errors?.halfSkitQty ? "error-input" : ""}`}
                        placeholder="Enter Half Skit Quantity"
                        onKeyDown={handleNumberRestriction}
                      />
                      <small>{errors?.halfSkitQty?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Half Skit Price</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("halfSkitPrice")}
                        className={`form-control ${errors?.halfSkitPrice ? "error-input" : ""}`}
                        placeholder="Enter Half Skit Price"
                        onKeyDown={handleKeyDown}
                      />
                      <small>{errors?.halfSkitPrice?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Full Skit Quantity</label>
                      <input
                        type="number"
                        {...register("fullSkitQty")}
                        className={`form-control ${errors?.fullSkitQty ? "error-input" : ""}`}
                        placeholder="Enter Full Skit Quantity"
                        onKeyDown={handleNumberRestriction}
                      />
                      <small>{errors?.fullSkitQty?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Full Skit Price</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("fullSkitPrice")}
                        className={`form-control ${errors?.fullSkitPrice ? "error-input" : ""}`}
                        placeholder="Enter Full Skit Price"
                        onKeyDown={handleKeyDown}
                      />
                      <small>{errors?.fullSkitPrice?.message}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Fields Section */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Master Case Type</label>
                      <input
                        type="text"
                        {...register("masterCaseType")}
                        className={`form-control ${errors?.masterCaseType ? "error-input" : ""}`}
                        placeholder="Enter Master Case Type"
                      />
                      <small>{errors?.masterCaseType?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Slot</label>
                      <input
                        type="text"
                        {...register("slot")}
                        className={`form-control ${errors?.slot ? "error-input" : ""}`}
                        placeholder="Enter Slot"
                      />
                      <small>{errors?.slot?.message}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Product Image</label>
                      <div className="image-upload">
                        <input
                          type="file"
                          {...register("images")}
                          accept="image/*"
                        />
                        <div className="image-uploads">
                          <img src={DropIcon} alt="img" />
                          <h4>Drag and drop a file to upload</h4>
                        </div>
                      </div>
                      {files && (
                        <div className="image-preview">
                          <img src={files} alt="preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="btn-addproduct mb-4">
                <Link to="/product-list" className="btn btn-cancel me-2">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-submit">
                  Update Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Editproduct;
