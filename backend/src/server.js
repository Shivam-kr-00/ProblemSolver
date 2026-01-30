import {app} from "./app.js";
import {env} from "./config/env.js";
import {connectDB} from "./config/db.js";



const PORT = env.port || 5000;



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});