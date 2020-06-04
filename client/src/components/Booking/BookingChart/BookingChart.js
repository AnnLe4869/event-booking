import React from "react";
import { Bar as BarChart } from "react-chartjs-2";

const BOOKINGS_BUCKETS = {
  cheap: { min: 0, max: 100 },
  normal: { min: 100, max: 200 },
  expensive: { min: 200, max: 100000 },
};

export default function BookingChart({ bookings }) {
  let values = [];
  const chartData = { labels: [], datasets: [] };
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = bookings.reduce(
      (accumulator, currentItem) => {
        if (
          currentItem.event.price < BOOKINGS_BUCKETS[bucket]["max"] &&
          currentItem.event.price >= BOOKINGS_BUCKETS[bucket]["min"]
        ) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      },
      0
    );
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: bucket,
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <BarChart
        data={chartData}
        width={100}
        height={400}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
}
