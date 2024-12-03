import React from 'react';

interface DeleteModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  handleDelete: (id: number) => void; // ต้องระบุว่าฟังก์ชันนี้รับพารามิเตอร์ id
  id: number;
}

export default function DeleteModal(props: DeleteModalProps) {
  const { showModal, handleCloseModal, handleDelete, id } = props;

  if (!showModal) return null; // If showModal is false, return nothing (don't render)

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            คุณต้องการลบใช่หรือไม่ ?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={() => { id && handleDelete(id); handleCloseModal(); }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
