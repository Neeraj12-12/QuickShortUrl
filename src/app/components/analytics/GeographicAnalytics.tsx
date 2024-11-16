import React from 'react';
import { MapPin } from 'lucide-react';
import WorldMap from './WorldMap';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

const GeographicAnalytics: React.FC = () => {
  const geoData = [
    { country: 'United States', clicks: 2450, percentage: 35 },
    { country: 'United Kingdom', clicks: 1230, percentage: 18 },
    { country: 'Germany', clicks: 840, percentage: 12 },
    { country: 'France', clicks: 720, percentage: 10 },
    { country: 'Canada', clicks: 650, percentage: 9 },
    { country: 'Others', clicks: 1110, percentage: 16 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Geographic Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Interactive World Map with highlighted regions */}
        <WorldMap data={geoData} />

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#4338ca]"></div>
            <span className="text-sm">{'> 30%'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#818cf8]"></div>
            <span className="text-sm">15-30%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#93c5fd]"></div>
            <span className="text-sm">10-15%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#bfdbfe]"></div>
            <span className="text-sm">{'< 10%'}</span>
          </div>
        </div>

        {/* Country List */}
        <div className="space-y-4">
          {geoData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{item.country}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{item.clicks} clicks</span>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicAnalytics;
