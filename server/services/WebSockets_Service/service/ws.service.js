/*
    REFERENCE:
    - WS NPM (2026) Available at: https://www.npmjs.com/package/ws
*/

import { WebSocketServer, WebSocket } from 'ws';
export class WSService {

    constructor(redisRepo) {
        this.redisRepo = redisRepo
        this.stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRKB', 'V', 'JNJ'];
        this.clients = new Set();
    }

    startWSService(port = 8080) {

        console.log("Web Sockets Service started...");

        //start the websockets connection...
        const wss = new WebSocketServer({ port:8080 })
        wss.on('connection', (ws) => {
            console.log('client connected...');
            this.clients.add(ws);

            ws.on('close', (ws) => {
                console.log('client disconnected...');
                this.clients.delete(ws);
            })
        });

        //start polling redis for latest data...
        this.streamLatestAnalyticsData()

        //start polling redis for marketindex...
        this.startPollingMarketIndex()
    }

    streamLatestAnalyticsData() {

            const POLL_INTERVAL_AN = 2000; // OG val - 2000/15000

            let lastId = '0-0';

            setInterval(async () => {
                for (const stock of this.stocks) {

                    try {

                        const streamKey = `analytics:${stock}`;
                        const result = await this.redisRepo.readStream(streamKey, lastId, 1);

                        if (result && result.length > 0) {
                            console.log("data exists...");
    
                            const [[, messages]] = result;

                            for (const [id, fields] of messages) {
                                lastId = id;
                
                                const anal_data = {};
                                for (let i = 0; i < fields.length; i += 2) {
                                     anal_data[fields[i]] = fields[i + 1];
                                 }
                                
                                console.log("anal_data.." + " " + stock + ":" + " " + JSON.stringify(anal_data, null, 2));
                                this.broadcastToClients(anal_data);
                            }
                        }

                    } catch (err) {

                        console.error(`Error in reading stream ${stock}:`, err);

                    }

                }
            }, POLL_INTERVAL_AN);
    }

    startPollingMarketIndex() {

            const POLL_INTERVAL_MI = 5000; // OG val - 15000

            let lastId = '0-0';

            setInterval(async () => {
                
                    try {

                        const streamKey = `marketindex`;
                        const result = await this.redisRepo.readStream(streamKey, lastId, 1);
                    
                        if (result && result.length > 0) {
                            console.log("data exists...");
    
                            const [[, messages]] = result;

                            for (const [id, fields] of messages) {
                                lastId = id;
                
                                const marketindex = {};
                                for (let i = 0; i < fields.length; i += 2) {
                                     marketindex[fields[i]] = fields[i + 1];
                                 }
                                
                                console.log("market index data" + " : " + JSON.stringify(marketindex, null, 2));
                                this.broadcastToClients(marketindex);
                            }
                        }

                    } catch (err) {

                        console.error(`Error in reading stream ${stock}:`, err);

                    }

            }, POLL_INTERVAL_MI);
    }

    broadcastToClients(data) {
        const payload = JSON.stringify(data);
        for (const client of this.clients) {
            if(client.readyState === WebSocket.OPEN){
                client.send(payload);
            }
        }
    }

}