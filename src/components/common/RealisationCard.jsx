import { useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './RealisationCard.css';

const RealisationCard = ({ realisation, onLikeUpdate }) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [likeCount, setLikeCount] = useState(realisation.likeCount || 0);
  const [isLiked, setIsLiked] = useState(
    realisation.likes?.includes(user?._id) || false
  );

  const handleLike = async () => {
    if (!user) {
      alert('Connectez-vous pour liker');
      return;
    }
    
    setIsLiking(true);
    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      const { data } = await api.post(`/realisations/${realisation._id}/${endpoint}`);
      setLikeCount(data.likeCount);
      setIsLiked(!isLiked);
      if (onLikeUpdate) onLikeUpdate();
    } catch (error) {
      console.error('Erreur like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const getBoostBadge = () => {
    switch (realisation.boostLevel) {
      case 'gold': return <span className="boost-badge gold">⭐ Sponsorisé Or</span>;
      case 'silver': return <span className="boost-badge silver">💎 Sponsorisé Argent</span>;
      case 'bronze': return <span className="boost-badge bronze">✨ Sponsorisé Bronze</span>;
      default: return null;
    }
  };

  return (
    <div className={`realisation-card ${realisation.isPremium ? 'premium' : ''}`}>
      <div className="realisation-image">
        <img src={realisation.image} alt={realisation.title} />
        {realisation.isPremium && (
          <div className="premium-badge">🎯 Boosté</div>
        )}
        {getBoostBadge()}
      </div>
      
      <div className="realisation-content">
        <h3 className="realisation-title">{realisation.title}</h3>
        <p className="realisation-description">{realisation.description}</p>
        
        <div className="realisation-footer">
          <div className="realisation-stats">
            <button 
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              {isLiked ? <FaHeart /> : <FiHeart />}
              <span>{likeCount}</span>
            </button>
            
            <button className="comment-btn">
              <FiMessageCircle />
              <span>0</span>
            </button>
            
            <button className="share-btn">
              <FiShare2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealisationCard;