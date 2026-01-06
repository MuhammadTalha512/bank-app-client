import React from "react";
import { Route, Routes } from "react-router-dom";
import CreateAccount from "./CreateAccount";
import DashboardOverview from "./DashboardOverview";
import AccountList from "./AccountList";
import Transactions from "./Transactions";

const Dashboard = () => {
  return (
    <>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="createaccount" element={<CreateAccount />} />
        <Route path="accountlist" element={<AccountList />} />
        <Route path="transactions" element={<Transactions />} />
        {/* <Route path="dashboard/account/accountlist" element={<AccountList />} /> */}
      </Routes>
    </>
  );
};

export default Dashboard;
