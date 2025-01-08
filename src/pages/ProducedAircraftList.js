import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Modal, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faTrash, faPlane, faEdit, faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProducedAircraftList = () => {
  const [producedAircraft, setProducedAircraft] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [selectedAircraftDetails, setSelectedAircraftDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    fetchProducedAircraft();
  }, []);

  const fetchProducedAircraft = async () => {
    setLoading(true);
    try {
      const response = await api.get('/produced-aircrafts/');
      setProducedAircraft(response.data);
      setError('');
    } catch (err) {
      setError('Üretilen uçak verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (aircraft) => {
    setSelectedAircraft(aircraft);
    setShowDeleteModal(true);
  };

  const handleShowDetails = (aircraft) => {
    setSelectedAircraftDetails(aircraft);
    setShowDetailsModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/produced-aircrafts/${selectedAircraft.id}`);
      setShowDeleteModal(false);
      fetchProducedAircraft();
      setError('');
    } catch (error) {
      setError('Silme işlemi başarısız oldu.');
    }
  };

  const handleAddNew = () => {
    if (loggedUser.team_name === "Montaj Takımı") {
      navigate("/create-produced-aircraft");
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Sadece Montaj Takımı Uçak Oluşturabilir',
        confirmButtonText: 'Tamam'
      });
    }
  };

  const filteredAircraft = producedAircraft.filter(aircraft =>
    aircraft.aircraft_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const DeleteConfirmationModal = () => (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Silme Onayı</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>{selectedAircraft?.aircraft_name}</strong> isimli uçağı silmek istediğinizden emin misiniz?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          İptal
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Sil
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const DetailsModal = () => (
    <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Uçak Detayları - {selectedAircraftDetails?.aircraft_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Kullanılan Parçalar:</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Parça Tipi</th>
              <th>Parça ID</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {selectedAircraftDetails?.parts.map((part, index) => (
              <tr key={part.id}>
                <td>{index + 1}</td>
                <td>{part.part_type_name}</td>
                <td>{part.part}</td>
                <td>
                  <Badge bg={part.status === "used" ? "success" : "warning"}>
                    {part.status === "used" ? "Kullanıldı" : "Beklemede"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
          Kapat
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Üretilen Uçak Listesi</h2>
            <Button 
              variant="success" 
              size="sm" 
              onClick={handleAddNew}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Yeni Üretim Ekle
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          ) : producedAircraft.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon 
                icon={faPlane} 
                size="4x" 
                className="mb-3 text-secondary"
                style={{ opacity: 0.5 }}
              />
              <h4 className="text-secondary mb-3">Henüz Üretilen Uçak Bulunmuyor</h4>
              <p className="text-muted mb-4">
                Yeni bir uçak üretimi eklemek için "Yeni Üretim Ekle" butonunu kullanabilirsiniz.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <Form.Group className="d-flex align-items-center">
                  <div className="position-relative flex-grow-1">
                    <Form.Control
                      type="text"
                      placeholder="Uçak ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="position-absolute"
                      style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0.5
                      }}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="bg-light">
                    <tr>
                      <th>#</th>
                      <th>Uçak Modeli</th>
                      <th>Üretim Tarihi</th>
                      <th>Durum</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAircraft.map((aircraft, index) => (
                      <tr key={aircraft.id}>
                        <td>{index + 1}</td>
                        <td>{aircraft.aircraft_name}</td>
                        <td>{new Date(aircraft.date).toLocaleDateString('tr-TR')}</td>
                        <td>
                          <Badge bg="success">Tamamlandı</Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="info" 
                              size="sm"
                              onClick={() => handleShowDetails(aircraft)}
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleDeleteClick(aircraft)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
      <DeleteConfirmationModal />
      <DetailsModal />
    </>
  );
};

export default ProducedAircraftList;
