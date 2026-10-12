import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HealthResponse = {
  application: string;
  api: string;
  database: { status: "connected" | "disconnected"; name?: string };
  environment: string;
  timestamp: string;
};

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export default function HomeScreen() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (!apiBaseUrl) throw new Error("Set EXPO_PUBLIC_API_BASE_URL in the mobile app environment.");
      const response = await fetch(`${apiBaseUrl}/api/health`, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`API returned HTTP ${response.status}.`);
      setHealth((await response.json()) as HealthResponse);
    } catch (cause) {
      setHealth(null);
      setError(cause instanceof Error ? cause.message : "Could not connect to the HARghAR API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void checkHealth()} tintColor="#387457" />}>
        <View style={styles.brandRow}><View style={styles.mark}><Text style={styles.markText}>H</Text></View><Text style={styles.brand}>HARghAR</Text></View>
        <Text style={styles.eyebrow}>BUSINESS OPERATIONS</Text>
        <Text style={styles.title}>Admin Mobile</Text>
        <Text style={styles.subtitle}>Your operations, wherever work takes you.</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}><Text style={styles.cardTitle}>Service health</Text><Pressable accessibilityRole="button" onPress={() => void checkHealth()} style={styles.refresh}><Text style={styles.refreshText}>Check status</Text></Pressable></View>
          {loading ? <View style={styles.loading}><ActivityIndicator color="#387457" /><Text style={styles.muted}>Connecting to HARghAR API…</Text></View> : error ? <View style={styles.errorBox}><Text style={styles.errorTitle}>API unavailable</Text><Text style={styles.errorText}>{error}</Text><Text style={styles.hint}>Confirm the API is running and your device URL is reachable.</Text></View> : <>
            <HealthRow label="Backend API" value="Connected" online />
            <HealthRow label="MongoDB" value={health?.database.status === "connected" ? `Connected${health.database.name ? ` · ${health.database.name}` : ""}` : "Disconnected"} online={health?.database.status === "connected"} />
            <HealthRow label="Environment" value={health?.environment ?? "Unknown"} />
            <Text style={styles.timestamp}>Last checked {health ? new Date(health.timestamp).toLocaleTimeString() : ""}</Text>
          </>}
        </View>
        <Text style={styles.footer}>Pull down to refresh · Phase 1 foundation</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function HealthRow({ label, value, online }: { label: string; value: string; online?: boolean }) {
  return <View style={styles.row}><View style={styles.labelWrap}><View style={[styles.dot, online ? styles.dotOnline : styles.dotOffline]} /><Text style={styles.rowLabel}>{label}</Text></View><Text style={styles.rowValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7f4" },
  container: { flexGrow: 1, padding: 25, paddingTop: 32 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 54 },
  mark: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#246b50" },
  markText: { color: "#fff", fontSize: 21, fontWeight: "800" },
  brand: { color: "#20352d", fontSize: 17, fontWeight: "800", letterSpacing: -0.5 },
  eyebrow: { color: "#508365", fontSize: 10, fontWeight: "800", letterSpacing: 1.7 },
  title: { marginTop: 11, color: "#20352d", fontSize: 38, fontWeight: "800", letterSpacing: -1.5 },
  subtitle: { marginTop: 10, color: "#718077", fontSize: 14, lineHeight: 21 },
  card: { marginTop: 37, padding: 19, borderWidth: 1, borderColor: "#e2e8e1", borderRadius: 15, backgroundColor: "#fff" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardTitle: { color: "#20352d", fontSize: 16, fontWeight: "700" },
  refresh: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: "#eff5f0" },
  refreshText: { color: "#315a43", fontSize: 11, fontWeight: "600" },
  row: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, borderTopWidth: 1, borderTopColor: "#edf0ed" },
  labelWrap: { flexDirection: "row", alignItems: "center", gap: 9 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOnline: { backgroundColor: "#3a9b68" },
  dotOffline: { backgroundColor: "#ce655a" },
  rowLabel: { color: "#34463b", fontSize: 12 },
  rowValue: { flexShrink: 1, color: "#718077", fontSize: 11, textAlign: "right" },
  timestamp: { marginTop: 8, color: "#89948c", fontSize: 10 },
  loading: { alignItems: "center", gap: 10, paddingVertical: 30 },
  muted: { color: "#718077", fontSize: 12 },
  errorBox: { paddingVertical: 14 },
  errorTitle: { color: "#b84e48", fontSize: 14, fontWeight: "700" },
  errorText: { marginTop: 8, color: "#6f4a48", fontSize: 12, lineHeight: 18 },
  hint: { marginTop: 9, color: "#858c86", fontSize: 11, lineHeight: 17 },
  footer: { marginTop: 24, color: "#89948c", fontSize: 10, textAlign: "center" },
});
