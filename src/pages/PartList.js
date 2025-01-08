import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCogs } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const PartList = () => {
  const [parts, setParts] = useState([]);
  const [error, setError] = useState('');
  const [silinecekList, setSilinecekList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const userRelatedPart = loggedUser.team_name.split(" ")[0];

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/part-stock/');
      const responseParts = await api.get('/parts/');

      setSilinecekList(responseParts.data);
      setParts(response.data);
    } catch (err) {
      setError('Parça verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (part) => {
    try {
      const silinecekEleman = silinecekList.find(
        item => item.aircraft_name === part.aircraft_name && item.part_type == part.part_type.id
      );

      if (!silinecekEleman) {
        setError("Silinecek parça bulunamadı");
        return;
      }

      await api.delete(`/parts/${silinecekEleman.id}`);
      await fetchParts();
    } catch (error) {
      setError('Silme işlemi sırasında bir hata oluştu.');
    }
  };


  const handleAddNew = () => {
    if (loggedUser.team_name !== "Montaj Takımı") {
      navigate("/create-part");
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Montaj Takımı Parça Üretemez',
        confirmButtonText: 'Tamam'
      });
    }
  };

  const getStatusBadge = (status) => {
    return status > 0 ? 
      <Badge bg="success">Stokta</Badge> : 
      <Badge bg="warning">Tükendi</Badge>;
  };

  const filteredParts = userRelatedPart && userRelatedPart !== "Montaj" 
    ? parts.filter((item) => item.part_type.name === userRelatedPart)
    : parts;

  if (loading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Parça Listesi</h2>
          <Button 
            variant="success" 
            size="sm" 
            onClick={handleAddNew}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Yeni Parça Ekle
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {filteredParts.length === 0 ? (
          <div className="text-center py-5">
            <FontAwesomeIcon 
              icon={faCogs} 
              size="4x" 
              className="mb-3 text-secondary"
              style={{ opacity: 0.5 }}
            />
            <h4 className="text-secondary mb-3">Henüz Parça Bulunmuyor</h4>
            <p className="text-muted mb-4">
              {userRelatedPart !== "Montaj" 
                ? `${userRelatedPart} takımına ait henüz bir parça üretilmemiş.`
                : "Sistemde henüz kayıtlı parça bulunmuyor."}
            </p>

          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Sıralama</th>
                <th>Parça Tipi</th>
                <th>Uçak</th>
                <th>Durum</th>
                <th>Stok</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map((part, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{part.part_type.name}</td>
                  <td>{part.aircraft_name}</td>
                  <td>{getStatusBadge(part.stock_quantity)}</td>
                  <td>{part.stock_quantity}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(part)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default PartList;
