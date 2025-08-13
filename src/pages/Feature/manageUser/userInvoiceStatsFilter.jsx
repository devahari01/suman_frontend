// userInvoiceStatsFilter.jsx - Filter Component
import React, { useEffect, useState } from "react";
import { DatePicker, Select } from "antd";
import { search } from "../../../common/imagepath";
import { debounce } from "../../../common/helper";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const UserInvoiceStatsFilter = (props) => {
  const {
    show,
    setShow,
    getUserStats,
    pagesize,
    page,
    setFilterArray,
    userStats,
  } = props;

  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [dateRange, setDateRange] = useState([]);

  // Debounced search function
  const debouncedSearch = debounce((value) => {
    applyFilters(value, selectedRole, dateRange);
  }, 500);

  const handleSearch = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    applyFilters(searchText, role, dateRange);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
    applyFilters(searchText, selectedRole, dates);
  };

  const applyFilters = (search, role, dates) => {
    const filters = {};
    
    if (search) filters.search = search;
    if (role) filters.role = role;
    if (dates && dates.length === 2) {
      filters.fromDate = dates[0].format('YYYY-MM-DD');
      filters.toDate = dates[1].format('YYYY-MM-DD');
    }

    getUserStats(1, pagesize, filters);
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedRole("");
    setDateRange([]);
    getUserStats(1, pagesize);
    setShow(false);
  };

  const resetSearch = () => {
    setSearchText("");
    applyFilters("", selectedRole, dateRange);
  };

  return (
    <div className={`toggle-sidebar ${show ? "open-filter" : ""}`}>
      <div className="sidebar-layout-filter">
        <div className="sidebar-header">
          <h5>Filter</h5>
          <a
            href="#"
            className="sidebar-closes"
            onClick={() => setShow(!show)}
          >
            <i className="fa-regular fa-circle-xmark"></i>
          </a>
        </div>
        <div className="sidebar-body">
          {/* Search Filter */}
          <div className="accordion" id="accordionMain1">
            <div className="card-header-new" id="headingOne">
              <h6 className="filter-title">
                <a
                  href="#"
                  className="w-100"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Search User
                  <span className="float-end">
                    <i className="fa-solid fa-chevron-down"></i>
                  </span>
                </a>
              </h6>
            </div>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionMain1"
            >
              <div className="card-body-chat">
                <div className="row">
                  <div className="col-md-12">
                    <div id="searchproduct-list">
                      <div className="search-input">
                        <input
                          type="text"
                          placeholder="Search user by name or email"
                          className="form-control"
                          value={searchText}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div className="search-addon">
                          <img src={search} alt="img" />
                        </div>
                        {searchText && (
                          <div 
                            className="input-addon"
                            onClick={resetSearch}
                            style={{ cursor: 'pointer' }}
                          >
                            <i className="fa fa-times"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role Filter */}
          <div className="accordion" id="accordionMain2">
            <div className="card-header-new" id="headingTwo">
              <h6 className="filter-title">
                <a
                  href="#"
                  className="w-100 collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Role
                  <span className="float-end">
                    <i className="fa-solid fa-chevron-down"></i>
                  </span>
                </a>
              </h6>
            </div>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionMain2"
            >
              <div className="card-body-chat">
                <div className="row">
                  <div className="col-md-12">
                    <Select
                      placeholder="Select Role"
                      className="w-100"
                      value={selectedRole || undefined}
                      onChange={handleRoleChange}
                      allowClear
                    >
                      <Option value="Super Admin">Super Admin</Option>
                      <Option value="Admin">Admin</Option>
                      <Option value="User">User</Option>
                      <Option value="Manager">Manager</Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="accordion" id="accordionMain3">
            <div className="card-header-new" id="headingThree">
              <h6 className="filter-title">
                <a
                  href="#"
                  className="w-100 collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Invoice Date Range
                  <span className="float-end">
                    <i className="fa-solid fa-chevron-down"></i>
                  </span>
                </a>
              </h6>
            </div>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionMain3"
            >
              <div className="card-body-chat">
                <div className="row">
                  <div className="col-md-12">
                    <RangePicker
                      className="w-100"
                      value={dateRange}
                      onChange={handleDateChange}
                      format="DD-MM-YYYY"
                      placeholder={['Start Date', 'End Date']}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-reset-btns">
          <div className="row">
            <div className="col-6">
              <a className="btn btn-light" href="#" onClick={resetFilters}>
                Reset
              </a>
            </div>
            <div className="col-6">
              <a
                href="#"
                className="btn btn-primary"
                onClick={() => setShow(false)}
              >
                Filter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInvoiceStatsFilter;
