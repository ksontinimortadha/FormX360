import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

function ChangeVisibilityModal({
  show,
  handleClose,
  fetchForms,
  handleVisibilityChange,
}) {
  const handleConfirmChange = async () => {
    await handleVisibilityChange(fetchForms);
    handleClose(); // Close the modal after the change
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Visibility</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to change the visibility of the form{" "}
          <strong>{fetchForms.title}</strong> to{" "}
          {fetchForms.visibility === "public" ? "private" : "public"}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FaTimes /> Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirmChange}>
          <FaCheck /> Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChangeVisibilityModal;
