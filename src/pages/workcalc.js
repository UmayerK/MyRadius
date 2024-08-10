import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth } from '../AuthContext'; // Ensure correct path to AuthContext

const WorkCalc = () => {
  const [tab, setTab] = useState('give');
  const [work, setWork] = useState([]);
  const [history, setHistory] = useState({
    accepted: [],
    waitlisted: [],
    finished: []
  });
  const [newWork, setNewWork] = useState({
    profileId: '',
    merchantOrderId: '',
    merchantSalesChannel: '',
    merchantCustomerId: '',
    languageId: '',
    placedBy: '',
    merchantPlacedDate: '',
    createdDate: '',
    fakeOrder: false,
    testingConfiguration: '',
    fulfillmentGroupId: '',
    fulfillerOrderId: '',
    fulfillerId: '',
    globalFulfillerId: '',
    shortFulfillmentGroupId: '',
    fulfillmentRequestVersion: 1,
    shippingPriority: 1,
    destinationAddress: {
      country: '',
      postalCode: '',
      stateOrProvince: '',
      city: '',
      company: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      phoneExt: '',
      email: '',
      street1: '',
      street2: '',
      doorCode: '',
      isPOBox: false,
      isResidential: false
    },
    consigneeAddress: {
      country: '',
      postalCode: '',
      stateOrProvince: '',
      city: '',
      company: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      phoneExt: '',
      email: '',
      street1: '',
      street2: '',
      doorCode: '',
      isPOBox: false,
      isResidential: false
    },
    quantity: '',
    skuCode: '',
    orderedSkuCode: '',
    merchantProductName: '',
    documentReferenceUrl: '',
    price: '',
    weight: '',
    name: '',
    urgency: '',
    status: 'Pending',
    verdict: 2,
    pallet_fullness: 0
  });
  const [paletteSize, setPaletteSize] = useState(1);
  const [priceIncrement, setPriceIncrement] = useState(1);
  const [paletteCount, setPaletteCount] = useState(0);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null); // Track expanded order
  const { isLoggedIn, userId } = useAuth(); // Get login status and userId from context
  const [selectedWorkIds, setSelectedWorkIds] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      setNewWork(prevWork => ({
        ...prevWork,
        merchantId: userId, // Automatically set merchantId based on logged-in user
        fulfillerId: null // Set fulfillerId to null
      }));
    }
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (paletteCount >= paletteSize) {
      setPaletteCount(0);
      setNewWork(prevWork => ({ ...prevWork, price: '' }));
    }
  }, [paletteCount, paletteSize]);

  useEffect(() => {
    if (isLoggedIn) {
      if (tab === 'accept') {
        axios.get('http://localhost:3000/api/orders', {
          headers: { 'x-user-id': userId }
        })
          .then(response => {
            setWork(response.data);
          })
          .catch(error => {
            console.error("There was an error fetching the orders!", error);
          });
      }

      if (tab === 'history') {
        axios.get('http://localhost:3000/api/orders/history', {
          headers: { 'x-user-id': userId }
        })
          .then(response => {
            const categorizedHistory = response.data.reduce((acc, order) => {
              if (!order.status) {
                acc.accepted.push(order); // Default to 'accepted' if no status
              } else {
                acc[order.status.toLowerCase()] = acc[order.status.toLowerCase()] || [];
                acc[order.status.toLowerCase()].push(order);
              }
              return acc;
            }, {
              accepted: [],
              waitlisted: [],
              finished: []
            });
            setHistory(categorizedHistory);
          })
          .catch(error => {
            console.error("There was an error fetching the history!", error);
          });
      }
    }
  }, [tab, isLoggedIn, userId]);

  const handleGiveSubmit = (e) => {
    e.preventDefault();
    if (error === '') {
      axios.post('http://localhost:3000/api/orders', {
        ...newWork,
        merchantId: userId, // Ensure merchantId is set to the logged-in user's ID
        fulfillerId: null // Set fulfillerId to null
      }, {
        headers: { 'x-user-id': userId }
      })
        .then(response => {
          setWork([...work, { ...newWork, verdict: 2 }]); // Add to state with 'verdict' set to 2 (on waitlist)
          setNewWork({
            profileId: '',
            merchantOrderId: '',
            merchantSalesChannel: '',
            merchantCustomerId: '',
            languageId: '',
            placedBy: '',
            merchantPlacedDate: '',
            createdDate: '',
            fakeOrder: false,
            testingConfiguration: '',
            fulfillmentGroupId: '',
            fulfillerOrderId: '',
            globalFulfillerId: '',
            shortFulfillmentGroupId: '',
            fulfillmentRequestVersion: 1,
            shippingPriority: 1,
            destinationAddress: {
              country: '',
              postalCode: '',
              stateOrProvince: '',
              city: '',
              company: '',
              firstName: '',
              middleName: '',
              lastName: '',
              phone: '',
              phoneExt: '',
              email: '',
              street1: '',
              street2: '',
              doorCode: '',
              isPOBox: false,
              isResidential: false
            },
            consigneeAddress: {
              country: '',
              postalCode: '',
              stateOrProvince: '',
              city: '',
              company: '',
              firstName: '',
              middleName: '',
              lastName: '',
              phone: '',
              phoneExt: '',
              email: '',
              street1: '',
              street2: '',
              doorCode: '',
              isPOBox: false,
              isResidential: false
            },
            quantity: '',
            skuCode: '',
            orderedSkuCode: '',
            merchantProductName: '',
            documentReferenceUrl: '',
            price: '',
            weight: '',
            name: '',
            urgency: '',
            status: 'Pending',
            verdict: 2,
            pallet_fullness: 0
          });
          setPaletteCount(prevCount => prevCount + 1);
          setTab('accept'); // Switch to accept tab after submission
        })
        .catch(error => {
          console.error("There was an error adding the order!", error);
        });
    }
  };

  const handleAcceptSubmit = (index) => {
    setSelectedWorkIds(prevSelected => {
      if (prevSelected.includes(work[index]._id)) {
        return prevSelected.filter(id => id !== work[index]._id);
      } else {
        return [...prevSelected, work[index]._id];
      }
    });
  };

  const handleSubmitAcceptedWork = () => {
    const updatedWorkList = work.map(workItem => {
      if (selectedWorkIds.includes(workItem._id)) {
        workItem.fulfillerId = userId; // Set fulfillerId to logged-in user's ID
      }
      return workItem;
    }).filter(workItem => !selectedWorkIds.includes(workItem._id));

    setWork(updatedWorkList);

    axios.patch('http://localhost:3000/api/orders', { ids: selectedWorkIds, fulfillerId: userId }, {
      headers: { 'x-user-id': userId }
    })
      .then(response => {
        console.log('Work items updated:', response.data);
        setSelectedWorkIds([]);
        setTab('history'); // Switch to history tab after submission
      })
      .catch(error => {
        console.error("There was an error updating the work items!", error);
      });
  };

  const handleRejectSubmit = (index) => {
    const newWorkList = [...work];
    newWorkList[index].status = 'Rejected';
    newWorkList[index].verdict = 1;
    setWork(newWorkList);
  };

  const handleWaitlistSubmit = (index) => {
    const newWorkList = [...work];
    newWorkList[index].status = 'waitlisted';
    newWorkList[index].verdict = 2;
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

  const handleAddressChange = (e, field, type) => {
    const address = { ...newWork[type], [field]: e.target.value };
    setNewWork({ ...newWork, [type]: address });
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const moveWorkItem = (workItemId, direction) => {
    setHistory((prevHistory) => {
      const columns = ['accepted', 'waitlisted', 'finished'];
      const newHistory = { ...prevHistory };

      let sourceColumn, sourceIndex;
      columns.forEach((column) => {
        const index = newHistory[column].findIndex((item) => item._id === workItemId);
        if (index !== -1) {
          sourceColumn = column;
          sourceIndex = index;
        }
      });

      if (sourceColumn !== undefined && sourceIndex !== undefined) {
        const sourceColumnIndex = columns.indexOf(sourceColumn);
        const destColumnIndex = sourceColumnIndex + (direction === 'right' ? 1 : -1);

        if (destColumnIndex >= 0 && destColumnIndex < columns.length) {
          const destColumn = columns[destColumnIndex];
          const [movedItem] = newHistory[sourceColumn].splice(sourceIndex, 1);
          movedItem.status = destColumn;

          // Update the verdict based on destination column
          if (destColumn === 'waitlisted') {
            movedItem.verdict = 2;
          } else if (destColumn === 'finished') {
            movedItem.verdict = 0;
          }

          newHistory[destColumn].push(movedItem);

          // Update the state to trigger a re-render
          setHistory(newHistory);

          // Send the update to the backend
          axios.patch('http://localhost:3000/api/orders/move', {
            workItemId,
            newStatus: destColumn,
            verdict: movedItem.verdict,
          })
            .then(response => {
              console.log('Work item moved:', response.data);
            })
            .catch(error => {
              console.error("There was an error moving the work item!", error);
            });
        }
      }

      return newHistory;
    });
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceItems = Array.from(history[source.droppableId]);
      const [removed] = sourceItems.splice(source.index, 1);
      const destItems = Array.from(history[destination.droppableId]);
      destItems.splice(destination.index, 0, removed);

      setHistory({
        ...history,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      });

      // Update the backend with the new status
      axios.patch('http://localhost:3000/api/orders/move', {
        workItemId: removed._id,
        newStatus: destination.droppableId,
        verdict: destination.droppableId === 'waitlisted' ? 2 : 0
      })
        .then(response => {
          console.log('Work item moved:', response.data);
        })
        .catch(error => {
          console.error("There was an error moving the work item!", error);
        });
    } else {
      const items = Array.from(history[source.droppableId]);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);

      setHistory({
        ...history,
        [source.droppableId]: items
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 mt-10" style={{ fontFamily: 'sans-serif' }}>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setTab('give')} className={`mt-4 text-white font-bold py-4 px-8 ${tab === 'give' ? 'bg-green-700' : 'bg-green-500'}`}>Give Work</button>
        <button onClick={() => setTab('accept')} className={`mt-4 text-white font-bold py-4 px-8 ${tab === 'accept' ? 'bg-red-700' : 'bg-red-500'}`}>Accept Work</button>
        <button onClick={() => setTab('history')} className={`mt-4 text-white font-bold py-4 px-8 ${tab === 'history' ? 'bg-gray-700' : 'bg-gray-500'}`}>History</button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {tab === 'give' && (
        <form onSubmit={handleGiveSubmit} className="flex flex-col space-y-3 mt-10 items-center">
          <input value={newWork.profileId} onChange={e => handleInputChange(e, 'profileId')} placeholder="Profile ID" className="w-full p-2 border border-gray-300" />
          <input value={newWork.merchantOrderId} onChange={e => handleInputChange(e, 'merchantOrderId')} placeholder="Merchant Order ID" className="w-full p-2 border border-gray-300" />
          <input value={newWork.merchantSalesChannel} onChange={e => handleInputChange(e, 'merchantSalesChannel')} placeholder="Merchant Sales Channel" className="w-full p-2 border border-gray-300" />
          <input value={newWork.merchantCustomerId} onChange={e => handleInputChange(e, 'merchantCustomerId')} placeholder="Merchant Customer ID" className="w-full p-2 border border-gray-300" />
          <input value={newWork.languageId} onChange={e => handleInputChange(e, 'languageId')} placeholder="Language ID" className="w-full p-2 border border-gray-300" />
          <input value={newWork.placedBy} onChange={e => handleInputChange(e, 'placedBy')} placeholder="Placed By" className="w-full p-2 border border-gray-300" />
          <input type="datetime-local" value={newWork.merchantPlacedDate} onChange={e => handleInputChange(e, 'merchantPlacedDate')} placeholder="Merchant Placed Date" className="w-full p-2 border border-gray-300" />
          <input type="datetime-local" value={newWork.createdDate} onChange={e => handleInputChange(e, 'createdDate')} placeholder="Created Date" className="w-full p-2 border border-gray-300" />
          <input type="checkbox" checked={newWork.fakeOrder} onChange={e => setNewWork({ ...newWork, fakeOrder: e.target.checked })} className="w-full p-2 border border-gray-300" /> Fake Order
          <input value={newWork.testingConfiguration} onChange={e => handleInputChange(e, 'testingConfiguration')} placeholder="Testing Configuration" className="w-full p-2 border border-gray-300" />
          <input value={newWork.fulfillmentGroupId} onChange={e => handleInputChange(e, 'fulfillmentGroupId')} placeholder="Fulfillment Group ID" className="w-full p-2 border border-gray-300" />
          <input value={newWork.fulfillerOrderId} onChange={e => handleInputChange(e, 'fulfillerOrderId')} placeholder="Fulfiller Order ID" className="w-full p-2 border border-gray-300" />
          <input value={newWork.globalFulfillerId} onChange={e => handleInputChange(e, 'globalFulfillerId')} placeholder="Global Fulfiller ID" className="w-full p-2 border border-gray-300" />
          <input value={newWork.shortFulfillmentGroupId} onChange={e => handleInputChange(e, 'shortFulfillmentGroupId')} placeholder="Short Fulfillment Group ID" className="w-full p-2 border border-gray-300" />
          <input type="number" value={newWork.fulfillmentRequestVersion} onChange={e => handleInputChange(e, 'fulfillmentRequestVersion')} placeholder="Fulfillment Request Version" className="w-full p-2 border border-gray-300" />
          <input type="number" value={newWork.shippingPriority} onChange={e => handleInputChange(e, 'shippingPriority')} placeholder="Shipping Priority" className="w-full p-2 border border-gray-300" />

          <h3 className="text-lg font-bold">Destination Address</h3>
          <input value={newWork.destinationAddress.country} onChange={e => handleAddressChange(e, 'country', 'destinationAddress')} placeholder="Country" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.postalCode} onChange={e => handleAddressChange(e, 'postalCode', 'destinationAddress')} placeholder="Postal Code" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.stateOrProvince} onChange={e => handleAddressChange(e, 'stateOrProvince', 'destinationAddress')} placeholder="State or Province" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.city} onChange={e => handleAddressChange(e, 'city', 'destinationAddress')} placeholder="City" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.company} onChange={e => handleAddressChange(e, 'company', 'destinationAddress')} placeholder="Company" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.firstName} onChange={e => handleAddressChange(e, 'firstName', 'destinationAddress')} placeholder="First Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.middleName} onChange={e => handleAddressChange(e, 'middleName', 'destinationAddress')} placeholder="Middle Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.lastName} onChange={e => handleAddressChange(e, 'lastName', 'destinationAddress')} placeholder="Last Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.phone} onChange={e => handleAddressChange(e, 'phone', 'destinationAddress')} placeholder="Phone" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.phoneExt} onChange={e => handleAddressChange(e, 'phoneExt', 'destinationAddress')} placeholder="Phone Extension" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.email} onChange={e => handleAddressChange(e, 'email', 'destinationAddress')} placeholder="Email" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.street1} onChange={e => handleAddressChange(e, 'street1', 'destinationAddress')} placeholder="Street 1" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.street2} onChange={e => handleAddressChange(e, 'street2', 'destinationAddress')} placeholder="Street 2" className="w-full p-2 border border-gray-300" />
          <input value={newWork.destinationAddress.doorCode} onChange={e => handleAddressChange(e, 'doorCode', 'destinationAddress')} placeholder="Door Code" className="w-full p-2 border border-gray-300" />
          <input type="checkbox" checked={newWork.destinationAddress.isPOBox} onChange={e => setNewWork({ ...newWork, destinationAddress: { ...newWork.destinationAddress, isPOBox: e.target.checked } })} className="w-full p-2 border border-gray-300" /> Is PO Box
          <input type="checkbox" checked={newWork.destinationAddress.isResidential} onChange={e => setNewWork({ ...newWork, destinationAddress: { ...newWork.destinationAddress, isResidential: e.target.checked } })} className="w-full p-2 border border-gray-300" /> Is Residential

          <h3 className="text-lg font-bold">Consignee Address</h3>
          <input value={newWork.consigneeAddress.country} onChange={e => handleAddressChange(e, 'country', 'consigneeAddress')} placeholder="Country" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.postalCode} onChange={e => handleAddressChange(e, 'postalCode', 'consigneeAddress')} placeholder="Postal Code" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.stateOrProvince} onChange={e => handleAddressChange(e, 'stateOrProvince', 'consigneeAddress')} placeholder="State or Province" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.city} onChange={e => handleAddressChange(e, 'city', 'consigneeAddress')} placeholder="City" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.company} onChange={e => handleAddressChange(e, 'company', 'consigneeAddress')} placeholder="Company" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.firstName} onChange={e => handleAddressChange(e, 'firstName', 'consigneeAddress')} placeholder="First Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.middleName} onChange={e => handleAddressChange(e, 'middleName', 'consigneeAddress')} placeholder="Middle Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.lastName} onChange={e => handleAddressChange(e, 'lastName', 'consigneeAddress')} placeholder="Last Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.phone} onChange={e => handleAddressChange(e, 'phone', 'consigneeAddress')} placeholder="Phone" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.phoneExt} onChange={e => handleAddressChange(e, 'phoneExt', 'consigneeAddress')} placeholder="Phone Extension" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.email} onChange={e => handleAddressChange(e, 'email', 'consigneeAddress')} placeholder="Email" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.street1} onChange={e => handleAddressChange(e, 'street1', 'consigneeAddress')} placeholder="Street 1" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.street2} onChange={e => handleAddressChange(e, 'street2', 'consigneeAddress')} placeholder="Street 2" className="w-full p-2 border border-gray-300" />
          <input value={newWork.consigneeAddress.doorCode} onChange={e => handleAddressChange(e, 'doorCode', 'consigneeAddress')} placeholder="Door Code" className="w-full p-2 border border-gray-300" />
          <input type="checkbox" checked={newWork.consigneeAddress.isPOBox} onChange={e => setNewWork({ ...newWork, consigneeAddress: { ...newWork.consigneeAddress, isPOBox: e.target.checked } })} className="w-full p-2 border border-gray-300" /> Is PO Box
          <input type="checkbox" checked={newWork.consigneeAddress.isResidential} onChange={e => setNewWork({ ...newWork, consigneeAddress: { ...newWork.consigneeAddress, isResidential: e.target.checked } })} className="w-full p-2 border border-gray-300" /> Is Residential

          <input value={newWork.quantity} onChange={e => handleInputChange(e, 'quantity')} placeholder="Quantity" className="w-full p-2 border border-gray-300" />
          <input value={newWork.skuCode} onChange={e => handleInputChange(e, 'skuCode')} placeholder="SKU Code" className="w-full p-2 border border-gray-300" />
          <input value={newWork.orderedSkuCode} onChange={e => handleInputChange(e, 'orderedSkuCode')} placeholder="Ordered SKU Code" className="w-full p-2 border border-gray-300" />
          <input value={newWork.merchantProductName} onChange={e => handleInputChange(e, 'merchantProductName')} placeholder="Merchant Product Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.documentReferenceUrl} onChange={e => handleInputChange(e, 'documentReferenceUrl')} placeholder="Document Reference URL" className="w-full p-2 border border-gray-300" />

          <input value={newWork.price} onChange={e => handleInputChange(e, 'price')} placeholder="Price" className="w-full p-2 border border-gray-300" disabled={paletteCount > 0} />
          <input value={newWork.weight} onChange={e => handleInputChange(e, 'weight')} placeholder="Weight" className="w-full p-2 border border-gray-300" />
          <input value={newWork.name} onChange={e => setNewWork({ ...newWork, name: e.target.value })} placeholder="Name" className="w-full p-2 border border-gray-300" />
          <input value={newWork.urgency} onChange={e => handleInputChange(e, 'urgency')} placeholder="Urgency (1-10)" className="w-full p-2 border border-gray-300" />
          <div className='text-white'>
            <label>Palette Size: {paletteSize}</label>
            <input type="range" min="1" max="10" value={paletteSize} onChange={e => setPaletteSize(e.target.value)} />
          </div>
          <div className='text-white'>
            <label>Price Increment: {priceIncrement}x</label>
            <input type="range" min="1" max="10" value={priceIncrement} onChange={e => setPriceIncrement(e.target.value)} />
          </div>
          <button type="submit" className="text-white font-bold py-2 px-4 bg-blue-500">Submit</button>
        </form>
      )}

      {tab === 'accept' && (
        <div className="flex flex-col space-y-3 mt-10 items-center text-white">
          {isLoggedIn ? (
            work.map((workItem, index) => (
              <div key={index} className="w-full p-2 border border-gray-300">
                <p>Name: {workItem.name}</p>
                <p>Quantity: {workItem.quantity}</p>
                <p>Verdict: {workItem.verdict}</p>
                <p>Address: {workItem.destinationAddress.street1}, {workItem.destinationAddress.city}, {workItem.destinationAddress.stateOrProvince}, {workItem.destinationAddress.postalCode}</p>
                {expandedIndex === index && (
                  <>
                    <p>Merchant ID: {workItem.merchantId}</p>
                    <p>Fulfiller ID: {workItem.fulfillerId}</p>
                    <p>Profile ID: {workItem.profileId}</p>
                    <p>Merchant Order ID: {workItem.merchantOrderId}</p>
                    <p>Merchant Sales Channel: {workItem.merchantSalesChannel}</p>
                    <p>Merchant Customer ID: {workItem.merchantCustomerId}</p>
                    <p>Language ID: {workItem.languageId}</p>
                    <p>Placed By: {workItem.placedBy}</p>
                    <p>Merchant Placed Date: {new Date(workItem.merchantPlacedDate).toLocaleString()}</p>
                    <p>Created Date: {new Date(workItem.createdDate).toLocaleString()}</p>
                    <p>Fake Order: {workItem.fakeOrder ? 'Yes' : 'No'}</p>
                    <p>Fulfillment Group ID: {workItem.fulfillmentGroupId}</p>
                    <p>Fulfiller Order ID: {workItem.fulfillerOrderId}</p>
                    <p>Global Fulfiller ID: {workItem.globalFulfillerId}</p>
                    <p>Short Fulfillment Group ID: {workItem.shortFulfillmentGroupId}</p>
                    <p>Fulfillment Request Version: {workItem.fulfillmentRequestVersion}</p>
                    <p>Shipping Priority: {workItem.shippingPriority}</p>
                    <p>Ordered SKU Code: {workItem.orderedSkuCode}</p>
                    <p>Merchant Product Name: {workItem.merchantProductName}</p>
                    <p>Document Reference URL: {workItem.documentReferenceUrl}</p>
                    <p>Price: {workItem.price}</p>
                    <p>Weight: {workItem.weight}</p>
                    <p>Urgency: {workItem.urgency}</p>
                    <p>Status: {workItem.status}</p>
                    <p>Pallet Fullness: {workItem.pallet_fullness}</p>
                  </>
                )}
                <button onClick={() => toggleExpand(index)} className="text-blue-500">{expandedIndex === index ? 'See Less' : 'See More'}</button>
                <div className="flex space-x-2">
                  <button onClick={() => handleAcceptSubmit(index)} className={`text-white font-bold py-2 px-4 ${selectedWorkIds.includes(workItem._id) ? 'bg-green-700' : 'bg-green-500'}`}>{selectedWorkIds.includes(workItem._id) ? 'Undo' : 'Complete'}</button>
                  <button onClick={() => handleRejectSubmit(index)} className="text-white font-bold py-2 px-4 bg-red-500">Reject</button>
                  <button onClick={() => handleWaitlistSubmit(index)} className="text-white font-bold py-2 px-4 bg-gray-500">Waitlist</button>
                </div>
              </div>
            ))
          ) : (
            <p>Please log in to view and accept work.</p>
          )}
          <button onClick={handleSubmitAcceptedWork} className="text-white font-bold py-2 px-4 bg-blue-500 mt-4">Submit</button>
        </div>
      )}

