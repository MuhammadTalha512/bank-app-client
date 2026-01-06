import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Card,
  InputNumber,
  message,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const { Option } = Select;

const initialState = {
  name: "",
  cnic: "",
  branchCode: "",
  accountNumber: "",
  accountType: "",
  cashDeposit: "",
};

const CreateAccount = () => {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const URL = import.meta.env.VITE_API_URL;

  // ✅ Handle input changes
  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value) => {
    setState((s) => ({ ...s, accountType: value }));
  };

  const handleCreateAccount = async (formData) => {
    try {
      setIsProcessing(true);

      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Please log in first.");
        setIsProcessing(false);
        return;
      }

      const response = await axios.post(`${URL}/api/bank/create-account`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success(response.data.message || "Account created successfully!");
      setState(initialState);
      navigate("/dashboard");


    } catch (error) {
      console.error("Create Account Error:", error);

      if (error.response?.status === 401) {
        message.error("Unauthorized — please log in again.");
      } else if (error.response?.status === 400) {
        message.error(error.response?.data?.message || "Invalid input data.");
      } else {
        message.error("Failed to create account. Please try again later.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegister = () => {
    const { name, cnic, branchCode, accountNumber, accountType, cashDeposit } = state;

    if (!name.trim()) return message.error("Name is required");
    if (!cnic.trim() || cnic.length !== 13)
      return message.error("CNIC must be 13 digits");
    if (!branchCode.trim() || branchCode.length !== 2) return message.error("Branch Code is required 2 digits");
    if (!accountNumber.trim() || accountNumber.length !== 9) return message.error("Account Number must be 9 digits required");
    if (!accountType) return message.error("Please select Account Type");
    if (!cashDeposit) return message.error("Cash Deposit is required");

    const AccountData = {
      name,
      cnic,
      branchCode,
      accountNumber,
      accountType,
      cashDeposit,
    };

    handleCreateAccount(AccountData);
  };

  return (
    <>
      <Header />
    <main className="create-account-card d-flex justify-content-center align-items-center py-10 bg-gradient-to-br from-gray-50 via-white to-gray-100">
  <Card
    className="account-card w-full max-w-[500px] shadow-xl rounded-2xl border border-gray-200 p-6"
    bordered={false}
  >
    <h2 className="text-center text-2xl font-semibold text-indigo-700 mb-6">
      🏦 Create Bank Account
    </h2>

    <Form layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={12}>
          <Form.Item label="Full Name" required>
            <Input
              placeholder="Enter your full name"
              name="name"
              value={state.name}
              onChange={handleChange}
            />
          </Form.Item>
        </Col>

        <Col xs={12}>
          <Form.Item label="CNIC" required>
            <Input
              max={13}
              maxLength={13}
              type="number"
              placeholder="Enter 13-digit CNIC"
              name="cnic"
              value={state.cnic}
              onChange={(e)=>{
                const value = e.target.value;
                if(value.length <= 13){
                  handleChange(e)
                }
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={12}>
          <Form.Item label="Branch Code" required>
            <Input
            maxLength={2}
              type="number"
              placeholder="Enter Branch Code"
              name="branchCode"
              value={state.branchCode}
              onChange={(e)=>{
                const value = e.target.value;
                if(value.length <= 2){
                  handleChange(e);
                }
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={12}>
          <Form.Item label="Account Number" required>
            <Input
            maxLength={9}
              type="number"
              placeholder="Enter Account Number"
              name="accountNumber"
              value={state.accountNumber}
              onChange={(e)=>{
                const value = e.target.value;
                if(value.length <= 9){
                  handleChange(e);
                }
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={12}>
          <Form.Item label="Account Type" required>
            <Select
              placeholder="Select Account Type"
              value={state.accountType}
              onChange={handleSelectChange}
            >
              <Option value="Saving">Saving Account</Option>
              <Option value="Current">Current Account</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={12}>
          <Form.Item label="Initial Deposit (PKR)" required>
            <InputNumber
              className="w-full w-100"
              placeholder="Enter Amount"
              min={0}
              name="cashDeposit"
              value={state.cashDeposit}
              onChange={(value) =>
                setState((prev) => ({ ...prev, cashDeposit: value }))
              }
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Button
            type="primary"
            loading={isProcessing}
            block
            className="create-btn bg-primary hover:bg-indigo-700 text-white font-medium rounded-lg"
            onClick={handleRegister}
          >
            Create Account
          </Button>
        </Col>
      </Row>
    </Form>
  </Card>
</main>

      <Footer />
    </>
  );
};

export default CreateAccount;
