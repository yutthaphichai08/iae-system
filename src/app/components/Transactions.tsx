"use client";

import React, { useEffect, useState } from "react";
import Transection from "@/service/api";
import DeleteModal from "./DeleteModal";

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
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);

  const fetchData = async () => {
    try {
      const data = await Transection.getAll();
      setTranData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true); // Open modal when edit button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleSave = async () => {
    if (selectedTransaction) {
      try {
        await Transection.Update(selectedTransaction.id, {
          type: selectedTransaction.type,
          name: selectedTransaction.name,
          amount: selectedTransaction.amount,
          transactionDate: selectedTransaction.transactionDate,
        });

        setTranData((prevTranData) =>
          prevTranData.map((tran) =>
            tran.id === selectedTransaction.id ? selectedTransaction : tran
          )
        );

        handleCloseModal();
      } catch (error) {
        console.error("Error saving transaction:", error);
      }
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    setSelectedTransactionId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedTransactionId(null); // Reset selected transaction ID after closing
  };

  const handleDelete = async () => {
    if (selectedTransactionId) {
      try {
        await Transection.Delete(selectedTransactionId);
        setTranData((prevTranData) =>
          prevTranData.filter((tran) => tran.id !== selectedTransactionId)
        );
        handleCloseDeleteModal(); // Close modal after deleting
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Transaction List</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ประเภท</th>
            <th>รายการ</th>
            <th>ราคา</th>
            <th>วันที่</th>
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
                  ? (() => {
                      const date = new Date(transaction.transactionDate);
                      const day = date.getDate().toString().padStart(2, "0");
                      const month = (date.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                      const year = date.getFullYear().toString();
                      return `${day}/${month}/${year}`;
                    })()
                  : "Invalid Date"}
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(transaction)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleOpenDeleteModal(transaction.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing */}
      {selectedTransaction && isModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
          aria-labelledby="editModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">
                  Edit Transaction
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="transactionType" className="form-label">
                    Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="transactionType"
                    value={selectedTransaction.type}
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        type: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="transactionName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="transactionName"
                    value={selectedTransaction.name}
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="transactionAmount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="transactionAmount"
                    value={selectedTransaction.amount}
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        amount: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="transactionDate" className="form-label">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="transactionDate"
                    value={
                      new Date(selectedTransaction.transactionDate)
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setSelectedTransaction({
                        ...selectedTransaction,
                        transactionDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DeleteModal Component */}
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        handleDelete={handleDelete}
        id={selectedTransactionId ?? 0}
      />
    </div>
  );
}
