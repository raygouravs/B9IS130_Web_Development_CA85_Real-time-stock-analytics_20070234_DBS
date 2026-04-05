// Market Simulation Service
export class MarketService {
  constructor(redisRepo) {
    this.redisRepo = redisRepo;
    this.stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRKB', 'V', 'JNJ', 
                   'WMT', 'JPM', 'MA', 'PG', 'UNH', 'HD', 'BAC', 'DIS', 'PFE', 'ADBE'];
  }

  // simulates stock tick data
  generateStockTick(symbol) {
    return {
      symbol,
      price: (Math.random() * 1000).toFixed(2),
      size: Math.floor(Math.random() * 100) + 1,
      timestamp: Date.now()
    };
  }

  // starts the service
  start() {
    console.log("Market Simulation Started...");
    setInterval(async () => {
      for (const stock of this.stocks) {
        const tick = this.generateStockTick(stock);
        try {
          const streamKey = `ticks:${stock}`; 
          await this.redisRepo.addToStream(streamKey, tick, 1000);
          
          console.log(`Published. ${stock} trimmed to last 1000`);
        } catch (err) {
          console.error(`Failed to publish ${stock}:`, err);
        }
      }
    }, 2000);
  }
}