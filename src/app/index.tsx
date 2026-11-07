import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SaranMakanan from '@/components/saran-makanan';
import { AKTIVITAS, GENDER, TUJUAN, hitung, validasi, type Form } from '@/lib/gizi';
import { BAYANG, K, R } from '@/lib/warna';

const LOGO = require('../../assets/logo-gizi-seimbang-ikon.svg');
const fmt = (n: number) => Math.round(n).toLocaleString('id-ID');
const LEBAR_DESKTOP = 900;
const ANGKA = { fontVariant: ['tabular-nums' as const] };

type Opsi = { id: string; label: string };

function Pil({ opsi, nilai, onPilih }: { opsi: Opsi[]; nilai: string; onPilih: (id: string) => void }) {
  return (
    <View style={s.pilRow}>
      {opsi.map((o) => {
        const on = nilai === o.id;
        return (
          <Pressable
            key={o.id}
            onPress={() => onPilih(o.id)}
            style={({ pressed }) => [s.pil, s.klik, on && s.pilOn, pressed && s.tekan]}>
            <Text style={[s.pilTeks, on && s.pilTeksOn]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Isian(props: { label: string; unit: string; value: string; onChange: (v: string) => void; error?: string }) {
  const { label, unit, value, onChange, error } = props;
  return (
    <View style={{ flex: 1 }}>
      <View style={[s.isianKotak, error ? { borderColor: K.merah } : null]}>
        <Text style={s.kecil}>{label}</Text>
        <View style={s.isianBaris}>
          <TextInput
            style={s.isian}
            value={value}
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={(t) => onChange(t.replace(/[^0-9]/g, ''))}
            placeholder="0"
            placeholderTextColor={K.garis}
          />
          <Text style={s.satuan}>{unit}</Text>
        </View>
      </View>
      <Text style={s.galat}>{error ?? ' '}</Text>
    </View>
  );
}

// Kartu hasil: energi di kartu hijau, lalu makronutrien dan ringkasan di kartu putih. Tanpa data, nilainya "—".
function Hasil({ f }: { f: Form | null }) {
  const h = f ? hitung(f) : null;
  const goal = TUJUAN.find((g) => g.id === f?.tujuan) ?? TUJUAN[1];
  const v = (n?: number) => (n === undefined ? '—' : fmt(n));
  const lemakPct = h ? Math.max(0, 100 - h.karboPct - h.proteinPct) : 0;
  const selisih = h && f ? Math.round(Number(f.berat) - h.ideal) : 0;
  const posisi = selisih > 1 ? `${selisih} kg di atas ideal` : selisih < -1 ? `${-selisih} kg di bawah ideal` : 'dekat dengan ideal';
  const makro = [
    { nama: 'Karbohidrat', g: h?.karboG, pct: h?.karboPct, warna: K.emas },
    { nama: 'Protein', g: h?.proteinG, pct: h?.proteinPct, warna: K.hijau },
    { nama: 'Lemak', g: h?.lemakG, pct: lemakPct, warna: K.lemak },
  ];

  return (
    <View style={{ gap: 14 }}>
      <View style={s.hero}>
        <Text style={s.heroLabel}>Kebutuhan energi harian</Text>
        <View style={s.heroBaris}>
          <Text style={[s.heroAngka, ANGKA]}>{v(h?.kalori)}</Text>
          <Text style={s.heroSatuan}>kkal</Text>
        </View>
        <Text style={s.heroSub}>{h ? `Tujuan: ${goal.label.toLowerCase()} berat badan` : 'Isi data lalu tekan hitung'}</Text>
      </View>

      <View style={s.kartu}>
        <View style={s.bar}>
          {h ? makro.map((m) => <View key={m.nama} style={{ flex: m.pct ?? 0, backgroundColor: m.warna }} />) : null}
        </View>
        <View style={s.tileRow}>
          {makro.map((m) => (
            <View key={m.nama} style={s.tile}>
              <View style={[s.tileTitik, { backgroundColor: m.warna }]} />
              <Text style={s.tileNama} numberOfLines={1}>
                {m.nama}
              </Text>
              <Text style={[s.tileGram, ANGKA]}>{v(m.g)} g</Text>
              <Text style={[s.tilePct, ANGKA]}>{h ? `${fmt(m.pct ?? 0)}%` : '—'}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.kartu}>
        <View style={s.baris}>
          <Text style={s.barisNama}>Per makan (3 kali)</Text>
          <Text style={[s.barisNilai, ANGKA]}>
            Karbo {v(h ? h.karboG / 3 : undefined)} g · Protein {v(h ? h.proteinG / 3 : undefined)} g
          </Text>
        </View>
        <View style={[s.baris, s.pisah]}>
          <Text style={s.barisNama}>Berat badan ideal</Text>
          <Text style={[s.barisNilai, ANGKA]}>{v(h?.ideal)} kg</Text>
        </View>
        {h && f && (
          <Text style={s.catatan}>
            Rentang sehat {fmt(h.minSehat)}-{fmt(h.maxSehat)} kg. Berat Anda {f.berat} kg, {posisi}.
          </Text>
        )}
      </View>

      {h?.dibatasi && (
        <View style={s.peringatan}>
          <Text style={s.peringatanTeks}>Target dinaikkan ke batas aman minimal agar asupan tidak terlalu rendah.</Text>
        </View>
      )}
      {h && f && selisih > 3 && f.tujuan === 'naik' && (
        <View style={s.peringatan}>
          <Text style={s.peringatanTeks}>Berat Anda sudah di atas ideal. Pertimbangkan tujuan Jaga atau Turunkan.</Text>
        </View>
      )}

      <Text style={s.catatan}>
        Perkiraan umum untuk orang dewasa sehat, bukan saran medis. Untuk hamil, menyusui, atau penyakit kronis, tanyakan ke ahli gizi atau dokter.
      </Text>
    </View>
  );
}

export default function Beranda() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const lebar = width >= LEBAR_DESKTOP;
  const [f, setF] = useState<Form>({ gender: 'L', usia: '', tinggi: '', berat: '', aktivitas: 'sedang', tujuan: 'jaga' });
  const [coba, setCoba] = useState(false);
  const [hasil, setHasil] = useState<Form | null>(null);
  const scroll = useRef<ScrollView>(null);

  const set =
    <K2 extends keyof Form>(k: K2) =>
    (v: Form[K2]) =>
      setF((p) => ({ ...p, [k]: v }));
  const err = validasi(f);
  const siap = Object.keys(err).length === 0;
  const kirim = () => {
    if (!siap) return setCoba(true);
    setHasil({ ...f });
    if (!lebar) scroll.current?.scrollTo({ y: 0, animated: false });
  };

  const formulir = (
    <View style={lebar ? s.kolom : undefined}>
      <Text style={s.label}>Jenis kelamin</Text>
      <Pil opsi={GENDER} nilai={f.gender} onPilih={(id) => set('gender')(id as Form['gender'])} />

      <View style={s.tigaIsian}>
        <Isian label="Usia" unit="th" value={f.usia} onChange={set('usia')} error={coba ? err.usia : undefined} />
        <Isian label="Tinggi" unit="cm" value={f.tinggi} onChange={set('tinggi')} error={coba ? err.tinggi : undefined} />
        <Isian label="Berat" unit="kg" value={f.berat} onChange={set('berat')} error={coba ? err.berat : undefined} />
      </View>

      <Text style={[s.label, { marginTop: 10 }]}>Aktivitas harian</Text>
      <View style={s.daftar}>
        {AKTIVITAS.map((a) => {
          const on = f.aktivitas === a.id;
          return (
            <Pressable
              key={a.id}
              onPress={() => set('aktivitas')(a.id)}
              style={({ pressed }) => [s.aktivitas, s.klik, on && s.aktivitasOn, pressed && s.tekan]}>
              <View style={{ flex: 1 }}>
                <Text style={[s.aktivitasNama, on && { fontWeight: '800' }]}>{a.label}</Text>
                <Text style={s.aktivitasHint}>{a.hint}</Text>
              </View>
              <View style={[s.radio, on && s.radioOn]}>{on ? <View style={s.radioTitik} /> : null}</View>
            </Pressable>
          );
        })}
      </View>

      <Text style={s.label}>Tujuan</Text>
      <Pil opsi={TUJUAN} nilai={f.tujuan} onPilih={set('tujuan')} />

      <Pressable style={({ pressed }) => [s.tombol, s.klik, !siap && s.tombolMati, pressed && s.tekan]} onPress={kirim}>
        <Text style={s.tombolTeks}>{hasil && lebar ? 'Hitung ulang' : 'Hitung kebutuhan'}</Text>
        <View style={s.tombolPanah}>
          <Text style={s.tombolPanahTeks}>→</Text>
        </View>
      </Pressable>
      {coba && !siap && <Text style={[s.galat, { marginTop: 10 }]}>Lengkapi isian yang bergaris merah.</Text>}
    </View>
  );

  const baris1 = !lebar && hasil ? 'Target gizi' : 'Hitung kebutuhan';
  const baris2 = !lebar && hasil ? 'hari ini' : 'gizi harianmu';

  return (
    <View style={s.layar}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scroll}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: insets.top + (lebar ? 36 : 18),
          paddingBottom: insets.bottom + 56,
          paddingHorizontal: lebar ? 40 : 20,
        }}
        keyboardShouldPersistTaps="handled">
        <View style={{ width: '100%', maxWidth: lebar ? 1120 : 560 }}>
          <View style={s.merek}>
            <Image source={LOGO} style={s.logo} contentFit="contain" />
            <Text style={s.merekTeks}>Gizi Seimbang</Text>
          </View>
          <Text style={[s.judul, lebar && { fontSize: 48, lineHeight: 52 }]}>
            {baris1}
            {'\n'}
            <Text style={{ color: K.hijau }}>{baris2}</Text>
          </Text>

          {lebar ? (
            <>
              <View style={s.dua}>
                {formulir}
                <View style={s.kolom}>
                  <Hasil f={hasil} />
                </View>
              </View>
              {hasil && <SaranMakanan tujuan={hasil.tujuan} lebar />}
            </>
          ) : hasil ? (
            <>
              <Hasil f={hasil} />
              <SaranMakanan tujuan={hasil.tujuan} lebar={false} />
              <Pressable style={({ pressed }) => [s.tombolPinggir, s.klik, pressed && s.tekan]} onPress={() => setHasil(null)}>
                <Text style={s.tombolPinggirTeks}>Ubah data</Text>
              </Pressable>
            </>
          ) : (
            formulir
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: K.kertas },
  klik: { cursor: 'pointer' },
  tekan: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  dua: { flexDirection: 'row', gap: 48, alignItems: 'flex-start', marginTop: 28 },
  kolom: { flex: 1, minWidth: 0 },

  merek: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: K.hijauMuda,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: R.pil,
  },
  logo: { width: 22, height: 22, borderRadius: 6 },
  merekTeks: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4, color: K.hijauTua },
  judul: { fontSize: 36, lineHeight: 40, fontWeight: '800', letterSpacing: -0.9, color: K.tinta, marginTop: 18, marginBottom: 26 },

  label: { fontSize: 13, fontWeight: '700', color: K.tinta, marginBottom: 10 },
  kecil: { fontSize: 12, fontWeight: '600', color: K.abu },

  pilRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  pil: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: R.pil,
    borderWidth: 1,
    borderColor: K.garis,
    backgroundColor: K.putih,
  },
  pilOn: { backgroundColor: K.hijau, borderColor: K.hijau },
  pilTeks: { fontSize: 15, fontWeight: '600', color: K.tinta },
  pilTeksOn: { color: K.putih, fontWeight: '700' },

  tigaIsian: { flexDirection: 'row', gap: 12 },
  isianKotak: {
    backgroundColor: K.putih,
    borderWidth: 1.5,
    borderColor: K.garis,
    borderRadius: R.kotak,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  isianBaris: { flexDirection: 'row', alignItems: 'baseline' },
  isian: { flex: 1, minWidth: 0, fontSize: 28, fontWeight: '800', color: K.tinta, paddingVertical: 2, outlineStyle: 'none' },
  satuan: { fontSize: 13, fontWeight: '600', color: K.abu },
  galat: { fontSize: 12, color: K.merah, marginTop: 4, marginLeft: 4 },

  daftar: { gap: 10, marginBottom: 22 },
  aktivitas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: K.putih,
    borderWidth: 1.5,
    borderColor: K.garis,
    borderRadius: R.kotak,
  },
  aktivitasOn: { borderColor: K.hijau, backgroundColor: K.hijauMuda },
  aktivitasNama: { fontSize: 16, color: K.tinta },
  aktivitasHint: { fontSize: 13, color: K.abu, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: K.garis, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: K.hijau },
  radioTitik: { width: 10, height: 10, borderRadius: 5, backgroundColor: K.hijau },

  tombol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: K.hijau,
    paddingVertical: 17,
    borderRadius: R.pil,
    marginTop: 6,
    boxShadow: '0 8px 20px rgba(30, 158, 87, 0.30)',
  },
  tombolMati: { backgroundColor: '#9DB5A6', boxShadow: '0 0 0 rgba(0, 0, 0, 0)' },
  tombolTeks: { color: K.putih, fontSize: 16, fontWeight: '800' },
  tombolPanah: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255, 255, 255, 0.22)', alignItems: 'center', justifyContent: 'center' },
  tombolPanahTeks: { color: K.putih, fontSize: 16, fontWeight: '800' },
  tombolPinggir: { borderWidth: 2, borderColor: K.hijau, paddingVertical: 15, alignItems: 'center', borderRadius: R.pil, marginTop: 28 },
  tombolPinggirTeks: { color: K.hijau, fontSize: 15, fontWeight: '800' },

  hero: { backgroundColor: K.hijauTua, borderRadius: 24, padding: 22, boxShadow: '0 10px 28px rgba(20, 119, 63, 0.28)' },
  heroLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255, 255, 255, 0.78)' },
  heroBaris: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 },
  heroAngka: { fontSize: 56, fontWeight: '900', letterSpacing: -1.5, color: K.putih },
  heroSatuan: { fontSize: 18, fontWeight: '700', color: 'rgba(255, 255, 255, 0.85)' },
  heroSub: { fontSize: 14, color: 'rgba(255, 255, 255, 0.78)', marginTop: 4 },

  kartu: { backgroundColor: K.putih, borderRadius: R.kartu, padding: 16, borderWidth: 1, borderColor: K.garis, boxShadow: BAYANG },
  bar: { flexDirection: 'row', height: 10, borderRadius: R.pil, overflow: 'hidden', backgroundColor: K.hijauMuda, marginBottom: 14 },
  tileRow: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, minWidth: 0, backgroundColor: K.kertas, borderRadius: 14, padding: 12 },
  tileTitik: { width: 8, height: 8, borderRadius: 4 },
  tileNama: { fontSize: 12, fontWeight: '600', color: K.abu, marginTop: 8 },
  tileGram: { fontSize: 20, fontWeight: '800', color: K.tinta, marginTop: 2 },
  tilePct: { fontSize: 12, color: K.abu, marginTop: 1 },

  baris: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingVertical: 10 },
  pisah: { borderTopWidth: 1, borderTopColor: K.garis },
  barisNama: { fontSize: 15, color: K.tinta },
  barisNilai: { fontSize: 15, fontWeight: '800', color: K.tinta, flexShrink: 1, textAlign: 'right' },
  catatan: { fontSize: 12, lineHeight: 18, color: K.abu, marginTop: 6 },
  peringatan: { backgroundColor: K.merahMuda, borderRadius: R.kecil, padding: 12 },
  peringatanTeks: { fontSize: 13, lineHeight: 18, color: K.merah },
});
