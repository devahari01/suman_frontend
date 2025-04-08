import React, { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import { onShowSizeChange, itemRender } from "../../../../common/paginationfunction";
import "../../../../common/antd.css";
import { Link, useParams } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/core-index";
import { commonDatacontext } from "../../../../core/commonData";
import moment from "moment";
import { userRolesCheck } from "../../../../common/commonMethods";

const ViewProduct = () => {
  const { id } = useParams();
  const { getData } = useContext(ApiServiceContext);
  const { currencyData } = useContext(commonDatacontext);
  const [productInvoices, setProductInvoices] = useState([]);
  
  useEffect(() => {
    fetchInvoicesByProduct();
  }, [id]);

  const fetchInvoicesByProduct = async () => {
    const url = `/products/listInvoicesByProduct/${id}`;
    try {
      const response = await getData(url);
      if (response?.data) {
        setProductInvoices(response.data);
      }
    } catch (error) {
      console.error("Error fetching invoices by product:", error);
    }
  };

  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      render: (text, record) => (
        <Link to={`/view-invoice/${record._id}`} className="invoice-link">
          {record.invoiceNumber.trim()}
        </Link>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "customerId",
      render: (customer) => customer?.name || "N/A",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (text) => (
    //     <span className={`badge ${text === "DRAFTED" ? "bg-light-gray" : "bg-success-light"}`}>
    //       {text}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Payment Method",
    //   dataIndex: "payment_method",
    // },
    // {
    //   title: "Total Discount",
    //   dataIndex: "totalDiscount",
    //   render: (text) => `${text || "0.00"}`,
    // },
    // {
    //   title: "VAT",
    //   dataIndex: "vat",
    //   render: (text) => `${text || "0.00"}`,
    // },
    // {
    //   title: "Total Amount",
    //   dataIndex: "TotalAmount",
    //   render: (text) => (
    //     <>
    //       {currencyData || "$"} {Number(text || 0).toLocaleString("en-IN", {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //       })}
    //     </>
    //   ),
    // },
    // {
    //   title: "Delivery Reference",
    //   dataIndex: "delivery",
    // },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Product Invoice Details</h5>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="table-responsive table-hover">
              <Table
                pagination={{
                  total: productInvoices.length,
                  showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={productInvoices}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;