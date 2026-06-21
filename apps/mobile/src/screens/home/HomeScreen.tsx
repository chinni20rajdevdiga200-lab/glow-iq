import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "react-native-linear-gradient";
import { Camera, Package, Sparkles, TrendingUp, ChevronRight, Star } from "lucide-react-native";

const { width } = Dimensions.get("window");

const GOLD = "#D4AF37";
const DARK = "#0F0F0F";
const CREAM = "#F8F4EC";
const BLUSH = "#E8B4B8";

const quickActions = [
  { label: "AI Scanner", icon: Camera, route: "Scan", color: GOLD, bg: "#FDF8E7" },
  { label: "Products", icon: Package, route: "Products", color: BLUSH, bg: "#FDF4F5" },
  { label: "Routine", icon: Sparkles, route: "Routine", color: "#10B981", bg: "#F0FDF4" },
  { label: "Progress", icon: TrendingUp, route: "Tracker", color: "#8B5CF6", bg: "#F5F3FF" },
];

export default function HomeScreen() {
  const navigation = useNavigation<never>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={CREAM} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning ✨</Text>
            <Text style={styles.name}>Hello, Beauty!</Text>
          </View>
          <View style={styles.scoreChip}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>87</Text>
          </View>
        </Animated.View>

        {/* Hero Scan Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.heroCard}>
          <LinearGradient colors={[DARK, "#1A1A2E"]} style={styles.heroBg}>
            <View style={styles.heroBadge}>
              <View style={styles.dot} />
              <Text style={styles.heroBadgeText}>AI Powered</Text>
            </View>
            <Text style={styles.heroTitle}>Scan Your{"\n"}Skin Now</Text>
            <Text style={styles.heroDesc}>Get beauty score, detect concerns, personalized advice.</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Scan" as never)}
              style={styles.heroCta}
            >
              <LinearGradient colors={[GOLD, "#F5E089"]} style={styles.heroCtaGrad}>
                <Camera size={18} color="#fff" />
                <Text style={styles.heroCtaText}>Start Analysis</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, i) => (
              <Animated.View
                key={action.label}
                entering={FadeInRight.delay(350 + i * 80).duration(500)}
                style={styles.actionWrapper}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate(action.route as never)}
                  style={[styles.actionCard, { backgroundColor: action.bg }]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + "20" }]}>
                    <action.icon size={22} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Scan */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scan</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Scan" as never)}>
              <Text style={styles.seeAll}>New Scan</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.recentCard} activeOpacity={0.85}>
            <View>
              <Text style={styles.recentDate}>Today · 2:30 PM</Text>
              <Text style={styles.recentSkin}>Medium Warm Tone</Text>
              <View style={styles.tagRow}>
                {["Mild Acne", "Dryness"].map((t) => (
                  <View key={t} style={styles.tag}>
                    <Text style={styles.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.recentScore}>
              <Text style={styles.recentScoreNum}>87</Text>
              <Text style={styles.recentScoreLabel}>Score</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Top Products */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Picks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topProducts.map((p, i) => (
              <TouchableOpacity key={p.id} style={styles.productCard} activeOpacity={0.85}>
                <View style={styles.productEmoji}>
                  <Text style={{ fontSize: 28 }}>{p.emoji}</Text>
                </View>
                <Text style={styles.productBrand}>{p.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                <View style={styles.productMeta}>
                  <Star size={12} color={GOLD} fill={GOLD} />
                  <Text style={styles.productRating}>{p.rating}</Text>
                  <Text style={styles.productSafe}>· {p.safe}% safe</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const topProducts = [
  { id: "1", emoji: "💧", brand: "The Ordinary", name: "Vitamin C 20% Serum", rating: 4.8, safe: 92 },
  { id: "2", emoji: "🫧", brand: "CeraVe", name: "Hydrating Cleanser", rating: 4.9, safe: 95 },
  { id: "3", emoji: "☀️", brand: "Kiehl's", name: "Daily SPF 50+ Defense", rating: 4.6, safe: 90 },
  { id: "4", emoji: "✨", brand: "FAB", name: "Ultra Repair Cream", rating: 4.7, safe: 88 },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM },
  scroll: { paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  greeting: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  name: { fontSize: 26, fontWeight: "700", color: DARK, marginTop: 2 },
  scoreChip: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, shadowColor: GOLD, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4, alignItems: "center" },
  scoreLabel: { fontSize: 10, color: "#6B7280", fontWeight: "600" },
  scoreValue: { fontSize: 22, fontWeight: "700", color: GOLD },
  heroCard: { borderRadius: 28, overflow: "hidden", marginBottom: 28, shadowColor: DARK, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  heroBg: { padding: 24, minHeight: 180 },
  heroBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(212,175,55,0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "flex-start", marginBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GOLD, marginRight: 6 },
  heroBadgeText: { fontSize: 11, color: GOLD, fontWeight: "700" },
  heroTitle: { fontSize: 28, fontWeight: "700", color: "#fff", lineHeight: 34, marginBottom: 8 },
  heroDesc: { fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 18 },
  heroCta: { borderRadius: 18, overflow: "hidden", alignSelf: "flex-start" },
  heroCtaGrad: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  heroCtaText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: DARK, marginBottom: 14 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  seeAll: { fontSize: 13, color: GOLD, fontWeight: "600" },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  actionWrapper: { width: (width - 52) / 2 },
  actionCard: { borderRadius: 22, padding: 18, shadowColor: DARK, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  actionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  actionLabel: { fontSize: 14, fontWeight: "600", color: DARK },
  recentCard: { backgroundColor: "#fff", borderRadius: 22, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28, shadowColor: GOLD, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 },
  recentDate: { fontSize: 11, color: "#6B7280", marginBottom: 4 },
  recentSkin: { fontSize: 16, fontWeight: "600", color: DARK, marginBottom: 8 },
  tagRow: { flexDirection: "row", gap: 6 },
  tag: { backgroundColor: GOLD + "15", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 11, color: GOLD, fontWeight: "600" },
  recentScore: { alignItems: "center" },
  recentScoreNum: { fontSize: 32, fontWeight: "700", color: GOLD },
  recentScoreLabel: { fontSize: 11, color: "#6B7280" },
  productCard: { backgroundColor: "#fff", borderRadius: 22, padding: 16, marginRight: 14, width: 160, shadowColor: DARK, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  productEmoji: { width: 52, height: 52, borderRadius: 16, backgroundColor: CREAM, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  productBrand: { fontSize: 10, color: GOLD, fontWeight: "700", marginBottom: 3 },
  productName: { fontSize: 13, fontWeight: "600", color: DARK, lineHeight: 17, marginBottom: 8 },
  productMeta: { flexDirection: "row", alignItems: "center", gap: 3 },
  productRating: { fontSize: 11, fontWeight: "600", color: DARK },
  productSafe: { fontSize: 11, color: "#10B981" },
  bottomSpacer: { height: 100 },
});
