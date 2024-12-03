"use client";

import React, { useEffect, useState } from "react";
import Transection from "@/service/api";

interface ITransaction {
  id: number;
  type: string;
  name: string;
  amount: number;
  transactionDate: string;
}

export default function TransactionList() {
  useEffect(() => {
    fetchData();
  }, []);

  const [tranData, setTranData] = useState<ITransaction[]>([]);

  const fetchData = async () => {
    try {
      const data = await Transection.getAll();
      setTranData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Transaction List</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Transaction Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tranData.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td>{transaction.name}</td>
              <td>{transaction.amount.toFixed(2)}</td>
              <td>
                {transaction.transactionDate
                  ? new Date(transaction.transactionDate).toLocaleDateString()
                  : "Invalid Date"}
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => console.log("Edit", transaction.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => console.log("Delete", transaction.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
