import React, { useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";

function FormPreview({ selectedTheme, loading, error, renderFormFields }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedField] = useState(null);
  
  const handleStyleChange = (styleType, value) => {
    const updatedFieldStyles = { ...fieldStyles };
    updatedFieldStyles[selectedField] = {
      ...updatedFieldStyles[selectedField],
      [styleType]: value,
    };
    setFieldStyles(updatedFieldStyles);
  };
  return (
    <div
      className="form-preview-container flex-grow-1 mr-4"
      style={{ width: "100%" }}
    >
      <Card className={`form-preview ${selectedTheme}`}>
        <Card.Body>
          <h4>Your Form Preview</h4>
          <p>Here is how your form will look with the selected theme.</p>
          <hr />
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="form-edit-content">{renderFormFields()}</div>
          )}
        </Card.Body>
      </Card>
      {/* Modal for Styling Control */}
      <EditStyleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        fieldStyles={fieldStyles}
        selectedField={selectedField}
        handleStyleChange={handleStyleChange}
      />
    </div>
  );
}

export default FormPreview;
