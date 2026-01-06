// import React from "react";
// import { Row, Col, Card, Button } from "antd";
// import {UserAddOutlined,EyeOutlined,TransactionOutlined,} from "@ant-design/icons";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import { useNavigate } from "react-router-dom";

// const DashboardOverview = () => {
//   const navigate = useNavigate();

//   const handleDashboardOverview = () => {
//     navigate("/dashboard/createaccount");
//   };

//   const handleViewAccount = () => {
//     navigate("/dashboard/accountlist"); 
//   };

//   const handleViewTransactions = () => {
//     navigate("/dashboard/transactions");
//   };

//   return (
//     <>
//       <Header />
//       <main className="container min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl py-4 md:text-4xl font-bold text-gray-800 text-center mb-12">
//             Dashboard Overview
//           </h1>

//           <Row gutter={[24, 24]} justify="center">
//             <Col xs={24} md={12}>
//               <Card
//                 bordered={false}
//                 className="text-center bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
//               >
//                 <div className="flex justify-center items-center mb-4">
//                   <div className="bg-blue-500 text-white rounded-full shadow-md p-3">
//                     <UserAddOutlined className="text-3xl" />
//                   </div>
//                 </div>
//                 <h3 className="text-2xl font-semibold text-gray-800 mb-2">
//                   Account
//                 </h3>
//                 <p className="text-gray-500 mb-4">
//                   Manage and create your bank accounts easily.
//                 </p>
//                 <div className="flex justify-center  mb-4">
//                   <Button
//                     type="primary"
//                     shape="round"
//                     icon={<UserAddOutlined />}
//                     className="shadow-md"
//                     onClick={handleDashboardOverview}
//                   >
//                     Create Account
//                   </Button>
//                   <Button
//                     shape="round"
//                     icon={<EyeOutlined />}
//                     className="shadow-sm m-md-2 m-lg-0"
//                     onClick={handleViewAccount}
//                   >
//                     View Account
//                   </Button>
//                 </div>
//                 <hr className="border-gray-300 mb-4" />
//                 <h4 className="text-lg font-medium text-gray-600">
//                   Accounts:{" "}
//                   <span className="text-blue-600 font-semibold">0</span>
//                 </h4>
//               </Card>
//             </Col>

//             <Col xs={24} md={12}>
//               <Card
//                 bordered={false}
//                 className="text-center bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
//               >
//                 <div className="flex justify-center items-center mb-4">
//                   <div className="bg-green-500 text-white rounded-full shadow-md p-3">
//                     <TransactionOutlined className="text-3xl" />
//                   </div>
//                 </div>
//                 <h3 className="text-2xl font-semibold text-gray-800 mb-2">
//                   Transactions
//                 </h3>
//                 <p className="text-gray-500 mb-4">
//                   View and track your financial transactions.
//                 </p>
//                 <div className="flex justify-center gap-3 mb-4">
//                   <Button
//                     type="primary"
//                     shape="round"
//                     className="shadow-md"
//                     onClick={handleViewTransactions}
//                   >
//                    💳 View Transactions
//                   </Button>
//                 </div>
//                 <hr className="border-gray-300 mb-4" />
//                 <h4 className="text-lg font-medium text-gray-600">
//                   Transactions:{" "}
//                   <span className="text-green-600 font-semibold">0</span>
//                 </h4>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default DashboardOverview;
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, message, Spin } from "antd";
import {
  UserAddOutlined,
  EyeOutlined,
  TransactionOutlined,
  BankOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [accountCount, setAccountCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch Account & Transaction Counts
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return message.error("Please login first");

      const [accountsRes, transactionsRes] = await Promise.all([
        axios.get(`${URL}/api/bank/get-accounts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${URL}/api/bank/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAccountCount(accountsRes.data?.accounts?.length || 0);
      setTransactionCount(transactionsRes.data?.transactions?.length || 0);
    } catch (error) {
      console.error("Dashboard Data Error:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDashboardOverview = () => navigate("/dashboard/createaccount");
  const handleViewAccount = () => navigate("/dashboard/accountlist");
  const handleViewTransactions = () => navigate("/dashboard/transactions");

  return (
    <>
      <Header />
      <main className="container min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl py-4 md:text-4xl font-bold text-gray-800 text-center mb-12">
            Dashboard Overview
          </h1>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-16">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]} justify="center">
              {/* ✅ Accounts Card */}
              <Col xs={24} md={12}>
                <Card
                  bordered={false}
                  className="text-center bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
                >
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-blue-500 text-white rounded-full shadow-md p-3">
                      <UserAddOutlined className="text-3xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Account
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Manage and create your bank accounts easily.
                  </p>

                  <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
                    <Button
                      type="primary"
                      shape="round"
                      icon={<UserAddOutlined />}
                      className="shadow-md bg-primary bg-green-600 hover:bg-green-700 border-none"
                      onClick={handleDashboardOverview}
                    >
                      Create Account
                    </Button>
                    <Button
                      shape="round"
                      icon={<EyeOutlined />}
                      className="shadow-sm border-green-500 text-green-600 hover:bg-green-100"
                      onClick={handleViewAccount}
                    >
                      View Account
                    </Button>
                  </div>

                  <hr className="border-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-600">
                    Accounts:{" "}
                    <span className="text-green-600 font-semibold">
                      {accountCount}
                    </span>
                  </h4>
                </Card>
              </Col>

              {/* ✅ Transactions Card */}
              <Col xs={24} md={12}>
                <Card
                  bordered={false}
                  className="text-center bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
                >
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-green-500 text-white rounded-full shadow-md p-3">
                      <TransactionOutlined className="text-3xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Transactions
                  </h3>
                  <p className="text-gray-500 mb-4">
                    View and track your financial transactions.
                  </p>

                  <div className="flex justify-center gap-3 mb-4">
                    <Button
                      type="primary"
                      shape="round"
                      className="shadow-md bg-green-600 hover:bg-green-700 border-none"
                      onClick={handleViewTransactions}
                    >
                      💳 View Transactions
                    </Button>
                  </div>

                  <hr className="border-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-600">
                    Transactions:{" "}
                    <span className="text-green-600 font-semibold">
                      {transactionCount}
                    </span>
                  </h4>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardOverview;
