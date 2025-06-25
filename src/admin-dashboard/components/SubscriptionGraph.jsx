import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaChartBar, FaUsers, FaDollarSign, FaChartLine } from "react-icons/fa";
import { Card, Select, Text, Group, Stack, Badge } from "@mantine/core";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const SubscriptionStatisticsDashboard = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const axios = useAxiosPrivate();

  const fetchSubscriptionStatistics = () => {
    return axios.get(
      `/client-subscriptions/subscription-graph?timeframe=${timeFrame}`
    );
  };

  const { data: statisticsData, isLoading, error } = useQuery({
    queryKey: [`subscriptionStatistics-${timeFrame}`, timeFrame],
    queryFn: fetchSubscriptionStatistics,
    keepPreviousData: true,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">Error loading statistics</Text>;

  const { clientRegistration = [], subscriptions = [], conversionRate = {} } =
    statisticsData?.data || {};

  return (
    <div className="p-4 bg-gray-100">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group position="" mb="md">
          <Text weight={600} size="xl">
            Subscription Analytics
          </Text>
          <Select
            value={timeFrame}
            onChange={setTimeFrame}
            data={[
              { value: "daily", label: "Daily" },
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly" },
            ]}
          />
        </Group>

        <Stack spacing="md">
          {/* Conversion Rate Overview */}
          <Card withBorder radius="md" p="md">
            <Group position="apart">
              <Group>
                <FaChartLine size={24} />
                <Text weight={600}>Conversion Rate</Text>
              </Group>
            </Group>
            <Group mt="md" spacing="xl">
              <Stack spacing={4}>
                <Text size="sm" color="dimmed">
                  Total Clients
                </Text>
                <Text weight={600}>{conversionRate.totalClients}</Text>
              </Stack>
              <Stack spacing={4}>
                <Text size="sm" color="dimmed">
                  Active Subscriptions
                </Text>
                <Text weight={600}>{conversionRate.activeSubscriptions}</Text>
              </Stack>
              <Stack spacing={4}>
                <Text size="sm" color="dimmed">
                  Conversion Rate
                </Text>
                <Badge
                  color={
                    conversionRate.conversionPercentage > 50
                      ? "green"
                      : conversionRate.conversionPercentage > 25
                      ? "yellow"
                      : "red"
                  }
                >
                  {conversionRate.conversionPercentage?.toFixed(2)}%
                </Badge>{" "}
              </Stack>
            </Group>
          </Card>

          {/* Client Registration Chart */}
          <Card withBorder radius="md" p="md">
            <Group mb="md">
              <FaUsers size={24} />
              <Text weight={600}>Client Registrations</Text>
            </Group>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientRegistration}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalClients" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Subscription Revenue Chart */}
          <Card withBorder radius="md" p="md">
            <Group mb="md">
              <FaDollarSign size={24} />
              <Text weight={600}>Subscription Revenue</Text>
            </Group>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscriptions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#8884d8" />
                <Bar dataKey="totalSubscriptions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Stack>
      </Card>
    </div>
  );
};

export default SubscriptionStatisticsDashboard;
