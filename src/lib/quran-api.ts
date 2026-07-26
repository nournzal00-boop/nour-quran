// Quran API helpers using AlQuran.cloud
const BASE = "https://api.alquran.cloud/v1";

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  audio?: string;
}

export interface SurahFull extends SurahMeta {
  ayahs: Ayah[];
}

export async function fetchSurahs(): Promise<SurahMeta[]> {
  const res = await fetch(`${BASE}/surah`);
  const json = await res.json();
  return json.data;
}

export async function fetchSurah(
  number: number,
  edition = "quran-uthmani",
): Promise<SurahFull> {
  const res = await fetch(`${BASE}/surah/${number}/${edition}`);
  const json = await res.json();
  return json.data;
}

export async function fetchSurahMultiple(
  number: number,
  editions: string[],
): Promise<SurahFull[]> {
  const res = await fetch(`${BASE}/surah/${number}/editions/${editions.join(",")}`);
  const json = await res.json();
  return json.data;
}

export async function fetchRandomAyah(): Promise<{
  text: string;
  translation: string;
  surah: { number: number; name: string; englishName: string };
  numberInSurah: number;
}> {
  const total = 6236;
  const n = Math.floor(Math.random() * total) + 1;
  const res = await fetch(`${BASE}/ayah/${n}/editions/quran-uthmani,ar.muyassar`);
  const json = await res.json();
  const [arabic, tafsir] = json.data;
  return {
    text: arabic.text,
    translation: tafsir.text,
    surah: {
      number: arabic.surah.number,
      name: arabic.surah.name,
      englishName: arabic.surah.englishName,
    },
    numberInSurah: arabic.numberInSurah,
  };
}

export function ayahAudioUrl(globalAyahNumber: number, reciterId = "ar.alafasy") {
  // Bitrate 128 mp3
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalAyahNumber}.mp3`;
}

export const RECITERS: { id: string; name: string }[] = [
  { id: "ar.alafasy", name: "مشاري العفاسي" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد" },
  { id: "ar.abdurrahmaansudais", name: "عبد الرحمن السديس" },
  { id: "ar.mahermuaiqly", name: "ماهر المعيقلي" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي" },
  { id: "ar.husary", name: "محمود خليل الحصري" },
  { id: "ar.hudhaify", name: "علي الحذيفي" },
];

export const TAFSIRS: { id: string; name: string }[] = [
  { id: "ar.muyassar", name: "التفسير الميسر" },
  { id: "ar.jalalayn", name: "تفسير الجلالين" },
];
