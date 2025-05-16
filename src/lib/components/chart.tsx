"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/lib/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/lib/components/ui/chart"

type ChartUIProps = {
	title: string;
	description?: string;
	chartData: any[];
	chartConfig: ChartConfig;
	xAxisKey: string;
	xAxisFormatter?: (value: any) => any;
}
export function ChartUI({ title, description = "", chartData, chartConfig, xAxisKey, xAxisFormatter = (v) => v }: ChartUIProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-72">
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey={xAxisKey}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={xAxisFormatter}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						{Object.keys(chartConfig).map(conf => (
							<Line
								key={conf}
								dataKey={conf}
								type="monotone"
								stroke={`var(--color-${conf})`}
								strokeWidth={2}
								dot={false}
							/>
						))}
					</LineChart>
				</ChartContainer>
			</CardContent>
			{/* <CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							Showing total visitors for the last 6 months
						</div>
					</div>
				</div>
			</CardFooter> */}
		</Card>
	)
}
