import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Drawer, Menu, Space } from "antd";
import { MenuOutlined, BankOutlined, BankFilled, LogoutOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../contexts/AuthContext";

const Navbar = () => {
  const { Authstate, handleLogout } = useAuthContext();
  const { isAuth } = Authstate;
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Watch for window resize to toggle mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <header
      style={{
        background: "#292E49",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          <div style={{ fontSize: "22px" }} />
          🏦 Bank App
        </Link>

       {!isMobile && (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    {!isAuth ? (
      <Space>
        <Link to="/auth/login">
          <Button type="default">Login</Button>
        </Link>
        <Link to="/auth/register">
          <Button type="primary">Register</Button>
        </Link>
      </Space>
    ) : (
      <Space>
        <Link to="/dashboard">
          <Button color="green" style={{ fontWeight: 500 }}>
            Dashboard
          </Button>
        </Link>
        <Link to="/dashboard/transactions">
          <Button type="primary" color="geekblue" style={{ fontWeight: 500 }}>
            Transactions
          </Button>
        </Link>
        <Link to="/dashboard/accountlist">
          <Button type="default" style={{ fontWeight: 500,background:"#00b96b", color:"white" }}>
            Accounts
          </Button>
        </Link>
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ fontWeight: 500 }}
        >
          Logout
        </Button>
      </Space>
    )}
  </div>
)}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "white", fontSize: "22px" }} />}
            onClick={showDrawer}
          />
        )}
      </div>

      {/* Mobile Drawer */}
      <Drawer
  title="Menu"
  placement="left"
  onClose={onClose}
  open={open}
  width={240}
  bodyStyle={{
    padding: "16px",
    background: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  }}
  headerStyle={{
    background: "#292E49",
    color: "white",
    fontWeight: "bold",
  }}
>
  {!isAuth ? (
    <>
      <Link to="/auth/login" onClick={onClose}>
        <Button
          type="primary"
          block
          size="large"
          style={{ fontWeight: 500 }}
        >
          Login
        </Button>
      </Link>
      <Link to="/auth/register" onClick={onClose}>
        <Button
          type="default"
          block
          size="large"
          style={{ fontWeight: 500 }}
        >
          Register
        </Button>
      </Link>
    </>
  ) : (
    <>
      <Link to="/dashboard" onClick={onClose}>
        <Button
          block
          size="large"
          style={{
            background: "#1677ff",
            color: "white",
            border: "none",
            fontWeight: 500,
          }}
        >
          Dashboard
        </Button>
      </Link>

      <Link to="/dashboard/transactions" onClick={onClose}>
        <Button
          block
          size="large"
          type="primary"
          style={{ fontWeight: 500 }}
        >
          Transactions
        </Button>
      </Link>

      <Link to="/dashboard/accountlist" onClick={onClose}>
        <Button
          block
          size="large"
          style={{
            background: "#00b96b",
            color: "white",
            border: "none",
            fontWeight: 500,
          }}
        >
          Accounts
        </Button>
      </Link>

      <Button
        block
        size="large"
        danger
        icon={<LogoutOutlined />}
        onClick={() => {
          handleLogout();
          onClose();
        }}
        style={{ fontWeight: 500 }}
      >
        Logout
      </Button>
    </>
  )}
</Drawer>
    </header>
  );
};

export default Navbar;
