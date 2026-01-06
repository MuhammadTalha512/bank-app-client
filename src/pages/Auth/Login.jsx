import React, { useState } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "../../components/message";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const { setContextState } = useAuthContext();

  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleLogin = async () => {
    let { email, password } = state;

    email = email.trim();
    password = password.trim();

    if (!email) return Toastify("Email is required", "error");
    if (!password) return Toastify("Password is required", "error");

    setIsProcessing(true);
    const URL = import.meta.env.VITE_API_URL;

    try {
      const res = await axios.post(`${URL}/api/auth/login`, {
        email,
        password,
      });

      const data = res.data;
      setIsProcessing(false);

      Toastify(data.message || "Login successful", "success");
      setContextState((s) => ({ ...s, isAuth: true }));

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setState(initialState);
    } catch (error) {
      setIsProcessing(false);
      console.error("Login error:", error);
      const message =
        error.response?.data?.message ||
        "Invalid credentials or network issue.";
      Toastify(message, "error");
    }
  };

  return (
    <main className="auth">
      <div className="card p-3 p-md-4 p-sm-4">
        <h2 className="text-center  py-3">Login</h2>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Email">
                <Input
                  type="email"
                  placeholder="Please enter your Email"
                  name="email"
                  value={state.email}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Password">
                <Input.Password
                  placeholder="Please enter your Password"
                  name="password"
                  value={state.password}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Button
              className="register-login-btn"
                loading={isProcessing}
                htmlType="button"
                block
                onClick={handleLogin}
              >
                Login
              </Button>
            </Col>
          </Row>

          <Row>
            <Col span={24} className="text-center">
              <p className="mb-0 pt-2">
                Don’t have an account?{" "}
                <Link to="/auth/register" style={{ textDecoration: "none" }}>
                  Register now
                </Link>
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  );
};

export default Login;
