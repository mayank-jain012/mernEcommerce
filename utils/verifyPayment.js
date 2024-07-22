import crypto from 'crypto'
export const verifyPayment = async (orderId,paymentId,signature,secret) => {
    const shashum=crypto.createHmac('sha256',secret);
    shashum.update(`${orderId}|${paymentId}`);
    const generateSignature=shashum.digest('hex')
    return generateSignature===signature;
}