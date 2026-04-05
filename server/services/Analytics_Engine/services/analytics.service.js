/*
    REFERENCES: 
    - Redis streams. Available at: https://redis.io/docs/latest/develop/data-types/streams/#consuming-data
      - referred to establish persistent connection to redis streams as given in the code example.
*/

export class AnalyticsService {
  constructor(redisRepo) {
    this.redisRepo = redisRepo;

    this.stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRKB', 'V', 'JNJ', 
                   'WMT', 'JPM', 'MA', 'PG', 'UNH', 'HD', 'BAC', 'DIS', 'PFE', 'ADBE'];

    // simple in-memory state
    this.state = {};
  }

  initStock(symbol) {
    if (!this.state[symbol]) {
      this.state[symbol] = {
        prices: [],
        prevClose: null,
        lastPrice: null
      };
    }
  }

  // process the ticks here ...
  async processTick(stocksymbol, tick) {
    console.log("tick data processed.." + " " + stocksymbol + ":" + " " + JSON.stringify(tick, null, 2))
  }

  async readStockTickData(stocksymbol) {
    let lastId = "0-0";
    const POLL_INTERVAL_MS = 500;

    while (true) {
      console.log("inside while loop...");
      try {

        const redisData = await this.redisRepo.readStream(
          `ticks:${stocksymbol}`,
          lastId,
          10
        );

        //console.log("redis data =>", JSON.stringify(redisData, null, 2));


        if (redisData && redisData.length > 0) {
          console.log("data exists...");
          // redisData is array: [[streamKey, [[id, fieldsArray], ...]]]
          const [[, messages]] = redisData;

          for (const [id, fields] of messages) {
            lastId = id;

            // convert fields array to object
            const tick = {};
            for (let i = 0; i < fields.length; i += 2) {
              tick[fields[i]] = fields[i + 1];
            }

            await this.processTick(stocksymbol, tick);
          }
      }

      // Wait before next poll
      await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
    } catch (err) {
      console.error("Error reading Redis stream:", err);
      await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
    }
  }
}

  


  // Start the service
  async start() {
    console.log("Analytics Service Started...");
    for(const symbol of this.stocks){
      this.readStockTickData(symbol);
    }
  }
}