{tab === 'history' && (
  <DragDropContext onDragEnd={handleDragEnd}>
    <div className="flex flex-row space-x-4 mt-10 items-start w-full text-white">
      {['accepted', 'waitlisted', 'finished'].map((columnId) => (
        <Droppable key={columnId} droppableId={columnId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-1/3 p-4 bg-gray-800 border border-gray-700 rounded-lg"
            >
              <h2 className="text-lg font-bold capitalize">{columnId}</h2>
              {history[columnId].map((workItem, index) => (
                <Draggable key={workItem._id} draggableId={workItem._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 mb-4 bg-gray-700 rounded-lg"
                    >
                      <p>Name: {workItem.name}</p>
                      <p>Quantity: {workItem.quantity}</p>
                      <p>Verdict: {workItem.verdict}</p>
                      <p>Address: {workItem.destinationAddress.street1}, {workItem.destinationAddress.city}, {workItem.destinationAddress.stateOrProvince}, {workItem.destinationAddress.postalCode}</p>
                      <p>Merchant ID: {workItem.merchantId}</p>
                      <p>Fulfiller ID: {workItem.fulfillerId}</p>
                      {expandedIndex === index && (
                        <>
                          <p>Profile ID: {workItem.profileId}</p>
                          <p>Merchant Order ID: {workItem.merchantOrderId}</p>
                          <p>Merchant Sales Channel: {workItem.merchantSalesChannel}</p>
                          <p>Merchant Customer ID: {workItem.merchantCustomerId}</p>
                          <p>Language ID: {workItem.languageId}</p>
                          <p>Placed By: {workItem.placedBy}</p>
                          <p>Merchant Placed Date: {new Date(workItem.merchantPlacedDate).toLocaleString()}</p>
                          <p>Created Date: {new Date(workItem.createdDate).toLocaleString()}</p>
                          <p>Fake Order: {workItem.fakeOrder ? 'Yes' : 'No'}</p>
                          <p>Fulfillment Group ID: {workItem.fulfillmentGroupId}</p>
                          <p>Fulfiller Order ID: {workItem.fulfillerOrderId}</p>
                          <p>Global Fulfiller ID: {workItem.globalFulfillerId}</p>
                          <p>Short Fulfillment Group ID: {workItem.shortFulfillmentGroupId}</p>
                          <p>Fulfillment Request Version: {workItem.fulfillmentRequestVersion}</p>
                          <p>Shipping Priority: {workItem.shippingPriority}</p>
                          <p>Ordered SKU Code: {workItem.orderedSkuCode}</p>
                          <p>Merchant Product Name: {workItem.merchantProductName}</p>
                          <p>Document Reference URL: {workItem.documentReferenceUrl}</p>
                          <p>Price: {workItem.price}</p>
                          <p>Weight: {workItem.weight}</p>
                          <p>Urgency: {workItem.urgency}</p>
                          <p>Status: {workItem.status}</p>
                          <p>Pallet Fullness: {workItem.pallet_fullness}</p>
                        </>
                      )}
                      <button onClick={() => toggleExpand(index)} className="text-blue-500">
                        {expandedIndex === index ? 'See Less' : 'See More'}
                      </button>
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => moveWorkItem(workItem._id, 'left')}
                          className="text-white font-bold py-1 px-2 bg-blue-500"
                          disabled={columnId === 'accepted'} // Disable left arrow for the first column
                        >
                          &larr;
                        </button>
                        <button
                          onClick={() => moveWorkItem(workItem._id, 'right')}
                          className="text-white font-bold py-1 px-2 bg-blue-500"
                          disabled={columnId === 'finished'} // Disable right arrow for the last column
                        >
                          &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  </DragDropContext>
)}

    </div>
  );
};

export default WorkCalc;
