// userInvoiceStats.jsx - Main Component
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../../../common/antd.css";
import { Table, Card, Row, Col, Statistic } from "antd";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import UserInvoiceStatsFilter from "../userInvoiceStatsFilter";
import { UserInvoiceStatsContext } from "./userInvoiceStats.control";
import moment from "moment";

const UserInvoiceStats = () => {
  const {
    show,
    setShow,
    userStats,
    filterList,
    setFilter,
    setFilterArray,
    searchFilter,
    setsearchFilter,
    permission,
    admin,
    page,
    pagesize,
    totalCount,
    handlePagination,
    getUserStats,
    handleImageError,
    summaryStats,
    loading,
  } = useContext(UserInvoiceStatsContext);

  const { view } = permission;

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (value, item, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => {
        return (
          <>
            <h2 className="table-avatar">
              <Link to="#" className="avatar avatar-sm me-2">
                <img
                  className="avatar-img rounded-circle"
                  onError={handleImageError}
                  src={record?.image}
                  alt="User Image"
                />
              </Link>
              <Link to="#">
                {record.firstName ? 
                  `${record.firstName} ${record.lastName}` : 
                  record.fullname
                }
                <span>{record.email}</span>
              </Link>
            </h2>
          </>
        );
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => (
        <span className={`badge badge-pill ${
          role === 'Super Admin' ? 'bg-danger-light' : 
          role === 'Admin' ? 'bg-warning-light' : 
          'bg-info-light'
        }`}>
          {role}
        </span>
      ),
    },
    {
      title: "Total Invoices",
      dataIndex: "totalInvoices",
      sorter: (a, b) => a.totalInvoices - b.totalInvoices,
      render: (count) => (
        <span className="fw-bold text-primary">{count}</span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => (
        <span className="fw-bold text-success">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Paid Invoices",
      dataIndex: "paidInvoices",
      render: (count) => (
        <span className="text-success">{count}</span>
      ),
    },
    {
      title: "Pending Invoices",
      dataIndex: "pendingInvoices",
      render: (count) => (
        <span className="text-warning">{count}</span>
      ),
    },
    {
      title: "Overdue Invoices",
      dataIndex: "overdueInvoices",
      render: (count) => (
        <span className="text-danger">{count}</span>
      ),
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    (view || admin) && {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => {
        return (
          <div className="d-flex align-items-center">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="btn-action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-right">
                <ul>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/user-invoices/${record?._id}`}
                    >
                      <i className="far fa-eye me-2" />
                      View Invoices
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/user-profile/${record?._id}`}
                    >
                      <i className="far fa-user me-2" />
                      View Profile
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      },
    },
  ].filter(Boolean);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>User Invoice Statistics</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-filters w-auto popup-toggle"
                      onClick={() => setShow(!show)}
                    >
                      <span className="me-2">
                        <FeatherIcon icon="filter" />
                      </span>
                      Filter
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="btn btn-secondary"
                      onClick={() => getUserStats(1, pagesize)}
                    >
                      <i className="fa fa-refresh me-2" aria-hidden="true" />
                      Refresh
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Summary Cards */}
          <Row gutter={16} className="mb-4">
            <Col xs={24} sm={8} md={8}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={summaryStats?.totalUsers || 0}
                  prefix={<FeatherIcon icon="users" />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8}>
              <Card>
                <Statistic
                  title="Total Invoices"
                  value={summaryStats?.totalInvoicesAcrossAllUsers || 0}
                  prefix={<FeatherIcon icon="file-text" />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={summaryStats?.totalAmountAcrossAllUsers || 0}
                  prefix="$"
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body purchase">
                  <div className="table-responsive table-hover">
                    <Table
                      loading={loading}
                      pagination={{
                        total: totalCount,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                        pageSizeOptions: [10, 25, 50, 100],
                        defaultPageSize: 10,
                        defaultCurrent: 1,
                        onChange: (page, pageSize) =>
                          handlePagination(page, pageSize),
                      }}
                      columns={columns}
                      dataSource={filterList?.length > 0 ? filterList : userStats}
                      rowKey={(record) => record?._id}
                      scroll={{ x: 1200 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserInvoiceStatsFilter
        setShow={setShow}
        show={show}
        setFilter={setFilter}
        setFilterArray={setFilterArray}
        searchFilter={searchFilter}
        setsearchFilter={setsearchFilter}
        filterList={filterList}
        userStats={userStats}
        getUserStats={getUserStats}
        pagesize={pagesize}
        page={page}
      />
    </>
  );
};

export default UserInvoiceStats;
