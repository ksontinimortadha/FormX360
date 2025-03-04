import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import AddFormModal from "../modals/AddFormModal";
import NavbarComponent from "./NavbarComponent";
import logo from "../images/logo.png";
import DeleteFormModal from "../modals/DeleteFormModal";

function Forms() {
  const [forms, setForms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToEdit, setFormToEdit] = useState(null);
  const [companyId, setCompanyId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const companyId = sessionStorage.getItem("companyId");
    if (companyId) {
      setCompanyId(companyId);
      fetchForms(companyId);
    }
  }, []);

  const fetchForms = async (companyId) => {
    if (!companyId) return;
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/forms/${companyId}/forms`
      );
      setForms(response.data);
    } catch (error) {
      toast.error("Failed to fetch forms.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("companyId");
    navigate("/login");
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleEditForm = (form) => {
    navigate(`/form-builder/${form._id}`);
  };

  const handleShowDeleteModal = (form) => {
    setFormToEdit(form);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  return (
    <div>
      <NavbarComponent logo={logo} handleLogout={handleLogout} />
      <div style={{ height: "100vh", display: "flex" }}>
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Container>
            <Row className="mb-4">
              <Card className="shadow-sm border-0 rounded-4 w-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Forms Management</h4>
                    <Button variant="primary" onClick={handleShowAddModal}>
                      <FaPlus /> Add Form
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              {forms.length === 0 ? (
                <Col className="text-center">No forms available.</Col>
              ) : (
                forms.map((form) => (
                  <Col key={form._id} md={12} className="mb-3">
                    <Card className="shadow-sm border-0 rounded-4">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                          <Card.Title>{form.title}</Card.Title>
                          <Card.Text>{form.description}</Card.Text>
                        </div>
                        <div>
                          <Button
                            variant="secondary"
                            onClick={() => handleEditForm(form)}
                          >
                            <FaPencilAlt size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            className="ms-2"
                            onClick={() => handleShowDeleteModal(form)}
                          >
                            <FaTrash size={16} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Container>
          <AddFormModal
            show={showAddModal}
            handleClose={handleCloseAddModal}
            fetchForms={fetchForms}
            companyId={companyId}
          />

          <DeleteFormModal
            show={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            formToEdit={formToEdit}
            fetchForms={fetchForms}
          />
        </main>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Forms;
