// İyzico SDK Test
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: "sandbox-juISS3OjMUUQTxESbPXv9XPBOXLq15BU",
  secretKey: "sandbox-CB1MRC4HeaiUduV35AnUFB17npreMuzs",
  uri: "https://sandbox-api.iyzipay.com",
});

console.log("🔄 İyzico SDK Test başlatılıyor...");

// Test checkout form initialize
const testBody = {
  locale: "tr",
  conversationId: "test-" + Date.now(),
  price: "1.00",
  paidPrice: "1.00",
  currency: "TRY",
  installment: "1",
  basketId: "test-basket-" + Date.now(),
  paymentGroup: "PRODUCT",
  callbackUrl: "http://localhost:3000/api/iyzico/callback",
  enabledInstallments: [2, 3, 6, 9],
  buyer: {
    id: "test-buyer",
    name: "Test",
    surname: "User",
    gsmNumber: "+905551234567",
    email: "test@example.com",
    identityNumber: "11111111111",
    lastLoginDate: "2023-10-01 10:00:00",
    registrationDate: "2023-01-01 10:00:00",
    registrationAddress: "Test Address",
    ip: "127.0.0.1",
    city: "Istanbul",
    country: "Turkey",
    zipCode: "34000"
  },
  shippingAddress: {
    contactName: "Test User",
    city: "Istanbul",
    country: "Turkey",
    address: "Test Address",
    zipCode: "34000"
  },
  billingAddress: {
    contactName: "Test User",
    city: "Istanbul",
    country: "Turkey",
    address: "Test Address",
    zipCode: "34000"
  },
  basketItems: [{
    id: "test-item",
    name: "Test Product",
    category1: "Test Category",
    itemType: "PHYSICAL",
    price: "1.00"
  }]
};

iyzipay.checkoutFormInitialize.create(testBody, (err, result) => {
  if (err) {
    console.error("❌ İyzico SDK Error:");
    console.error(JSON.stringify(err, null, 2));
  } else {
    console.log("✅ İyzico SDK Success:");
    console.log(JSON.stringify(result, null, 2));
  }
});
