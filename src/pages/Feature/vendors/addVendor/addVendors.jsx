import React, { useContext, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddvendorContext } from "./addVendor.control";
import { Link } from "react-router-dom";
import {
  handleCharacterRestrictionSpace,
  handleKeyDown,
  handleNumberRestriction,
  handleSpecialCharacterSpaceRestriction,
} from "../../../../constans/globals";

const AddVendors = () => {
  const {
    addvendorPageschema,
    SubmitVendorForm,
    radio2,
    radio1,
    setRadio2,
    setRadio1,
  } = useContext(AddvendorContext);
  const inputRef = useRef();

  const {
  handleSubmit,
  control,
  setValue,
  trigger,
  watch,
  formState: { errors },
} = useForm({
  resolver: yupResolver(addvendorPageschema),
  defaultValues: {
    noOfDaysCount: "",
    bankDetails: {
      bankName: "",
      branch: "",
      accountHolderName: "",
      accountNumber: "",
      IFSC: "",
      shift: "", // << important
    },
    billingAddress: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      county: "",
    },
  },
});
  const balanceType = watch("balanceType");
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Add Vendor</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <form onSubmit={handleSubmit(SubmitVendorForm)}>
              <div className="card-body add-vendor">
                <div className="form-group-item border-0 pb-0">
                  <div className="row">
                    <div className="col-lg-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Name<span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="vendor_name"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                onKeyPress={handleCharacterRestrictionSpace}
                                placeholder="Enter Name"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("vendor_name");
                                }}
                              />
                              <small>{errors.vendor_name?.message}</small>
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Email<span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="vendor_email"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                autoComplete="off"
                                value={value}
                                type="text"
                                placeholder="Enter Email Address"
                                onChange={(val) => {
                                  onChange(val);
                                  // trigger("vendor_email");
                                }}
                              />
                              <small>{errors.vendor_email?.message}</small>
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Phone Number<span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="vendor_phone"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                autoComplete="off"
                                value={value}
                                type="text"
                                placeholder="Enter Phone Number"
                                ref={inputRef}
                                id="myInput"
                                maxLength={15}
                                onKeyPress={handleNumberRestriction}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("vendor_phone");
                                }}
                              />
                              <small>{errors.vendor_phone?.message}</small>
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    {/*<div className="col-lg-6 col-sm-12">
                      <div className="form-group">
                        <label>Closing Balance</label>
                        <Controller
                          name="balance"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Balance Amount"
                                onKeyPress={handleNumberRestriction}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("balance");
                                }}
                              />
                              <small>{errors.balance?.message}</small>
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>*/}
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group d-inline-flex align-center mb-0">
                        <label>
                          Mode
                          <Controller
                            name="balanceType"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="form-control"
                                onChange={(e) => {
                                  setValue("balanceType", e.target.value);
                                  trigger("balanceType");
                                }}
                              >
                                <option value="">Select Mode</option>
                                <option value="Advance paid">Advance paid</option>
                                <option value="COD">COD</option>
                                <option value="Credit">Credit</option>
                              </select>
                            )}
                          />
                          {errors?.balanceType && <span>{errors.balanceType.message}</span>}
                        </label>
                        {balanceType === "Credit" && (
                          <label>
                            No of Days Count
                            <Controller
                              name="noOfDaysCount"
                              control={control}
                              render={({ field }) => (
                                <input className="form-control" type="number" {...field} placeholder="No of Days Count" />
                              )}
                            />
                            {errors?.noOfDaysCount && <span>{errors.noOfDaysCount.message}</span>}
                          </label>
                        )}
                      </div>
                      <small className="d-block" style={{ color: "red" }}>
                        {errors.balanceType?.message}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group-vendor vendor-additional-form">
                  <div className="row">
                    <h5 className="form-title">Bank Details</h5>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Bank Name
                        </label>
                        <Controller
                          name="bankDetails[bankName]"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                onKeyPress={handleCharacterRestrictionSpace}
                                placeholder="Enter Bank Name"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails[bankName]");
                                }}
                              />
                              
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Branch
                        </label>
                        <Controller
                          name="bankDetails[branch]"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                onKeyPress={
                                  handleSpecialCharacterSpaceRestriction
                                }
                                placeholder="Enter Branch Name"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails[branch]");
                                }}
                              />
                              
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>
                          Account Holder Name
                        </label>
                        <Controller
                          name="bankDetails[accountHolderName]"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                onKeyPress={handleCharacterRestrictionSpace}
                                maxLength={20}
                                placeholder="Enter Account Holder Name"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails[accountHolderName]");
                                }}
                              />
                              {errors.bankDetails?.accountHolderName && (
                                <p className="text-danger">
                                  {
                                    errors.bankDetails?.accountHolderName
                                      ?.message
                                  }
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>
                          Account Number
                        </label>
                        <Controller
                          name="bankDetails[accountNumber]"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                onInput={(e) =>
                                  (e.target.value = e.target.value.slice(
                                    0,
                                    20
                                  ))
                                }
                                onKeyDown={(e) => handleKeyDown(e)}
                                onKeyPress={handleNumberRestriction}
                                placeholder="Enter Account Number"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails[accountNumber]");
                                }}
                              />
                              
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>
                          IFSC
                        </label>
                        <Controller
                          name="bankDetails[IFSC]"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                maxLength={15}
                                placeholder="Enter IFSC Code"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails[IFSC]");
                                }}
                              />
                              {errors.bankDetails?.IFSC && (
                                <p className="text-danger">
                                  {errors.bankDetails?.IFSC?.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>
                          Shift
                          <Controller
                            name="bankDetails.shift"
                            control={control}
                            render={({ field }) => (
                              <input className="form-control" {...field} placeholder="Shift" />
                            )}
                          />
                          {errors?.bankDetails?.shift && <span>{errors.bankDetails.shift.message}</span>}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group-item">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="billing-btn mb-2">
                          <h5 className="form-title">Billing Address</h5>
                        </div>
                        <div className="form-group">
                          <label>Name<span className="text-danger"> *</span></label>
                          <Controller
                            name="billingAddress[name]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  maxLength={20}
                                  label={"Name"}
                                  onKeyPress={handleCharacterRestrictionSpace}
                                  placeholder="Enter Name"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("billingAddress[name]");
                                    
                                  }}
                                />
                                 {errors.billingAddress?.name && (
                                  <p className="text-danger">
                                    {errors.billingAddress?.name?.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                        <div className="form-group">
                          <label>Address Line 1<span className="text-danger"> *</span></label>
                          <Controller
                            name="billingAddress[addressLine1]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  label={"Name"}
                                  placeholder="Enter Address Line1"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("billingAddress[addressLine1]");
                                    
                                  }}
                                />
                                {errors.billingAddress?.addressLine1 && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.addressLine1?.message}
                                      </p>
                                    )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                        <div className="form-group">
                          <label>Address Line 2<span className="text-danger"> *</span></label>
                          <Controller
                            name="billingAddress[addressLine2]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  label={"Name"}
                                  placeholder="Enter Address Line2"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("billingAddress[addressLine2]");
                                    
                                  }}
                                />
                                {errors.billingAddress?.addressLine2 && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.addressLine2?.message}
                                      </p>
                                    )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>City<span className="text-danger"> *</span></label>
                              <Controller
                                name="billingAddress[city]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      maxLength={20}
                                      label={"Name"}
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      placeholder="Enter City"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress[city]");
                                        
                                      }}
                                    />
                                    {errors.billingAddress?.city && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.city?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                                defaultValue=""
                              />
                            </div>
                            <div className="form-group">
                              <label>Country<span className="text-danger"> *</span></label>
                              <Controller
                                name="billingAddress[country]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      label={"Name"}
                                      placeholder="Enter Country"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress[country]");
                                        
                                      }}
                                    />
                                    {errors.billingAddress?.country && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.country?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                                defaultValue=""
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>County<span className="text-danger"> *</span></label>
                            <Controller
                              name="billingAddress[county]"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    onKeyPress={handleCharacterRestrictionSpace}
                                    placeholder="Enter County"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("billingAddress[county]");
                                    }}
                                  />
                                  {errors.billingAddress?.county && (
                                    <p className="text-danger">
                                      {errors.billingAddress?.county?.message}
                                    </p>
                                  )}
                                </>
                              )}
                              defaultValue=""
                            />
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>Province / Territory<span className="text-danger"> *</span></label>
                              <Controller
                                name="billingAddress[state]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <select
                                      className="form-control"
                                      value={value}
                                      onChange={(e) => {
                                        onChange(e.target.value);
                                        trigger("billingAddress[state]");
                                      }}
                                    >
                                      <option value="" disabled>
                                        Select Province / Territory
                                      </option>
                                      <option value="Alberta">Alberta</option>
                                      <option value="British Columbia">British Columbia</option>
                                      <option value="Manitoba">Manitoba</option>
                                      <option value="New Brunswick">New Brunswick</option>
                                      <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                                      <option value="Northwest Territories">Northwest Territories</option>
                                      <option value="Nova Scotia">Nova Scotia</option>
                                      <option value="Nunavut">Nunavut</option>
                                      <option value="Ontario">Ontario</option>
                                      <option value="Prince Edward Island">Prince Edward Island</option>
                                      <option value="Quebec">Quebec</option>
                                      <option value="Saskatchewan">Saskatchewan</option>
                                      <option value="Yukon">Yukon</option>
                                    </select>
                                    {errors.billingAddress?.state && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.state?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                                defaultValue=""
                              />
                            </div>
                            <div className="form-group">
                              <label>Pincode<span className="text-danger"> *</span></label>
                              <Controller
                                name="billingAddress[pincode]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      onKeyPress={handleNumberRestriction}
                                      onKeyDown={(e) => handleKeyDown(e)}
                                      label={"Name"}
                                      placeholder="Enter Pincode"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress[pincode]");
                                       
                                      }}
                                    />
                                    {errors.billingAddress?.pincode && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.pincode?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                                defaultValue=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                <div className="add-vendor-btns text-end">
                  <Link to="/vendors" className="btn btn-primary cancel me-2">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Add Vendor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVendors;
