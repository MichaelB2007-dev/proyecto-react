import React, { useState } from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, addToCart }) => {
  const [category, setCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState("");
  const [size, setSize] = useState("");

  const filteredProducts = products.filter((product) => {
    return (
      (category === "Todos" || product.category === category) &&
      (priceRange === "" ||
        (priceRange === "low" && product.price < 30) ||
        (priceRange === "medium" && product.price >= 30 && product.price <= 60) ||
        (priceRange === "high" && product.price > 60)) &&
      (size === "" || product.sizes.includes(size))
    );
  });

  return (
    <div>
      <h2 className="text-center mt-4">Catálogo de productos</h2>

      {/* Filtros */}
      <div className="filters">
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="Todos">Todas las categorías</option>
          <option value="Camisetas">Camisetas</option>
          <option value="Pantalones">Pantalones</option>
          <option value="Zapatillas">Zapatillas</option>
        </select>

        <select onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">Todos los precios</option>
          <option value="low">Menos de $30</option>
          <option value="medium">$30 - $60</option>
          <option value="high">Más de $60</option>
        </select>

        <select onChange={(e) => setSize(e.target.value)}>
          <option value="">Todas las tallas</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
        </select>
      </div>

      {/* Lista de productos filtrados */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} addToCart={addToCart} />
          ))
        ) : (
          <p>No hay productos que coincidan con los filtros.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
