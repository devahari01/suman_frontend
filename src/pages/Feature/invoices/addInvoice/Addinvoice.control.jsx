/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as yup from "yup";
import { useParams,useNavigate, useSearchParams } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  invoice as invoice_api,
  dropdown_api,
  successToast,
  customerrorToast,
} from "../../../../core/core-index";
import { viewCustomerApi } from "../../../../constans/apiname";
import dayjs from "dayjs";
import {delivery_challans} from "../../../../core/end_points/end_points";
// const { id } = useParams();
// console.log(id)
const addInvoiceschema = yup
  .object({
    customerId: yup.object().shape({
      _id: yup.string().required("Choose any Customer"),
    }),
    invoiceDate: yup.string().required("Choose Invoice Date"),

    dueDate: yup.string().required("Choose Due Date"),

    payment_method: yup.object().shape({
      value: yup.string().required("Choose Payment Mode"),
    }),
    products: yup.object().shape({
      value: yup.string().required("Choose Products"),
    }),
    // invoiceDate: yup.string().required("Choose Invoice Date").nullable(),
    // dueDate: yup.string().required("Choose Due Date").nullable(),
    sign_type: yup.string().typeError("Choose Signature Type"),
    signatureName: yup.string().when("sign_type", (sign_type) => {
      if (sign_type == "eSignature") {
        return yup.string().nullable().required("Enter Signature Name");
      } else {
        return yup.string().notRequired();
      }
    }),
    signatureData: yup.string().when("sign_type", (sign_type) => {
      if (sign_type == "eSignature") {
        return yup
          .string()
          .test(
            "is-eSignature",
            `Draw The Signature`,
            async (value) => value == "true"
          );
      } else {
        return yup.string().notRequired();
      }
    }),
    signatureId: yup.string().when("sign_type", (sign_type) => {
      if (sign_type == "manualSignature") {
        return yup.object().shape({
          value: yup.string().required("Choose Signature Name"),
        });
      } else {
        return yup.object().notRequired();
      }
    }),
  })
  .required();
  //   signatureId: yup.lazy((value, originalValue) => {
  //     if (originalValue?.sign_type === 'manualSignature') {
  //       return yup.object().shape({
  //         _id: yup.string().required('Signature ID is required'),
  //         signatureName: yup.string().required('Signature Name is required'),
  //         signatureImage: yup.string().url('Invalid URL').required('Signature Image URL is required'),
  //         status: yup.boolean().required('Status is required'),
  //         markAsDefault: yup.boolean().required('Mark as Default is required'),
  //         isDeleted: yup.boolean().required('Is Deleted is required'),
  //         userId: yup.string().required('User ID is required'),
  //         createdAt: yup.string().required('Created At is required'),
  //         updatedAt: yup.string().required('Updated At is required'),
  //         __v: yup.number().required('__v is required'),
  //         value: yup.string().required('Value is required'),
  //         label: yup.string().required('Label is required'),
  //       });
  //     } else {
  //       return yup.object().notRequired();
  //     }
  //   }),
  // })
  // .required();

const dicountEditForm = yup
  .object({
    discount: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .typeError("Enter Valid Discount Price"),
    rate: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .typeError("Enter Valid Rate"),
  })
  .required();

const AddinvoiceContext = createContext({
  addInvoiceschema: addInvoiceschema,
  dicountEditForm: dicountEditForm,
  submitaddInvoiceAddForm: () => {},
});

const AddinvoiceComponentController = (props) => {
  const { id } = useParams();
  const { postData, getData } = useContext(ApiServiceContext);
  const { Base } = invoice_api;
  const [menu, setMenu] = useState(false);
  const [isRecurring, setisRecurring] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const navigate = useNavigate();
  const [dueDate, setdueDate] = useState(new Date());

  const [invoiceDate, setinvoiceDate] = useState(new Date());
  const [dataSource, setDataSource] = useState([]);
  const [customersData, setCustomers] = useState([]);
  const [payment, setPayment] = useState([{ id: 1, text: "Cash" }]);
  const [bank, setBank] = useState([]);
  const [taxableAmount, settaxableAmount] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0);
  const [totalTax, settotalTax] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);
  const [productData, setProductOptiondata] = useState([]);
  const [productsCloneData, setproductsCloneData] = useState([]);
  const [roundof, setroundof] = useState(false);
  const addbankpocancelModal = useRef(null);
  const [rowErr, setrowErr] = useState([]);
  const [showSubmit, setshowSubmit] = useState(false);
  const [ChoosedCustomer, setChoosedCustomer] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [num, setNum] = useState("");
  const [type, setType] = useState("new");
  const [referenceNo, setReferenceNo] = useState("");
  const [taxfromcustomer, settaxfromcustomer] = useState(0);
  const [creditNotes, setCreditNotes] = useState([]);
