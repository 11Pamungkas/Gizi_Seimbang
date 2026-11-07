import type { ImageSourcePropType } from 'react-native';

// Saran makanan umum yang mudah ditemukan di Indonesia.
// Belum ada angka gizi di sini. Nilai per bahan akan memakai data TKPI resmi.
// Foto ada di assets/makanan/. Nama file harus sama persis (termasuk huruf besar dan spasi).
// Emoji dipakai sebagai cadangan kalau `foto` tidak diisi.
export interface Makanan {
  nama: string;
  emoji: string;
  catatan: string;
  foto?: ImageSourcePropType;
}

export interface Kelompok {
  id: string;
  judul: string;
  warna: string;
  bg: string;
  item: Makanan[];
}

export const KELOMPOK: Kelompok[] = [
  {
    id: 'karbo',
    judul: 'Sumber karbohidrat',
    warna: '#B7791F',
    bg: '#FBF0D5',
    item: [
      { nama: 'Nasi merah', emoji: '🍚', catatan: 'Lebih banyak serat, kenyang lebih lama', foto: require('../../assets/makanan/Nasi Merah.jpg') },
      { nama: 'Nasi putih', emoji: '🍙', catatan: 'Atur porsinya sesuai target', foto: require('../../assets/makanan/Nasi Putih.jpg') },
      { nama: 'Ubi jalar', emoji: '🍠', catatan: 'Rebus atau kukus, bukan digoreng', foto: require('../../assets/makanan/Ubi Jalar.jpg') },
      { nama: 'Singkong rebus', emoji: '🥔', catatan: 'Imbangi dengan lauk protein', foto: require('../../assets/makanan/Singkong Rebus.jpg') },
      { nama: 'Jagung rebus', emoji: '🌽', catatan: 'Camilan sehat dan mengenyangkan', foto: require('../../assets/makanan/Jagung rebus.jpg') },
      { nama: 'Oatmeal', emoji: '🥣', catatan: 'Cocok untuk sarapan', foto: require('../../assets/makanan/Oatmeal.jpg') },
    ],
  },
  {
    id: 'protein',
    judul: 'Sumber protein',
    warna: '#D9694B',
    bg: '#F9E2DA',
    item: [
      { nama: 'Telur', emoji: '🥚', catatan: 'Rebus atau dadar dengan sedikit minyak', foto: require('../../assets/makanan/Telur.jpg') },
      { nama: 'Dada ayam', emoji: '🍗', catatan: 'Panggang atau rebus, tanpa kulit', foto: require('../../assets/makanan/Dada Ayam.jpg') },
      { nama: 'Ikan (kembung, nila, tongkol)', emoji: '🐟', catatan: 'Pepes, bakar, atau kukus', foto: require('../../assets/makanan/Ikan.jpg') },
      { nama: 'Tempe', emoji: '🫘', catatan: 'Bakar atau tumis, kurangi goreng', foto: require('../../assets/makanan/Tempe.jpg') },
      { nama: 'Tahu', emoji: '⬜', catatan: 'Kukus, panggang, atau dalam sup', foto: require('../../assets/makanan/Tahu.jpg') },
      { nama: 'Udang', emoji: '🦐', catatan: 'Rebus atau tumis ringan', foto: require('../../assets/makanan/Udang.jpg') },
      { nama: 'Daging sapi tanpa lemak', emoji: '🥩', catatan: 'Masak tanpa santan', foto: require('../../assets/makanan/Daging sapi.jpg') },
      { nama: 'Susu atau yoghurt', emoji: '🥛', catatan: 'Pilih yang tanpa tambahan gula', foto: require('../../assets/makanan/Sussu.jpg') },
    ],
  },
  {
    id: 'pendamping',
    judul: 'Sayur dan buah pendamping',
    warna: '#1F4D3A',
    bg: '#DDE8DC',
    item: [
      { nama: 'Bayam', emoji: '🥬', catatan: 'Sayur bening atau tumis ringan', foto: require('../../assets/makanan/bayam.jpg') },
      { nama: 'Kangkung', emoji: '🌿', catatan: 'Tumis dengan sedikit minyak', foto: require('../../assets/makanan/kangkung.jpg') },
      { nama: 'Buncis', emoji: '🫛', catatan: 'Rebus atau tumis', foto: require('../../assets/makanan/buncis.jpg') },
      { nama: 'Wortel', emoji: '🥕', catatan: 'Mentah, rebus, atau dalam sup', foto: require('../../assets/makanan/wortel.jpg') },
      { nama: 'Tomat dan lalapan', emoji: '🍅', catatan: 'Segar bersama lauk', foto: require('../../assets/makanan/tomat.jpg') },
      { nama: 'Pepaya', emoji: '🍈', catatan: 'Penutup makan yang ringan', foto: require('../../assets/makanan/pepaya.jpg') },
      { nama: 'Pisang', emoji: '🍌', catatan: 'Camilan praktis', foto: require('../../assets/makanan/pisang.jpg') },
      { nama: 'Jeruk', emoji: '🍊', catatan: 'Buah segar, bukan jus bergula', foto: require('../../assets/makanan/jeruk.jpg') },
    ],
  },
];

export interface MenuHari {
  tips: string;
  baris: { waktu: string; isi: string }[];
}

export const MENU: Record<string, MenuHari> = {
  turun: {
    tips: 'Pilih cara masak kukus, rebus, atau panggang. Kurangi gorengan dan santan, dan perbanyak sayur agar kenyang lebih lama.',
    baris: [
      { waktu: 'Sarapan', isi: 'Oatmeal atau nasi merah porsi kecil, telur rebus, dan sayur' },
      { waktu: 'Makan siang', isi: 'Nasi merah, pepes ikan, tumis kangkung, dan tempe bakar' },
      { waktu: 'Makan malam', isi: 'Ayam panggang tanpa kulit, sayur bening bayam, dan ubi rebus' },
      { waktu: 'Camilan', isi: 'Buah segar atau yoghurt tanpa gula' },
    ],
  },
  jaga: {
    tips: 'Variasikan lauk dan sayur setiap hari, dan atur porsi nasi sesuai target karbohidrat Anda.',
    baris: [
      { waktu: 'Sarapan', isi: 'Nasi, telur dadar, dan tumis sayur' },
      { waktu: 'Makan siang', isi: 'Nasi, ayam bakar, tahu, dan lalapan' },
      { waktu: 'Makan malam', isi: 'Nasi, ikan kukus atau bakar, tempe, dan sayur bening' },
      { waktu: 'Camilan', isi: 'Pisang atau jagung rebus' },
    ],
  },
  naik: {
    tips: 'Tambah porsi nasi dan lauk, serta camilan padat gizi di antara jam makan utama.',
    baris: [
      { waktu: 'Sarapan', isi: 'Bubur ayam dengan telur dan segelas susu' },
      { waktu: 'Makan siang', isi: 'Nasi porsi besar, ikan bakar, tempe, tahu, dan sayur' },
      { waktu: 'Makan malam', isi: 'Nasi, daging sapi atau ayam, tahu, dan sayur' },
      { waktu: 'Camilan', isi: 'Pisang, kacang rebus, atau susu di antara jam makan' },
    ],
  },
};
