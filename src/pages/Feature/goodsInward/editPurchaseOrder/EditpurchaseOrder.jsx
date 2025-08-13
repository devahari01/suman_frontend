import React, { useEffect, useContext, useState, useRef } from "react";
import { EditpurchaseOrderContext } from "./EditpurchaseOrder.control";
import { BankSettingsContext } from "../../settings/bankSettings/BankSettings.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import FeatherIcon from "feather-icons-react";
import { Form, Popconfirm, Table } from "antd";
import { commonDatacontext } from "../../../../core/commonData";
import { handleNumberRestriction } from "../../../../constans/globals";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import DatePickerComponent from "../../datePicker/DatePicker";
import moment from "moment";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditPurchaseOrder = () => {
  const { BankSettingschema } = useContext(BankSettingsContext);
  const [selectedSign, setselectedSign] = useState("/");

  const {
    dataSource,
    setDataSource,
    editpurchaseOrderschema,
    dicountEditForm,
    submiteditPOForm,
    handleKeyPress,
    productData,
    vendors,
    bank,
    tax,
    poData,
    taxableAmount,
    settaxableAmount,
    totalTax,
    settotalTax,
    totalAmount,
    settotalAmount,
    totalDiscount,
    settotalDiscount,
    setroundof,
    addBankSettingsForm,
    productsCloneData,
    setproductsCloneData,
    editbankpocancelModal,
    rowErr,
    setrowErr,
    count,
    setCount,
    trimmedDataURL,
    setTrimmedDataURL,
    setSignatureData,
  } = useContext(EditpurchaseOrderContext);

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    getValues,
    control,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(editpurchaseOrderschema) });
  const { currencyData } = useContext(commonDatacontext);
  const {
    handleSubmit: bankHandle,
    control: addBankControl,
    formState: { errors: addBankerrors },
  } = useForm({ resolver: yupResolver(BankSettingschema) });

  const {
    handleSubmit: addTaxratesFormhandle,
    trigger: Edittrigger,
    setValue: editsetValue,
    control: editTaxratesFormControl,
    formState: { errors: addTaxratesFormErr },
  } = useForm({ resolver: yupResolver(dicountEditForm) });

  const EditcancelModal = useRef(null);
  const [roundofValue, setroundofValue] = useState(0);

  const changeRoundoff = (val) => {
    setroundof(val);
    if (val == true) {
      let roundValue =
        Math.round(
          Number(taxableAmount) + Number(totalTax) - Number(totalDiscount)
        ) -
        (Number(taxableAmount) + Number(totalTax) - Number(totalDiscount));
      setroundofValue(roundValue.toFixed(2));
      settotalAmount(
        Math.round(
          Number(taxableAmount) + Number(totalTax) - Number(totalDiscount)
        ).toFixed(2)
      );
    } else {
      setroundofValue((0).toFixed(2));
      settotalAmount(
        (
          Number(taxableAmount) +
          Number(totalTax) -
          Number(totalDiscount)
        ).toFixed(2)
      );
    }
  };

  useEffect(() => {
    setroundof(poData?.roundOff);
    setValue("roundof", poData?.roundOff);
    setValue("purchaseId", poData?.purchaseOrderId);
    setValue("referenceNo", poData?.referenceNo);
    setValue("vendorId", poData?.vendorId);
    setValue("notes", poData?.notes);
    setValue("termsAndCondition", poData?.termsAndCondition);
    setValue("signatureName", poData?.signatureName);
    setValue("bank", poData?.bank);

    setValue("purchaseOrderDate", moment(poData?.purchaseOrderDate));
    setValue("dueDate", moment(poData?.dueDate));

    let discount = dataSource.reduce(function (tot, arr) {
      return Number(tot) + Number(arr.discount);
    }, 0);
    let rate = dataSource.reduce(function (tot, arr) {
      return Number(tot) + Number(arr.rate);
    }, 0);
    let vat = dataSource.reduce(function (tot, arr) {
      return Number(tot) + Number(arr.tax);
    }, 0);
    let amount = dataSource.reduce(function (tot, arr) {
      return Number(tot) + Number(arr.amount);
    }, 0);

    settaxableAmount(Number(rate).toFixed(2));
    settotalDiscount(Number(discount).toFixed(2));
    settotalTax(Number(vat).toFixed(2));

    if (poData?.roundOff == true) {
      let roundValue =
        Math.round(Number(rate) + Number(vat) - Number(discount)) -
        (Number(rate) + Number(vat) - Number(discount));
      setroundofValue(roundValue.toFixed(2));
      settotalAmount(
        Math.round(Number(rate) + Number(vat) - Number(discount)).toFixed(2)
      );
    } else {
      setroundofValue((0).toFixed(2));
      settotalAmount(amount.toFixed(2));
    }
  }, [dataSource, poData]);

  const editModal = (data) => {
    let taxInfoData = data?.taxInfo;
    if (typeof data?.taxInfo === "string") {
      taxInfoData = JSON.parse(data?.taxInfo);
    }
    editsetValue("taxInfo", taxInfoData);
    editsetValue("tax", data?.form_updated_tax);
    editsetValue("rate", Number(data?.form_updated_rate).toFixed(2));
    editsetValue(
      "discountType",
      Number(data.form_updated_discounttype).toFixed(2)
    );
    editsetValue("discount", Number(data.form_updated_discount).toFixed(2));
    editsetValue("keyValue", data.key);
    editsetValue("productId", data.productId);
    editsetValue("quantity", data.quantity);
    Edittrigger();
  };

  let editRowInputs = useRef([]);

  const addTableRows = (product_id) => {
    if (product_id != "") {
      let selectedProduct;
      selectedProduct = productData.find((prod) => {
        return prod?._id == `${product_id}`;
      });

      let removeSeletctedProd;
      removeSeletctedProd = productsCloneData.filter((prod) => {
        return prod?._id != `${product_id}`;
      });
      // setproductsCloneData(removeSeletctedProd);
      // record?.quantity*record?.weight
      const newData = {
        key: count,
        name: selectedProduct?.name,
        sku: selectedProduct?.sku,
        productId: selectedProduct?._id,
        units: selectedProduct?.units?.name,
        unit_id: selectedProduct?.units?._id,
        quantity: 1,
        discountType: selectedProduct?.discountType,
        discount: Number(selectedProduct?.discountValue).toFixed(2),
        rate: Number(selectedProduct?.purchasePrice).toFixed(2),
        tax: Number(selectedProduct?.tax?.taxRate).toFixed(2),
        taxInfo: selectedProduct?.tax,
        weight:selectedProduct?.weight,
        numberOfPacks:selectedProduct?.numberOfPacks,
        primaryUnit:selectedProduct?.primaryUnit,
        halfskitprice: "",
        fullskitprice: "",
        isRateFormUpadted: false,
        form_updated_discounttype: selectedProduct?.discountType,
        form_updated_discount: Number(selectedProduct?.discountValue).toFixed(
          2
        ),
        form_updated_rate: Number(selectedProduct?.purchasePrice).toFixed(2),
        form_updated_tax: Number(selectedProduct?.tax?.taxRate).toFixed(2),
        amount: 0,
      };
      console.log({newData})
      let Calulateddicount;
      let tdrateVlaue = Number(1 * selectedProduct?.purchasePrice);

      if (selectedProduct?.discountType == "2") {
        Calulateddicount = (
          tdrateVlaue *
          (selectedProduct?.discountValue / 100)
        ).toFixed(2);
      } else {
        Calulateddicount = (selectedProduct?.discountValue).toFixed(2);
      }

      let afterdiscount = (
        Number(tdrateVlaue) - Number(Calulateddicount)
      ).toFixed(2);

      let newDataTax = (
        afterdiscount *
        (Number(selectedProduct?.tax?.taxRate) / 100)
      ).toFixed(2);

      let newDataAmount = (
        Number(selectedProduct?.purchasePrice) -
        Number(Calulateddicount) +
        Number(newDataTax)
      ).toFixed(2);

      newData.tax = newDataTax;
      newData.amount = newDataAmount;
      newData.discount = (tdrateVlaue - afterdiscount).toFixed(2);
      if (newData.primaryUnit){
        newData.rate = newData.rate*newData.numberOfPacks;
        newData.tax = newData.tax*newData.numberOfPacks;
        newData.amount = newData.amount*newData.numberOfPacks;
        newData.discount = newData.discount*newData.numberOfPacks;
      }
      setDataSource([...dataSource, newData]);
      editRowInputs.current[count] = React.createRef();
      setrowErr([
        ...rowErr,
        { field: `qtyInput${count}`, valid: true, key: count },
      ]);
      setCount(count + 1);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isAnyerr = rowErr.some((tblRows) => tblRows.valid == false);
  }, [rowErr]);

  useEffect(() => {
    console.log({dataSource})
  }, [dataSource]);
  const addTaxratesForm = async (data) => {
    const row = dataSource.find((item) => item.key == data.keyValue);
    let updatedTaxdata = data?.taxInfo;
    let enteredVlaue;
    if (data.quantity && data.quantity != "" && data.quantity != 0) {
      enteredVlaue = Number(data.quantity);
    }

    if (enteredVlaue != undefined) {
      // with cal qty
      let discountType = Number(data.discountType);
      let temp_rate = Number(data.rate);
      let temp_discount = Number(data.discount);
      let temp_tax = Number(updatedTaxdata?.taxRate);

      row.rate = (enteredVlaue * temp_rate).toFixed(2);

      let Calulateddicount;
      let tdrateVlaue = Number(enteredVlaue * temp_rate);

      // eslint-disable-next-line no-unused-vars, no-constant-condition
      if ((discountType = "2")) {
        Calulateddicount = (tdrateVlaue * (temp_discount / 100)).toFixed(2);
      } else {
        Calulateddicount = (Number(temp_discount)).toFixed(2);
      }

      row.discount = Number(Calulateddicount).toFixed(2);
      let tdDiscout = tdrateVlaue - Calulateddicount;
      row.tax = (tdDiscout * (Number(temp_tax) / 100)).toFixed(2);
      row.amount = (
        Number(row.rate) +
        Number(row.tax) -
        Number(row.discount)
      ).toFixed(2);
      row.quantity = enteredVlaue;
    } else {
      // with cal qty
      let discountType = Number(data.discountType);
      let temp_rate = Number(data.rate);
      let temp_discount = Number(data.discount);
      let temp_tax = Number(updatedTaxdata?.taxRate);

      row.rate = temp_rate.toFixed(2);

      let Calulateddicount;
      let tdrateVlaue = Number(temp_rate);

      // eslint-disable-next-line no-constant-condition, no-unused-vars
      if ((discountType = "2")) {
        Calulateddicount = (tdrateVlaue * (temp_discount / 100)).toFixed(2);
      } else {
        Calulateddicount = (Number(temp_discount)).toFixed(2);
      }

      row.discount = Number(Calulateddicount).toFixed(2);
      let tdDiscout = tdrateVlaue - Calulateddicount;
      row.tax = (tdDiscout * (Number(temp_tax) / 100)).toFixed(2);
      row.amount = (
        Number(row.rate) +
        Number(row.tax) -
        Number(row.discount)
      ).toFixed(2);
      row.quantity = enteredVlaue;
    }

    row.isRateFormUpadted = true;
    row.form_updated_discount = Number(data.discount);
    row.form_updated_rate = Number(data.rate);
    row.form_updated_tax = Number(updatedTaxdata?.taxRate);
    row.taxInfo = data.taxInfo;

    const newData = [...dataSource];
    const index = newData.findIndex((item) => data.keyValue === item.key);
    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    EditcancelModal.current.click();
  };

  var removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        // eslint-disable-next-line no-prototype-builtins
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] == value
      ) {
        arr.splice(i, 1);
      }
    }
    return arr;
  };

  const handleDelete = (key, productId) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    let addDeletedprod;
    addDeletedprod = productData.find((prod) => {
      return prod?._id == `${productId}`;
    });
    // setproductsCloneData([...productsCloneData, addDeletedprod]);

    let errorListarray = rowErr;
    let resterrorlists = removeByAttr(errorListarray, "key", key);
    setrowErr([...resterrorlists]);
  };

  const handleChanges = (evnt, key) => {
    const { value } = evnt.target;
    const row = dataSource.find((item) => item.key == key);

    // reset start
    let resetRowdataBefore;
    let resetRowdataBeforerate;
    let resetRowdataBeforediscount;
    let resetRowdataBeforetax;
    resetRowdataBefore = productData.find((prod) => {
      return prod?._id == row.productId;
    });

    if (row.isRateFormUpadted) {
      resetRowdataBeforerate = row?.form_updated_rate;
      resetRowdataBeforediscount = row?.form_updated_discount;
      resetRowdataBeforetax = row?.form_updated_tax;
    } else {
      resetRowdataBeforerate = resetRowdataBefore?.purchasePrice;
      resetRowdataBeforediscount = resetRowdataBefore?.discountValue;
      resetRowdataBeforetax = resetRowdataBefore?.tax?.taxRate;
    }

    row.rate = resetRowdataBeforerate;
    row.discount = resetRowdataBeforediscount;
    row.tax = resetRowdataBeforetax;
    row.amount = 0;
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    // reset done

    if (value && value != "" && value != 0) {
      let setValidRow = rowErr.find((row) => Number(row?.key) == key);
      setValidRow.valid = true;
      const newrowData = [...rowErr];
      const rowindex = newrowData.findIndex((item) => item?.key == key);
      const rowitem = newrowData[rowindex];
      newrowData.splice(rowindex, 1, {
        ...rowitem,
        ...setValidRow,
      });
      setrowErr(newrowData);

      let temp_rate = Number(row.rate);
      let temp_discount = Number(row.discount);
      let temp_tax = Number(row.tax);
      let enteredVlaue = value;
      let enVlaue = Number(enteredVlaue);
      let discountType = Number(row.discountType);

      if (row.isRateFormUpadted) {
        temp_rate = row?.form_updated_rate;
        temp_discount = Number(row?.form_updated_discount);
        temp_tax = row?.form_updated_tax;
      }

      row.rate = (enVlaue * temp_rate).toFixed(2);

      let Calulateddicount;
      let tdrateVlaue = Number(enVlaue * temp_rate);

      if (discountType == "2") {
        Calulateddicount = (tdrateVlaue * (temp_discount / 100)).toFixed(2);
      } else {
        Calulateddicount = (Number(temp_discount)).toFixed(2);
      }

      row.discount = Number(Calulateddicount).toFixed(2);
      let tdDiscout = tdrateVlaue - Calulateddicount;
      row.tax = (tdDiscout * (Number(temp_tax) / 100)).toFixed(2);

      row.amount = (
        Number(row.rate) +
        Number(row.tax) -
        Number(row.discount)
      ).toFixed(2);
      row.quantity = enteredVlaue;
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      const item = newData[index];

      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
    } else {
      let setValidRow = rowErr.find((row) => row?.key == key);
      setValidRow.valid = false;
      const newrowDatad = [...rowErr];
      const rowindex = newrowDatad.findIndex((item) => item?.key == key);
      const rowitem = newrowDatad[rowindex];
      newrowDatad.splice(rowindex, 1, {
        ...rowitem,
        ...setValidRow,
      });
      setrowErr(newrowDatad);
      row.rate = Number(0).toFixed(2);
      row.discount = Number(0).toFixed(2);
      row.tax = Number(0).toFixed(2);
      row.amount = Number(0).toFixed(2);
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
    }
  };
  const handleBatchNoChanges = (event, key) => {
    const { value } = event.target;
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);

    if (index !== -1) {
      newData[index] = { ...newData[index], batchNo: value };
      setDataSource(newData);
    }
  };

  const handleInlineRateChange = (event, key) => {
    const { value } = event.target;
    console.log({value})
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);
    if (index === -1) return;

    const row = { ...newData[index] };
    const perUnitRate = Number(value || 0);
    const quantity = Number(row.quantity || 0);

    const discountType = Number(row.discountType);
    const tempDiscount = row.isRateFormUpadted
      ? Number(row.form_updated_discount)
      : Number(row.discount);

    const taxRate = row.isRateFormUpadted
      ? Number(row.form_updated_tax)
      : Number(row?.taxInfo?.taxRate);

    const totalRateBeforeDiscount = Number(quantity * perUnitRate);

    let calculatedDiscount;
    if (discountType == "2") {
      calculatedDiscount = Number(
        (totalRateBeforeDiscount * (tempDiscount / 100)).toFixed(2)
      );
    } else {
      calculatedDiscount = Number(Number(tempDiscount).toFixed(2));
    }

    const taxableBase = totalRateBeforeDiscount - calculatedDiscount;
    const taxAmount = Number((taxableBase * (taxRate / 100)).toFixed(2));
    const totalRate = Number(totalRateBeforeDiscount.toFixed(2));
    const amount = Number((totalRate + taxAmount - calculatedDiscount).toFixed(2));

    row.isRateFormUpadted = true;
    row.form_updated_rate = perUnitRate;
    row.rate = totalRate.toFixed(2);
    row.discount = calculatedDiscount.toFixed(2);
    row.tax = taxAmount.toFixed(2);
    row.amount = amount.toFixed(2);
    row.price_per_piece = perUnitRate;

    newData.splice(index, 1, row);
    setDataSource(newData);
  };

  const handleHalfSkitPriceChange = (event, key) => {
    const { value } = event.target;
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);
    if (index === -1) return;
    newData[index] = { ...newData[index], halfskitprice: value };
    setDataSource(newData);
  };

  const handleFullSkitPriceChange = (event, key) => {
    const { value } = event.target;
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);
    if (index === -1) return;
    newData[index] = { ...newData[index], fullskitprice: value };
    setDataSource(newData);
  };

  const handleMFGChanges = (event, key) => {
    const { value } = event.target;
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);

    if (index !== -1) {
      newData[index] = { ...newData[index], mfgDate: value };
      setDataSource(newData);
    }
  };

  const handleEXPChanges = (event, key) => {
    const { value } = event.target;
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);

    if (index !== -1) {
      newData[index] = { ...newData[index], expDate: value };
      setDataSource(newData);
    }
  };

  const handleKey = (event) => {
    const { name, value } = event.target;
    if (event.keyCode === 8 || event.keyCode === 46) {
      let strVlaue = `${event.target.value}`;
      let curVal = strVlaue.replace(/:$/, "");
    }
  };

  const defaultColumns = [
    {
      title: "S.No",
      dataIndex: "serialNo",
      render: (text, record, index) => index + 1, // Generating Serial Number
    },
    {
      title: "Product",
      dataIndex: "name",
    },{
      title: "Product code",
      dataIndex: "sku",
    },
    {
      title: "quantity",
      dataIndex: "quantity",
      editable: "true",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <input
            type="text"
            onKeyPress={handleNumberRestriction}
            {...register(`qtyInput${record.key}`)}
            className={`form-control`}
            onKeyDown={(e) => {
              handleKey(e);
            }}
            onKeyUp={(e) => {
              handleKey(e);
            }}
            onChange={(e) => {
              handleChanges(e, record.key);
            }}
            // value={record?.quantity ? record?.quantity : ""}
            defaultValue={record?.quantity}
          />
        </div>
      ),
    },
    {
      title: "Batch No",
      dataIndex: "batchNo",
      editable: true,
      render: (text, record) => (
        <div className="d-flex flex-column">
          <input
            type="text"
            className="form-control"
            onChange={(e) => handleBatchNoChanges(e, record.key)}
            defaultValue={record?.batchNo}
            placeholder="Batch No"
          />
        </div>
      ),
    },
    {
      title: "Price per piece",
      dataIndex: "price",
      editable: false,
      render: (text, record) => (
        <div className="d-flex flex-column">
          <input
            type="number"
            className="form-control mt-1"
            onChange={(e) => handleInlineRateChange(e, record.key)}
            defaultValue={
              record?.isRateFormUpadted
                ? record?.form_updated_rate
                : record?.rate && record?.quantity
                ? (Number(record?.rate) / Number(record?.quantity)).toFixed(2)
                : ""
            }
            placeholder="Rate"
          />
        </div>
      ),
    },
    {
      title: "Half Skit Price",
      dataIndex: "halfskitprice",
      editable: false,
      render: (text, record) => (
        <div className="d-flex flex-column">
          
          <input
            type="text"
            className="form-control mt-1"
            onChange={(e) => handleHalfSkitPriceChange(e, record.key)}
            defaultValue={record?.halfskitprice}
            placeholder="Half Skit Price"
          />
          
        </div>
      ),
    },
    {
      title: "Full Skit Price",
      dataIndex: "fullskitprice",
      editable: false,
      render: (text, record) => (
        <div className="d-flex flex-column">
          <input
            type="number"
            className="form-control mt-1"
            onChange={(e) => handleFullSkitPriceChange(e, record.key)}
            defaultValue={record?.fullskitprice}
            placeholder="Full Skit Price"
          />
        </div>
      ),
    },
    {
      title: "MFG Date",
      dataIndex: "mfgDate",
      editable: true,
      render: (text, record) => (
        <input
          type="date"
          className="form-control"
          onChange={(e) => handleMFGChanges(e, record.key)}
          defaultValue={record?.mfgDate}
        />
      ),
    },
    {
      title: "EXP Date",
      dataIndex: "expDate",
      editable: true,
      render: (text, record) => (
        <input
          type="date"
          className="form-control"
          onChange={(e) => handleEXPChanges(e, record.key)}
          defaultValue={record?.expDate}
        />
      ),
    },
    
    {
      title: "Grs Weights",
      dataIndex: "weight",
      render: (text, record) => (
        <>
          {record?.quantity*record?.weight }{record?.units}
        </>
      ),
    },
    // {
    //   title: "Unit",
    //   dataIndex: "units",
    // },
    {
      title: "Grs Quantity",
      dataIndex: "quantity",
      render: (text, record) => {
        return <>{ record.quantity* record.numberOfPacks}</>;
      },
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.rate}
        </>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.discount}
        </>
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.tax}
        </>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.amount}
        </>
      ),
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to="#"
              className="btn-action-icon me-2"
              onClick={() => editModal(record)}
              data-bs-toggle="modal"
              data-bs-target="#add_discount"
            >
              <span>
                {/* <i className="fe fe-edit" /> */}
                <FeatherIcon icon="edit" />
              </span>
            </Link>
            <Link
              to="#"
              className="btn-action-icon"
            >
              <Popconfirm
                title="Sure you want to delete?"
                onConfirm={() => handleDelete(record.key, record.productId)}
              >
                <span>
                  <i className="fe fe-trash-2">
                    <FeatherIcon icon="trash-2" />
                  </i>
                </span>
              </Popconfirm>
            </Link>
          </div>
        </>
      ),
    },
  ];

  const handlesave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataindex: col.dataIndex,
        title: col.title,
        // handlesave,
      }),
    };
  });

  const values = getValues();
  values.totalTax = totalTax;
  values.taxableAmount = taxableAmount;
  values.totalAmount = totalAmount;
  values.selectedSign = selectedSign;
  values.product = dataSource;

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="content-page-header">
            <h5>Confirm Goods Inward</h5>
          </div>
          <form onSubmit={handleSubmit(submiteditPOForm)}>
            <div className="row">
              <div className="col-md-12">
                <div className="card-body">
                  <div className="form-group-item border-0 mb-0">
                    <div className="row align-item-center">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Purchases Id</label>
                          <Controller
                            name="purchaseId"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.purchaseId ? "error-input" : ""
                                }`}
                                type="text"
                                value={value ? value : ""}
                                onChange={onChange}
                                readOnly={true}
                                disabled={true}
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.purchaseId?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Select Vendor<span className="text-danger"> *</span>
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="vendorId"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    
                                    className={`react-selectcomponent form-control w-100 ${
                                      errors?.vendorId ? "error-input" : ""
                                    }`}
                                    placeholder="Select Vendor"
                                    getOptionLabel={(option) =>
                                      `${option.vendor_name}`
                                    }
                                    getOptionValue={(option) => `${option._id}`}
                                    options={vendors}
                                    disabled={true}
                                    classNamePrefix="select_kanakku"
                                  />
                                )}
                              />
                              <small className="text-danger">
                                {errors?.vendorId?.message}
                              </small>
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="/add-vendors"
                              >
                                <i className="fas fa-plus-circle" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>Purchases Order Date</label>
                          <Controller
                            control={control}
                            name="purchaseOrderDate"
                            render={({ field: { value, onChange } }) => (
                              <DatePickerComponent
                                className={`datetimepicker form-control ${
                                  errors?.purchaseOrderDate ? "error-input" : ""
                                }`}
                                value={value}
                                disabled={true}
                                onChange={(date) => {
                                  onChange(date);
                                }}
                              />
                            )}
                            defaultValue=""
                          />
                         
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>Due Date</label>
                          <Controller
                            control={control}
                            name="dueDate"
                            render={({ field: { value, onChange } }) => (
                              <DatePickerComponent
                                className={`datetimepicker form-control ${
                                  errors?.dueDate ? "error-input" : ""
                                }`}
                                value={value}
                                disabled={true}
                                onChange={(date) => {
                                  onChange(date);
                                }}
                              />
                            )}
                            defaultValue=""
                          />
                          
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Reference No</label>
                          <Controller
                            name="referenceNo"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.referenceNo ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value ? value : ""}
                                disabled={true}
                                onChange={onChange}
                                placeholder="Enter Reference No"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Products<span className="text-danger"> *</span>
                          </label>
                          {/* addTableRows */}
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="products"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <Select
                                      className={`react-selectcomponent form-control w-100 ${
                                        errors?.products ? "error-input" : ""
                                      }`}
                                      placeholder="Select Products"
                                      options={productsCloneData}
                                      value={value}
                                      classNamePrefix="select_kanakku"
                                      onChange={(e) => {
                                        onChange(e);
                                        trigger("products");
                                        addTableRows(e?.value);
                                      }}
                                      disabled={true}
                                    />
                                  </>
                                )}
                              />
                              <small>{errors?.products?.message}</small>
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="/add-product"
                              >
                                <i className="fas fa-plus-circle" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-item">
                    <div className="card-table">
                      <div className="card-body product-list category">
                        <div className="table-responsive">
                          <Table
                            components={components}
                            rowClassName={() => "editable-row"}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                            pagination={{ position: ["none", "none"] }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-item border-0 p-0">
                    <div className="row">
                      <div className="col-xl-6 col-lg-12">
                        <div className="form-group-bank">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="form-group">
                                <label>Select Bank</label>
                                <Controller
                                  name="bank"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <Select
                                        value={value}
                                        onChange={onChange}
                                        className={`form-control react-selectcomponent w-100`}
                                        placeholder="Select Bank"
                                        getOptionLabel={(option) =>
                                          `${option.bankName}`
                                        }
                                        getOptionValue={(option) =>
                                          `${option._id}`
                                        }
                                        options={bank}
                                        classNamePrefix="select_kanakku"
                                      />
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-groups">
                                <Link
                                  className="btn btn-primary"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#bank_details"
                                >
                                  Add Bank
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="form-group notes-form-group-info">
                            <label>Notes</label>
                            <Controller
                              name="notes"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <textarea
                                  className={`form-control ${
                                    errors?.notes ? "error-input" : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Notes"
                                  autoComplete="false"
                                  onKeyPress={handleKeyPress}
                                />
                              )}
                              defaultValue=""
                            />
                          </div>
                          <div className="form-group input_text notes-form-group-info mb-0">
                            <label>Terms and Conditions</label>
                            <Controller
                              name="termsAndCondition"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <textarea
                                  className={`form-control ${
                                    errors?.termsAndCondition
                                      ? "error-input"
                                      : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Terms and Conditions"
                                  autoComplete="false"
                                  onKeyPress={handleKeyPress}
                                />
                              )}
                              defaultValue=""
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-12">
                        <div className="form-group-bank">
                          <div className="invoice-total-box">
                            <div className="invoice-total-inner">
                              <p>
                                Amount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {Number(taxableAmount).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </p>
                              <p>
                                Discount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                 
                                  {Number(totalDiscount).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </p>
                              <p>
                                Tax{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {Number(totalTax).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </p>
                              <div className="status-toggle justify-content-between">
                                <div className="d-flex align-center">
                                  <p>Round Off </p>

                                  
                                  <Controller
                                    name="roundof"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                      <input
                                        id="rating_1"
                                        className="check"
                                        type="checkbox"
                                        checked={field.value} // Use field.value to control the input
                                        onChange={(e) => {
                                          field.onChange(e.target.checked); 
                                          trigger("roundof");
                                          changeRoundoff(e.target.checked);
                                          setroundof(e.target.checked);
                                        }}
                                      />
                                    )}
                                  />
                                  <label
                                    htmlFor="rating_1"
                                    className="checktoggle checkbox-bg"
                                  >
                                    checkbox
                                  </label>
                                </div>
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {roundofValue}
                                </span>
                              </div>
                            </div>
                            <div className="invoice-total-footer">
                              <h4>
                                Total Amount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {Number(totalAmount).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </h4>
                            </div>
                          </div>
                          <SignaturePadComponent
                            setValue={setValue}
                            register={register}
                            trigger={trigger}
                            formcontrol={control}
                            errors={errors}
                            clearErrors={clearErrors}
                            setTrimmedDataURL={setTrimmedDataURL}
                            trimmedDataURL={trimmedDataURL}
                            setSignatureData={setSignatureData}
                            handleKeyPress={handleKeyPress}
                            data={poData}
                            setselectedSign={setselectedSign}
                            selectedSign={selectedSign}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    
                    <Link
                      to="/purchase-orders"
                      // type="reset"
                      className="btn btn-primary cancel me-2"
                    >
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="modal custom-modal fade" id="add_discount" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <form onSubmit={addTaxratesFormhandle(addTaxratesForm)}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Tax &amp; Discount</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>Rate</label>
                      <Controller
                        name={`keyValue`}
                        type="hidden"
                        control={editTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value ? value : ""} />
                        )}
                        defaultValue=""
                      />
                      <Controller
                        name={`productId`}
                        type="hidden"
                        control={editTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value ? value : ""} />
                        )}
                        defaultValue=""
                      />
                      <Controller
                        name={`quantity`}
                        type="hidden"
                        control={editTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value ? value : ""} />
                        )}
                        defaultValue=""
                      />
                      <Controller
                        name={`tax`}
                        type="hidden"
                        control={editTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value ? value : ""} />
                        )}
                        defaultValue=""
                      />
                      <Controller
                        name={`discountType`}
                        type="hidden"
                        control={editTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value ? value : ""} />
                        )}
                        defaultValue=""
                      />
                      <Controller
                        name={`rate`}
                        type="number"
                        control={editTaxratesFormControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              errors?.rate ? "error-input" : ""
                            }`}
                            type="number"
                            value={value ? value : ""}
                            onChange={onChange}
                            placeholder="Enter Rate"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addTaxratesFormErr?.rate?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>Discount Amount</label>
                      <Controller
                        name={`discount`}
                        type="number"
                        control={editTaxratesFormControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              errors?.discount ? "error-input" : ""
                            }`}
                            type="number"
                            value={value ? value : ""}
                            onChange={onChange}
                            placeholder="Enter discount"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addTaxratesFormErr?.discount?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0 input_text">
                      <label>Tax</label>
                      <Controller
                        name="taxInfo"
                        control={editTaxratesFormControl}
                        render={({ field }) => (
                          <Select
                            {...field}
                           
                            className={`react-selectcomponent form-control`}
                            placeholder="Select Tax"
                            getOptionLabel={(option) =>
                              `${option.name} (${option.taxRate}%)`
                            }
                            getOptionValue={(option) => `${option._id}`}
                            options={tax}
                            classNamePrefix="select_kanakku"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  ref={EditcancelModal}
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Back
                </Link>
                <button
                  className="btn btn-primary paid-continue-btn"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div
        className="modal custom-modal fade"
        id="delete_discount"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 justify-content-center pb-0">
              <div className="form-header modal-header-title text-center mb-0">
                <h4 className="mb-2">Delete Products</h4>
                <p>Are you sure want to delete?</p>
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-continue-btn"
                    >
                      Delete
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="bank_details" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <form onSubmit={bankHandle(addBankSettingsForm)}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Bank Details</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Bank Name <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="bankName"
                        type="text"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.bankName ? "error-input" : ""
                            }`}
                            type="text"
                            value={value ? value : ""}
                            onChange={onChange}
                            placeholder="Enter Bank Name"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.bankName?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Account Number <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="accountNumber"
                        type="number"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.accountNumber ? "error-input" : ""
                            }`}
                            type="number"
                            value={value ? value : ""}
                            onChange={onChange}
                            placeholder="Enter Account Number"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.accountNumber?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Account Holder Name{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="name"
                        type="text"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.name ? "error-input" : ""
                            }`}
                            type="text"
                            value={value ? value : ""}
                            onChange={onChange}
                            placeholder="Enter Account Holder Name"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.name?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Branch Name <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="branch"
                        type="text"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.branch ? "error-input" : ""
                            }`}
                            type="text"
                            value={value ? value : ""}
                            onChange={onChange}
                            placeholder="Enter branch Name"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.branch?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text mb-0">
                      <label>
                        IFSC Code <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="IFSCCode"
                        type="text"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.IFSCCode ? "error-input" : ""
                            }`}
                            type="text"
                            value={value ? value : ""}
                            onChange={onChange}
                            placeholder="Enter IFSC Code"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.IFSCCode?.message}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  ref={editbankpocancelModal}
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
                <button
                  className="btn btn-primary paid-continue-btn"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default EditPurchaseOrder;
