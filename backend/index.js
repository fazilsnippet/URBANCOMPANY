import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/index.js";
dotenv.config({
  path: "./.env"
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server is running at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed...", err);
  });