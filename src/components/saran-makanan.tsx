import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { KELOMPOK, MENU, type Makanan } from '@/lib/saran';
import { BAYANG, K, R } from '@/lib/warna';

const HURUF = ['A', 'B', 'C'];

function Kartu({ m, lebar }: { m: Makanan; lebar: boolean }) {
  return (
    <View style={[s.kartu, { width: lebar ? 200 : 164 }]}>
      {m.foto ? <Image source={m.foto} style={s.foto} resizeMode="cover" /> : (
        <View style={[s.foto, s.fotoKosong]}>
          <Text style={s.emoji}>{m.emoji}</Text>
        </View>
      )}
      <View style={s.kartuIsi}>
        <Text style={s.nama} numberOfLines={2}>
          {m.nama}
        </Text>
        <Text style={s.catatan} numberOfLines={3}>
          {m.catatan}
        </Text>
      </View>
    </View>
  );
}

export default function SaranMakanan({ tujuan, lebar }: { tujuan: string; lebar: boolean }) {
  const menu = MENU[tujuan] ?? MENU.jaga;

  return (
    <View style={{ marginTop: lebar ? 48 : 36 }}>
      <Text style={s.judul}>Yang bisa dimakan</Text>
      <Text style={s.sub}>Bahan yang mudah ditemukan di pasar dan warung. Cara masak ada di bawah nama bahan.</Text>

      {KELOMPOK.map((k, i) => {
        const kartu = k.item.map((m) => <Kartu key={m.nama} m={m} lebar={lebar} />);
        return (
          <View key={k.id} style={{ marginTop: 28 }}>
            <View style={s.kepalaRow}>
              <View style={s.huruf}>
                <Text style={s.hurufTeks}>{HURUF[i]}</Text>
              </View>
              <Text style={s.kepala}>{k.judul}</Text>
            </View>
            {lebar ? (
              <View style={s.grid}>{kartu}</View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={s.geser}>
                {kartu}
              </ScrollView>
            )}
          </View>
        );
      })}

      <View style={{ marginTop: 36 }}>
        <Text style={s.judulKecil}>Contoh menu sehari</Text>
        <View style={s.menuKartu}>
          <Text style={s.tips}>{menu.tips}</Text>
          {menu.baris.map((b, i) => (
            <View key={b.waktu} style={[s.menuBaris, i > 0 && s.pisah]}>
              <View style={s.waktuPil}>
                <Text style={s.waktu}>{b.waktu}</Text>
              </View>
              <Text style={s.isi}>{b.isi}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={s.penutup}>Saran umum, bukan program diet khusus. Sesuaikan dengan selera, anggaran, dan kondisi kesehatan Anda.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  judul: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: K.tinta },
  judulKecil: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, color: K.tinta, marginBottom: 12 },
  sub: { fontSize: 14, lineHeight: 20, color: K.abu, marginTop: 6 },

  kepalaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  huruf: { width: 26, height: 26, borderRadius: 13, backgroundColor: K.hijau, alignItems: 'center', justifyContent: 'center' },
  hurufTeks: { fontSize: 12, fontWeight: '800', color: K.putih },
  kepala: { fontSize: 16, fontWeight: '800', color: K.tinta },

  geser: { paddingHorizontal: 20, gap: 14, paddingBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },

  kartu: {
    backgroundColor: K.putih,
    borderRadius: R.kartu,
    borderWidth: 1,
    borderColor: K.garis,
    overflow: 'hidden',
    boxShadow: BAYANG,
  },
  foto: { width: '100%', height: 112 },
  fotoKosong: { backgroundColor: K.hijauMuda, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 44 },
  kartuIsi: { padding: 12 },
  nama: { fontSize: 15, fontWeight: '700', color: K.tinta },
  catatan: { fontSize: 12, lineHeight: 17, color: K.abu, marginTop: 4 },

  menuKartu: { backgroundColor: K.putih, borderRadius: R.kartu, borderWidth: 1, borderColor: K.garis, padding: 16, boxShadow: BAYANG },
  tips: { fontSize: 14, lineHeight: 21, color: K.abu, marginBottom: 8 },
  menuBaris: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  pisah: { borderTopWidth: 1, borderTopColor: K.garis },
  waktuPil: { width: 84, paddingVertical: 5, borderRadius: R.pil, backgroundColor: K.hijauMuda, alignItems: 'center' },
  waktu: { fontSize: 12, fontWeight: '700', color: K.hijauTua },
  isi: { flex: 1, fontSize: 15, lineHeight: 21, color: K.tinta },
  penutup: { fontSize: 12, lineHeight: 18, color: K.abu, marginTop: 16 },
});
