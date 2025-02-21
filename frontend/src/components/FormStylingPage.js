import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProgressBarComponent from "./ProgressBarComponent";
import { FaArrowRight } from "react-icons/fa";

const FormStylingPage = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [fieldPlacement, setFieldPlacement] = useState("vertical");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(50); // Adjust progress dynamically if necessary
  const [fieldStyles, setFieldStyles] = useState({});
  const handleBackButtonClick = () => {
    navigate("/forms"); // Navigate back to the forms page
  };
  // Fetch form data from backend when component mounts
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/forms/${formId}`
        );
        const form = response.data.form;
        setFormData(form);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Error loading form. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFormData();
  }, [formId]);

  // Handle individual field styling change
  const handleFieldStyleChange = (fieldId, styleType, value) => {
    setFieldStyles((prevStyles) => ({
      ...prevStyles,
      [fieldId]: {
        ...prevStyles[fieldId],
        [styleType]: value,
      },
    }));
  };

  // Handle saving the styles for the entire form
  const handleSaveStyles = () => {
    alert("Styles saved successfully!");
    navigate("/forms"); // Navigate back to the forms list
  };

  const renderFormFields = () => {
    return formData?.fields?.map((field, index) => {
      const commonStyle = {
        backgroundColor:
          fieldStyles[field.id]?.backgroundColor || backgroundColor,
        color: fieldStyles[field.id]?.textColor || textColor,
        marginBottom: "1rem",
        borderRadius: "5px",
        padding: "10px",
      };

      // Adjust layout for vertical and horizontal placements
      const fieldLayoutClass =
        fieldPlacement === "horizontal" ? "d-flex align-items-center" : "";

      const renderFieldControl = (controlType, additionalProps = {}) => {
        return (
          <Form.Control {...additionalProps} style={commonStyle} readOnly />
        );
      };

      const renderOptions = (options) => {
        return options?.map((option, optionIndex) => (
          <div key={optionIndex}>
            <Form.Check
              type={field.type}
              label={option.label}
              disabled
              style={commonStyle}
              aria-label={option.label}
            />
          </div>
        ));
      };

      switch (field.type) {
        case "text":
        case "email":
        case "password":
        case "number":
        case "phone":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                {renderFieldControl("text", {
                  type: field.type,
                  value: field.defaultValue,
                  placeholder: field.placeholder,
                })}
                <Form.Control
                  type="color"
                  onChange={(e) =>
                    handleFieldStyleChange(
                      field.id,
                      "backgroundColor",
                      e.target.value
                    )
                  }
                />
                <Form.Control
                  type="color"
                  onChange={(e) =>
                    handleFieldStyleChange(
                      field.id,
                      "textColor",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </div>
          );

        case "textarea":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                {renderFieldControl("textarea", {
                  value: field.defaultValue,
                  placeholder: field.placeholder,
                })}
              </Form.Group>
            </div>
          );

        case "checkbox":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                {renderOptions(field.options)}
              </Form.Group>
            </div>
          );

        case "radio-group":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                {renderOptions(field.options)}
              </Form.Group>
            </div>
          );

        case "select":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                {renderFieldControl("select", {
                  defaultValue: field.defaultValue,
                  disabled: true,
                })}
                {field.options?.map((option, optionIndex) => (
                  <option key={optionIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Group>
            </div>
          );

        case "file":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                {renderFieldControl("file", { disabled: true })}
              </Form.Group>
            </div>
          );

        case "date":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                {renderFieldControl("date", {
                  value: field.defaultValue,
                  readOnly: true,
                })}
              </Form.Group>
            </div>
          );

        case "header":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <h3>{field.label}</h3>
            </div>
          );

        case "paragraph":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <p>{field.label}</p>
            </div>
          );

        case "autocomplete":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  list={`autocomplete-options-${index}`}
                  placeholder={field.placeholder}
                  value={field.defaultValue}
                  readOnly
                />
                <datalist id={`autocomplete-options-${index}`}>
                  {field.options?.map((option, optionIndex) => (
                    <option key={optionIndex} value={option.value} />
                  ))}
                </datalist>
              </Form.Group>
            </div>
          );

        case "hidden":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                {renderFieldControl("hidden", {
                  value: field.defaultValue,
                })}
              </Form.Group>
            </div>
          );

        case "starRating":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                <div className="star-rating" style={{ ...commonStyle }}>
                  {[...Array(5)].map((_, starIndex) => (
                    <span
                      key={starIndex}
                      className={`star ${
                        starIndex < field.defaultValue ? "filled" : ""
                      }`}
                      aria-label={`star ${starIndex + 1}`}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </Form.Group>
            </div>
          );

        case "button":
          return (
            <div key={index} style={commonStyle} className={fieldLayoutClass}>
              <Form.Group>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={commonStyle}
                  onClick={field.onClick}
                  aria-label={field.label}
                >
                  {field.label}
                </button>
              </Form.Group>
            </div>
          );

        default:
          return null;
      }
    });
  };

  if (loading) {
    return (
      <Container className="my-4">
        <Row>
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Row>
          <Col className="text-center">
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Title and Progress Bar */}
      <Row>
        <Col className="text-center">
          <div className="d-flex justify-content-center align-items-center mb-4 w-100">
            <h1 className="mb-4 flex-grow-1 text-center">Style Your Form</h1>
            <Button
              variant="outline-secondary"
              onClick={handleBackButtonClick}
              className="ml-auto"
            >
              <FaArrowRight className="mr-2" />
            </Button>
          </div>

          <ProgressBarComponent progress={progress} />
        </Col>
      </Row>

      <Row>
        {/* Form Styling Controls */}
        <Col md={4}>
          <Card className="shadow-lg border-0 rounded-4 mb-4">
            <Card.Body>
              <h3>Form Settings</h3>
              <Form>
                <Form.Group controlId="backgroundColor">
                  <Form.Label>Form Background Color</Form.Label>
                  <Form.Control
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="textColor">
                  <Form.Label>Text Color</Form.Label>
                  <Form.Control
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="fieldPlacement">
                  <Form.Label>Field Placement</Form.Label>
                  <Form.Control
                    as="select"
                    value={fieldPlacement}
                    onChange={(e) => setFieldPlacement(e.target.value)}
                  >
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                  </Form.Control>
                </Form.Group>

                <Button
                  variant="outline-primary"
                  className="mt-3"
                  onClick={handleSaveStyles}
                >
                  Save Styles
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Form Preview Section */}
        <Col md={8}>
          <h4>Form Preview</h4>
          <Card className="shadow-lg border-0 rounded-4 mb-4">
            <Card.Body style={{ height: "500px", overflowY: "auto" }}>
              {renderFormFields()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormStylingPage;
