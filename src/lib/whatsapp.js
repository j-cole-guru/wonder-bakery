const PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID
const ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN
const OWNER_NUMBER = import.meta.env.VITE_BAKERY_WHATSAPP_NUMBER

const send = async (to, message) => {
  // TODO: send WhatsApp notification
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log(`[WhatsApp Mock Notification] Sending to ${to}:\n${message}`);
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message }
      })
    });
    
    if (!response.ok) {
      const errData = await response.json();
      console.error('WhatsApp API response error:', errData);
    }
  } catch (error) {
    console.error('Failed to send WhatsApp message via Meta Cloud API:', error);
  }
}

export const notifyOwner = async (order) => {
  const itemList = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
  const message = [
    `New Order — ${order.id}`,
    `Customer: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Items: ${itemList}`,
    `Total: Le ${order.total.toLocaleString()}`,
    `Payment: ${order.payment_method}`,
    order.delivery_type === 'delivery'
      ? `Delivery to: ${order.delivery_address}`
      : `Pickup`
  ].join('\n')

  await send(OWNER_NUMBER, message)
}

export const notifyCustomer = async (phone, orderId, status) => {
  const message = [
    `Wonder Bakery — Order Update`,
    `Order ${orderId} is now: ${status.toUpperCase()}`,
    `Track your order at: https://wonderbakery.com/track/${orderId}`
  ].join('\n')

  await send(phone, message)
}
