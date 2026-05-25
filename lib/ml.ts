import { Transaction } from "./data";
import { format, parseISO, addDays } from "date-fns";

// --- CUSTOMER SEGMENTATION (K-Means Approximation) ---
export interface CustomerSegment {
  customerId: string;
  recency: number; // days since last order
  frequency: number; // total orders
  monetary: number; // total spent
  cluster: "High-Value" | "Loyal" | "At-Risk" | "New";
}

export function performRFM(transactions: Transaction[]): CustomerSegment[] {
  const customerMap = new Map<string, { r: number, f: number, m: number, lastDate: Date }>();
  const now = new Date();

  transactions.forEach(t => {
    const d = parseISO(t.date);
    if (!customerMap.has(t.customerId)) {
      customerMap.set(t.customerId, { r: Infinity, f: 0, m: 0, lastDate: new Date(0) });
    }
    const c = customerMap.get(t.customerId)!;
    c.f += 1;
    c.m += t.sales;
    if (d.getTime() > c.lastDate.getTime()) {
      c.lastDate = d;
      c.r = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    }
  });

  const segments: CustomerSegment[] = [];
  customerMap.forEach((val, key) => {
    let cluster: "High-Value" | "Loyal" | "At-Risk" | "New" = "Loyal";
    
    if (val.m > 2500 && val.f > 5 && val.r < 30) cluster = "High-Value";
    else if (val.f > 8) cluster = "Loyal";
    else if (val.r > 90) cluster = "At-Risk";
    else if (val.r <= 30 && val.f <= 2) cluster = "New";

    segments.push({
      customerId: key,
      recency: val.r,
      frequency: val.f,
      monetary: Number(val.m.toFixed(2)),
      cluster
    });
  });

  return segments;
}

// --- ANOMALY DETECTION (Z-Score Approximation for Isolation Forest) ---
export function detectAnomalies(transactions: Transaction[]): Transaction[] {
  const sales = transactions.map(t => t.sales);
  const mean = sales.reduce((a, b) => a + b, 0) / (sales.length || 1);
  const stdDev = Math.sqrt(sales.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (sales.length || 1));

  const threshold = 3; // 3 standard deviations

  return transactions.map(t => ({
    ...t,
    isAnomaly: Math.abs(t.sales - mean) > threshold * stdDev
  }));
}

// --- DEMAND FORECASTING (Moving Average / Simple Trend) ---
export interface ForecastData {
  date: string;
  actualSales: number | null;
  forecastSales: number | null;
}

export function generateForecast(transactions: Transaction[], daysToForecast = 30): ForecastData[] {
  // Aggregate daily
  const dailyMap = new Map<string, number>();
  transactions.forEach(t => {
    const d = t.date.split("T")[0];
    dailyMap.set(d, (dailyMap.get(d) || 0) + t.sales);
  });

  const sortedDates = Array.from(dailyMap.keys()).sort();
  if (sortedDates.length === 0) return [];

  const results: ForecastData[] = [];
  let lastFewSales: number[] = [];

  sortedDates.forEach(d => {
    const s = dailyMap.get(d)!;
    results.push({ date: d, actualSales: Number(s.toFixed(2)), forecastSales: null });
    lastFewSales.push(s);
    if (lastFewSales.length > 7) lastFewSales.shift();
  });

  // Simple Moving Average for future
  const lastDate = parseISO(sortedDates[sortedDates.length - 1]);
  let currentSMA = lastFewSales.reduce((a, b) => a + b, 0) / lastFewSales.length;

  for (let i = 1; i <= daysToForecast; i++) {
    const nextDate = addDays(lastDate, i);
    const dateStr = format(nextDate, "yyyy-MM-dd");
    // Add random noise + slight trend
    const noise = (Math.random() - 0.5) * (currentSMA * 0.2);
    currentSMA = currentSMA * 1.005; // 0.5% growth
    
    const fval = Math.max(0, currentSMA + noise);
    results.push({
      date: dateStr,
      actualSales: null,
      forecastSales: Number(fval.toFixed(2))
    });
  }

  return results;
}

// --- INVENTORY OPTIMIZATION ---
export interface InventoryItem {
  productName: string;
  category: string;
  currentStock: number;
  monthlyVelocity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  recommendation: string;
}

export function analyzeInventory(transactions: Transaction[]): InventoryItem[] {
  // We'll mock current stock and calculate velocity
  const now = new Date();
  const thirtyDaysAgo = addDays(now, -30);
  
  const velocityMap = new Map<string, { sold: number, cat: string }>();
  
  transactions.forEach(t => {
    if (parseISO(t.date).getTime() >= thirtyDaysAgo.getTime()) {
      if (!velocityMap.has(t.productName)) {
        velocityMap.set(t.productName, { sold: 0, cat: t.category });
      }
      velocityMap.get(t.productName)!.sold += t.quantity;
    }
  });

  // Generate pseudo-random current stock using hash of string
  const getHash = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);

  const inventory: InventoryItem[] = [];
  velocityMap.forEach((val, key) => {
    // Generate stock between 0 and 200
    const stock = Math.abs(getHash(key)) % 250;
    
    let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
    let rec = "No action needed";

    if (stock === 0) {
      status = "Out of Stock";
      rec = "Urgent restock needed.";
    } else if (stock < val.sold / 2) {
      status = "Low Stock";
      rec = `Restock ${Math.ceil(val.sold - stock)} units to meet 30-day demand.`;
    } else if (stock > val.sold * 3) {
      rec = "Overstocked. Consider discounts.";
    }

    inventory.push({
      productName: key,
      category: val.cat,
      currentStock: stock,
      monthlyVelocity: val.sold,
      status,
      recommendation: rec
    });
  });

  return inventory.sort((a,b) => a.currentStock - b.currentStock);
}
