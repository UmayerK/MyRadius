import React, { useState, useEffect } from 'react';

const WorkCalc = () => {
  const [tab, setTab] = useState('give');
  const [work, setWork] = useState([]);
  const [newWork, setNewWork] = useState({ price: '', weight: '', name: '', quantity: '', urgency: '', completed: false });
  const [paletteSize, setPaletteSize] = useState(1);
  const [priceIncrement, setPriceIncrement] = useState(1);
  const [paletteCount, setPaletteCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (paletteCount >= paletteSize) {
      setPaletteCount(0);
      setNewWork(prevWork => ({ ...prevWork, price: '' }));
    }
  }, [paletteCount, paletteSize]);

  const handleGiveSubmit = (e) => {
    e.preventDefault();
    if (error === '') {
      setWork([...work, newWork]);
      setNewWork(prevWork => ({ ...prevWork, price: prevWork.price * priceIncrement }));
      setPaletteCount(prevCount => prevCount + 1);
    }
  };

  const handleAcceptSubmit = (index) => {
    const newWorkList = [...work];
    newWorkList[index].completed = !newWorkList[index].completed;
    setWork(newWorkList);
  };

  const validateInput = (value) => {
    if (isNaN(value) || value < 0) {
      setError('Input must be a non-negative number');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (e, field) => {
    if (validateInput(e.target.value)) {
      setNewWork({ ...newWork, [field]: e.target.value });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 mt-10" style={{ fontFamily: 'sans-serif' }}>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setTab('give')} className={`mt-4 text-white font-bold py-2 px-4 ${tab === 'give' ? 'bg-blue-700' : 'bg-blue-500'}`}>Give Work</button>
        <button onClick={() => setTab('accept')} className={`mt-4 text-white font-bold py-2 px-4 ${tab === 'accept' ? 'bg-green-700' : 'bg-green-500'}`}>Accept Work</button>
        <button onClick={() => setTab('history')} className={`mt-4 text-white font-bold py-2 px-4 ${tab === 'history' ? 'bg-gray-700' : 'bg-gray-500'}`}>History</button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {tab === 'give' && (
        <form onSubmit={handleGiveSubmit} className="flex flex-col space-y-3 mt-10 items-center">
          <input value={newWork.price} onChange={e => handleInputChange(e, 'price')} placeholder="Price" className="w-full p-2 border border-gray-300" disabled={paletteCount > 0} />
          <input value={newWork.weight} onChange={e => handleInputChange(e, 'weight')} placeholder="Weight" className="w-full p-2 border border-gray-300" />
          <input value={newWork.name} onChange={e => setNewWork({ ...newWork, name: e.target.value })} placeholder="Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.quantity} onChange={e => handleInputChange(e, 'quantity')} placeholder="Quantity" className="w-full p-2 border border-gray-300" />
          <input value={newWork.urgency} onChange={e => handleInputChange(e, 'urgency')} placeholder="Urgency (1-10)" className="w-full p-2 border border-gray-300" />
          <div>
            <label>Palette Size: {paletteSize}</label>
            <input type="range" min="1" max="10" value={paletteSize} onChange={e => setPaletteSize(e.target.value)} />
          </div>
          <div>
            <label>Price Increment: {priceIncrement}x</label>
            <input type="range" min="1" max="10" value={priceIncrement} onChange={e => setPriceIncrement(e.target.value)} />
          </div>
          <button type="submit" className="text-white font-bold py-2 px-4 bg-blue-500">Submit</button>
        </form>
      )}

      {tab === 'accept' && (
        <div className="flex flex-col space-y-3 mt-10 items-center">
          {work.map((workItem, index) => (
            <div key={index} className="w-full p-2 border border-gray-300">
              <p>Name: {workItem.name}</p>
              <p>Price: {workItem.price}</p>
              <p>Weight: {workItem.weight}</p>
              <p>Quantity: {workItem.quantity}</p>
              <p>Urgency: {workItem.urgency}</p>
              <p>Status: {workItem.completed ? 'Completed' : 'Pending'}</p>
              <button onClick={() => handleAcceptSubmit(index)} className="text-white font-bold py-2 px-4 bg-green-500">{workItem.completed ? 'Undo' : 'Complete'}</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <div className="flex flex-col space-y-3 mt-10 items-center">
          {work.filter(workItem => workItem.completed).map((workItem, index) => (
            <div key={index} className="w-full p-2 border border-gray-300">
              <p>Name: {workItem.name}</p>
              <p>Price: {workItem.price}</p>
              <p>Weight: {workItem.weight}</p>
              <p>Quantity: {workItem.quantity}</p>
              <p>Urgency: {workItem.urgency}</p>
              <p>Status: Completed</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkCalc;
