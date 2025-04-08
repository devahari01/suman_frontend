import React from "react";
import { AddBrandComponentController } from "./AddBrand.control";
// import AddCategory from "./AddCategory";
import AddBrand from "./AddBrand";

const AddbrandComponent = () => {
  return (
    <>
      <AddBrandComponentController>
        <AddBrand />
      </AddBrandComponentController>
    </>
  );
};

export default AddbrandComponent;
