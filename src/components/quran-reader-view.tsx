import React, { useState } from 'react';
import { BookOpen, Play, Pause, Search, Settings, Heart } from 'lucide-react';

export const QuranReaderView = () => {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(24);

  // قائمة تجريبية للسور
  const surahs = [
    { id: 1, name: "الفاتحة", versesCount: 7, type: "مكية" },
    { id: 2, name: "البقرة", versesCount: 286, type: "مدنية" },
    { id: 3, name: "آل عمران", versesCount: 200, type: "مدنية" },
    { id: 112, name: "الإخلاص", versesCount: 4, type: "مكية" },
    { id: 113, name: "الفلق", versesCount: 5, type: "مكية" },
    { id: 114, name: "الناس", versesCount: 6, type: "مكية" },
  ];

  return (
    <div className="min-h-screen bg-amber-50/30 text-gray-800 dir-rtl p-4 font-sans">
      {/* هيدر الصفحة */}
      <header className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm mb-6 border border-amber-100">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-bold text-emerald-900">القرآن الكريم</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setFontSize(prev => Math.min(prev + 2, 40))}
            className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold"
          >
            A+
          </button>
          <button 
            onClick={() => setFontSize(prev => Math.max(prev - 2, 16))}
            className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold"
          >
            A-
          </button>
        </div>
      </header>

      {/* اختيار السورة */}
      <div className="mb-6 overflow-x-auto flex gap-2 pb-2">
        {surahs.map((surah) => (
          <button
            key={surah.id}
            onClick={() => setSelectedSurah(surah.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedSurah === surah.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-100'
            }`}
          >
            {surah.id}. {surah.name}
          </button>
        ))}
      </div>

      {/* عرض الآيات */}
      <main className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100 min-h-[400px]">
        <div className="text-center my-6">
          <p className="text-emerald-800 text-lg font-serif">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>

        <div 
          className="leading-loose text-center text-gray-800 space-y-4 font-serif"
          style={{ fontSize: `${fontSize}px` }}
        >
          {selectedSurah === 1 ? (
            <p className="leading-[2.5]">
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿١﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٢﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٣﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٤﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٥﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٦﴾
            </p>
          ) : (
            <p className="text-gray-500 text-base font-sans mt-10">
              جاري تحميل سور وآيات القرآن الكريم... 📖
            </p>
          )}
        </div>
      </main>

      {/* شريط التحكم الصوتي السفلّي */}
      <div className="fixed bottom-4 left-4 right-4 bg-emerald-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-emerald-200">سورة الفاتحة</p>
          <p className="text-sm font-bold">القارئ: مشاري العفاسي</p>
        </div>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 bg-emerald-500 rounded-full text-white hover:bg-emerald-400 transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default QuranReaderView;
