import React from 'react';

function ProductCard({ product, addToCart }) {
  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button style={styles.button} onClick={() => addToCart(product)}>
        Comprar
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '1rem',
    margin: '1rem',
    width: '200px',
    borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    borderRadius: '4px',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    background: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
};

export default ProductCard;
