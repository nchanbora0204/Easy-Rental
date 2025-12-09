import "dotenv/config";
import connectDB from "./src/configs/db.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(` Server đang chạy trên port ${PORT}`));
  })
  .catch((err) => {
    console.error(" DB connect fail:", err);
    process.exit(1);
  });
