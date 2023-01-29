import { View, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { api } from '../lib/axios';
import { getAllYearDaysUntilNow } from '../utils/get-all-year-days-until-now';

import { DAY_SIZE, HabitDay } from '../components/HabitDay';
import { Header } from '../components/Header';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const daysFromYearStart = getAllYearDaysUntilNow();
const minimumSummaryDays = 18 * 5;
const amountOfDaysToFill = minimumSummaryDays - daysFromYearStart.length;

type Summary = {
  id: string;
  date: string;
  available: number;
  completed: number;
}[];

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const { navigate } = useNavigation();

  async function fetchSummary() {
    try {
      setLoading(true);
      const { data: summary } = await api.get('summary');
      setSummary(summary);
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekdays.map((weekday, index) => (
          <Text
            key={`${weekday}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekday}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {daysFromYearStart.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, 'day');
              });
              return (
                <HabitDay
                  available={dayWithHabits?.available}
                  completed={dayWithHabits?.completed}
                  date={date}
                  key={date.toISOString()}
                  onPress={() => navigate('habit', { date: date.toISOString() })}
                />
              );
            })}
            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <View
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  key={index}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
