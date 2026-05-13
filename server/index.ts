import app from "./src/app";
import { connectDB } from "./src/config/db";
import { config } from "./src/config/config";
import dns from "node:dns";
dns.setServers(["[8.8.8.8]"]);
connectDB();

app.listen(config.PORT, () => {
    console.log(`🚀 Server is running on port ${config.PORT} `);
});