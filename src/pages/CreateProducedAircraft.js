import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, ListGroup, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faCogs, faInfo, faSpinner, faEye, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';
import { staticValues } from '../static/Static';

const CreateProducedAircraft = () => {
  const [formData, setFormData] = useState({
    aircraft: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [aircrafts, setAircrafts] = useState([]);
  const [error, setError] = useState('');
  const [missingParts, setMissingParts] = useState([]);
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const fetchAircrafts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/aircrafts/');
      setAircrafts(response.data);
    } catch (err) {
      setError('Uçak modelleri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAircraftChange = (e) => {
    const selectedAircraftId = e.target.value;
    setFormData({
      ...formData,
      aircraft: selectedAircraftId
    });
    setError('');
    setMissingParts([]);
  };

  const validateForm = () => {
    if (!formData.aircraft) {
      setError('Lütfen bir uçak modeli seçin.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setMissingParts([]);

    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post('/produced-aircrafts/', {
        aircraft: parseInt(formData.aircraft),
        is_deleted: false
      });

      setSuccess('Uçak başarıyla kaydedildi!');
      setTimeout(() => {
        navigate('/produced-aircraft');
      }, 2000);
    } catch (err) {
      if (err.response?.data?.missing_parts) {
        setError(err.response.data.error);
        setMissingParts(err.response.data.missing_parts);
        setShowModal(true); // Hata durumunda modalı göster
      } else {
        setError('Uçak kaydedilirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const MissingPartsModal = () => (
    <Modal 
      show={showModal} 
      onHide={() => setShowModal(false)}
      size="lg"
      centered
    >
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Stok Hatası
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Uçak Modeli</th>
              <th>Parça Tipi</th>
              <th>Gereken</th>
              <th>Mevcut</th>
              <th>Eksik</th>
            </tr>
          </thead>
          <tbody>
            {missingParts.map((part, index) => (
              <tr key={index}>
                <td>{part.aircraft}</td>
                <td>{part.part_type}</td>
                <td>{part.required}</td>
                <td>{part.available}</td>
                <td className="text-danger fw-bold">{part.missing}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Kapat
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h2 className="mb-4">
          <FontAwesomeIcon icon={faPlane} className="me-2" />
          Yeni Uçak Kaydı
        </h2>

        {error && !showModal && (
          <Alert variant="danger">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                <span>{error}</span>
              </div>
              {missingParts.length > 0 && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => setShowModal(true)}
                >
                  <FontAwesomeIcon icon={faInfo} className="me-2" />
                  Detayları Göster
                </Button>
              )}
            </div>
          </Alert>
        )}
        
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Uçak Modeli</Form.Label>
                <Form.Select
                  value={formData.aircraft}
                  onChange={handleAircraftChange}
                  disabled={loading}
                >
                  <option value="">Uçak modeli seçin</option>
                  {staticValues.aircrafts.map((aircraft) => (
                    <option key={aircraft.id} value={aircraft.id}>
                      {aircraft.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <Button
              variant="secondary"
              disabled={loading}
              className="me-2"
              onClick={() => navigate("/produced-aircraft")}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                  Kaydediliyor...
                </>
              ) : (
                'Uçağı Kaydet'
              )}
            </Button>
          </div>
        </Form>

        <MissingPartsModal />
      </Card.Body>
    </Card>
  );
};

export default CreateProducedAircraft;
