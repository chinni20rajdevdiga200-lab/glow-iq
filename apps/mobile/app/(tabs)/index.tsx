import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const BLUE = '#2563EB';
const BLUE_M = '#3B82F6';
const BLUE_LT = '#EFF4FF';
const TEXT = '#0D1526';
const SUB = 'rgba(13,21,38,0.58)';
const BG = '#F7F9FF';

const METRICS = [
  { label: 'Hydration', value: 62, icon: 'water-outline' },
  { label: 'Barrier', value: 74, icon: 'shield-outline' },
  { label: 'UV Guard', value: 45, icon: 'sunny-outline' },
] as const;

const PRODUCTS = [
  { id: 1, name: 'Gentle Foaming Cleanser', brand: 'CeraVe', price: '$14.99', rating: 4.8, match: 96, emoji: '🧴', safe: true },
  { id: 2, name: 'Hyaluronic Acid Serum', brand: 'The Ordinary', price: '$8.90', rating: 4.9, match: 94, emoji: '💧', safe: true },
  { id: 3, name: 'Moisturizing Cream SPF30', brand: 'La Roche-Posay', price: '$19.99', rating: 4.7, match: 91, emoji: '☀️', safe: true },
];

const CIRCUMFERENCE = 2 * Math.PI * 36;

export default function HomeScreen() {
  const router = useRouter();
  const score = 78;
  const dash = CIRCUMFERENCE * (score / 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Sarah ✨</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={BLUE} />
              <View style={styles.badge} />
            </TouchableOpacity>
            <View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={SUB} style={{ marginRight: 8 }} />
          <TextInput placeholder="Search products, ingredients..." placeholderTextColor={SUB}
            style={styles.searchInput} />
        </View>

        {/* Skin Score Hero */}
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroLabel}>Your Skin Score</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
              <Text style={styles.heroScore}>{score}</Text>
              <Text style={styles.heroSub}>/100</Text>
            </View>
            <Text style={styles.heroCaption}>Good — keep it up! 🌟</Text>
          </View>
          <Svg width={96} height={96} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={48} cy={48} r={36} stroke="rgba(255,255,255,0.15)" strokeWidth={8} fill="none" />
            <Circle cx={48} cy={48} r={36} stroke="white" strokeWidth={8} fill="none"
              strokeDasharray={`${dash} ${CIRCUMFERENCE}`} strokeLinecap="round" />
          </Svg>
        </View>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          {METRICS.map(m => (
            <View key={m.label} style={styles.metricCard}>
              <Ionicons name={m.icon} size={18} color="rgba(255,255,255,0.85)" />
              <Text style={styles.metricValue}>{m.value}%</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { marginHorizontal: 20, marginBottom: 12 }]}>Quick Actions</Text>
        <View style={styles.quickRow}>
          {[
            { label: 'Skin Scan', icon: 'camera-outline', route: '/scan' },
            { label: 'Product Scan', icon: 'barcode-outline', route: '/products/scan' },
            { label: 'Wishlist', icon: 'bookmark-outline', route: '/saved' },
          ].map(a => (
            <TouchableOpacity key={a.label} style={styles.quickCard} onPress={() => router.push(a.route as any)}>
              <View style={styles.quickIcon}>
                <Ionicons name={a.icon as any} size={22} color={BLUE} />
              </View>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top Products */}
        <View style={[styles.row, { marginHorizontal: 20, marginTop: 24, marginBottom: 12 }]}>
          <Text style={styles.sectionTitle}>Top Matches For You</Text>
          <TouchableOpacity onPress={() => router.push('/shop')}>
            <Text style={{ color: BLUE, fontSize: 13, fontWeight: '600' }}>See all</Text>
          </TouchableOpacity>
        </View>
        {PRODUCTS.map(p => (
          <TouchableOpacity key={p.id} style={styles.productCard}
            onPress={() => router.push('/products/analysis')}>
            <View style={styles.productEmoji}><Text style={{ fontSize: 28 }}>{p.emoji}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productBrand}>{p.brand}</Text>
              <View style={styles.row}>
                <Ionicons name="star" size={12} color="#FBBF24" />
                <Text style={styles.ratingText}>{p.rating}</Text>
                <View style={styles.matchBadge}><Text style={styles.matchText}>{p.match}% match</Text></View>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={styles.price}>{p.price}</Text>
              <View style={styles.safeBadge}><Text style={styles.safeText}>Safe</Text></View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, marginBottom: 16 },
  greeting: { fontSize: 13, color: SUB },
  name: { fontSize: 26, fontWeight: '700', color: TEXT, marginTop: 2 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(37,99,235,0.10)' },
  searchInput: { flex: 1, fontSize: 14, color: TEXT },
  hero: { marginHorizontal: 20, borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: BLUE, marginBottom: 0 },
  heroLabel: { color: 'rgba(255,255,255,0.80)', fontSize: 13, marginBottom: 4 },
  heroScore: { fontSize: 52, fontWeight: '800', color: '#fff' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.60)', paddingBottom: 8 },
  heroCaption: { color: 'rgba(255,255,255,0.80)', fontSize: 13, marginTop: 4 },
  metricsRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: '#1D4ED8', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingHorizontal: 8, paddingBottom: 16, paddingTop: 12, gap: 6 },
  metricCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 12, alignItems: 'center', gap: 4 },
  metricValue: { color: '#fff', fontWeight: '700', fontSize: 18 },
  metricLabel: { color: 'rgba(255,255,255,0.70)', fontSize: 10 },
  quickRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 4 },
  quickCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(37,99,235,0.10)', elevation: 2, shadowColor: BLUE, shadowOpacity: 0.06, shadowRadius: 8 },
  quickIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: BLUE_LT, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11, fontWeight: '600', color: TEXT, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: TEXT },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, padding: 14, marginBottom: 10, gap: 12, borderWidth: 1, borderColor: 'rgba(37,99,235,0.08)', elevation: 2, shadowColor: BLUE, shadowOpacity: 0.06, shadowRadius: 8 },
  productEmoji: { width: 56, height: 56, borderRadius: 16, backgroundColor: BLUE_LT, alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 2 },
  productBrand: { fontSize: 11, color: SUB, marginBottom: 6 },
  ratingText: { fontSize: 11, fontWeight: '600', color: TEXT },
  matchBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  matchText: { fontSize: 10, color: BLUE, fontWeight: '600' },
  price: { fontSize: 14, fontWeight: '700', color: TEXT },
  safeBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  safeText: { fontSize: 10, color: '#16A34A', fontWeight: '600' },
});
