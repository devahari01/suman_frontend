import React from "react";
import Addprice from "./Addprice";
import { AddpriceComponentController } from "./Addprice.control";

const AddpriceComponent = () => {
  return (
    <>
      <AddpriceComponentController>
        <Addprice />
      </AddpriceComponentController>
    </>
  );
};

export default AddpriceComponent;
