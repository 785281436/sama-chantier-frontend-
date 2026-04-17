import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './TopWorkersSection.css';

const TopWorkersSection = () => {
  const [topWorkers, setTopWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopWorkers();
  }, []);

  const loadTopWorkers = async () => {
    try {
      const { data } = await api.get('/workers/top?limit=6');
      setTopWorkers(data);
    } catch (error) {
      console.error('Erreur chargement top workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (worker) => {
    if (worker.isSponsored) {
      return <span className="worker-badge sponsored">💎 Sponsorisé</span>;
    }
    if (worker.isTopWorker) {
      return <span className="worker-badge top">🔥 Top Ouvrier</span>;
    }
    if (worker.isRecommended) {
      return <span className="worker-badge recommended">⭐ Recommandé</span>;
    }
    return null;
  };

  if (loading) return <div className="top-workers-loading">Chargement...</div>;

  if (topWorkers.length === 0) return null;

  return (
    <section className="top-workers-section">
      <div className="container">
        <div className="section-header">
          <h2>🏆 Ouvriers d'Exception</h2>
          <p>Les meilleurs artisans sélectionnés par notre communauté</p>
        </div>

        <div className="top-workers-grid">
          {topWorkers.map((worker, index) => (
            <Link to={`/ouvriers/${worker._id}`} key={worker._id} className="top-worker-card">
              <div className="rank-badge">#{index + 1}</div>
              {getBadge(worker)}
              <div className="worker-avatar">
                {worker.user?.avatar ? (
                  <img src={worker.user.avatar} alt={worker.user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {worker.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <h3 className="worker-name">{worker.user?.name}</h3>
              <p className="worker-specialty">{worker.specialty}</p>
              <div className="worker-stats">
                <span>⭐ {worker.ratings?.toFixed(1) || 0}</span>
                <span>❤️ {worker.totalLikes || 0}</span>
                <span>🏗️ {worker.completedJobs || 0}</span>
              </div>
              <div className="worker-score">
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${worker.workerScore || 0}%` }}></div>
                </div>
                <span className="score-value">{Math.round(worker.workerScore || 0)}%</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="view-all">
          <Link to="/ouvriers?sort=top" className="btn-view-all">
            Voir tous les tops ouvriers →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopWorkersSection;