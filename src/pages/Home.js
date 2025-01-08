import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faCogs, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Uçak Üretim Sistemi'ne Hoş Geldiniz</h1>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <FontAwesomeIcon icon={faPlane} size="3x" className="mb-3 text-primary" />
              <Card.Title>Uçak Yönetimi</Card.Title>
              <Card.Text className="text-center">
                Uçak modellerini görüntüleyin, ekleyin ve düzenleyin.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <FontAwesomeIcon icon={faCogs} size="3x" className="mb-3 text-success" />
              <Card.Title>Parça Yönetimi</Card.Title>
              <Card.Text className="text-center">
                Uçak parçalarını takip edin, stok durumlarını kontrol edin.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column align-items-center">
              <FontAwesomeIcon icon={faChartLine} size="3x" className="mb-3 text-warning" />
              <Card.Title>Üretim Takibi</Card.Title>
              <Card.Text className="text-center">
                Üretilen uçakları izleyin ve üretim sürecini yönetin.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
