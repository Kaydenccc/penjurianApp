'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

export default function RekapNilaiPage() {

    const router = useRouter()
  const { id } = useParams();
  const [pesertaList, setPesertaList] = useState([]);
  const [nilaiData, setNilaiData] = useState({});
  const [judulLomba, setJudulLomba] = useState('');

  useEffect(() => {
    onValue(ref(database, `lomba/${id}`), (snap) => {
      const data = snap.val();
      if (data?.judul) setJudulLomba(data.judul);
    });

    onValue(ref(database, `peserta/${id}`), (snap) => {
      const data = snap.val();
      if (data) {
        const arr = Object.entries(data).map(([pid, item]) => ({ id: pid, ...item }));
        setPesertaList(arr);
      }
    });

    onValue(ref(database, `nilai/${id}`), (snap) => {
      const data = snap.val() || {};
      setNilaiData(data);
    });
  }, [id]);

  const pesertaWithNilai = pesertaList
    .map((p) => {
      const nilaiPeserta = nilaiData[p.id] || {};
      const nilaiArray = Object.values(nilaiPeserta).map((n) => n.nilai);
      const total = nilaiArray.length > 0 ? nilaiArray.reduce((a, b) => a + b, 0) : 0;

      return { ...p, nilaiPeserta, total };
    })
    .sort((a, b) => b.total - a.total);

  const rankStyle = (index) => {
    if (index === 0) return 'bg-yellow-400 text-black';
    if (index === 1) return 'bg-gray-300 text-black';
    if (index === 2) return 'bg-orange-400 text-black';
    return 'bg-white text-black';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto ">

      <h1 className="text-3xl font-extrabold text-center mb-4 tracking-wide">
        🏆 Rekap Nilai: <span className="text-blue-600">{judulLomba}</span>
      </h1>

      <AnimatePresence>
        {pesertaWithNilai.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`border rounded-lg shadow-md p-4 mb-4 flex items-center justify-between ${rankStyle(i)} transition-all duration-300`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold w-8">{i + 1}</div>
              <div className="text-lg font-semibold">{p.nama}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{p.total.toFixed(2)} pts</div>
              <div className="text-xs text-gray-600">
                {Object.entries(p.nilaiPeserta).map(([juri, nilai]) => (
                  <span key={juri} className="mr-2">
                    {juri.replace(/_/g, '.')}:{' '}
                    <span className="font-semibold">{nilai.nilai}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>


    <button className='cursor-pointer hover:opacity-70' onClick={()=>router.push('/dashboard/rekap/daftar')}>&lt;kembali</button>

      {pesertaList.length === 0 && (
        <p className="text-center text-gray-500 mt-10">Belum ada peserta.</p>
      )}
    </div>
  );
}
