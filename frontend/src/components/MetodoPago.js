import React, { useState } from "react";
import "./metodoPago.css";

function MetodoPago() {
  const [metodo, setMetodo] = useState("");

  const datosPago = {
    "Banco Pichincha": {
      descripcion: "Transferencia bancaria a la siguiente cuenta:",
      cuenta: "Cuenta Corriente: 2200154789",
      titular: "Juan Pérez",
      cedula: "Cédula: 0102030405",
      imagen: "/img/BancoPichincha.png"
    },
    "De Una": {
      descripcion: "Pago rápido a través de la app De Una:",
      cuenta: "Número de cuenta: 0998765432",
      titular: "Maria Gómez",
      cedula: "Cédula: 1102030405",
      imagen: "/img/DeUna!.png"
    },
    "Produbanco": {
      descripcion: "Transferencia a Produbanco:",
      cuenta: "Cuenta Ahorros: 4567891230",
      titular: "Carlos Torres",
      cedula: "Cédula: 1702030405",
      imagen: "/img/Produbanco.png"
    },
    "Efectivo": {
      descripcion: "Paga en efectivo al momento de recibir el producto o en nuestras oficinas.",
      cuenta: "",
      titular: "",
      cedula: "",
      imagen: "/img/efectivo-icon.png"
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!metodo) {
      alert("Por favor, selecciona un método de pago.");
      return;
    }
    alert(`Has seleccionado: ${metodo}`);
  };

  // Función para crear las opciones de método de pago
  const crearOpcionMetodo = (opcion) => {
    return React.createElement("label", {
      key: opcion,
      className: `metodo-option ${metodo === opcion ? "active" : ""}`
    },
      React.createElement("input", {
        type: "radio",
        value: opcion,
        checked: metodo === opcion,
        onChange: (e) => setMetodo(e.target.value)
      }),
      React.createElement("div", {
        className: "metodo-content"
      },
        React.createElement("img", {
          src: datosPago[opcion].imagen,
          alt: opcion,
          className: "metodo-imagen",
          onError: (e) => {
            e.target.style.display = 'none';
          }
        }),
        React.createElement("span", {
          className: "metodo-nombre"
        }, opcion)
      )
    );
  };

  // Función para crear la información de pago
  const crearInfoPago = () => {
    if (!metodo) return null;

    const datos = datosPago[metodo];
    
    const detalles = [];
    
    // Descripción
    detalles.push(
      React.createElement("p", { key: "descripcion" }, datos.descripcion)
    );

    // Cuenta (si existe)
    if (datos.cuenta) {
      detalles.push(
        React.createElement("div", { 
          key: "cuenta",
          className: "cuenta-info" 
        },
          React.createElement("p", null,
            React.createElement("b", null, datos.cuenta)
          )
        )
      );
    }

    // Titular (si existe)
    if (datos.titular) {
      detalles.push(
        React.createElement("p", { key: "titular" },
          React.createElement("b", null, "Titular: "),
          datos.titular
        )
      );
    }

    // Cédula (si existe)
    if (datos.cedula) {
      detalles.push(
        React.createElement("p", { key: "cedula" },
          React.createElement("b", null, datos.cedula)
        )
      );
    }

    return React.createElement("div", {
      className: "info-pago"
    },
      React.createElement("div", {
        className: "info-header"
      },
        React.createElement("img", {
          src: datos.imagen,
          alt: metodo,
          className: "info-imagen"
        }),
        React.createElement("h3", null, `Instrucciones para ${metodo}`)
      ),
      React.createElement("div", {
        className: "info-details"
      }, ...detalles)
    );
  };

  return React.createElement("div", {
    className: "home-container"
  },
    React.createElement("h1", null, "Selecciona tu método de pago"),
    
    React.createElement("form", {
      onSubmit: handleSubmit,
      className: "metodo-pago-form"
    },
      ...Object.keys(datosPago).map(opcion => crearOpcionMetodo(opcion)),
      React.createElement("button", {
        type: "submit",
        className: "btn-confirmar"
      }, "Confirmar método")
    ),
    
    crearInfoPago()
  );
}

export default MetodoPago;