import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import EditStyleModal from "../modals/EditStyleModal";
import { useNavigate, useParams } from "react-router-dom";
import { predefinedThemes } from "./themes";

function ThemeSelector() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("Minialist-white");
  const [showModal, setShowModal] = useState(false);
  const [fieldStyles, setFieldStyles] = useState({});
  const [selectedField] = useState(null);
  const { formId } = useParams();

  const navigate = useNavigate();

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme.className);
    setIsDropdownOpen(false);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // Redirect to the preview page
  const handlePreviewToggle = () => {
    navigate(`/preview/${formId}`);
  };

  const handleStyleChange = (styleType, value) => {
    const updatedFieldStyles = { ...fieldStyles };
    updatedFieldStyles[selectedField] = {
      ...updatedFieldStyles[selectedField],
      [styleType]: value,
    };
    setFieldStyles(updatedFieldStyles);
  };

  const handleSave = () => {
    // Redirect to the form page
    navigate("/forms"); // Change this path to the actual form page URL
  };

  return (
    <div
      className="theme-selector-container"
      style={{ width: "40%", marginLeft: "20px", marginTop: "20px" }}
    >
      <Card className="shadow-lg border-0 rounded-4 custom-card">
        <Card.Body>
          <h3>Select a Predefined Theme</h3>

          {/* Dropdown for theme selection */}
          <div className="choosing-list-container" onClick={toggleDropdown}>
            {/* Button to toggle preview */}
            <Button
              variant="secondary"
              onClick={handlePreviewToggle}
              className="mb-4"
            >
              <FaEye style={{ marginRight: "5px" }} />
              Preview Form
            </Button>
            <div
              className="choosing-list"
              style={{
                border: "1px solid #d1d1d6",
                padding: "12px 20px",
                fontSize: "16px",
                borderRadius: "10px",
                backgroundColor: "#f7f7f8",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span>
                {predefinedThemes.find(
                  (theme) => theme.className === selectedTheme
                )?.name || "Select a Theme"}
              </span>
              <div
                className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}
                style={{ marginLeft: "10px" }}
              />
            </div>

            {isDropdownOpen && (
              <div className="dropdown-options">
                {predefinedThemes.map((theme) => (
                  <div
                    key={theme.name}
                    className={`option ${
                      theme.className === selectedTheme ? "selected" : ""
                    }`}
                    onClick={() => handleThemeChange(theme)}
                  >
                    {theme.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <Button variant="primary" className="mt-4 w-100" onClick={handleSave}>
            Save
          </Button>
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

export default ThemeSelector;
