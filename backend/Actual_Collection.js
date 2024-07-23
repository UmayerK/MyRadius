const mongoose = require('mongoose');

// Define all necessary sub-schemas first
const AddressSchema = new mongoose.Schema({
  country: String,
  postalCode: String,
  stateOrProvince: String,
  city: String,
  company: String,
  firstName: String,
  middleName: String,
  lastName: String,
  phone: String,
  phoneExt: String,
  email: String,
  street1: String,
  street2: String,
  doorCode: String,
  isPOBox: Boolean,
  isResidential: Boolean
});

const ShipmentPlanSchema = new mongoose.Schema({
  expectedCarrier: String,
  expectedShipDate: Date,
  enforced: Boolean,
  fulfillmentLocation: {
    fulfillmentLocationId: String,
    url: String
  },
  _links: {
    self: {
      href: String
    }
  }
});

const DeliveryConfigurationSchema = new mongoose.Schema({
  quantity: Number,
  deliveryRequestLink: {
    href: String,
    rel: String
  },
  isSample: Boolean,
  shipmentPlan: ShipmentPlanSchema,
  destinationAddress: AddressSchema,
  deliveryConstraints: mongoose.Schema.Types.Mixed,
  _links: mongoose.Schema.Types.Mixed
});

const FulfillmentAttributeSchema = new mongoose.Schema({
  name: String,
  value: String
});

const VariableAttributeSchema = new mongoose.Schema({
  name: String,
  value: String,
  attributeClass: String,
  attributeSubclass: String
});

const ProductManufacturingDataSchema = new mongoose.Schema({
  name: String,
  value: String
});

const CustomsInformationSchema = new mongoose.Schema({
  listPrice: {
    basePrice: Number,
    baseTax: Number,
    shippingPrice: Number,
    shippingTax: Number,
    currencyCode: String
  },
  pricePaid: {
    basePrice: Number,
    baseTax: Number,
    shippingPrice: Number,
    shippingTax: Number,
    currencyCode: String
  }
});

const StatusSchema = new mongoose.Schema({
  name: String,
  updatedDate: Date,
  expectedCloseDate: Date,
  state: String,
  quantity: Number,
  detail: mongoose.Schema.Types.Mixed
});

// Define the main order schema
const OrderSchema = new mongoose.Schema({
  merchantId: String,
  merchantOrderSupportContact: {
    email: String,
    phoneNumber: String
  },
  supportContact: {
    email: String
  },
  profileId: String,
  merchantOrderId: String,
  merchantSalesChannel: String,
  orderId: String,
  eventCallbackUrl: String,
  merchantCustomerId: String,
  languageId: String,
  taxpayerIdentification: mongoose.Schema.Types.Mixed,
  placedBy: String,
  merchantPlacedDate: Date,
  createdDate: Date,
  fakeOrder: Boolean,
  testingConfiguration: String,
  metadata: mongoose.Schema.Types.Mixed,
  fulfillmentGroupId: String,
  fulfillerOrderId: String,
  fulfillerId: String,
  globalFulfillerId: String,
  shortFulfillmentGroupId: String,
  fulfillmentRequestVersion: Number,
  shippingPriority: Number,
  deliveryNoteUrl: mongoose.Schema.Types.Mixed,
  destinationAddress: AddressSchema,
  consigneeAddress: AddressSchema,
  shipmentPickupInformation: mongoose.Schema.Types.Mixed,
  shippingLabelDetail: mongoose.Schema.Types.Mixed,
  deliveryConstraints: mongoose.Schema.Types.Mixed,
  deliveryOptionSelectionId: mongoose.Schema.Types.Mixed,
  promisedArrivalDate: Date,
  localPromisedArrivalDate: String,
  merchantPromisedDeliveryOption: mongoose.Schema.Types.Mixed,
  fulfillmentFeatures: mongoose.Schema.Types.Mixed,
  transportFeatures: mongoose.Schema.Types.Mixed,
  businessDays: Number,
  expectedShipDate: mongoose.Schema.Types.Mixed,
  expectedCarrierService: mongoose.Schema.Types.Mixed,
  itemId: String,
  fulfillerItemId: String,
  shortItemId: String,
  merchantItemId: String,
  purchaseOrderNumber: mongoose.Schema.Types.Mixed,
  newFulfillmentGroup: Boolean,
  skuCode: String,
  orderedSkuCode: String,
  quantity: Number,
  deliveryConfigurations: [DeliveryConfigurationSchema],
  merchantProductName: String,
  documentReference: mongoose.Schema.Types.Mixed,
  documentReferenceUrl: String,
  documentReviewOptions: {
    requireReview: Boolean
  },
  itemPreviewUrl: mongoose.Schema.Types.Mixed,
  itemViews: mongoose.Schema.Types.Mixed,
  transferPrice: {
    basePrice: Number,
    shippingPrice: Number,
    currencyCode: String,
    shippingCurrencyCode: String
  },
  wholesalePrice: mongoose.Schema.Types.Mixed,
  customsInformation: CustomsInformationSchema,
  fulfillmentAttributes: [FulfillmentAttributeSchema],
  groupFulfillmentAttributes: mongoose.Schema.Types.Mixed,
  variableAttributes: [VariableAttributeSchema],
  manufacturingReadyDataUrl: mongoose.Schema.Types.Mixed,
  productManufacturingData: [ProductManufacturingDataSchema],
  costsIncurredData: mongoose.Schema.Types.Mixed,
  claimReference: mongoose.Schema.Types.Mixed,
  shipments: [
    {
      href: String,
      name: String
    }
  ],
  unmetExpectations: [mongoose.Schema.Types.Mixed],
  fulfillmentCapabilities: [mongoose.Schema.Types.Mixed],
  status: {
    attributes: mongoose.Schema.Types.Mixed,
    additionalData: mongoose.Schema.Types.Mixed
  },
  _links: mongoose.Schema.Types.Mixed,
  _embedded: mongoose.Schema.Types.Mixed,
  statuses: mongoose.Schema.Types.Mixed,
  version: Number,
  lastModifiedDate: Date,
  name: String,
  price: Number,
  weight: Number,
  urgency: Number,
  verdict: Number,
  pallet_fullness: Number
});

const Order = mongoose.model('Actual_collection', OrderSchema);

module.exports = Order;
