import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { staticValues } from '../static/Static';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamId, setTeamId] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
       await axios.post('http://localhost:8000/api/auth/register/', { username, email, password, team: teamId });
      // await api.post('/register/', { username, email, password, team: teamId });
      navigate('/login');
    } catch (err) {
      setError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm" style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Kayıt Ol</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Kullanıcı Adı</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Kullanıcı adınızı girin" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="E-posta adresinizi girin" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Şifre</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Şifrenizi girin" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Takım</Form.Label>
              <Form.Control 
                as="select"
                onChange={(e) =>setTeamId(e.target.value)}
                required
              >
                {
                  staticValues.teams.map((item,index)=>

                    <option key={index} value={item.id}>{item.name}</option>
                  )
                }

              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Kayıt Ol
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
