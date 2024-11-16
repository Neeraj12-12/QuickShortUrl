"use client"
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { MapPin, Monitor, Smartphone, Tablet, Globe, Mail, Search, Share2, Clock } from 'lucide-react';


const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('daily');
  
  // Sample data
  const clickData = {
    daily: [
      { time: '00:00', clicks: 45 },
      { time: '04:00', clicks: 25 },
      { time: '08:00', clicks: 85 },
      { time: '12:00', clicks: 120 },
      { time: '16:00', clicks: 95 },
      { time: '00:00', clicks: 45 },
      { time: '04:00', clicks: 25 },
      { time: '08:00', clicks: 85 },
      { time: '12:00', clicks: 120 },
      { time: '16:00', clicks: 95 },
      { time: '00:00', clicks: 45 },
      { time: '04:00', clicks: 25 },
      { time: '08:00', clicks: 85 },
      { time: '12:00', clicks: 120 },
      { time: '16:00', clicks: 95 },
      { time: '00:00', clicks: 45 },
      { time: '04:00', clicks: 25 },
      { time: '08:00', clicks: 85 },
      { time: '12:00', clicks: 120 },
      { time: '16:00', clicks: 95 },
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
  };

  const geoData = [
    { country: 'United States', clicks: 2450, percentage: '35%' },
    { country: 'United Kingdom', clicks: 1230, percentage: '18%' },
    { country: 'Germany', clicks: 840, percentage: '12%' },
    { country: 'France', clicks: 720, percentage: '10%' },
    { country: 'Canada', clicks: 650, percentage: '9%' },
    { country: 'Others', clicks: 1110, percentage: '16%' }
  ];

  const deviceData = [
    { category: 'Mobile', type: 'Android', clicks: 1850, icon: Smartphone },
    { category: 'Mobile', type: 'iOS', clicks: 1620, icon: Smartphone },
    { category: 'Desktop', type: 'Windows', clicks: 2340, icon: Monitor },
    { category: 'Desktop', type: 'macOS', clicks: 1450, icon: Monitor },
    { category: 'Tablet', type: 'iPad', clicks: 580, icon: Tablet },
    { category: 'Tablet', type: 'Android Tablet', clicks: 160, icon: Tablet }
  ];

  const browserData = [
    { name: 'Chrome', clicks: 3200 },
    { name: 'Safari', clicks: 2100 },
    { name: 'Firefox', clicks: 1400 },
    { name: 'Edge', clicks: 800 }
  ];

  const referrerData = [
    { source: 'Social Media', platform: 'Facebook', clicks: 1250, icon: Share2 },
    { source: 'Social Media', platform: 'Twitter', clicks: 980, icon: Share2 },
    { source: 'Social Media', platform: 'LinkedIn', clicks: 750, icon: Share2 },
    { source: 'Email', platform: 'Gmail', clicks: 890, icon: Mail },
    { source: 'Email', platform: 'Outlook', clicks: 560, icon: Mail },
    { source: 'Search', platform: 'Google', clicks: 1450, icon: Search },
    { source: 'Search', platform: 'Bing', clicks: 320, icon: Search },
    { source: 'Direct', platform: 'Direct Traffic', clicks: 680, icon: Globe }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">URL Analytics Dashboard</h1>
      
      {/* Click Tracking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Click Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clickData.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="weekly" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clickData.weekly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="monthly" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clickData.monthly}>
                  <CartesianGrid strokeDasharray="6 6" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Geographic Data Section */}
       
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geoData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{item.country}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{item.clicks} clicks</span>
                    <span className="text-sm font-medium">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device & Browser Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-6 w-6" />
              Device & Browser Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="devices">
              <TabsList>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="browsers">Browsers</TabsTrigger>
              </TabsList>
              <TabsContent value="devices">
                <div className="space-y-4">
                  {deviceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-5 w-5 text-gray-500" />
                        <div>
                          <span className="font-medium">{item.type}</span>
                          <span className="text-sm text-gray-500 ml-2">({item.category})</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{item.clicks} clicks</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="browsers" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={browserData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Referrer Sources Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-6 w-6" />
              Referrer Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {referrerData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="font-medium">{item.platform}</span>
                      <span className="text-sm text-gray-500 block">{item.source}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{item.clicks} clicks</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;