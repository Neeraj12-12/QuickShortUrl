import { MongoClient, Db } from "mongodb";

// Interfaces for the mock data
export interface ClickData {
  time: string;
  clicks: number;
}

export interface GeoData {
  country: string;
  clicks: number;
  percentage: string;
}

export interface DeviceData {
  category: string;
  type: string;
  clicks: number;
  icon: string;
}

export interface BrowserData {
  name: string;
  clicks: number;
}

export interface Analytics {
  urlId: string;
  timestamp: Date;
  ipAddress: string;
  deviceType: string;
  browser?: string;
  location?: string;
  isUnique: boolean;
  clickData: { daily: ClickData[]; weekly: ClickData[]; monthly: ClickData[] };  // added clickData
  geoData: GeoData[];  // added geoData
  deviceData: DeviceData[];  // added deviceData
  browserData: BrowserData[];  // added browserData
}

// MongoDB connection function
export async function getDb(): Promise<Db> {
  const client = new MongoClient(process.env.REACT_APP_MONGODB_URI!);
  await client.connect();
  const db = client.db('urlShortener');
  return db;
}

// Function to log the analytics with the provided data
export async function logAnalytics(analytics: Analytics) {
  const db = await getDb();
  const collection = db.collection<Analytics>("analytics");
  return collection.insertOne(analytics);
}

// Function to get analytics for a specific URL based on urlId
export async function getAnalyticsForUrl(urlId: string) {
  const db = await getDb();
  const collection = db.collection<Analytics>("analytics");
  return collection.find({ urlId }).toArray();
}

// Example function to insert mock data
export async function insertMockData() {
  const mockData: Analytics = {
    urlId: "example-url-id",
    timestamp: new Date(),
    ipAddress: "192.168.0.1",
    deviceType: "Mobile",
    isUnique: true,
    clickData: {
      daily: [
        { time: '00:00', clicks: 45 },
        { time: '04:00', clicks: 25 },
        { time: '08:00', clicks: 85 },
        { time: '12:00', clicks: 120 },
        { time: '16:00', clicks: 95 },
        { time: '20:00', clicks: 75 }
      ],
      weekly: [
        { time: 'Mon', clicks: 320 },
        { time: 'Tue', clicks: 380 },
        { time: 'Wed', clicks: 420 },
        { time: 'Thu', clicks: 390 },
        { time: 'Fri', clicks: 450 },
        { time: 'Sat', clicks: 280 },
        { time: 'Sun', clicks: 240 }
      ],
      monthly: [
        { time: 'Week 1', clicks: 1850 },
        { time: 'Week 2', clicks: 2100 },
        { time: 'Week 3', clicks: 1950 },
        { time: 'Week 4', clicks: 2300 }
      ]
    },
    geoData: [
      { country: 'United States', clicks: 2450, percentage: '35%' },
      { country: 'United Kingdom', clicks: 1230, percentage: '18%' },
      { country: 'Germany', clicks: 840, percentage: '12%' },
      { country: 'France', clicks: 720, percentage: '10%' },
      { country: 'Canada', clicks: 650, percentage: '9%' },
      { country: 'Others', clicks: 1110, percentage: '16%' }
    ],
    deviceData: [
      { category: 'Mobile', type: 'Android', clicks: 1850, icon: "Smartphone" },
      { category: 'Mobile', type: 'iOS', clicks: 1620, icon: "Smartphone" },
      { category: 'Desktop', type: 'Windows', clicks: 2340, icon: "Monitor" },
      { category: 'Desktop', type: 'macOS', clicks: 1450, icon: "Monitor" },
      { category: 'Tablet', type: 'iPad', clicks: 580, icon: "Tablet" },
      { category: 'Tablet', type: 'Android Tablet', clicks: 160, icon: "Tablet" }
    ],
    browserData: [
      { name: 'Chrome', clicks: 3200 },
      { name: 'Safari', clicks: 2100 },
      { name: 'Firefox', clicks: 1400 },
      { name: 'Edge', clicks: 800 }
    ]
  };

  // Insert mock data into MongoDB
  const db = await getDb();
  const collection = db.collection<Analytics>("analytics");
  return collection.insertOne(mockData);
}
