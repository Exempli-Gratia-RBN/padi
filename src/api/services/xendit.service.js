import { Xendit } from 'xendit-node';

export async function createPayment(ref, amount) {
  try {
    const xenditClient = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY,
      xenditURL: 'https://api.xendit.co',
    });
    const { Invoice } = xenditClient;
    let data = {
      amount: amount,
      invoiceDuration: 172800,
      externalId: ref,
      currency: 'IDR',
      successRedirectUrl: process.env.BASE_URL + '/payment?ref=' + ref,
      failureRedirectUrl: process.env.BASE_URL + '/payment?ref=' + ref,
    };
    const invoice = await Invoice.createInvoice({
      data,
    });
    return invoice.invoiceUrl;
  } catch (err) {
    console.log('ERROR', err);
    return false;
  }
}
