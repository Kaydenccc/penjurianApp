'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ref, onValue, set,remove  } from 'firebase/database';
import { auth, database } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function InputNilaiPage() {
  const router = useRouter()
  const { id } = useParams(); // id lomba
  const [nilaiData, setNilaiData] = useState({});

  const [pesertaList, setPesertaList] = useState([]);
  const [nilaiMap, setNilaiMap] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const emailSafe = user.email.replace(/\./g, '_');
        setUserEmail(emailSafe);
      } else {
        alert('Silakan login sebagai juri');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pesertaRef = ref(database, `peserta/${id}`);
    onValue(pesertaRef, (snap) => {
      const data = snap.val();
      if (data) {
        const arr = Object.entries(data).map(([pid, item]) => ({ id: pid, ...item }));
        setPesertaList(arr);
      } else {
        setPesertaList([]);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!userEmail) return;
    const nilaiRef = ref(database, `nilai/${id}`);
    onValue(nilaiRef, (snap) => {
      const data = snap.val() || {};
      const status = {};
      for (const pid in data) {
        if (data[pid][userEmail]) {
          status[pid] = true;
        }
      }
      setSubmitted(status);
      setNilaiData(data); // menyimpan semua nilai peserta dari juri

    });
  }, [id, userEmail]);

  const handleChange = (pid, nilai) => {
    setNilaiMap((prev) => ({
      ...prev,
      [pid]: nilai,
    }));
  };

  const simpanNilai = async (pid) => {
    const nilai = nilaiMap[pid];
    if (!nilai || isNaN(nilai)) {
      alert('Masukkan nilai yang valid');
      return;
    }

    const nilaiRef = ref(database, `nilai/${id}/${pid}/${userEmail}`);
    await set(nilaiRef, {
      nilai: parseFloat(nilai),
      waktu: Date.now(),
    });

    setSubmitted((prev) => ({ ...prev, [pid]: true }));
  };

  const hapusNilai = async (pid) => {
  const nilaiRef = ref(database, `nilai/${id}/${pid}/${userEmail}`);
  await remove(nilaiRef);
  setSubmitted((prev) => ({ ...prev, [pid]: false }));
  setNilaiMap((prev) => ({ ...prev, [pid]: '' }));
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Input Nilai Peserta</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {pesertaList.map((p) => (
          <div
            key={p.id}
            className="bg-white text-gray-800 rounded-xl shadow-md p-6 transition transform hover:scale-[1.02]"
          >
            <h2 className="text-xl font-semibold mb-4">{p.nama}</h2>

            {submitted[p.id] ? (
  <div className="text-center space-y-2">
    <div className="text-green-600 font-semibold">
      ✅ Nilai dikirim: {nilaiData[p.id]?.[userEmail]?.nilai}
    </div>
    <button
      onClick={() => hapusNilai(p.id)}
      className="text-red-600 hover:text-red-800 text-sm underline"
    >
      Hapus Nilai & Input Ulang
    </button>
  </div>
            ) : (
              <>
                <input
                  type="number"
                  placeholder="Nilai"
                  className="border border-gray-300 rounded w-full px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nilaiMap[p.id] || ''}
                  onChange={(e) => handleChange(p.id, e.target.value)}
                />
                <button
                  onClick={() => simpanNilai(p.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition"
                >
                  Simpan Nilai
                </button>
              </>
            )}


          </div>
        ))}
      </div>

      <div className=''>
        <button className='cursor-pointer hover:opacity-70 mt-2' onClick={()=>router.push('/dashboard')}>&lt;kembali</button>
      </div>

      {pesertaList.length === 0 && (
        <p className="text-center text-gray-300 mt-10">Belum ada peserta untuk lomba ini.</p>
      )}
    </div>
  );
}
