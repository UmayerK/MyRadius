import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Ensure correct path to AuthContext

const WorkCalc = () => {
  const [tab, setTab] = useState('give');
  const [work, setWork] = useState([]);
  const [history, setHistory] = useState([]);
  const [newWork, setNewWork] = useState({
    merchantId: '',
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
  const { isLoggedIn } = useAuth(); // Get login status from context

  useEffect(() => {
    if (paletteCount >= paletteSize) {
      setPaletteCount(0);
      setNewWork(prevWork => ({ ...prevWork, price: '' }));
    }
  }, [paletteCount, paletteSize]);

  useEffect(() => {
    if (isLoggedIn) {
      if (tab === 'accept') {
        axios.get('http://localhost:3000/api/orders')
          .then(response => {
            setWork(response.data);
          })
          .catch(error => {
            console.error("There was an error fetching the orders!", error);
          });
      }

      if (tab === 'history') {
        axios.get('http://localhost:3000/api/orders')
          .then(response => {
            setHistory(response.data); // Fetch all orders for history tab
          })
          .catch(error => {
            console.error("There was an error fetching the history!", error);
          });
      }
    }
  }, [tab, isLoggedIn]);

  const handleGiveSubmit = (e) => {
    e.preventDefault();
    if (error === '') {
      axios.post('http://localhost:3000/api/orders', newWork)
        .then(response => {
          setWork([...work, { ...newWork, verdict: 2 }]); // Add to state with 'verdict' set to 2 (on waitlist)
          setNewWork({
            merchantId: '',
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
          setPaletteCount(prevCount => prevCount + 1);
          setTab('accept'); // Switch to accept tab after submission
        })
        .catch(error => {
          console.error("There was an error adding the order!", error);
        });
    }
  };

  const handleAcceptSubmit = (index) => {
    const newWorkList = [...work];
    newWorkList[index].completed = !newWorkList[index].completed;
    newWorkList[index].status = newWorkList[index].completed ? 'Completed' : 'Pending';
    setWork(newWorkList);
  };

  const handleRejectSubmit = (index) => {
    const newWorkList = [...work];
    newWorkList[index].status = 'Rejected';
    newWorkList[index].verdict = 1;
    setWork(newWorkList);
  };

  const handleWaitlistSubmit = (index) => {
    const newWorkList = [...work];
    newWorkList[index].status = 'Waitlisted';
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
          <input value={newWork.merchantId} onChange={e => handleInputChange(e, 'merchantId')} placeholder="Merchant ID" className="w-full p-2 border border-gray-300" />
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
          <input value={newWork.fulfillerId} onChange={e => handleInputChange(e, 'fulfillerId')} placeholder="Fulfiller ID" className="w-full p-2 border border-gray-300" />
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
                    <p>Fulfiller ID: {workItem.fulfillerId}</p>
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
                  <button onClick={() => handleAcceptSubmit(index)} className="text-white font-bold py-2 px-4 bg-green-500">{workItem.completed ? 'Undo' : 'Complete'}</button>
                  <button onClick={() => handleRejectSubmit(index)} className="text-white font-bold py-2 px-4 bg-red-500">Reject</button>
                  <button onClick={() => handleWaitlistSubmit(index)} className="text-white font-bold py-2 px-4 bg-gray-500">Waitlist</button>
                </div>
              </div>
            ))
          ) : (
            <p>Please log in to view and accept work.</p>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="flex flex-col space-y-3 mt-10 items-center text-white">
          {isLoggedIn ? (
            history.map((workItem, index) => (
              <div key={index} className="w-full p-2 border border-gray-300">
                <p>Name: {workItem.name}</p>
                <p>Quantity: {workItem.quantity}</p>
                <p>Verdict: {workItem.verdict}</p>
                <p>Address: {workItem.destinationAddress.street1}, {workItem.destinationAddress.city}, {workItem.destinationAddress.stateOrProvince}, {workItem.destinationAddress.postalCode}</p>
                {expandedIndex === index && (
                  <>
                    <p>Merchant ID: {workItem.merchantId}</p>
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
                    <p>Fulfiller ID: {workItem.fulfillerId}</p>
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
              </div>
            ))
          ) : (
            <p>Please log in to view the history.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkCalc;
