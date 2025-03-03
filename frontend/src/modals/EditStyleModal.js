import React from "react";
import { Modal, Button } from "react-bootstrap";

function EditStyleModal({
  show,
  onHide,
  fieldStyles,
  selectedField,
  handleStyleChange,
}) {
  return (
    <Modal show={show} onHide={onHide} centered className="ios-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-lg font-semibold text-gray-800">
          Customize Field Style
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-5 space-y-6 bg-gray-50 rounded-2xl">
        <div className="form-styling-controls space-y-4">
          {/* Background Color */}
          <div className="control-group space-y-1">
            <label className="text-gray-700 font-medium pr-5">
              Background Color
            </label>
            <input
              type="color"
              className="w-full h-10 rounded-lg border border-gray-300 p-1 cursor-pointer"
              value={fieldStyles[selectedField]?.backgroundColor || "#ffffff"}
              onChange={(e) =>
                handleStyleChange("backgroundColor", e.target.value)
              }
            />
            <p style={{ color: "grey" }}>
              Choose a background color for your field.
            </p>
          </div>

          {/* Text Color */}
          <div className="control-group space-y-1">
            <label className="text-gray-700 font-medium pr-5">Text Color</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg border border-gray-300 p-1 cursor-pointer"
              value={fieldStyles[selectedField]?.color || "#000000"}
              onChange={(e) => handleStyleChange("color", e.target.value)}
            />
            <p style={{ color: "grey" }}>
              Select the text color for the field content.
            </p>
          </div>

          {/* Field Placement */}
          <div className="control-group space-y-2">
            <label className="text-gray-800 font-medium">Field Placement</label>
            <div className="flex gap-5">
              {["left", "middle", "right"].map((position) => (
                <button
                  key={position}
                  className={`w-1/3 py-2 rounded border transition-all font-medium text-center
                  ${
                    fieldStyles[selectedField]?.placement === position
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-black border-gray-400"
                  } hover:bg-blue-100`}
                  onClick={() => handleStyleChange("placement", position)}
                >
                  {position.charAt(0).toUpperCase() + position.slice(1)}
                </button>
              ))}
            </div>
            <p style={{ color: "grey" , marginTop:"5px" }}>
              Select where you want the field to be positioned.
            </p>
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
          onClick={onHide}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditStyleModal;
