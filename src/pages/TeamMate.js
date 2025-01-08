import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const TeamMates = () => {
  const [teammates, setTeammates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMates = async () => {
      try {
        const response = await api.get('/teammates/');
        setTeammates(response.data);
        setLoading(false);
      } catch (error) {
        setError('Takım arkadaşları yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchTeamMates();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
<div className="teammates-container">
  <h2>Takım Arkadaşlarım</h2>
  <table className="teammates-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Kullanıcı Adı</th>
      </tr>
    </thead>
    <tbody>
      {teammates.map((teammate, index) => (
        <tr key={teammate.id}>
          <td>{index + 1}</td>
          <td>{teammate.username}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default TeamMates;

