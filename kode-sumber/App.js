import { useEffect, useRef, useState } from "react";
import {
  Animated, Platform, Pressable, ScrollView, StatusBar as RNStatusBar,
  StyleSheet, Text, TextInput, View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AKTIVITAS, GENDER, TUJUAN, hitung, validasi } from "./src/gizi";

const C = {
  bg: "#FAF6EF", card: "#FFFFFF", ink: "#1E2A25", mute: "#7A857F", line: "#E6E0D3",
  hijau: "#1F4D3A", sage: "#DDE8DC", karbo: "#E9B44C", karboBg: "#FBF0D5",
  protein: "#D9694B", proteinBg: "#F9E2DA", error: "#B3412B",
};
const SERIF = Platform.select({ ios: "Georgia", default: "serif" });
const TOP = Platform.select({ ios: 60, default: (RNStatusBar.currentHeight || 24) + 16 });
const fmt = (n) => Math.round(n).toLocaleString("id-ID");

function Segmen({ opsi, nilai, onPilih }) {
  return (
    <View style={s.segmen}>
      {opsi.map((o) => (
        <Pressable key={o.id} onPress={() => onPilih(o.id)} style={[s.segItem, nilai === o.id && s.segOn]}>
          <Text style={[s.segTeks, nilai === o.id && s.segTeksOn]}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Field({ label, unit, value, onChange, error }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, error && { borderColor: C.error }]}>
        <TextInput
          style={s.input} value={value} keyboardType="number-pad" maxLength={3}
          onChangeText={(t) => onChange(t.replace(/[^0-9]/g, ""))}
          placeholder="0" placeholderTextColor={C.line}
        />
        <Text style={s.unit}>{unit}</Text>
      </View>
      <Text style={s.err}>{error || " "}</Text>
    </View>
  );
}

function Bar({ pct, color, bg }) {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: pct, duration: 800, useNativeDriver: false }).start();
  }, [pct]);
  return (
    <View style={[s.bar, { backgroundColor: bg }]}>
      <Animated.View
        style={{ height: "100%", borderRadius: 6, backgroundColor: color,
          width: w.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) }}
      />
    </View>
  );
}

function Makro({ nama, gram, pct, warna, bg }) {
  return (
    <View style={[s.makro, { backgroundColor: bg }]}>
      <Text style={s.makroNama}>{nama}</Text>
      <Text style={[s.makroAngka, { color: warna }]}>{fmt(gram)}<Text style={s.makroSatuan}> g</Text></Text>
      <Bar pct={pct} color={warna} bg={C.card} />
      <Text style={s.makroCatatan}>{fmt(pct)}% kalori</Text>
      <Text style={s.makroCatatan}>sekitar {fmt(gram / 3)} g per makan</Text>
    </View>
  );
}

