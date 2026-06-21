import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BLUE = '#2563EB';

export default function ScanScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<'ready' | 'scanning' | 'done'>('ready');
  const scanAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'scanning') {
      // Scan line animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
        ])
      ).start();
      // Glow pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      scanAnim.stopAnimation();
      glowAnim.stopAnimation();
    }
  }, [phase]);

  const startScan = () => {
    setPhase('scanning');
    setTimeout(() => {
      setPhase('done');
      setTimeout(() => router.push('/scan/result'), 500);
    }, 3000);
  };

  const scanLineY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 180] });
  const borderColor = glowAnim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.35)', '#3B82F6'] });

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>AI Skin Analysis</Text>
          <TouchableOpacity style={styles.closeBtn}>
            <Ionicons name="camera-reverse-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Camera Frame */}
        <View style={styles.frameWrap}>
          <Animated.View style={[styles.frame, { borderColor }]}>
            {/* Corner Dots */}
            {[styles.dotTL, styles.dotTR, styles.dotBL, styles.dotBR].map((dotStyle, i) => (
              <Animated.View key={i} style={[styles.dot, dotStyle, { backgroundColor: phase === 'scanning' ? '#3B82F6' : 'rgba(255,255,255,0.7)' }]} />
            ))}

            {/* Face Oval */}
            <View style={styles.oval} />

            {/* Scan Line */}
            {phase === 'scanning' && (
              <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]} />
            )}

            {/* Center instruction */}
            <View style={styles.overlayText}>
              <Text style={styles.overlayLabel}>
                {phase === 'ready' && 'Position your face'}
                {phase === 'scanning' && 'Hold still…'}
                {phase === 'done' && '✓ Done!'}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Tips */}
        {phase === 'ready' && (
          <View style={styles.tips}>
            {['Good lighting', 'Face forward', 'No glasses'].map(t => (
              <View key={t} style={styles.tipCard}>
                <Text style={styles.tipText}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Scanning dots */}
        {phase === 'scanning' && (
          <View style={styles.dots}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.dot2, { opacity: 0.4 + i * 0.3 }]} />
            ))}
          </View>
        )}

        {/* CTA */}
        <View style={styles.cta}>
          {phase === 'ready' && (
            <TouchableOpacity style={styles.startBtn} onPress={startScan}>
              <Ionicons name="flash" size={20} color="#fff" />
              <Text style={styles.startBtnText}>Start Analysis</Text>
            </TouchableOpacity>
          )}
          {phase === 'scanning' && (
            <Text style={styles.scanningHint}>Analyzing your skin…</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1526' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontWeight: '600', fontSize: 16 },
  frameWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  frame: { width: '100%', aspectRatio: 0.75, borderRadius: 28, borderWidth: 2, backgroundColor: '#111827', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  oval: { width: 200, height: 260, borderRadius: 100, borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)', position: 'absolute' },
  dot: { position: 'absolute', width: 14, height: 14, borderRadius: 7 },
  dotTL: { top: 12, left: 12 },
  dotTR: { top: 12, right: 12 },
  dotBL: { bottom: 12, left: 12 },
  dotBR: { bottom: 12, right: 12 },
  scanLine: { position: 'absolute', left: 30, right: 30, height: 2, borderRadius: 1, backgroundColor: '#3B82F6', top: 60 },
  overlayText: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  overlayLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  tips: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  tipCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  tipText: { color: 'rgba(255,255,255,0.70)', fontSize: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' },
  cta: { paddingHorizontal: 20, paddingBottom: 20 },
  startBtn: { backgroundColor: BLUE, borderRadius: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: BLUE, shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  scanningHint: { color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center', paddingVertical: 16 },
});
