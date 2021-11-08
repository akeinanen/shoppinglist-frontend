import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './app.css';

function App() {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const URL = "http://localhost/shoppinglist/";

  useEffect(() => {
    axios.get(URL)
      .then(response => {
        setItems(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, [])

  const addItem = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    const json = JSON.stringify({ description: description, amount: amount });
    console.log(json)
    axios.post(
      URL + 'add.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        setItems(items => [...items, response.data]);
        setDescription('');
        setAmount('');
      }).catch(error => {
        alert(error.response.data.error);
      });
  }

  const removeItem = (id) => {
    const json = JSON.stringify({ id: id })
    axios.post(URL + "delete.php", json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setItems(items.filter(item => item.id !== id));
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  return (

    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={addItem}>
        <label>New item</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button>Add</button>
      </form>

      <table>
        <tbody>
          {items?.map(item => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.amount}</td>
              <td className="remove" onClick={() => removeItem(item.id)}>remove</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
