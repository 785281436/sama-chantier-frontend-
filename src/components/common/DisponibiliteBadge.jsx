import './DisponibiliteBadge.css'

export default function DisponibiliteBadge({ disponible }) {
  const heure = new Date().getHours()
  const horaire = heure >= 8 && heure < 18

  const estDispo = disponible && horaire

  return (
    <span className={`badge ${estDispo ? 'disponible' : 'occupe'}`}>
      {estDispo ? '🟢 Disponible maintenant' : horaire ? '🔴 Occupé' : '🔴 Indisponible'}
    </span>
  )
}