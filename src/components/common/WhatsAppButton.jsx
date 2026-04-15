import './WhatsAppButton.css'

export default function WhatsAppButton({ nom, metier, telephone, variant = 'detail' }) {
  const message = `Bonjour ${nom}, j'ai vu votre profil sur Sama Chantier. Je souhaite un devis pour ${metier}.`
  
  const cleanPhone = telephone?.replace(/\D/g, '')

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-btn ${
        variant === 'catalogue' ? 'whatsapp-btn--catalogue' : 'whatsapp-btn--detail'
      }`}
    >
      {variant === 'detail'
        ? '💬 Discuter sur WhatsApp'
        : '📲 Réserver via WhatsApp'}
    </a>
  )
}