function Hasil({ f, onUlang }) {
  const h = hitung(f);
  const goal = TUJUAN.find((g) => g.id === f.tujuan);
  const selisih = Math.round(Number(f.berat) - h.ideal);
  const posisi = selisih > 1 ? `${selisih} kg di atas ideal` : selisih < -1 ? `${-selisih} kg di bawah ideal` : "Sudah dekat dengan ideal";
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start(); }, []);
  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }}>
      <View style={s.hero}>
        <Text style={s.heroLabel}>Kebutuhan energi harian · {goal.label.toLowerCase()}</Text>
        <Text style={s.heroAngka}>{fmt(h.kalori)}<Text style={s.heroSatuan}> kkal</Text></Text>
        {h.dibatasi && <Text style={s.heroCatatan}>Target dinaikkan ke batas aman minimal agar asupan tidak terlalu rendah.</Text>}
      </View>

      <View style={s.makroRow}>
        <Makro nama="Karbohidrat" gram={h.karboG} pct={h.karboPct} warna="#B7791F" bg={C.karboBg} />
        <Makro nama="Protein" gram={h.proteinG} pct={h.proteinPct} warna={C.protein} bg={C.proteinBg} />
      </View>

      <View style={s.kartu}>
        <Text style={s.kartuJudul}>Berat badan ideal</Text>
        <Text style={s.idealAngka}>{fmt(h.ideal)} kg</Text>
        <Text style={s.kartuIsi}>Rentang sehat {fmt(h.minSehat)}-{fmt(h.maxSehat)} kg. Berat Anda sekarang {f.berat} kg ({posisi}).</Text>
        {selisih > 3 && f.tujuan === "naik" && (
          <Text style={[s.kartuIsi, { color: C.error, marginTop: 8 }]}>Berat Anda sudah di atas ideal. Pertimbangkan tujuan Jaga atau Turunkan.</Text>
        )}
        <Text style={[s.kartuIsi, { marginTop: 8 }]}>Lemak sekitar {fmt(h.lemakG)} g per hari melengkapi sisa kalori.</Text>
      </View>

      <Text style={s.disclaimer}>
        Ini perkiraan umum untuk orang dewasa sehat, bukan saran medis. Untuk kondisi khusus (hamil, menyusui, penyakit kronis), konsultasikan dengan ahli gizi atau dokter.
      </Text>
      <Pressable style={s.tombolSekunder} onPress={onUlang}>
        <Text style={s.tombolSekunderTeks}>Ubah data</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function App() {
  const [f, setF] = useState({ gender: "L", usia: "", tinggi: "", berat: "", aktivitas: "sedang", tujuan: "jaga" });
  const [coba, setCoba] = useState(false);
  const [hasil, setHasil] = useState(false);
  const scroll = useRef(null);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const err = validasi(f);
  const siap = Object.keys(err).length === 0;
  const kirim = () => {
    if (!siap) return setCoba(true);
    setHasil(true);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <View style={s.layar}>
      <StatusBar style="dark" />
      <ScrollView ref={scroll} contentContainerStyle={s.isi} keyboardShouldPersistTaps="handled">
        <Text style={s.merek}>GIZI SEIMBANG</Text>
        <Text style={s.judul}>{hasil ? "Kebutuhan gizi Anda hari ini" : "Berapa gizi yang tubuhmu butuhkan?"}</Text>

        {hasil ? (
          <Hasil f={f} onUlang={() => setHasil(false)} />
        ) : (
          <>
            <Text style={s.sub}>Isi data singkat ini. Kami hitung karbohidrat dan protein harian untuk menuju berat badan ideal.</Text>
            <View style={s.kartu}>
              <Text style={s.label}>Jenis kelamin</Text>
              <Segmen opsi={GENDER} nilai={f.gender} onPilih={set("gender")} />
              <View style={s.baris}>
                <Field label="Usia" unit="th" value={f.usia} onChange={set("usia")} error={coba && err.usia} />
                <Field label="Tinggi" unit="cm" value={f.tinggi} onChange={set("tinggi")} error={coba && err.tinggi} />
                <Field label="Berat" unit="kg" value={f.berat} onChange={set("berat")} error={coba && err.berat} />
              </View>
            </View>

            <View style={s.kartu}>
              <Text style={s.label}>Aktivitas harian</Text>
              {AKTIVITAS.map((a) => (
                <Pressable key={a.id} onPress={() => set("aktivitas")(a.id)} style={[s.opsi, f.aktivitas === a.id && s.opsiOn]}>
                  <View style={[s.radio, f.aktivitas === a.id && s.radioOn]} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.opsiJudul}>{a.label}</Text>
                    <Text style={s.opsiHint}>{a.hint}</Text>
                  </View>
                </Pressable>
              ))}
              <Text style={[s.label, { marginTop: 16 }]}>Tujuan</Text>
              <Segmen opsi={TUJUAN} nilai={f.tujuan} onPilih={set("tujuan")} />
            </View>

            <Pressable style={[s.tombol, !siap && s.tombolMati]} onPress={kirim}>
              <Text style={s.tombolTeks}>Hitung kebutuhan saya</Text>
            </Pressable>
            {coba && !siap && <Text style={[s.err, { textAlign: "center", marginTop: 8 }]}>Lengkapi data yang bertanda merah.</Text>}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: C.bg },
  isi: { paddingTop: TOP, paddingHorizontal: 20, paddingBottom: 48 },
  merek: { fontSize: 12, letterSpacing: 3, color: C.hijau, fontWeight: "700" },
  judul: { fontFamily: SERIF, fontSize: 30, lineHeight: 36, color: C.ink, marginTop: 8 },
  sub: { fontSize: 15, lineHeight: 22, color: C.mute, marginTop: 10, marginBottom: 20 },
  kartu: { backgroundColor: C.card, borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: C.line },
  kartuJudul: { fontSize: 13, color: C.mute, fontWeight: "600" },
  kartuIsi: { fontSize: 14, lineHeight: 21, color: C.ink, marginTop: 4 },
  label: { fontSize: 13, color: C.mute, fontWeight: "600", marginBottom: 8 },
  baris: { flexDirection: "row", gap: 10, marginTop: 16 },
  segmen: { flexDirection: "row", backgroundColor: C.sage, borderRadius: 14, padding: 4 },
  segItem: { flex: 1, paddingVertical: 11, borderRadius: 11, alignItems: "center" },
  segOn: { backgroundColor: C.hijau },
  segTeks: { fontSize: 14, color: C.hijau, fontWeight: "600" },
  segTeksOn: { color: "#FFFFFF" },
  inputWrap: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: C.line, borderRadius: 14, paddingHorizontal: 12, backgroundColor: C.bg },
  input: { flex: 1, fontSize: 22, fontFamily: SERIF, color: C.ink, paddingVertical: 12 },
  unit: { fontSize: 13, color: C.mute },
  err: { fontSize: 12, color: C.error, marginTop: 4 },
  opsi: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: "transparent", marginBottom: 6 },
  opsiOn: { backgroundColor: C.sage, borderColor: C.hijau },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.mute, marginRight: 12 },
  radioOn: { borderColor: C.hijau, backgroundColor: C.hijau },
  opsiJudul: { fontSize: 15, fontWeight: "600", color: C.ink },
  opsiHint: { fontSize: 12, color: C.mute, marginTop: 1 },
  tombol: { backgroundColor: C.hijau, borderRadius: 18, paddingVertical: 17, alignItems: "center", marginTop: 6 },
  tombolMati: { backgroundColor: "#8FA89B" },
  tombolTeks: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  tombolSekunder: { borderWidth: 1.5, borderColor: C.hijau, borderRadius: 18, paddingVertical: 15, alignItems: "center", marginTop: 16 },
  tombolSekunderTeks: { color: C.hijau, fontSize: 15, fontWeight: "700" },
  hero: { backgroundColor: C.hijau, borderRadius: 24, padding: 22, marginTop: 20, marginBottom: 14 },
  heroLabel: { color: "#BFD6C8", fontSize: 13, fontWeight: "600" },
  heroAngka: { color: "#FAF6EF", fontFamily: SERIF, fontSize: 54, marginTop: 6 },
  heroSatuan: { fontSize: 20 },
  heroCatatan: { color: "#BFD6C8", fontSize: 12, lineHeight: 18, marginTop: 8 },
  makroRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  makro: { flex: 1, borderRadius: 20, padding: 16 },
  makroNama: { fontSize: 13, fontWeight: "700", color: C.ink },
  makroAngka: { fontFamily: SERIF, fontSize: 38, marginVertical: 6 },
  makroSatuan: { fontSize: 16 },
  makroCatatan: { fontSize: 12, color: C.ink, marginTop: 6, opacity: 0.75 },
  bar: { height: 8, borderRadius: 6, overflow: "hidden" },
  idealAngka: { fontFamily: SERIF, fontSize: 34, color: C.hijau, marginTop: 4 },
  disclaimer: { fontSize: 12, lineHeight: 18, color: C.mute, marginTop: 4 },
});
