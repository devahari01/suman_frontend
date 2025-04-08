import React, { useState, useEffect, useContext, createContext } from "react";
import "../../../../common/antd.css";
// import { brandApi } from "../../../../constans/apiname";
import { categoryApi } from "../../../../constans/apiname";
import { ApiServiceContext, successToast } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListBrandContext = createContext({});

const ListBrandController = (props) => {
  const [show, setShow] = useState(false);
  const [brandlist, setBrandlist] = useState([]);
  const [brandDelete, setBrandDelete] = useState([]);
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getBrandDetails();
    let findModule = userRolesCheck("brand");
    if (findModule === "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);

  const { getData, patchData } = useContext(ApiServiceContext);
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getBrandDetails(page, pageSize);
  };

  const getBrandDetails = async (currentpage = 1, currentpagesize = 10) => {
    try {
      const skipSize = currentpage === 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${process.env.REACT_APP_BACKEND_URL}brand?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response) {
        setBrandlist(response?.data);
        setTotalCount(response?.totalRecords);
      }
    } catch {
      return false;
    }
  };

  const onDelete = async (id) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}brand/${id}`;
    try {
      const responseDelete = await patchData(url);
      if (responseDelete) {
        handlePagination(1, 10);
        successToast("Brand Deleted Successfully");
        getBrandDetails();
      }
    } catch {
      return false;
    }
  };

  return (
    <ListBrandContext.Provider
      value={{
        show,
        setShow,
        brandlist,
        setBrandlist,
        brandDelete,
        setBrandDelete,
        onDelete,
        admin,
        permission,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
        setPage,
        setPagesize,
      }}
    >
      {props.children}
    </ListBrandContext.Provider>
  );
};

export { ListBrandContext, ListBrandController };
