import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
     const loginResponse =  await axios.post('http://localhost:8000/api/auth/login/',  { username, password });
      localStorage.setItem("loggedUser",JSON.stringify(loginResponse.data))
      localStorage.setItem("token",loginResponse.data.token)
      navigate('/');
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm" style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Giriş</h2>
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
              <Form.Label>Şifre</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Şifrenizi girin" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Giriş Yap
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
