import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import geoUrl from 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

// Define the type for your data items
interface DataItem {
  country: string;
  clicks: number;
  percentage: number;
}

// Define component props
interface WorldMapProps {
  data: DataItem[];
}

// Create a color scale for map coloring
const colorScale = scaleQuantize<string>()
  .domain([0, 35])  // Assumes percentages go up to 35
  .range(["#bfdbfe", "#93c5fd", "#818cf8", "#4338ca"]);  // Color scale

const WorldMap: React.FC<WorldMapProps> = ({ data }) => {
  // Create a lookup map to easily find the percentage by country name
  const countryPercentageMap = data.reduce((map, item) => {
    map[item.country] = item.percentage;
    return map;
  }, {} as Record<string, number>);

  return (
    <ComposableMap projection="geoMercator" width={800} height={400}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const countryName = geo.properties.name;
            const percentage = countryPercentageMap[countryName] || 0;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={colorScale(percentage)}
                stroke="#fff"
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', opacity: 0.8 },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default WorldMap;
