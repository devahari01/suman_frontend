/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { viewVendor, updateVendor, successToast, errorToast } from "../../../../core/core-index";
import { useNavigate, useParams } from "react-router-dom";

const editvendorPageschema = yup.object().shape({
  vendor_name: yup.string().required("Enter Vendor Name"),
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
  balanceType: yup.string(),
  noOfDaysCount: yup.string().when("balanceType", {
    is: (val) => val === "Credit",
    then: yup.string().required("Enter No of Days Count"),
    otherwise: yup.string().notRequired(),
  }),
  bankDetails: yup.object().shape({
    bankName: yup.string().required("Enter Bank Name"),
    branch: yup.string().required("Enter Branch Name"),
    accountHolderName: yup.string().required("Enter Account Holder Name"),
    accountNumber: yup.string().required("Enter Account Number"),
    IFSC: yup.string().required("Enter IFSC"),
    shift: yup.string(), // Optional
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
});


const EditvendorContext = createContext({
  editvendorPageschema: editvendorPageschema,

  EditSubmitForm: () => {},
});

const EditvendorComponentController = (props) => {
  const { getData, putData } = useContext(ApiServiceContext);
  const [vendorDetails, setVendorDetails] = useState([]);
  const navigate = useNavigate();
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);

  let { id } = useParams();

  const getVendorDetails = async () => {
    const url = `${viewVendor}/${id}`;
    const response = await getData(url);
    if (response?.data) {
      setVendorDetails(response?.data);
    }
  };

  const EditSubmitForm = async (data) => {
    const obj = {
      vendor_name: data?.vendor_name,
      vendor_email: data?.vendor_email,
      vendor_phone: data?.vendor_phone,
      balance: data?.balance || 0,
      balanceType: data?.balanceType,
      noOfDaysCount: data?.noOfDaysCount,
      bankDetails: {
        bankName: data?.bankDetails?.bankName || "",
        branch: data?.bankDetails?.branch || "",
        accountHolderName: data?.bankDetails?.accountHolderName || "",
        accountNumber: data?.bankDetails?.accountNumber || "",
        IFSC: data?.bankDetails?.IFSC || "",
        shift: data?.bankDetails?.shift || "",
      },
      billingAddress: {
        name: data?.billingAddress?.name || "",
        addressLine1: data?.billingAddress?.addressLine1 || "",
        addressLine2: data?.billingAddress?.addressLine2 || "",
        city: data?.billingAddress?.city || "",
        state: data?.billingAddress?.state || "",
        county: data?.billingAddress?.county || "",
        pincode: data?.billingAddress?.pincode || "",
        country: data?.billingAddress?.country || "",
      },
    };
    const url = `${updateVendor}/${vendorDetails?._id}`;
    const response = await putData(url, obj);
    if (response.code == 200) {
      successToast("Vendor edited successfully");
      getVendorDetails();
      navigate("/vendors");
    }else{
      errorToast(response?.data?.message)
    }
  };

  useEffect(() => {
    getVendorDetails();
  }, []);

  return (
    <EditvendorContext.Provider
      value={{
        editvendorPageschema,
        vendorDetails,
        EditSubmitForm,
        radio2,
        radio1,
        setRadio2,
        setRadio1,
      }}
    >
      {props.children}
    </EditvendorContext.Provider>
  );
};

export { EditvendorContext, EditvendorComponentController };
