import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function EditStyleModal({
  show,
  onHide,
  fieldStyles,
  selectedField,
  formId, // Pass formId as prop
  handleStyleChange,
}) {
  const [updatedStyles, setUpdatedStyles] = useState(
    fieldStyles[selectedField] || {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (styleKey, value) => {
    setUpdatedStyles((prev) => ({ ...prev, [styleKey]: value }));
    handleStyleChange(styleKey, value); // Optional: notify parent of style change
  };

  const handleSave = async () => {
    try {
      // Set loading state
      setIsSaving(true);

      // Validate if a field and form are selected
      if (!selectedField || !formId) {
        setError("No field or form selected.");
        setIsSaving(false);
        return;
      }

      // Log the selected field and updated styles for debugging
      console.log("Selected field:", selectedField);
      console.log("Updated styles:", updatedStyles);

      // Prepare the request data
      const dataToUpdate = {
        backgroundColor: updatedStyles.backgroundColor,
        color: updatedStyles.color,
        position: updatedStyles.position,
      };

      // Make the PUT request to update the field style
      const response = await axios.put(
        `https://formx360.onrender.com/forms/${formId}/fields/${selectedField}/style`,
        dataToUpdate
      );

      // Check if the response is successful
      if (response.status === 200) {
        toast.success("Field styles saved successfully!");
        onHide(); // Close the modal on success
      } else {
        setError("Failed to save the field styles. Please try again.");
      }
    } catch (err) {
      // Log detailed error for debugging
      console.error("Error saving styles:", err);

      // Check if the error has a response object (which means it came from the backend)
      if (err.response) {
        // Log the entire error response to the console
        console.error("Backend Error:", err.response.data);
      } else {
        // Network or unexpected errors
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      // Reset the loading state regardless of success or failure
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="right-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-lg font-semibold text-gray-800">
          Customize Field Style
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-5 space-y-6 bg-gray-50 rounded-2xl">
        <div className="form-styling-controls space-y-4">
          <div className="control-group space-y-1">
            <label className="text-gray-700 font-medium pr-5">
              Background Color
            </label>
            <input
              type="color"
              className="w-full h-10 rounded-lg border border-gray-300 p-1 cursor-pointer"
              value={updatedStyles.backgroundColor || "#ffffff"}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
            />
          </div>

          <div className="control-group space-y-1">
            <label className="text-gray-700 font-medium pr-5">Text Color</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg border border-gray-300 p-1 cursor-pointer"
              value={updatedStyles.color || "#000000"}
              onChange={(e) => handleChange("color", e.target.value)}
            />
          </div>

          {/* Optional: Add position control */}
          <div className="control-group space-y-1">
            <label className="text-gray-700 font-medium pr-5">Position</label>
            <select
              className="w-full h-10 rounded-lg border border-gray-300 p-1"
              value={updatedStyles.position || "left"}
              onChange={(e) => handleChange("position", e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 flex justify-between px-3 pb-3">
        <Button
          variant="light"
          className="w-full py-2 rounded-full text-gray-700"
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="w-full py-2 rounded-full bg-blue-500 text-white"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
}

export default EditStyleModal;
