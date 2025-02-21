import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ProgressBarComponent from "./ProgressBarComponent"; // Import the new ProgressBar component
import "bootstrap/dist/css/bootstrap.min.css";
import "./FormBuilder.css";
import $ from "jquery";

window.jQuery = $;
window.$ = $;
require("jquery-ui-sortable");
require("formBuilder");

const FormBuilder = () => {
  const fb = useRef(null);
  const { formId } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState();
  const [formDescription, setFormDescription] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/forms/${formId}`
        );
        const form = response.data.form;

        setFormData(form);
        setFormTitle(form.title || "Untitled Form");
        setFormDescription(form.description || "");

        const validatedFields =
          form.fields?.map((field, index) => {
            if (!field.type)
              console.warn(`Missing type for field at index ${index}`);
            return field;
          }) || [];

        if (fb.current && !$(fb.current).data("formBuilder")) {
          $(fb.current).formBuilder({
            formData: validatedFields,
            onSave: () => handleSaveForm(),
          });
        }

        // Set progress to 50% if fields are loaded
        setProgress(validatedFields.length > 0 ? 50 : 0);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Error loading form. Please try again.");
        setFormTitle("Error Loading Form");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId,]);

  const handleSaveForm = async () => {
    try {
      setIsSaving(true);
      const updatedFields = JSON.parse(
        $(fb.current).data("formBuilder").actions.getData("json", true)
      );

      await axios.put(`http://localhost:5000/forms/${formId}`, {
        title: formTitle,
        description: formDescription,
        fields: updatedFields,
      });

      // Update progress to 100% when form is saved
      setProgress(100);
      alert("Form saved successfully!");
    } catch (err) {
      console.error("Error saving form:", err);
      setError("Error saving form. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setFormDescription(e.target.value);
  };

  const handleBackButtonClick = () => {
    navigate("/forms"); // Navigate back to the forms page
  };

  return (
    <div className="form-builder-container">
      <Container className="my-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button
                variant="outline-secondary"
                onClick={handleBackButtonClick}
                disabled={isSaving}
                className="mr-3"
              >
                <FaArrowLeft className="mr-2" />
              </Button>
              <h1 className="text-center w-100 form-builder-title">
                Create Your Custom Form
              </h1>
            </div>

            {/* Use the ProgressBarComponent here */}
            <ProgressBarComponent progress={progress} />

            <Button
              variant="success"
              size="sm"
              onClick={() => navigate(`/form-styling/${formId}`)}
              className="next-step-btn"
            >
              Next Step - Style Form
            </Button>

            <Card className="shadow-lg border-0 rounded-4 custom-card">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center mb-3">
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        value={formTitle}
                        onChange={handleTitleChange}
                        className="form-title-input"
                        placeholder="Enter Form Title"
                        disabled={isSaving}
                      />
                      <Button
                        variant="outline-primary"
                        className="ml-3"
                        onClick={handleSaveForm}
                        disabled={isSaving}
                      >
                        Save Title
                      </Button>
                    </>
                  )}
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formDescription}
                    onChange={handleDescriptionChange}
                    className="form-description-input"
                    placeholder="Enter Form Description"
                    disabled={isSaving}
                  />
                  <Button
                    variant="outline-primary"
                    className="ml-3"
                    onClick={handleSaveForm}
                    disabled={isSaving}
                  >
                    Save Description
                  </Button>
                </div>
                <div className="guide-text mb-3">
                  <p>
                    Use the form builder below to create your custom form. Drag
                    and drop fields to customize your form's layout.
                  </p>
                </div>
              </Card.Body>
            </Card>
            <Card className="shadow-lg border-0 rounded-4 custom-form-builder-card">
              <Card.Body>
                <h3 className="form-builder-title mb-4">Form Builder</h3>
                <div
                  ref={fb}
                  className="fb-container custom-fb-container"
                ></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FormBuilder;
