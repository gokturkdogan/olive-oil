// Test script for İyzico authentication
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: "sandbox-juISS3OjMUUQTxESbPXv9XPBOXLq15BU",
  secretKey: "sandbox-CB1MRC4HeaiUduV35AnUFB17npreMuzs",
  uri: "https://sandbox-api.iyzipay.com",
});

console.log("🔄 İyzico SDK ile test başlatılıyor...");

// Test retrieve with a dummy token
iyzipay.checkoutForm.retrieve({ 
  locale: "tr", 
  token: "27503409" 
}, (err, result) => {
  if (err) {
    console.error("❌ İyzico SDK Error:", err);
  } else {
    console.log("✅ İyzico SDK Success:", result);
  }
});
