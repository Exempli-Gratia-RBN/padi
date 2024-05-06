import { ObjectId } from 'mongodb';
import net from 'net';

import { getDb } from '../configs/database.js';

let clients = [];

const server = net.createServer((socket) => {
  console.log('A client has connected');

  socket.on('data', async (data) => {
    let msg = data.toString();
    let id = msg.split('#')[0];
    let prompt = msg.split('#')[1];
    console.log(`Vending dengan ID : ${id} mengirim perintah : ${prompt}`);

    // Jika prompt adalah "CHECK", kirimkan pesan order
    if (prompt === 'CHECK') {
      const db = getDb();

      const platformCollection = db.collection('platforms');

      const platform = await platformCollection.findOne({
        number: parseInt(id),
      });
      if (!platform) {
        socket.write('Platform not found');
        return;
      }

      if (platform.transactions.length > 0) {
        socket.write(`${platform.transactions[0].total}`);
        return;
      } else {
        socket.write(`0`);
      }
    }

    if (prompt === 'DONE') {
      const db = getDb();

      const platformCollection = db.collection('platforms');

      const platform = await platformCollection.findOne({
        number: parseInt(id),
      });
      if (!platform) {
        socket.write('Platform not found');
        return;
      }

      if (platform.transactions.length > 0) {
        const trxCollection = db.collection('transactions');
        await trxCollection.updateOne(
          { reference_code: platform.transactions[0].ref },
          {
            $set: {
              status: 'done',
              payment_status: 'success',
              updated_at: new Date(),
            },
          }
        );
        platform.transactions.shift();
        await platformCollection.updateOne(
          { number: parseInt(id) },
          {
            $set: {
              transactions: platform.transactions,
            },
          }
        );
      }

      socket.write('OK');
    }
  });

  socket.on('end', () => {
    console.log('ESP32 disconnected');
  });

  // Handle error event to prevent crashing due to ECONNRESET
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(2001, () => {
  console.log('Net Server listening on port 3000');
});
