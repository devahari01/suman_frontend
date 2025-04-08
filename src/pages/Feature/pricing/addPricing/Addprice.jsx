import React, {useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { AddpriceContext } from "./Addprice.control";
import { Table, Input, Button,Modal  } from "antd";
import { ApiServiceContext } from "../../../../core/API/api-service";
import moment from 'moment';


const AddPrice = () => {
  const { customersData, dataSource, setDataSource, handleCustomerChange, submitCustomPrices } = useContext(AddpriceContext);
  const { control, handleSubmit } = useForm();
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getData} = useContext(ApiServiceContext);


  const handleProductPriceChange = (productId, newPrice) => {
    console.log({productId, newPrice})
    const updatedData = dataSource.map((product) =>
      product.productId === productId ? { ...product, customPrice: newPrice } : product
    );
    setDataSource(updatedData);
  };
  const fetchPriceLogs = async (customerId, productId) => {
    if (!customerId || !productId) {
      console.error("Missing customerId or productId");
      return;
    }

    setLoading(true);
    try {
      console.log(`Fetching logs for Customer: ${customerId}, Product: ${productId}`);
      const response = await getData(`/products/getPriceChangeLog/${customerId}/${productId}`);

      if (response?.data) {
        setLogData(response.data);
      } else {
        setLogData([]);
      }
    } catch (error) {
      console.error("Error fetching price logs:", error);
      setLogData([]);
    }
    setLoading(false);
    setLogModalVisible(true);
  };

  const columns = [
    { title: "Product", dataIndex: "name" },
    { title: "Product code", dataIndex: "sku" },
    { title: "Price", dataIndex: "sellingPrice" },
    { 
      title: "Custom Price", 
      dataIndex: "customPrice", 
      render: (text, record) => (
        <Input
          type="number"
          value={record.customPrice}
          onChange={(e) => handleProductPriceChange(record.productId, e.target.value)}
        />
      ) 
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Button onClick={() => fetchPriceLogs(record.customerId, record.productId)}>View Log</Button>
      )
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <h5>Set Custom Pricing</h5>
        <form onSubmit={handleSubmit(submitCustomPrices)}>
          <div className="row">
            <div className="col-lg-6">
              <label>Customer</label>
              <Controller
                name="customerId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={customersData}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option._id}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      handleCustomerChange(selectedOption);
                    }}
                  />
                )}
              />
            </div>
          </div>
          <Table columns={columns} dataSource={dataSource} rowKey="productId" />
          <Button type="primary" htmlType="submit" className="mt-3">Submit Prices</Button>
        </form>
      </div>
      <Modal title="Price Change Log" visible={logModalVisible} onCancel={() => setLogModalVisible(false)} footer={null}>
        {loading ? (
          <p>Loading...</p>
        ) : logData.length > 0 ? (
          <Table
            columns={[
              { title: "Old Price", dataIndex: "oldPrice" },
              { title: "New Price", dataIndex: "newPrice" },
              {
                title: "Changed At",
                dataIndex: "changedAt",
                render: (text) => {
                  return <span>{moment(text).format("DD-MM-YYYY")}</span>;
                },
              },
            ]}
            dataSource={logData}
            rowKey="_id"
            pagination={false}
          />
        ) : (
          <p>No price change history found.</p>
        )}
      </Modal>
    </div>
  );
};

export default AddPrice;
