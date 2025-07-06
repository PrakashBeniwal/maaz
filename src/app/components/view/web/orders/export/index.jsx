import React, { useState } from "react";
import styles from "./index.module.scss";
import { routes } from "../../../../../config";

const OrderExport = () => {
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({
        status,
        startDate,
        endDate,
        email,
      });

      const res = await fetch(`${routes.orderExport}?${query.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_${status}_${Date.now()}.xlsx`;
      a.click();

      alert("Export successful. File downloaded and emailed if provided.");
    } catch (err) {
      console.error(err);
      alert(err);
      alert("Something went wrong during export.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Export Orders</h2>

      <label className={styles.label}>Order Status:</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={styles.select}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="shipping">Shipping</option>
        <option value="cancelled">Cancelled</option>
        <option value="delivered">Delivered</option>
      </select>

      <label className={styles.label}>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className={styles.input}
      />

      <label className={styles.label}>End Date:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className={styles.input}
      />

      <label className={styles.label}>Send Export to Email (optional):</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@example.com"
        className={styles.input}
      />

      <button
        onClick={handleExport}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Exporting..." : "Export Orders"}
      </button>
    </div>
  );
};

export default OrderExport;

