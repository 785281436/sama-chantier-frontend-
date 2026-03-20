import { Link } from 'react-router-dom'
import { FiStar, FiMapPin, FiCheckCircle } from 'react-icons/fi'
import './WorkerCard.css'

export default function WorkerCard({ worker }) {
  const user = worker.user || {}
  return (
    <Link to={`/ouvriers/${worker._id}`} className="worker-card card">
      <div className="worker-card__header">
        <div className="worker-card__avatar">
          {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name?.[0]?.toUpperCase() || '?'}</span>}
          {worker.availability && <span className="worker-card__available" />}
        </div>
        <div>
          <h3 className="worker-card__name">
            {user.name}
            {worker.isVerified && <FiCheckCircle size={14} className="worker-card__verified" />}
          </h3>
          <span className="badge badge-primary">{worker.specialty}</span>
        </div>
      </div>
      <div className="worker-card__body">
        <div className="worker-card__row"><FiMapPin size={13} /><span>{worker.city}</span></div>
        <div className="worker-card__row"><FiStar size={13} fill="#FBBF24" color="#FBBF24" /><span>{worker.ratings?.toFixed(1) || '0.0'} ({worker.numReviews} avis)</span></div>
        {worker.dailyRate && <div className="worker-card__rate">{worker.dailyRate.toLocaleString('fr-FR')} FCFA <small>/ jour</small></div>}
      </div>
      <div className="worker-card__footer">
        <span className={`badge ${worker.availability ? 'badge-success' : 'badge-error'}`}>
          {worker.availability ? '✅ Disponible' : '❌ Indisponible'}
        </span>
        <span className="btn btn-outline btn-sm">Voir profil</span>
      </div>
    </Link>
  )
}