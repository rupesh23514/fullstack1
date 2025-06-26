import React from 'react';

const OrderReceipt = ({ order }) => (
  <div className="card" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
    <h2 className="text-center mb-4">Order Receipt</h2>
    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
    <p><strong>Delivery Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
    <table style={{ width: '100%', margin: '20px 0', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {order.items.map(item => (
          <tr key={item.menuItem._id}>
            <td>{item.menuItem.name}</td>
            <td style={{ textAlign: 'center' }}>{item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="d-flex justify-between mb-2"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
    <div className="d-flex justify-between mb-2"><span>Delivery Fee:</span><span>${order.deliveryFee.toFixed(2)}</span></div>
    <div className="d-flex justify-between mb-2"><span>Tax:</span><span>${order.tax.toFixed(2)}</span></div>
    <hr />
    <div className="d-flex justify-between" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}><span>Total:</span><span>${order.total.toFixed(2)}</span></div>
    <button className="btn btn-primary mt-4" onClick={() => window.print()}>Print Receipt</button>
  </div>
);

export default OrderReceipt; 