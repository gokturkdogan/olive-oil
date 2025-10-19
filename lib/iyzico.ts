import crypto from "crypto";

const IYZICO_API_KEY = process.env.IYZICO_API_KEY || "";
const IYZICO_SECRET_KEY = process.env.IYZICO_SECRET_KEY || "";
const IYZICO_BASE_URL = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

/**
 * JSON stringify without whitespace (İyzico requirement)
 */
function stringifyBody(body: any): string {
  return JSON.stringify(body)
    .replace(/\s+/g, '') // Remove all whitespace
    .replace(/[\u007F-\uFFFF]/g, function(chr) {
      return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
    });
}

/**
 * İyzico API'ye istek gönderir
 */
async function iyzicoRequest(endpoint: string, body: any): Promise<any> {
  const url = `${IYZICO_BASE_URL}${endpoint}`;
  const randomString = crypto.randomBytes(16).toString("hex");
  
  // İyzico strict JSON formatting
  const requestBody = stringifyBody(body);
  
  // İmza oluştur
  const dataToSign = IYZICO_API_KEY + randomString + requestBody;
  const signature = crypto
    .createHmac("sha256", IYZICO_SECRET_KEY)
    .update(dataToSign, 'utf8')
    .digest("base64");
  
  const authString = `IYZWS ${IYZICO_API_KEY}:${signature}:${randomString}`;

  console.log("İyzico Request URL:", url);
  console.log("İyzico Random String:", randomString);
  console.log("İyzico Request Body Length:", requestBody.length);
  console.log("İyzico Data to Sign Length:", dataToSign.length);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": authString,
      "x-iyzi-rnd": randomString,
      "Accept": "application/json",
    },
    body: requestBody,
  });

  const responseText = await response.text();
  console.log("İyzico Raw Response:", responseText);

  if (!response.ok) {
    console.error("İyzico API Error Status:", response.status);
    throw new Error(`İyzico API Error: ${response.status} - ${responseText}`);
  }

  return JSON.parse(responseText);
}

export interface CreateCheckoutFormParams {
  locale?: string;
  conversationId: string;
  price: string;
  paidPrice: string;
  currency?: string;
  basketId: string;
  paymentGroup?: string;
  paymentChannel?: string;
  callbackUrl: string;
  enabledInstallments?: number[];
  buyer: {
    id: string;
    name: string;
    surname: string;
    gsmNumber: string;
    email: string;
    identityNumber: string;
    lastLoginDate?: string;
    registrationDate?: string;
    registrationAddress: string;
    ip: string;
    city: string;
    country: string;
    zipCode?: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    category2?: string;
    itemType: string;
    price: string;
  }>;
}

/**
 * İyzico Checkout Form oluşturur
 */
export async function createCheckoutForm(
  params: CreateCheckoutFormParams
): Promise<any> {
  const startTime = Date.now();
  
  try {
    console.log("\n📤 createCheckoutForm() başladı");
    console.log("Request Params:", JSON.stringify(params, null, 2));
    
    const baseUrl = typeof window === 'undefined' 
      ? (process.env.NEXTAUTH_URL || "http://localhost:3000")
      : '';
    
    const apiUrl = `${baseUrl}/api/iyzico/init`;
    console.log("🌐 API URL:", apiUrl);
    console.log("🔄 Fetch başlıyor...");
    
    const fetchStartTime = Date.now();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const fetchElapsed = Date.now() - fetchStartTime;
    
    console.log(`📥 Fetch tamamlandı (${fetchElapsed}ms)`);
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const result = await response.json();
    const totalElapsed = Date.now() - startTime;
    
    console.log(`✅ createCheckoutForm tamamlandı (${totalElapsed}ms)`);
    console.log("Response:", JSON.stringify(result, null, 2));
    
    return result;
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ createCheckoutForm error (${elapsed}ms):`, error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

/**
 * İyzico ödeme sonucunu doğrular
 */
export async function retrieveCheckoutForm(token: string): Promise<any> {
  try {
    const baseUrl = typeof window === 'undefined'
      ? (process.env.NEXTAUTH_URL || "http://localhost:3000")
      : '';
    const response = await fetch(`${baseUrl}/api/iyzico/retrieve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("İyzico retrieveCheckoutForm error:", error);
    throw error;
  }
}

