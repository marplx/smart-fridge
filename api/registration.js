const SocketServer = require('ws').Server;
const _ = require('lodash');
const HEARTBEAT_INTERVAL = 5000;
const SECONDS_TO_LIVE = 30; //max time a receiving websocket is allowed to stay active
const moment = require('moment');

module.exports = function(server) {
  const wss = new SocketServer({ server, path: '/api/scanRfid' });
  const clients = [];

  wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', function heartbeat() {
      this.isAlive = true;
    });

    clients.push(ws);

    if (clients.length > 1) {
      //there are registrators before you!
      ws.status = 'waiting';
      ws.send(JSON.stringify({ status: 'waiting', count: clients.length-1}));
    } else {
      ws.status = 'receiving';
      ws.since = moment();
      ws.send(JSON.stringify({ status: 'receiving' }));
    }

    ws.on('close', function () {
      removeClient(ws);
    });
  });

  //HEALTH CHECK OF LIVING CONNECTIONS
  setInterval(function() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
        removeClient(ws);
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping('', false, true);
    });
  }, HEARTBEAT_INTERVAL);

  //KILL LONG RUNNING CONNECTIONS
  setInterval(function() {
    _(clients).filter(function(client) {
      return client.status === 'receiving' && moment().diff(client.since, 's') > SECONDS_TO_LIVE;
    }).forEach(removeClient);

  }, 1000);

  function removeClient(client) {
    _.remove(clients, client);
    client.close();

    clients.forEach((client) => {
      var position = clients.indexOf(client);
      if (position === 0) {
        client.status = 'receiving';
        client.since = moment();
        client.send(JSON.stringify({ status: 'receiving'}));
      } else {
        client.status = 'waiting';
        client.send(JSON.stringify({ status: 'waiting', count: position}));
      }
    });
  }

  //unknownRfidCallback
  //returns true if there is a listener
  return function(rfid) {
    if (clients.length > 0) {
      clients[0].send(JSON.stringify({ status: 'received', rfid: rfid}));
      removeClient(clients[0]);
      return true;
    } else {
      return false;
    }
  };

};
