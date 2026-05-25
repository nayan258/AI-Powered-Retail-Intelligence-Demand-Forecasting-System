import { subDays, addDays, format, isSameDay } from "date-fns";

export interface Transaction {
  id: string;
  orderId: string;
  customerId: string;
  productName: string;
  category: string;
  region: string;
  sales: number;
  quantity: number;
  profit: number;
  discount: number;
  date: string;
  paymentMode: string;
  isAnomaly?: boolean;
}

const CATEGORIES = ["Electronics", "Clothing", "Home & Furniture", "Grocery", "Beauty"];
const REGIONS = ["North", "South", "East", "West"];
const PAYMENT_MODES = ["Credit Card", "Debit Card", "UPI", "Cash", "Net Banking"];

const PRODUCTS_MAP: Record<string, string[]> = {
  "Electronics": ["Smartphone", "Laptop", "Wireless Earbuds", "Smartwatch", "Monitor", "Tablet"],
  "Clothing": ["T-Shirt", "Jeans", "Jacket", "Sneakers", "Dress", "Sweater"],
  "Home & Furniture": ["Office Chair", "Desk", "Sofa", "Bed Sheet", "Lamp"],
  "Grocery": ["Coffee Beans", "Olive Oil", "Almonds", "Organic Honey", "Green Tea"],
  "Beauty": ["Face Wash", "Moisturizer", "Perfume", "Lipstick", "Sunscreen"]
};

// Seeded random approach for consistent data
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
const rng = mulberry32(12345);

function randomInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return rng() * (max - min) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function generateSyntheticData(numRows = 2000): Transaction[] {
  const data: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < numRows; i++) {
    const category = randomItem(CATEGORIES);
    const productName = randomItem(PRODUCTS_MAP[category]);
    const quantity = randomInt(1, 10);
    
    // Base price varies by category
    let basePrice = 0;
    if (category === "Electronics") basePrice = randomFloat(100, 1500);
    else if (category === "Clothing") basePrice = randomFloat(15, 120);
    else if (category === "Home & Furniture") basePrice = randomFloat(40, 800);
    else if (category === "Grocery") basePrice = randomFloat(5, 40);
    else basePrice = randomFloat(10, 80);

    const discount = i % 10 === 0 ? randomFloat(0.1, 0.5) : randomFloat(0, 0.1); 
    const sales = Number((basePrice * quantity * (1 - discount)).toFixed(2));
    const profitMargin = randomFloat(-0.1, 0.4);
    const profit = Number((sales * profitMargin).toFixed(2));

    const daysAgo = randomInt(0, 365);
    const orderDate = subDays(now, daysAgo);

    // Occasional massive anomaly
    let finalSales = sales;
    let finalProfit = profit;
    if (i % 300 === 0) {
       finalSales = sales * randomInt(5, 15);
       finalProfit = profit * randomInt(5, 15);
    }

    data.push({
      id: `TXN-${10000 + i}`,
      orderId: `ORD-${randomInt(1000, 9999)}`,
      customerId: `CUST-${randomInt(100, 999)}`,
      productName,
      category,
      region: randomItem(REGIONS),
      sales: finalSales,
      quantity,
      profit: finalProfit,
      discount: Number(discount.toFixed(2)),
      date: orderDate.toISOString(),
      paymentMode: randomItem(PAYMENT_MODES),
    });
  }

  // Sort by date ascending
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Global cached data to simulate DB
let cachedData: Transaction[] | null = null;
export function getRetailData(): Transaction[] {
  if (!cachedData) {
    cachedData = generateSyntheticData(2000);
  }
  return cachedData;
}
