/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { addVendor, errorToast, successToast } from "../../../../core/core-index";

const addvendorPageschema = yup
  .object()
  .shape({
    vendor_name: yup
      .string()
      .notOneOf(
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        "Name cannot Contain Numbers"
      )
      .required("Enter Vendor Name"),
    vendor_email: yup
      .string()
      .email("Email Must Be a Valid Email")
      .required("Enter Vendor Email ID"),
    vendor_phone: yup
      .string()
      .required("Enter Phone number")
      .min(10, "Phone Number Must Be At Least 10 Digits")
      .max(15, "Phone Number Must Be At Most 15 Digits")
      .matches(/^\+?[1-9]\d*$/, "Invalid phone number"),
    balance: yup.string(),
    balanceType: yup.string().when("balance", {
      is: (balance) => balance && balance.trim() !== "",
      then: yup.string().required("Mode is Required"),
      otherwise: yup.string(),
    }),
  
    noOfDaysCount: yup.string().when("balanceType", {
      is: (type) => type === "Credit",
      then: yup.string().required("Enter No of Days Count"),
      otherwise: yup.string().notRequired(),
    }),
    bankDetails: yup.object().shape({
      shift: yup.string().notRequired(),
    }),
    billingAddress: yup.object().shape({
      name: yup.string().required("Billing Name is required"),
      addressLine1: yup.string().required("Address Line 1 is required"),
      addressLine2: yup.string(),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      county: yup.string().required("County is required"),
      pincode: yup.string().required("Pincode is required"),
      country: yup.string().required("Country is required"),
    }),
  })
  .required();

const AddvendorContext = createContext({
  addvendorPageschema: addvendorPageschema,

  SubmitVendorForm: () => {},
});

const AddvendorComponentController = (props) => {
  const { postData } = useContext(ApiServiceContext);
  const navigate = useNavigate();
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);

  const SubmitVendorForm = async (data) => {
    const obj = {
      vendor_name: data?.vendor_name,
      vendor_email: data?.vendor_email,
      vendor_phone: data?.vendor_phone,
      balance: data?.balance ? data?.balance : 0,
      balanceType: data?.balanceType,
      bankDetails: data?.bankDetails,
      billingAddress: {
        name: data?.billingAddress?.name,
        addressLine1: data?.billingAddress?.addressLine1,
        addressLine2: data?.billingAddress?.addressLine2,
        city: data?.billingAddress?.city,
        state: data?.billingAddress?.state,
        pincode: data?.billingAddress?.pincode,
        country: data?.billingAddress?.country,
        county: data?.billingAddress?.county,
      },
      noOfDaysCount: data?.noOfDaysCount,
      bankDetails: {
        ...data?.bankDetails,
        shift: data?.bankDetails?.shift || "",
      },
    };
    try {
      const response = await postData(addVendor, obj);
      if (response.code == 200) {
        successToast("Vendor Added successfully");
        setRadio1(false);
        setRadio2(false);
        navigate("/vendors");
      }else{
        errorToast(response?.data?.message)
      }
    } catch {
      /* empty */
    } finally {
      /* empty */
    }
  };

  return (
    <AddvendorContext.Provider
      value={{
        addvendorPageschema,
        SubmitVendorForm,
        radio2,
        radio1,
        setRadio2,
        setRadio1,
      }}
    >
      {props.children}
    </AddvendorContext.Provider>
  );
};

export { AddvendorContext, AddvendorComponentController };
