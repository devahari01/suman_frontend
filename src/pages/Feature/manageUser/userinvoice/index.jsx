import React from "react";
import { UserInvoiceStatsController } from "./userInvoiceStats.control";
import UserInvoiceStats from "./userInvoiceStats";

const UserInvoiceStatsComponent = () => {
  return (
    <>
      <UserInvoiceStatsController>
        <UserInvoiceStats />
      </UserInvoiceStatsController>
    </>
  );
};

export default UserInvoiceStatsComponent;