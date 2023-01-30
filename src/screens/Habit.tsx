import { useRoute } from '@react-navigation/native';
import { ScrollView, View, Text, Alert } from 'react-native';
import { BackButton } from '../components/BackButton';
import dayjs from 'dayjs';
import { ProgressBar } from '../components/ProgressBar';
import { Checkbox } from '../components/Checkbox';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { api } from '../lib/axios';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import { EmptyHabits } from '../components/EmptyHabits';
import clsx from 'clsx';

interface Params {
  date: string;
}

interface HabitsAtDay {
  available: {
    id: string;
    title: string;
  }[];
  completed: string[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [habitsAtDay, setHabitsAtDay] = useState<HabitsAtDay | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isPastDate = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitsProgressPercentage = habitsAtDay?.available.length
    ? generateProgressPercentage(habitsAtDay.available.length, completedHabits.length)
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);
      const { data: habitsAtDayData } = await api.get('day', {
        params: { date }
      });
      setHabitsAtDay(habitsAtDayData);
      setCompletedHabits(habitsAtDayData.completed);
    } catch (error) {
      console.error(error);
      Alert.alert('Ops', 'Não foi possível carregar as informações de hábitos');
    } finally {
      setLoading(false);
    }
  }

  async function handleHabitToggle(habitID: string) {
    try {
      await api.patch(`habits/${habitID}/toggle`);

      if (completedHabits.includes(habitID)) {
        setCompletedHabits((previousState) =>
          previousState.filter((completedHabitID) => completedHabitID !== habitID)
        );
      } else {
        setCompletedHabits((previousState) => [...previousState, habitID]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito.');
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">{dayOfWeek}</Text>

        <Text className="text-white font-extrabold text-3xl">{dayAndMonth}</Text>

        <ProgressBar progress={habitsProgressPercentage} />

        <View className={clsx('mt-6', { ['opacity-50']: isPastDate })}>
          {habitsAtDay?.available ? (
            habitsAtDay.available.map(({ id, title }) => (
              <Checkbox
                key={id}
                title={title}
                checked={completedHabits.includes(id)}
                onPress={() => handleHabitToggle(id)}
                disabled={isPastDate}
              />
            ))
          ) : (
            <EmptyHabits />
          )}
        </View>
        {isPastDate && (
          <Text className="text-white mt-10 text-center">
            Você não pode alterar hábitos de uma data passada.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
