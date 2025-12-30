import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];

function App() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer onOpenOrder={() => setIsOrderModalOpen(true)} />
      {isOrderModalOpen && (
        <OrderModal onClose={() => setIsOrderModalOpen(false)} />
      )}
    </div>
  );
}

function Pizza({ name, ingredient, photoName, price, soldOut }) {
  return (
    <div className={`pizza ${soldOut ? "sold-out" : ""}`}>
      <img src={photoName} alt="Pizza spinaci" />
      <div>
        <h3>{name}</h3>
        <p>{ingredient}</p>
        <span>{soldOut ? "Sold out" : price}</span>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}

function Menu() {
  return (
    <div className="menu">
      <h2>Our menu</h2>
      {/* Helps to know if there are no pizzas */}
      {pizzaData ? (
        <>
          <p>
            Authentic Ialian cuisine. 6 creative dishes to choose from. All from
            our stone oven, all organic, all delicious.
          </p>
          <ul className="pizzas">
            {pizzaData.map((p) => {
              return (
                <Pizza
                  name={p.name}
                  ingredient={p.ingredients}
                  photoName={p.photoName}
                  price={p.price}
                  soldOut={p.soldOut}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <span>There are no pizzas in the menu.</span>
      )}
      {/* <Pizza
        name="Pizza Spinaci"
        ingredient="Tomato, mozarella, spinach, and ricotta cheese"
        photoName="pizzas/spinaci.jpg"
        price="10"
      /> */}
    </div>
  );
}

function Footer({ onOpenOrder }) {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour <= closeHour;

  return (
    <footer className="footer">
      {isOpen ? (
        <Order
          openHour={openHour}
          closedHour={closeHour}
          onOpenOrder={onOpenOrder}
        />
      ) : (
        <p>
          We're happy to welcome you between {openHour}:00 to {closeHour}:00.
        </p>
      )}
    </footer>
  );
}

function Order({ openHour, closedHour, onOpenOrder }) {
  return (
    <div className="order">
      <p>We're open until {closedHour}.</p>
      <button className="btn" onClick={onOpenOrder}>
        Order
      </button>
    </div>
  );
}

function OrderModal({ onClose }) {
  const [orderItems, setOrderItems] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleQuantityChange = (pizzaName, change) => {
    setOrderItems((prev) => {
      const currentQty = prev[pizzaName] || 0;
      const newQty = Math.max(0, currentQty + change);
      if (newQty === 0) {
        const { [pizzaName]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [pizzaName]: newQty };
    });
  };

  const calculateTotal = () => {
    return Object.entries(orderItems).reduce((total, [pizzaName, quantity]) => {
      const pizza = pizzaData.find((p) => p.name === pizzaName);
      return total + pizza.price * quantity;
    }, 0);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (Object.keys(orderItems).length === 0) {
      alert("Please add at least one item to your order!");
      return;
    }
    if (!customerName.trim() || !customerAddress.trim()) {
      alert("Please fill in your name and address!");
      return;
    }

    const order = {
      customerName,
      customerAddress,
      items: orderItems,
      total: calculateTotal(),
      timestamp: new Date().toLocaleString(),
    };

    setConfirmedOrder(order);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setOrderItems({});
    setCustomerName("");
    setCustomerAddress("");
    onClose();
  };

  if (showConfirmation && confirmedOrder) {
    return (
      <div className="modal-overlay" onClick={handleCloseConfirmation}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Order Confirmation</h2>
            <button className="close-btn" onClick={handleCloseConfirmation}>
              &times;
            </button>
          </div>
          <div className="confirmation-content">
            <div className="confirmation-icon">✓</div>
            <h3>Thank you, {confirmedOrder.customerName}!</h3>
            <p>Your order has been confirmed.</p>
            <div className="order-summary">
              <h4>Order Details:</h4>
              <p>
                <strong>Delivery Address:</strong>{" "}
                {confirmedOrder.customerAddress}
              </p>
              <p>
                <strong>Order Time:</strong> {confirmedOrder.timestamp}
              </p>
              <div className="order-items">
                <h4>Items:</h4>
                {Object.entries(confirmedOrder.items).map(
                  ([pizzaName, quantity]) => {
                    const pizza = pizzaData.find((p) => p.name === pizzaName);
                    return (
                      <div key={pizzaName} className="confirmation-item">
                        <span>
                          {quantity}x {pizzaName}
                        </span>
                        <span>${(pizza.price * quantity).toFixed(2)}</span>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="order-total">
                <strong>Total: ${confirmedOrder.total.toFixed(2)}</strong>
              </div>
            </div>
            <button className="btn" onClick={handleCloseConfirmation}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Place Your Order</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmitOrder}>
          <div className="customer-info">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Delivery Address:</label>
              <input
                type="text"
                id="address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter your delivery address"
                required
              />
            </div>
          </div>
          <div className="order-section">
            <h3>Select Your Pizzas:</h3>
            <div className="pizza-selection">
              {pizzaData.map((pizza) => (
                <div
                  key={pizza.name}
                  className={`order-item ${pizza.soldOut ? "disabled" : ""}`}
                >
                  <div className="order-item-info">
                    <img src={pizza.photoName} alt={pizza.name} />
                    <div>
                      <h4>{pizza.name}</h4>
                      <p className="ingredients">{pizza.ingredients}</p>
                      <p className="price">${pizza.price}</p>
                    </div>
                  </div>
                  {!pizza.soldOut && (
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(pizza.name, -1)}
                        disabled={!orderItems[pizza.name]}
                      >
                        -
                      </button>
                      <span className="quantity">
                        {orderItems[pizza.name] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(pizza.name, 1)}
                      >
                        +
                      </button>
                    </div>
                  )}
                  {pizza.soldOut && (
                    <span className="sold-out-badge">Sold Out</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="order-footer">
            <div className="total-section">
              <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            </div>
            <button type="submit" className="btn btn-submit">
              Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
