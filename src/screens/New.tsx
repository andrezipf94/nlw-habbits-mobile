import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { api } from '../lib/axios';

const availableWeekdays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

export function New() {
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [title, setTitle] = useState('');

  function handleToggleWeekday(weekdayIndex: number) {
    if (weekdays.includes(weekdayIndex)) {
      setWeekdays((prevState) => prevState.filter((weekday) => weekday !== weekdayIndex));
      return;
    }
    setWeekdays((prevState) => [...prevState, weekdayIndex]);
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || weekdays.length === 0) {
        return Alert.alert('Novo Hábito', 'Informe o nome do hábito e selecione a periodicidade');
      }

      await api.post('habits', { title, weekdays });
      resetState();
      Alert.alert('Novo hábito', 'Hábito criado com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Ops', 'Não foi possível criar o novo hábito');
    }
  }

  function resetState() {
    setTitle('');
    setWeekdays([]);
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">Criar hábito</Text>

        <Text className="mt-6 text-white font-semibold text-base">Qual seu comprometimento?</Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">Qual a recorrência?</Text>

        {availableWeekdays.map((weekday, index) => (
          <Checkbox
            key={index}
            title={weekday}
            checked={weekdays.includes(index)}
            onPress={() => handleToggleWeekday(index)}
          />
        ))}

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />

          <Text className="text-semibold text-base text-white ml-2">Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
