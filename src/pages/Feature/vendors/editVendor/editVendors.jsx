import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditvendorContext } from "./editVendor.control";
import { Link } from "react-router-dom";
import {
  handleCharacterRestriction,
  handleCharacterRestrictionSpace,
  handleNumberRestriction,
  handleSpecialCharacterRestriction,
  handleSpecialCharacterSpaceRestriction,
} from "../../../../constans/globals";

const EditVendorList = () => {
  const {
    editvendorPageschema,
    vendorDetails,
    EditSubmitForm,
    radio2,
    radio1,
    setRadio2,
    setRadio1,
  } = useContext(EditvendorContext);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(editvendorPageschema) });

  useEffect(() => {
    setValue("vendor_name", vendorDetails?.vendor_name);
    setValue("vendor_email", vendorDetails?.vendor_email);
    setValue("vendor_phone", vendorDetails?.vendor_phone);
    setValue("balance", vendorDetails?.balance);
    setValue(
      "bankDetails[bankName]",
      vendorDetails?.bankDetails?.bankName ? vendorDetails?.bankDetails?.bankName : ""
    );
    setValue(
      "bankDetails[branch]",
      vendorDetails?.bankDetails?.branch ? vendorDetails?.bankDetails?.branch : ""
    );
    setValue(
      "bankDetails[accountHolderName]",
      vendorDetails?.bankDetails?.accountHolderName
        ? vendorDetails?.bankDetails?.accountHolderName
        : ""
    );
    setValue(
      "bankDetails[accountNumber]",
      vendorDetails?.bankDetails?.accountNumber ? vendorDetails?.bankDetails?.accountNumber : ""
    );
    setValue(
      "bankDetails[IFSC]",
      vendorDetails?.bankDetails?.IFSC ? vendorDetails?.bankDetails?.IFSC : ""
    );
    vendorDetails?.balanceType == "Debit" ? setRadio1(true) : setRadio1(false);
    vendorDetails?.balanceType == "Credit" ? setRadio2(true) : setRadio2(false);
  }, [vendorDetails]);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Edit Vendor</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <form onSubmit={handleSubmit(EditSubmitForm)}>
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
                                placeholder="Enter Name"
                                onKeyPress={handleCharacterRestrictionSpace}
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
                                value={value}
                                type="text"
                                placeholder="Enter Email Address"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("vendor_email");
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
                                value={value}
                                type="text"
                                placeholder="Enter Phone Number"
                                onKeyDown={(e) => handleKeyDown(e)}
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
                        {errors.mode?.message}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group-customer customer-additional-form">
                  <div className="row">
                    <h5 className="form-title">Bank Details</h5>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Bank Name<span className="text-danger"> *</span>
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
                                placeholder="Enter Bank Name"
                                onKeyPress={
                                  handleSpecialCharacterSpaceRestriction
                                }
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails.bankName");
                                }}
                              />
                              {errors.bankDetails?.bankName && (
                                <p className="text-danger">
                                  {errors.bankDetails?.bankName?.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Branch<span className="text-danger"> *</span>
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
                                placeholder="Enter Branch Name"
                                onKeyPress={handleSpecialCharacterRestriction}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails.branch");
                                }}
                              />
                              {errors.bankDetails?.branch && (
                                <p className="text-danger">
                                  {errors.bankDetails?.branch?.message}
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
                          Account Holder Name
                          <span className="text-danger"> *</span>
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
                                placeholder="Enter Account Holder Name"
                                onKeyPress={handleCharacterRestrictionSpace}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails.accountHolderName");
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
                          <span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="bankDetails[accountNumber]"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="number"
                                onKeyDown={(e) => handleKeyDown(e)}
                                placeholder="Enter Account Number"
                                onKeyPress={handleNumberRestriction}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails.accountNumber");
                                }}
                              />
                              {errors.bankDetails?.accountNumber && (
                                <p className="text-danger">
                                  {errors.bankDetails?.accountNumber?.message}
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
                          IFSC<span className="text-danger"> *</span>
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
                                placeholder="Enter IFSC Code"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("bankDetails.IFSC");
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
                  <Link className="btn btn-primary cancel me-2" to="/vendors">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Update
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

export default EditVendorList;
