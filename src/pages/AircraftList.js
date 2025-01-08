import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';
import axios from 'axios';

const AircraftList = () => {
  const [aircraft, setAircraft] = useState([]);
  const [error, setError] = useState('');


  const fetchAircraft = async () => {
    try {

      const token = localStorage.getItem("token");
      const response = await api.get('/aircrafts/', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '', // Token varsa başlığa ekliyoruz
        },
      });
      setAircraft(response.data);
    } catch (err) {
      setError('Uçak verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
    }
  };

  useEffect(() => {
    fetchAircraft();
  }, []);


  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Uçak Listesi</h2>
         
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>İsim</th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((plane) => (
              <tr key={plane.id}>
                <td>{plane.id}</td>
                <td>{plane.name}</td>
                
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AircraftList;
