/**
 * Dados de contato e endereço da igreja usados no site.
 */

export const ENDERECO = {
  rua: 'Avenida Francisco Jalles, 3575',
  bairro: 'Vila Maria',
  cidade: 'Jales/SP',
  referencia: 'Ao lado do Hospital de Amor',
};

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Avenida Francisco Jalles 3575 Jales SP')}`;

// WhatsApp da secretaria: secretário Pr. Marcos Aguiar (formato 55 + DDD + número)
export const WHATSAPP_SECRETARIA = '5517997443443';

export function whatsappSecretariaUrl(mensagem) {
  return `https://wa.me/${WHATSAPP_SECRETARIA}?text=${encodeURIComponent(mensagem)}`;
}

export const ORACAO_URL = whatsappSecretariaUrl('Olá, gostaria de fazer um pedido de oração');

export const INSTAGRAM_URL = 'https://instagram.com/adbelemjales';
export const FACEBOOK_URL = 'https://facebook.com/adbelemjales';
export const INSTAGRAM_PASTOR_URL = 'https://instagram.com/pc_oliveira1';
