import { ObjectId } from 'mongodb';
import { getDb } from '../configs/database';
import { createPayment } from '../services/xendit.service';
import { generateRef } from '../utils/helpers';

/**
 * Fields:
 * - _id: string
 * - platform_id: string
 * - ref: string
 * - amount: number
 * - status: string
 * - type: string
 * - payment_status: string
 * - payment_url: string
 */

export default {
  create: async (req, res) => {
    try {
      const db = getDb();
      const platformCollection = db.collection('platforms');
      const trxCollection = db.collection('transactions');
      const { platform_id, amount } = req.body;
      const platform = await platformCollection.findOne({
        _id: new ObjectId(String(platform_id)),
      });
      if (!platform) {
        return res.status(404).send({ message: 'Platform not found' });
      }

      const ref = generateRef('TRX');
      let total_amount = parseFloat(amount) * parseInt(platform.price);
      // Create payment
      const payment_url = await createPayment(ref, total_amount);
      if (!payment_url) {
        return res.status(500).send({ message: 'Failed to create payment' });
      }

      const result = await trxCollection.insertOne({
        platform_id,
        reference_code: ref,
        amount: total_amount,
        status: 'pending',
        type: 'buy',
        total: amount,
        payment_status: 'pending',
        payment_url,
        created_at: new Date(),
        updated_at: new Date(),
      });

      res.send({
        status: 'success',
        data: {
          ...result,
          payment_url,
        },
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  list: async (req, res) => {
    try {
      const db = getDb();
      const trxCollection = db.collection('transactions');
      const transactions = await trxCollection.find().toArray();
      res.send({
        status: 'success',
        data: transactions,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  get: async (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const trxCollection = db.collection('transactions');
      const transaction = await trxCollection.findOne({
        _id: new ObjectId(String(id)),
      });
      res.send({
        status: 'success',
        data: transaction,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  callback: async (req, res) => {
    if (req.headers['x-callback-token'] !== process.env.XENDIT_CB_TOKEN) {
      return res.status(401).json({ message: 'Invalid callback token' });
    }

    let { external_id, status, amount } = req.body;
    if (!external_id || !status || !amount) {
      return res.status(400).json({ message: 'Invalid body' });
    }

    const db = getDb();
    const trxCollection = db.collection('transactions');
    const platformCollection = db.collection('platforms');
    const trx = await trxCollection.findOne({ reference_code: external_id });
    if (!trx) {
      return res.status(404).send({ message: 'Transaction not found' });
    }

    if (trx.amount !== amount) {
      return res.status(400).send({ message: 'Invalid amount' });
    }

    await trxCollection.updateOne(
      { reference_code: external_id },
      {
        $set: {
          status: status.toLowerCase(),
          payment_status:
            status.toLowerCase() === 'paid' ? 'success' : 'failed',
          updated_at: new Date(),
        },
      }
    );

    if (status.toLowerCase() === 'paid') {
      await platformCollection.updateOne(
        { _id: new ObjectId(String(trx.platform_id)) },
        {
          $push: {
            transactions: trx,
          },
        }
      );
    }

    res.send({
      status: 'success',
    });
  },
  platform: async (req, res) => {
    try {
      let platform_id = req.params.id;
      let status = req.params.status;
      if (!platform_id) {
        return res.status(400).send({ message: 'Invalid parameters' });
      }
      const db = getDb();
      const trxCollection = db.collection('transactions');
      const platformCollection = db.collection('platforms');
      const platform = await platformCollection.findOne({
        _id: new ObjectId(String(platform_id)),
      });
      if (!platform) {
        return res.status(404).send({ message: 'Platform not found' });
      }

      const transactions = await trxCollection
        .find({
          platform_id,
          status: status || { $ne: null },
        })
        .toArray();

      res.send({
        status: 'success',
        data: transactions,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
};
