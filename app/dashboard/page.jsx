'use client';

import { useEffect, useState } from 'react';
import { database } from '@/lib/firebase';
import { onValue, ref, push, remove } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lombaList, setLombaList] = useState([]);
  const [judulLomba, setJudulLomba] = useState('');
  const [hapusId, setHapusId] = useState(null); // untuk modal konfirmasi
  const router = useRouter();

  useEffect(() => {
    const dbRef = ref(database, 'lomba');
    const unsub = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }));
        setLombaList(dataArray);
      } else {
        setLombaList([]);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
  const auth = getAuth();
  const unsub = auth.onAuthStateChanged((user) => {
      if (user?.email === 'admin@gmail.com') {
        setIsAdmin(true);
      }
    });
    return () => unsub();
  }, []);

  const tambahLomba = async () => {
    if (!judulLomba.trim()) return alert('Masukkan judul lomba');
    const dbRef = ref(database, 'lomba');
    await push(dbRef, {
      judul: judulLomba,
      createdAt: Date.now(),
    });
    setJudulLomba('');
  };

  const konfirmasiHapus = async () => {
    if (!hapusId) return;
    await remove(ref(database, `lomba/${hapusId}`));
    await remove(ref(database, `peserta/${hapusId}`));
    await remove(ref(database, `nilai/${hapusId}`));
    setHapusId(null);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard Juri</h1>

      {isAdmin && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nama Lomba"
            value={judulLomba}
            onChange={(e) => setJudulLomba(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button onClick={tambahLomba} className="bg-green-600 text-white px-4 py-2 rounded">
            Tambah Lomba
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold mt-6 mb-2">Daftar Lomba</h2>
      <ul className="space-y-2">
        {lombaList.map((lomba) => (
          <li
            key={lomba.id}
            className="border p-3 rounded hover:bg-gray-100 flex justify-between items-center"
          >
            <span
              className="cursor-pointer w-full"
              onClick={() => router.push(`/dashboard/lomba/${lomba.id}`)}
            >
              {lomba.judul}
            </span>

            {isAdmin && (
                <button
                  onClick={() => setHapusId(lomba.id)}
                  className="bg-red-500 cursor-pointer text-white px-2 py-1 text-sm rounded"
                >
                  Hapus
                </button>
              )}
            
          </li>
        ))}
      </ul>

      {/* Modal Konfirmasi Hapus */}
      {hapusId && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6">Apakah kamu yakin ingin menghapus lomba ini?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setHapusId(null)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={konfirmasiHapus}
                className="px-4 py-2 bg-red-600 text-black rounded cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
