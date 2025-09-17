"use client"

import * as React from "react"
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type RiskScoreChartProps = {
  score: number
  level: string
}

const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'low':
            return 'hsl(var(--chart-2))'; // Greenish
        case 'medium':
            return 'hsl(var(--chart-3))'; // Orange
        case 'high':
            return 'hsl(var(--chart-4))'; // Red
        default:
            return 'hsl(var(--muted))';
    }
}

export function RiskScoreChart({ score, level }: RiskScoreChartProps) {
  const chartData = [{ name: "score", value: score, fill: getRiskColor(level) }]
  
  const chartConfig = {
    score: {
      label: "Risk Score",
      color: getRiskColor(level),
    },
  }

  return (
    <Card className="flex flex-col items-center justify-center p-4 border-none shadow-none bg-transparent">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[250px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={-270}
          innerRadius="80%"
          outerRadius="100%"
          barSize={20}
        >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar
            dataKey="value"
            background={{ fill: "hsl(var(--muted))" }}
            cornerRadius={10}
          />
        </RadialBarChart>
      </ChartContainer>
      <div className="text-center -mt-24">
        <p className="text-5xl font-bold font-headline">{score}</p>
        <p className={cn("text-xl font-semibold", `text-[${getRiskColor(level)}]`)}
           style={{color: getRiskColor(level)}}
        >
            {level} Risk
        </p>
      </div>
    </Card>
  )
}
