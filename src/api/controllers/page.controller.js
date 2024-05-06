import { getDb } from '../configs/database.js';

export default {
  payment: async (req, res) => {
    try {
      const db = getDb();
      const trxCollection = db.collection('transactions');
      const transaction = await trxCollection.findOne({
        reference_code: req.query.ref,
      });
      return res.view('payment.ejs', {
        title: 'Payment',
        message: 'Payment Page',
        data: transaction,
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },
};
