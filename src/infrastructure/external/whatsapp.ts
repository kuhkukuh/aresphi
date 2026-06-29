const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function defaultGreetingLink(): string {
  const message = 'Halo, saya tertarik untuk konsultasi properti.';
  return generateWhatsAppLink(WHATSAPP_NUMBER, message);
}

export function propertyInquiryLink(propertyTitle: string, propertyUrl: string): string {
  const message = `Halo, saya tertarik dengan properti: ${propertyTitle}\n\nLink: ${propertyUrl}`;
  return generateWhatsAppLink(WHATSAPP_NUMBER, message);
}

export function ownerInquiryMessage(name: string, phone: string, address: string): string {
  return `Halo, saya ingin menjual/menyewakan properti.\n\nNama: ${name}\nTelepon: ${phone}\nAlamat Properti: ${address}`;
}
