import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate  } from 'react-router-dom';
import api from '../utils/api';
import {staticValues} from '../static/Static'
const CreatePart = () => {
  const [partType, setPartType] = useState('');
  const [aircraft, setAircraft] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const navigate  = useNavigate ();

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  var selectedPart; 
  if(loggedUser){

   selectedPart = staticValues.teams.find((item)=>item.name == loggedUser.team_name);

  }
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/parts/', { part_type:  selectedPart.id, aircraft: parseInt(aircraft), status:"stock", stock: parseInt(stock) });
      navigate('/parts');
    } catch (err) {
      setError('Parça oluşturulamadı. Lütfen bilgileri kontrol edin.');
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h2 className="mb-4">Yeni Parça Oluştur</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Parça Tipi</Form.Label>
          {
            loggedUser  && selectedPart ? 

            <Form.Control 
            as="select"
            value={selectedPart.id}
            onChange={(e) => setPartType(e.target.value)}
            required
          >
              <option  value={selectedPart.id}>{selectedPart.part}</option>

          </Form.Control>
            :
            <Form.Control 
            as="select"
            value={partType}
            onChange={(e) => setPartType(e.target.value)}
            required
          >
            {staticValues.parts.map((type) => (
              <option key={type.id} value={type.id}>{type.part}</option>
            ))}
          </Form.Control>
          }
           
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Uçak Modeli</Form.Label>
            <Form.Control 
              as="select"
              value={aircraft}
              onChange={(e) => setAircraft(e.target.value)}
              required
            >
              <option value="">Uçak modeli seçin</option>
              {staticValues.aircrafts.map((plane) => (
                <option key={plane.id} value={plane.id}>{plane.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stok Miktarı</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Stok miktarını girin" 
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Parça Oluştur
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePart;
