import React, { createContext, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";

const AddpriceSchema = yup.object({
  customerId: yup.object().shape({ _id: yup.string().required("Choose a Customer") }),
  products: yup.array().of(
    yup.object().shape({
      productId: yup.string().required("Choose a Product"),
      price: yup.number().required("Enter Price")
    })
  )
}).required();

const AddpriceContext = createContext({});

const AddpriceComponentController = ({ children }) => {
  const { getData, postData } = useContext(ApiServiceContext);
  const { id } = useParams();
  const [customersData, setCustomersData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);


  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await getData("/drop_down/customer");

      if (response?.code === 200) setCustomersData(response.data);
    };
    fetchCustomers();
  }, []);

  // const handleCustomerChange = async (customer) => {
  //   if (!customer?._id) return;
  //   // const response = await getData(`/api/products?customerId=${customer._id}`);
  //   const response = await getData(`/drop_down/custompricing`);
  //   if (response?.code === 200) {
  //     const productList = response.data.map((product) => ({
  //       ...product,
  //       productId: product._id,
  //       price: product.defaultPrice || 0,
  //     }));
  //     setDataSource(productList);
  //   }
  // };
  const handleCustomerChange = async (customer) => {
    if (!customer?._id) return;
    setSelectedCustomer(customer._id); // Update selected customer ID
    let payload = {
      customerId:customer._id
    }
    const response = await postData(`/drop_down/custompricing`, payload);
    if (response?.code === 200) {
      const productList = response.data.map((product) => ({
        ...product,
        productId: product._id,
        customerId:customer._id,
        price: product.defaultPrice || 0,
      }));
      setDataSource(productList);
    }
  };

  const submitCustomPrices = async () => {
    const payload = {
      customerId: selectedCustomer,
      products: dataSource.map(({ productId, customPrice }) => ({ productId, customPrice }))
    };
    const response = await postData("/products/storeCustomPrices", payload);
    if (response?.code === 200) {
      alert("Prices updated successfully!");
    }
  };

  return (
    <AddpriceContext.Provider value={{ customersData, dataSource, setDataSource, handleCustomerChange, submitCustomPrices }}>
      {children}
    </AddpriceContext.Provider>
  );
};

export { AddpriceContext, AddpriceComponentController };
