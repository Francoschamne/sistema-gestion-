const express = require("express");
const Producto = require("../models/Producto");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.log("Error al obtener productos:", error);

        res.status(500).json({
            mensaje: "Error al obtener los productos"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const nuevoProducto = new Producto({
            nombre: req.body.nombre,
            precio: req.body.precio,
            stock: req.body.stock
        });

        const productoGuardado = await nuevoProducto.save();

        res.status(201).json(productoGuardado);

    } catch (error) {
        console.log("Error al crear producto:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        res.status(500).json({
            mensaje: "Error al crear el producto"
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                precio: req.body.precio,
                stock: req.body.stock
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!productoActualizado) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json(productoActualizado);

    } catch (error) {
        console.log("Error al actualizar producto:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        res.status(500).json({
            mensaje: "Error al actualizar el producto"
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

        if (!productoEliminado) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto eliminado correctamente",
            producto: productoEliminado
        });

    } catch (error) {
        console.log("Error al eliminar producto:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el producto"
        });
    }
});

module.exports = router;