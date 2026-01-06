import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Descriptions, message } from "antd";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion"; 
import dayjs from "dayjs";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const URL = import.meta.env.VITE_API_URL;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        return;
      }

      const res = await axios.get(`${URL}/api/bank/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && Array.isArray(res.data.transactions)) {
        setTransactions(res.data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      message.error(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns = [
    { title: "Transaction ID", dataIndex: "_id", key: "_id" },
    {
  title: "Account Number",
  dataIndex: "accountNumber",
  key: "accountNumber",
  render: (value, record) => record.accountNumber || "N/A",
},
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      title: "Amount (PKR)",
      dataIndex: "amount",
      key: "amount",
      render: (value) => `Rs. ${Number(value).toLocaleString()}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value) => dayjs(value).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedTransaction(record);
            setIsModalVisible(true);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  const centeredColumns = columns.map(col => ({ ...col, align: "center" }));

  return (
    <>
      <Header />
      <main className="container mx-auto py-10 my-5 px-4 min-h-screen">
        <Card
          title="💳 Transactions"
          bordered={false}
          className="shadow-lg rounded-2xl"
        >
          <div className="overflow-x-auto">
            {transactions.length === 0 && !loading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center py-12 text-gray-500 text-lg"
              >
                <div className="text-5xl mb-3">💸</div>
                <p>No transactions have been made yet.</p>
              </motion.div>
            ) : (
              <Table
                columns={centeredColumns}
                dataSource={transactions}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="min-w-full"
              />
            )}
          </div>
        </Card>

        {/* Transaction Details Modal */}
        <Modal
          title="Transaction Details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          centered
          width={600}
        >
          {selectedTransaction && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Transaction ID">
                {selectedTransaction._id}
              </Descriptions.Item>
              <Descriptions.Item label="Account ID">
                {selectedTransaction.accountId || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                {selectedTransaction.type}
              </Descriptions.Item>
              <Descriptions.Item label="Amount (PKR)">
                Rs. {Number(selectedTransaction.amount).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {dayjs(selectedTransaction.date).format("dddd, MMMM D, YYYY h:mm A")}

              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </main>
      <Footer />
    </>
  );
};

export default Transactions;
