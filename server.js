const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const productRouter = require("./routes/productsRouter.js");
const userRouter = require("./routes/usersRouter.js");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
