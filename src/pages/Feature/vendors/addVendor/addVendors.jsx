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
    formState: { errors },
  } = useForm({ resolver: yupResolver(addvendorPageschema) });

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
                    <div className="col-lg-6 col-sm-12">
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
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group d-inline-flex align-center mb-0">
                        <label className="me-5 mb-0">Mode</label>
                        <div>
                          <label className="custom_radio me-3 mb-0">
                            <Controller
                              name="balanceType"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="radio"
                                    label={"Name"}
                                    checked={radio1}
                                    onChange={() => {
                                      onChange("Debit");
                                      setRadio1(true);
                                      setRadio2(false);
                                      setValue("Credit", "");
                                      trigger("Debit");
                                    }}
                                  />
                                </>
                              )}
                              defaultValue=""
                            />
                           
                            <span className="checkmark" /> Debit
                          </label>
                          <label className="custom_radio mb-0">
                            <Controller
                              name="balanceType"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="radio"
                                    label={"Name"}
                                    checked={radio2}
                                    onChange={() => {
                                      onChange("Credit");
                                      setValue("Debit", "");
                                      setRadio1(false);
                                      setRadio2(true);
                                      trigger("Credit");
                                    }}
                                  />
                                  
                                </>
                              )}
                              defaultValue=""
                            />
                           
                            <span className="checkmark" /> Credit
                          </label>
                        </div>
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
