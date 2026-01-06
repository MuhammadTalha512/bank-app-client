import React, { useEffect, useState } from "react";
import {Table,Card,message,Button,Modal,Descriptions,InputNumber,Space,} from "antd";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BankOutlined } from "@ant-design/icons";

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing , setIsProcessing] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [amount, setAmount] = useState(null);
  const navigate = useNavigate();

  const URL = import.meta.env.VITE_API_URL;

  
  // ✅ Fetch accounts of logged-in user
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        return;
      }

      const response = await axios.get(`${URL}/api/bank/get-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.accounts)) {
        setAccounts(response.data.accounts);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      message.error(error.response?.data?.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ✅ Show details modal
  const showDetails = (record) => {
    setSelectedAccount(record);
    setIsDetailModalVisible(true);
  };

  // ✅ Open transaction modal
  const openTransactionModal = (type) => {
    setTransactionType(type);
    setAmount(null);
    setIsTransactionModalVisible(true);
  };

  // ✅ Handle withdraw/deposit
  const handleTransaction = async () => {
    if (!amount || amount <= 0) return message.error("Enter a valid amount");

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        transactionType === "deposit"
          ? `${URL}/api/bank/deposit/${selectedAccount._id}`
          : `${URL}/api/bank/withdraw/${selectedAccount._id}`;
      setIsProcessing(true)
      const response = await axios.post(
        endpoint,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success(response.data.message || `${transactionType} successful!`);
      setIsProcessing(false)
      setIsTransactionModalVisible(false);
      setIsDetailModalVisible(false);
      fetchAccounts();
    } catch (error) {
      console.error(`${transactionType} Error:`, error);
      message.error(error.response?.data?.message || `Failed to ${transactionType}`);
    }
  };
  
  const columns = [
    { title: "Full Name", dataIndex: "name", key: "name" },
    { title: "CNIC", dataIndex: "cnic", key: "cnic" },
    { title: "Branch Code", dataIndex: "branchCode", key: "branchCode" },
    { title: "Account Number", dataIndex: "accountNumber", key: "accountNumber" },
    { title: "Account Type", dataIndex: "accountType", key: "accountType" },
    {
      title: "Cash Deposit (PKR)",
      dataIndex: "cashDeposit",
      key: "cashDeposit",
      render: (value) => `Rs. ${Number(value || 0).toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
        type="primary"
          onClick={() => showDetails(record)}
          className="bg-primary hover:bg-indigo-700"
          >
          View Details
        </Button>
      ),
    },
  ];
  
  const handleDeleteAccount = async (accountId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete this account?");
      if (!confirmDelete) return;

      const response = await axios.delete(`${URL}/api/bank/delete/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      message.success(response.data.message || "Account deleted successfully");
      setIsDetailModalVisible(false);
      fetchAccounts();
    } catch (error) {
      console.error("Delete account error:", error);
      message.error(error.response?.data?.message || "Failed to delete account");
    }
  };
  const centeredColumns = columns.map(col => ({ ...col, align: "center" }));

  return (
    <>
      <Header />
      <main className="container mx-auto my-3 py-10 px-4 min-h-screen">
        <Card
          title="🏦 My Bank Accounts"
          bordered={false}
          className="shadow-lg rounded-2xl"
        >
          {accounts.length === 0 && !loading ? (
            // 🟢 Custom empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center items-center py-16"
            >
              <BankOutlined
                style={{ fontSize: 64, color: "#292E49", marginBottom: 16 }}
              />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No accounts found
              </h3>
              <p className="text-gray-500 mb-4 text-center">
                You don’t have any accounts yet. Create one to get started!
              </p>
              <Button
                type="primary"
                size="large"
                className="bg-primary hover:bg-blue-700 text-white"
                onClick={() => navigate("/dashboard/createaccount")}
              >
                + Create New Account
              </Button>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={centeredColumns}
                dataSource={accounts}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                className="min-w-full"
                
              />
            </div>
          )}
        </Card>
      </main>

      {/* ✅ Account Details Modal */}
      <Modal
        title={
          <div className="d-flex justify-content-between align-items-center mb-3 px-3 py-2 border-bottom">
            <span className="fw-bold fs-5 text-primary">Account Details</span>
            <Button
              danger
              className="btn-delete"
              onClick={() => handleDeleteAccount(selectedAccount._id)}
            >
              Delete Account
            </Button>
          </div>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{
        }}
        style={{
          padding: "6px",
        }}
      >
        {selectedAccount && (
          <>
            <Descriptions
              bordered
              column={1}
              size="middle"
              className="mb-4"
              style={{ marginBottom: "20px" }}
            >
              <Descriptions.Item label="Full Name">{selectedAccount.name}</Descriptions.Item>
              <Descriptions.Item label="CNIC">{selectedAccount.cnic}</Descriptions.Item>
              <Descriptions.Item label="Branch Code">{selectedAccount.branchCode}</Descriptions.Item>
              <Descriptions.Item label="Account Number">{selectedAccount.accountNumber}</Descriptions.Item>
              <Descriptions.Item label="Account Type">{selectedAccount.accountType}</Descriptions.Item>
              <Descriptions.Item label="Current Balance">
                Rs. {Number(selectedAccount.cashDeposit || 0).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Space className="flex justify-center w-full gap-3" style={{ marginTop: "10px" }}>
              <Button
                type="primary"
                className="bg-green-600 bg-primary hover:bg-green-700 text-white w-full sm:w-auto"
                onClick={() => openTransactionModal("deposit")}
              >
                Deposit
              </Button>

              <Button
                type="primary"
                danger
                className="w-full sm:w-auto"
                onClick={() => openTransactionModal("withdraw")}
              >
                Withdraw
              </Button>
            </Space>
          </>
        )}
      </Modal>

      {/*  Deposit / Withdraw Modal */}
      <Modal
        title={`${transactionType === "withdraw" ? "Withdraw" : "Deposit"} Amount`}
        open={isTransactionModalVisible}
        onCancel={() => setIsTransactionModalVisible(false)}
        onOk={handleTransaction}
        centered
        okText={transactionType === "withdraw" ? "Withdraw" : "Deposit"}
        okButtonProps={{
        loading:isProcessing,
          className:
            transactionType === "withdraw"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white",
        }}
        bodyStyle={{
          padding: "30px 35px",
        }}
        style={{
          padding: "20px",
        }}
      >
        <div className="text-center">
          <p className="font-medium mb-3">
            Enter amount to {transactionType === "withdraw" ? "withdraw" : "deposit"}:
          </p>
          <InputNumber
            min={1}
            value={amount}
            onChange={setAmount}
            className="w-full w-100"
            placeholder="Enter amount"
            style={{ marginBottom: "10px" }}
          />
        </div>
      </Modal>

      <Footer />
    </>
  );
};

export default AccountsList;
