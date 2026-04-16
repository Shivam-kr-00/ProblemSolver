import "./app.js";                            // registers CORS, routes, middleware on the app
import { server } from "./config/socket.js";  // the HTTP server that wraps the same app
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";



const PORT = env.port || 5000;



server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});