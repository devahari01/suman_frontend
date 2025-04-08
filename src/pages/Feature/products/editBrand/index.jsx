import React from "react";
import { EditBrandComponentController } from "./editBrand.control";
import EditBrand from "./editBrand";

const AddbrandComponent = () => {
  return (
    <>
      <EditBrandComponentController>
        <EditBrand />
      </EditBrandComponentController>
    </>
  );
};

export default AddbrandComponent;