const [totalTaxableAmount, setTotalTaxableAmount] = useState(0);
const [batchApproved, setBatchApproved] = useState(0);

  const getmasterDetails = async () => {
    try {
      if (searchParams.get("cid") && searchParams.get("cid") != "") {
        const url = `${viewCustomerApi}/${searchParams.get("cid")}`;
        const response = await getData(url);
        if (response?.code == 200) {
          setChoosedCustomer(response?.data);
        }
      }
      if(!id){ 
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
          console.log({DDOPTData})
          setProductOptiondata(DDOPTData);
          setproductsCloneData(DDOPTData);
        }
      
        const Customersresponse = await getData(dropdown_api.customer_api);
        if (Customersresponse.code === 200) {
          setCustomers(Customersresponse?.data);
        }
      }

      const Bankresponse = await getData(dropdown_api.bank_api);
      if (Bankresponse.code === 200) {
        setBank(Bankresponse?.data);
      }

      const Taxresponse = await getData(dropdown_api.tax_api);
      if (Taxresponse.code === 200) {
        setTax(Taxresponse?.data);
      }
    } catch (error) {
    }
  };
  const getsingleChallan = async () => {
    // console.log("val of ",id)
    
    console.log("val of ",id)
    if(id){
      console.log("inside call")
      const single = await getData(`${delivery_challans?.View}/${id}`);
    // setSingleChallan(single?.data?.dc_details);
    setCustomers([single?.data?.dc_details?.customerId])
    // setChoosedCustomer([single?.data?.dc_details?.customerId])
    // if (productresponse.code === 200) {
    console.log("single?.data?.dc_details?.items",{single})
        let data = single?.data?.dc_details?.items;
        let DDOPTData = data.map((item) => {
          return {
            ...item,
            value: item.productId,
            label: item.name,
          };
        });
        console.log({DDOPTData})
        setProductOptiondata(DDOPTData);
        setproductsCloneData(DDOPTData);
        setType("old");
        setReferenceNo(single?.data?.dc_details?.referenceNo);
        // setValue("dueDate", moment(single?.data?.dc_details?.dueDate));
        // setValue("invoiceDate", moment(single?.data?.dc_details?.deliveryChallanDate));
        // let duedate = single?.data?.dc_details?.dueDate;
        // let Duedate = duedate?.split("/").reverse().join("/");
        // setdueDate(new Date(Duedate));
        // let invoicedate = single?.data?.dc_details?.invoiceDate;
        // let Invoicedate = invoicedate?.split("/").reverse().join("/");
        // setinvoiceDate(new Date(Invoicedate));
      // }
    }
    
  };
  useEffect(() => {
    // console.log("customersData Value changed:", customersData);
  }, [customersData]);
  // useEffect(() => {
  //   console.log("referenceNo:", referenceNo);
  // }, [referenceNo]);
  // useEffect(() => {
  //   console.log("type:", type);
  // }, [type]);
  useEffect(() => {
    console.log("product Value changed:", productData);
  }, [productData]);
  useEffect(() => {
    console.log("cloned product Value changed:", productsCloneData);
  }, [productsCloneData]);
  const getBankList = async () => {
    const bankList = await getData(dropdown_api?.bank_api);
    const newBankList = bankList?.data?.map((item) => {
      return { id: item.userId, text: item.name };
    });

    setBank(newBankList);
  };
  // const getVendorList = async () => {
  //   const VendorList = await getData(dropdown_api?.vendor_api);
  //   const newList = VendorList?.data?.map((item) => {
  //     return {
  //       id: item._id,
  //       text: item.vendor_name,
  //       value: item._id,
  //       label: item.vendor_name,
  //     };
  //   });

  //   setProductOptiondata(newList);
  // };
  const getTaxList = async () => {
    const tax = await getData(dropdown_api?.tax_api);
    let newTax = tax?.data?.map((item) => {
      return {
        id: item?.id,
        label: item?.name + ` ${item?.taxRate}%`,
        value: parseInt(item?.taxRate),
      };
    });
    setTax(newTax);
  };
  useEffect(() => {
    getsingleChallan();
    getBankList();
    // getVendorList();
    getTaxList();
  }, []);
  useEffect(() => {
    getmasterDetails();
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

  const [tax, setTax] = useState([]);

  const submitaddInvoiceAddForm = async (data) => {
    console.log({data})

    let invoiceDate =
      data?.invoiceDate == undefined ? new Date() : data?.invoiceDate;
    let dueDate = data?.dueDate == undefined ? new Date() : data?.dueDate;

    if (rowErr.length > 0) {
      let errors = rowErr.filter((row) => {
        return row.valid == false;
      });
      if (errors.length > 0) {
        customerrorToast(`Product quantity is required`);
        return;
      }
    } else {
      customerrorToast(`Products  is required`);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < dataSource.length; i++) {
      formData.append(`items[${i}][name]`, dataSource[i].name);
      formData.append(`items[${i}][key]`, dataSource[i].key);
      formData.append(`items[${i}][productId]`, dataSource[i].productId);
      formData.append(`items[${i}][quantity]`, dataSource[i].quantity);
      formData.append(`items[${i}][units]`, dataSource[i].units);
      formData.append(`items[${i}][unit]`, dataSource[i].unit_id);
      formData.append(`items[${i}][rate]`, dataSource[i].rate);
      formData.append(`items[${i}][discount]`, dataSource[i].discount);
      formData.append(`items[${i}][tax]`, dataSource[i].tax);
      formData.append(`items[${i}][primaryUnit]`, dataSource[i]?.primaryUnit);
      formData.append(`items[${i}][batchNo]`, dataSource[i]?.batchNo);
      formData.append(`items[${i}][secondaryUnit]`, dataSource[i]?.secondaryUnit);
      formData.append(`items[${i}][numberOfPacks]`, dataSource[i]?.numberOfPacks);
      formData.append(
        `items[${i}][taxInfo]`,
        JSON.stringify(dataSource[i].taxInfo)
      );
      formData.append(`items[${i}][amount]`, dataSource[i].amount);
      formData.append(`items[${i}][discountType]`, dataSource[i].discountType);
      formData.append(`items[${i}][sku]`, dataSource[i].sku);
      formData.append(
        `items[${i}][isRateFormUpadted]`,
        dataSource[i].isRateFormUpadted
      );
      formData.append(
        `items[${i}][form_updated_discounttype]`,
        dataSource[i].form_updated_discounttype
      );
      formData.append(
        `items[${i}][form_updated_discount]`,
        dataSource[i].form_updated_discount
      );
      formData.append(
        `items[${i}][form_updated_rate]`,
        dataSource[i].form_updated_rate
      );
      formData.append(
        `items[${i}][form_updated_tax]`,
        dataSource[i].form_updated_tax
      );
    }
    formData.append("customerId", data?.customerId?._id);
    formData.append("payment_method", data?.payment_method?.value);
    // formData.append("invoiceDate", format(invoiceDate, "dd/MM/yyyy"));
    // formData.append("dueDate", format(dueDate, "dd/MM/yyyy"));

    // For antd Datepicker
    formData.append("dueDate", dayjs(data?.dueDate).toDate());
    formData.append("invoiceDate", dayjs(data?.invoiceDate).toDate());
    // For antd Datepicker
    formData.append("referenceNo", data?.referenceNo);
    formData.append("invoiceNumber", num);
    formData.append("taxableAmount", taxableAmount);
    formData.append("TotalAmount", totalAmount);
    formData.append("vat", totalTax);
    formData.append("totalDiscount", totalDiscount);
    formData.append("DCid", id);
    formData.append("type", type);
    formData.append("roundOff", roundof);
    formData.append(
      "bank",
      data?.bank?._id == undefined ? "" : data?.bank?._id
    );
    formData.append("notes", data?.notes);
    formData.append("termsAndCondition", data?.termsAndCondition);
    formData.append("isRecurring", isRecurring);
    formData.append("recurringCycle", data?.recurringCycle);
    formData.append("sign_type", data?.sign_type);
    formData.append("creditNotes", JSON.stringify(
      creditNotes.map(({ _id, credit_note_id, taxableAmount }) => ({
                  _id,
                  credit_note_id,
                  taxableAmount
                }))
              ));
    formData.append("detectableAmount", totalTaxableAmount);
    formData.append("batchApproved", batchApproved);
    if (data?.sign_type == "eSignature") {
      formData.append("signatureName", data?.signatureName);
      formData.append("signatureImage", signatureData);
    } else {
      formData.append("signatureId", data?.signatureId?.value);
    }

    try {
      const response = await postData(Base, formData);
      if (response.code === 200) {
        successToast("Invoice Added Successfully");
        navigate("/invoice-list");
      }
      return response;
    } catch (error) {
    }
  };

  // const handleKeyPress = (event) => {
  //   const keyCode = event.keyCode || event.which;
  //   const keyValue = String.fromCharCode(keyCode);
  //   if (/^\d+$/.test(keyValue)) {
  //     event.preventDefault();
  //   }
  // };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Allow only alphabetic characters
    if (!/^[a-zA-Z]+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  const [status, setstatus] = useState([
    { id: 1, text: "Choose a Status" },
    { id: "UNPAID", text: "Unpaid" },
    { id: "PARTIALLY_PAID", text: "Partially Paid" },
    { id: "PAID", text: "Paid" },
    { id: "OVERDUE", text: "Overdue" },
    { id: "CANCELLED", text: "Cancelled" },
    { id: "REFUNDED", text: "Refunded" },
    { id: "DRAFTED", text: "Draft" },
  ]);

  const addBankSettingsForm = async (data) => {
    const formData = {};
    formData.name = data.name;
    formData.bankName = data.bankName;
    formData.branch = data.branch;
    formData.accountNumber = data.accountNumber;
    formData.IFSCCode = data.IFSCCode;
    try {
      const response = await postData("/bankSettings/addBank", formData);
      if (response.code === 200) {
        addbankpocancelModal.current.click();
        successToast("Bank Added Successfully");
        const Bankresponse = await getData("/bankSettings/listBanks");
        if (Bankresponse.code === 200) {
          setBank(Bankresponse?.data);
        }
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  return (
    <AddinvoiceContext.Provider
      value={{
        id,
        dataSource,
        setDataSource,
        addInvoiceschema,
        dicountEditForm,
        menu,
        submitaddInvoiceAddForm,
        handleKeyPress,
        toggleMobileMenu,
        payment,
        productData,
        customersData,
        tax,
        bank,
        taxableAmount,
        settaxableAmount,
        totalTax,
        settotalTax,
        totalAmount,
        settotalAmount,
        totalDiscount,
        settotalDiscount,
        roundof,
        setroundof,
        addBankSettingsForm,
        productData,
        setProductOptiondata,
        productsCloneData,
        setproductsCloneData,
        setinvoiceDate,
        invoiceDate,
        setdueDate,
        dueDate,
        addbankpocancelModal,
        rowErr,
        setrowErr,
        showSubmit,
        setshowSubmit,
        status,
        isRecurring,
        setisRecurring,
        ChoosedCustomer,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
        num,
        setNum,
        type,
        referenceNo,
        taxfromcustomer,
        settaxfromcustomer,
        creditNotes,
        setCreditNotes,  // Ensure the setter function is available
        totalTaxableAmount,
        setTotalTaxableAmount, 
        batchApproved,
        setBatchApproved,
      }}
    >
      {props.children}
    </AddinvoiceContext.Provider>
  );
};

export { AddinvoiceContext, AddinvoiceComponentController };
