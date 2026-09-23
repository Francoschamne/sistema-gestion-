import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [productoEditando, setProductoEditando] = useState(null);

  // Traer productos
  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProductos(datos);
      })
      .catch((error) => {
        console.log("Error al obtener productos:", error);
      });
  }, []);

  // Agregar producto
  const agregarProducto = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          precio: Number(precio),
          stock: Number(stock),
        }),
      });

      const nuevoProducto = await respuesta.json();

      if (!respuesta.ok) {
        console.log("Error:", nuevoProducto);
        return;
      }

      setProductos([...productos, nuevoProducto]);

      setNombre("");
      setPrecio("");
      setStock("");
    } catch (error) {
      console.log("Error al agregar producto:", error);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/productos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) {
        console.log("Error al eliminar el producto");
        return;
      }

      setProductos(
        productos.filter((producto) => producto._id !== id)
      );
    } catch (error) {
      console.log("Error al eliminar producto:", error);
    }
  };

  // Preparar un producto para editar
  const comenzarEdicion = (producto) => {
    setProductoEditando(producto._id);

    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setStock(producto.stock);
  };

  // Guardar los cambios
const editarProducto = async (e) => {
  e.preventDefault();

  try {
    const respuesta = await fetch(
      `http://localhost:3000/productos/${productoEditando}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          precio: Number(precio),
          stock: Number(stock),
        }),
      }
    );

    if (!respuesta.ok) {
      const error = await respuesta.json();
      console.log("Error:", error);
      return;
    }

    // Volvemos a pedir todos los productos actualizados
    const respuestaProductos = await fetch(
      "http://localhost:3000/productos"
    );

    const productosActualizados = await respuestaProductos.json();

    setProductos(productosActualizados);

    setProductoEditando(null);
    setNombre("");
    setPrecio("");
    setStock("");

  } catch (error) {
    console.log("Error al editar producto:", error);
  }
};
  return (
    <div>
      <h1>Sistema de Gestión</h1>

      <h2>Productos</h2>

      <h3>
        {productoEditando ? "Editar producto" : "Agregar producto"}
      </h3>

      <form
        onSubmit={
          productoEditando ? editarProducto : agregarProducto
        }
      >
        <div>
          <label>Nombre: </label>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label>Precio: </label>
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div>
          <label>Stock: </label>
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <button type="submit">
          {productoEditando ? "Guardar cambios" : "Agregar producto"}
        </button>
      </form>

      <hr />

      <h2>Lista de productos</h2>

      {productos.length === 0 ? (
        <p>No hay productos cargados.</p>
      ) : (
        productos.map((producto) => (
          <div key={producto._id}>
            <h3>{producto.nombre}</h3>

            <p>Precio: ${producto.precio}</p>

            <p>Stock: {producto.stock}</p>

            <button onClick={() => comenzarEdicion(producto)}>
              Editar
            </button>

            <button onClick={() => eliminarProducto(producto._id)}>
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;