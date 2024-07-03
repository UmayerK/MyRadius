import { useEffect, useState } from 'react'; // Corrected 'usestate' to 'useState'
import axios from 'axios';

export default function Register() {
  const [Actual_collection, setOrders] = useState([]); // Corrected the destructuring syntax

  useEffect(() => {
    axios.get('http://localhost:3000/getOrders')
      .then(Actual_collection => setOrders(Actual_collection.data)) // Corrected 'orders.data' to 'response.data'
      .catch(error => console.error("There was an error fetching the orders!", error));
  }, []);

  return (
    <div className="Table">
      <table>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Price
            </th>
            <th>
              Weight
            </th>
            <th>
              Quantity
            </th>
            <th>
              Urgency
            </th>
            <th>
              Verdict
            </th>
            <th>
              Pallet Fullness
            </th>
          </tr>
        </thead>
        <tbody> 
  {
    Actual_collection.map((Actual_collection) => ( // Fixed syntax error: Added parentheses and arrow function
      <tr key={Actual_collection.id}> {/* Added a key for each child in a list */}
        <td>{Actual_collection.name}</td>
        <td>{Actual_collection.price}</td>
        <td>{Actual_collection.weight}</td>
        <td>{Actual_collection.quantity}</td>
        <td>{Actual_collection.urgency}</td>
        <td>{Actual_collection.verdict}</td>
        <td>{Actual_collection.pallet_fullness}</td> {/* Assuming the correct property name is pallet_fullness */}
      </tr>
    ))
  }
</tbody>
          
      </table>
    </div>


  ) 




  
}

