import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import qrcode from 'qrcode';

import { getDb } from '../configs/database';

/**
 * FIelds:
 * - _id: string
 * - name: string
 * - slug: string
 * - price: number
 * - uuid: string
 */

export default {
  create: async (req, res) => {
    try {
      const db = getDb();
      const collection = db.collection('platforms');
      const { name, price } = req.body;
      let uuid = uuidv4();
      let uuidExist = await collection.findOne({ uuid });
      while (uuidExist) {
        uuid = uuidv4();
        uuidExist = await collection.findOne({ uuid });
      }
      let number = Math.floor(Math.random() * 100);
      let numberExist = await collection.findOne({ number });
      while (numberExist) {
        number = Math.floor(Math.random() * 100);
        numberExist = await collection.findOne({ number });
      }
      number = parseInt(number);
      const result = await collection.insertOne({
        name,
        price,
        createdAt: new Date(),
        updatedAt: new Date(),
        uuid,
        number,
        job: [],
      });
      res.send({
        status: 'success',
        data: result,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  list: async (req, res) => {
    try {
      const db = getDb();
      const platforms = await db.collection('platforms').find().toArray();
      res.send({
        status: 'success',
        data: platforms,
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
      const platform = await db
        .collection('platforms')
        .findOne({ _id: new ObjectId(String(id)) });
      res.send({
        status: 'success',
        data: platform,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  update: async (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const { name, price } = req.body;
      const result = await db
        .collection('platforms')
        .updateOne(
          { _id: new ObjectId(String(id)) },
          { $set: { name, price, updatedAt: new Date() } }
        );
      res.send({
        status: 'success',
        data: result,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  delete: async (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const result = await db
        .collection('platforms')
        .deleteOne({ _id: new ObjectId(String(id)) });
      res.send({
        status: 'success',
        data: result,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  generateQr: async (req, res) => {
    try {
      const platform = await getDb()
        .collection('platforms')
        .findOne({ _id: new ObjectId(String(req.params.id)) });
      if (!platform) {
        return res.status(404).send({ message: 'Platform not found' });
      }

      const qr = await qrcode.toDataURL(
        process.env.BASE_URL + '/platform/detail?id=' + platform.uuid
      );
      // send qr code as html
      return res.view('qr.ejs', {
        qrcode: qr,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  page: async (req, res) => {
    try {
      const slug = req.params.slug;
      const platform = await getDb()
        .collection('platforms')
        .findOne({ slug: slug });

      if (!platform) {
        return res.status(404).send({ message: 'Platform not found' });
      }

      return res.view('vending.ejs', {
        platform,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  detail_page: async (req, res) => {
    try {
      const slug = req.query.id;
      const platform = await getDb()
        .collection('platforms')
        .findOne({ slug: slug });

      if (!platform) {
        return res.status(404).send({ message: 'Platform not found' });
      }

      return res.view('vending.ejs', {
        platform,
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  },
};
