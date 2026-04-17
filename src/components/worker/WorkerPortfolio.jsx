import { useState, useEffect } from 'react';
import api from '../../utils/api';
import RealisationCard from '../common/RealisationCard';
import './WorkerPortfolio.css';

const WorkerPortfolio = ({ workerId, isOwner = false }) => {
  const [realisations, setRealisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    loadRealisations();
  }, [workerId]);

  const loadRealisations = async () => {
    try {
      const { data } = await api.get(`/realisations/worker/${workerId}`);
      setRealisations(data);
    } catch (error) {
      console.error('Erreur chargement réalisations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/realisations', formData);
      setRealisations([data, ...realisations]);
      setFormData({ title: '', description: '', image: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur création:', error);
      alert('Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette réalisation ?')) return;
    try {
      await api.delete(`/realisations/${id}`);
      setRealisations(realisations.filter(r => r._id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleLikeUpdate = () => {
    loadRealisations();
  };

  if (loading) return <div className="portfolio-loading">Chargement...</div>;

  return (
    <div className="worker-portfolio">
      <div className="portfolio-header">
        <h3>📸 Réalisations ({realisations.length})</h3>
        {isOwner && (
          <button 
            className="btn-add-realisation"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Annuler' : '+ Ajouter une réalisation'}
          </button>
        )}
      </div>

      {showForm && isOwner && (
        <form className="realisation-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre de la réalisation"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Description détaillée"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            required
          />
          <input
            type="url"
            placeholder="URL de l'image (Cloudinary)"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            required
          />
          <button type="submit" className="btn-submit">Publier</button>
        </form>
      )}

      {realisations.length === 0 ? (
        <div className="portfolio-empty">
          <p>Aucune réalisation pour le moment.</p>
          {isOwner && <p>Cliquez sur "Ajouter" pour partager votre travail !</p>}
        </div>
      ) : (
        <div className="portfolio-grid">
          {realisations.map(realisation => (
            <div key={realisation._id} className="portfolio-item">
              <RealisationCard 
                realisation={realisation} 
                onLikeUpdate={handleLikeUpdate}
              />
              {isOwner && (
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(realisation._id)}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerPortfolio;