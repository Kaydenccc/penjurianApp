'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Sistem Penjurian Digital
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl mb-8">
          Aplikasi penjurian real-time untuk lomba yang transparan, cepat, dan mudah.
          Cocok untuk kegiatan sekolah, kampus, atau komunitas.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push('/login')}
            className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-md"
          >
            Masuk sebagai Juri
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-md"
          >
            Lihat Rekap Nilai
          </button>

          <button
            onClick={() => router.push('/login')}
            className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition shadow-md"
          >
            Admin Panel
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} PenjurianApp. Dibuat dengan ❤️ oleh Anhar. dan MTs Negeri 2 Tana Toraja
      </footer>
    </div>
  );
}
