import React from 'react';
import { Bar, BarChart, XAxis, Tooltip, Legend } from 'recharts';

// Composant Card
const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-lg">
    {children}
  </div>
);

// Composant CardHeader
const CardHeader = ({ children }) => (
  <div className="p-4 border-b border-gray-200">
    {children}
  </div>
);

// Composant CardTitle
const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">
    {children}
  </h2>
);

// Composant CardDescription
const CardDescription = ({ children }) => (
  <p className="text-gray-600">
    {children}
  </p>
);

// Composant CardContent
const CardContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

// Composant ChartContainer
const ChartContainer = ({ children, config }) => (
  <div className="relative">
    {React.cloneElement(children, { config })}
  </div>
);

// Composant ChartTooltipContent
const ChartTooltipContent = ({ payload, label, indicator }) => {
  if (!payload || payload.length === 0) return null;
  return (
    <div className="p-2 bg-white border border-gray-300 rounded shadow-lg">
      <p className="text-sm font-semibold">{label}</p>
      {payload.map((entry, index) => (
        <p key={`item-${index}`} className="text-sm text-gray-700">
          {indicator === "line" && <span style={{ color: entry.color }}>● </span>}
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

// Composant ChartTooltip
const ChartTooltip = ({ content, cursor, defaultIndex }) => (
  <Tooltip content={content} cursor={cursor} />
);

// Données pour le graphique
const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
];

// Configuration du graphique
const chartConfig = {
  running: {
    label: "Running",
    color: "hsl(var(--chart-1))",
  },
  swimming: {
    label: "Swimming",
    color: "hsl(var(--chart-2))",
  },
};


// Composant principal
export function MixedChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tooltip - Line Indicator</CardTitle>
        <CardDescription>Tooltip with line indicator.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={600} height={300} data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <Bar
              dataKey="running"
              stackId="a"
              fill={chartConfig.running.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill={chartConfig.swimming.color}
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" payload={undefined} label={undefined} />}
              cursor={false}
              defaultIndex={1}
            />
            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
