const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const productRouter = require("./routes/productsRouter.js");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
