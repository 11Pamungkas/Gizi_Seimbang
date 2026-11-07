// Perhitungan kebutuhan gizi harian. Semua hasil adalah perkiraan umum.

export type Gender = 'L' | 'P';

export interface Form {
  gender: Gender;
  usia: string;
  tinggi: string;
  berat: string;
  aktivitas: string;
  tujuan: string;
}

export const GENDER: { id: Gender; label: string }[] = [
  { id: 'L', label: 'Laki-laki' },
  { id: 'P', label: 'Perempuan' },
];

export const AKTIVITAS = [
  { id: 'jarang', label: 'Jarang bergerak', hint: 'Kerja duduk, hampir tanpa olahraga', faktor: 1.2 },
  { id: 'ringan', label: 'Ringan', hint: 'Olahraga 1-3 kali seminggu', faktor: 1.375 },
  { id: 'sedang', label: 'Sedang', hint: 'Olahraga 3-5 kali seminggu', faktor: 1.55 },
  { id: 'aktif', label: 'Aktif', hint: 'Olahraga 6-7 kali seminggu', faktor: 1.725 },
];

export const TUJUAN = [
  { id: 'turun', label: 'Turunkan', adj: -500, proteinPerKg: 1.2 },
  { id: 'jaga', label: 'Jaga', adj: 0, proteinPerKg: 1.0 },
  { id: 'naik', label: 'Naikkan', adj: 300, proteinPerKg: 1.4 },
];

export function validasi({ usia, tinggi, berat }: Form): Record<string, string> {
  const e: Record<string, string> = {};
  const u = Number(usia);
  const t = Number(tinggi);
  const b = Number(berat);
  if (!usia) e.usia = 'Isi usia';
  else if (u < 18 || u > 80) e.usia = '18-80 tahun';
  if (!tinggi) e.tinggi = 'Isi tinggi';
  else if (t < 120 || t > 220) e.tinggi = '120-220 cm';
  if (!berat) e.berat = 'Isi berat';
  else if (b < 30 || b > 250) e.berat = '30-250 kg';
  return e;
}

export function hitung({ gender, usia, tinggi, berat, aktivitas, tujuan }: Form) {
  const u = Number(usia);
  const t = Number(tinggi);
  const b = Number(berat);
  const h = t / 100;
  const akt = AKTIVITAS.find((a) => a.id === aktivitas) ?? AKTIVITAS[2];
  const goal = TUJUAN.find((g) => g.id === tujuan) ?? TUJUAN[1];

  // Berat ideal: IMT 22. Rentang sehat: IMT 18,5-22,9 (acuan Asia-Pasifik).
  const ideal = 22 * h * h;
  const minSehat = 18.5 * h * h;
  const maxSehat = 22.9 * h * h;

  // BMR Mifflin-St Jeor, lalu dikali faktor aktivitas.
  const bmr = 10 * b + 6.25 * t - 5 * u + (gender === 'L' ? 5 : -161);
  const tdee = bmr * akt.faktor;

  // Target kalori tidak boleh di bawah BMR maupun batas minimal umum.
  const lantai = Math.max(bmr, gender === 'L' ? 1500 : 1200);
  const mentah = tdee + goal.adj;
  const dibatasi = mentah < lantai;
  const kalori = Math.max(mentah, lantai);

  // Protein per kg berat badan (maks. 30% kalori), karbohidrat 55% kalori.
  const proteinG = Math.min(b * goal.proteinPerKg, (kalori * 0.3) / 4);
  const karboG = (kalori * 0.55) / 4;
  const lemakG = Math.max(0, (kalori - proteinG * 4 - karboG * 4) / 9);

  return {
    ideal,
    minSehat,
    maxSehat,
    bmr,
    tdee,
    kalori,
    dibatasi,
    proteinG,
    karboG,
    lemakG,
    proteinPct: ((proteinG * 4) / kalori) * 100,
    karboPct: ((karboG * 4) / kalori) * 100,
  };
}
