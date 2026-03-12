import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const cards = [
  { title: 'Daily Plan', subtitle: 'Planiraj dan uz AI prioritizaciju' },
  { title: 'Goals', subtitle: 'Prati ciljeve i napredak' },
  { title: 'Habits', subtitle: 'Gradi navike i streak-ove' },
  { title: 'AI Coach', subtitle: 'Traži dnevni savet i pregled' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1020' }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ gap: 8, marginTop: 10 }}>
          <Text style={{ color: 'white', fontSize: 14, opacity: 0.75 }}>LifePilot AI Mobile</Text>
          <Text style={{ color: 'white', fontSize: 32, fontWeight: '700' }}>Tvoj AI life manager u džepu</Text>
          <Text style={{ color: '#b9c0d4', fontSize: 16, lineHeight: 24 }}>
            Mobilni starter za planiranje, navike, ciljeve i AI coaching.
          </Text>
        </View>

        <View style={{ backgroundColor: '#151c33', borderRadius: 24, padding: 18, gap: 8 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Današnji AI brief</Text>
          <Text style={{ color: '#c9d1e7', lineHeight: 22 }}>
            Fokus stavi na 1 važan zadatak, 1 kratku rutinu i 1 stvar koja smanjuje stres.
          </Text>
        </View>

        {cards.map((card) => (
          <View key={card.title} style={{ backgroundColor: 'white', borderRadius: 22, padding: 18, gap: 6 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>{card.title}</Text>
            <Text style={{ color: '#4b5563', lineHeight: 22 }}>{card.subtitle}</Text>
          </View>
        ))}

        <Pressable
          style={{
            backgroundColor: '#3b82f6',
            paddingVertical: 16,
            borderRadius: 18,
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Poveži sa web aplikacijom</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
