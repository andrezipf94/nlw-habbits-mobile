import { View, Text, ScrollView } from "react-native";

import { getAllYearDaysUntilNow } from "../utils/get-all-year-days-until-now";

import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";

const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const daysFromYearStart = getAllYearDaysUntilNow();
const minimumSummaryDays = 18 * 5;
const amountOfDaysToFill = minimumSummaryDays - daysFromYearStart.length;

export function Home() {
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekdays.map((weekday, index) => (
                        <Text
                            key={`${weekday}-${index}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={ { width: DAY_SIZE } }
                        >
                            { weekday }
                        </Text>
                    ))   
                }
            </View>
            
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={ { paddingBottom: 100 } }
            >
                <View className="flex-row flex-wrap">
                    {
                        daysFromYearStart.map(date => (
                            <HabitDay
                                key={date.toISOString()}
                            />
                        ))
                    }
                    {
                        amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                            <View
                                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                style={ { width: DAY_SIZE, height: DAY_SIZE } }
                                key={index}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    );
}