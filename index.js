const app = require("express")();
require("dotenv").config();
const cors = require("cors");
const { json } = require("express");
const connection = require("./configs/db");
const accountRouter = require("./routes/account.routes");

app.use(json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("welcome to home");
});
app.use("/", accountRouter);

app.listen(process.env.PORT, async () => {
  connection();
  console.log("server is running");
});
