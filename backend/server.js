const express = require("express");
const mongoose = require("mongoose");
const productosRoutes = require("./routes/productos");
const app = express();
app.use(express.json());
app.use("/productos", productosRoutes);
const PORT = 3000;
mongoose.connect("mongodb://localhost:27017/sistema-gestion")
.then(() => {
    console.log("conectado a MongoDB");
})
.catch((error) => {
    console.log("error al conectar a MongoDB:", error);
});
app.get("/", (req, res) => { 
    res.send("Mi sistema de gestion esta funcionando");
});
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
