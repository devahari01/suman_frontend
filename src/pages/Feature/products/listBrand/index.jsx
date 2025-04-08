import React from "react";
import { ListBrandController } from "./listBrand.control";
import ListBrand from "./listBrand";

const ListCategories = () => {
  return (
    <>
      <ListBrandController>
        <ListBrand />
      </ListBrandController>
    </>
  );
};

export default ListCategories;
