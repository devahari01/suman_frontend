// userInvoiceStats.control.jsx - Controller Component
import React, { createContext, useContext, useEffect, useState } from "react";
import "../../../../common/antd.css";
import {
  ApiServiceContext,
  errorToast,
  usersApi,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";
import { PreviewImg } from "../../../../common/imagepath";
const UserInvoiceStatsContext = createContext({});

const UserInvoiceStatsController = (props) => {
  const [show, setShow] = useState(false);
  const [userStats, setUserStats] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [filter, setFilter] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [searchFilter, setsearchFilter] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [summaryStats, setSummaryStats] = useState({});
  const [loading, setLoading] = useState(false);

  const { getData } = useContext(ApiServiceContext);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("user");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);

  useEffect(() => {
    getUserStats();
  }, []);

  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getUserStats(page, pageSize);
  };

  const getUserStats = async (
    currentpage = 1, 
    currentpagesize = 10, 
    filters = {}
  ) => {
    setLoading(true);
    try {
      let skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      
      // Build query parameters
      let queryParams = new URLSearchParams({
        limit: currentpagesize,
        skip: skipSize,
      });

      // Add filters if provided
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);

      const response = await getData(
        `https://software.iyappaa.com:7005/users/invoice-stats?${queryParams.toString()}`
      );

      if (response?.data?.users) {
        setUserStats(response.data.users);
        setFilterList(response.data.users);
        setsearchFilter(response.data.users);
        setTotalCount(response?.data?.pagination?.totalRecords || 0);
        setSummaryStats(response?.data?.summary || {});
      }
    } catch (error) {
      errorToast("Failed to fetch user statistics");
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilterList(filterArray?.length > 0 ? filterArray : userStats);
  }, [filterArray, userStats]);

  const handleImageError = (event) => {
    event.target.src = PreviewImg;
  };

  return (
    <UserInvoiceStatsContext.Provider
      value={{
        show,
        setShow,
        userStats,
        setUserStats,
        filterList,
        setFilterList,
        filter,
        setFilter,
        filterArray,
        setFilterArray,
        searchFilter,
        setsearchFilter,
        permission,
        setPermission,
        admin,
        setAdmin,
        page,
        setPage,
        pagesize,
        setPagesize,
        totalCount,
        setTotalCount,
        handlePagination,
        getUserStats,
        handleImageError,
        summaryStats,
        setSummaryStats,
        loading,
        setLoading,
      }}
    >
      {props.children}
    </UserInvoiceStatsContext.Provider>
  );
};

export { UserInvoiceStatsContext, UserInvoiceStatsController };

