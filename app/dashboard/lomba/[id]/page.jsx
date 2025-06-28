'use client';

import { useParams, useRouter  } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';

export default function LombaDetailPage() {
    const router = useRouter();
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [lomba, setLomba] = useState(null);
  const [pesertaList, setPesertaList] = useState([]);
  const [namaPeserta, setNamaPeserta] = useState('');
    useEffect(() => {
    const auth = getAuth();
    const unsub = auth.onAuthStateChanged((user) => {
        if (user?.email === 'admin@gmail.com') {
        setIsAdmin(true);
        }
    });
    return () => unsub();
      }, []);

  useEffect(() => {
    const lombaRef = ref(database, `lomba/${id}`);
    onValue(lombaRef, (snap) => {
      setLomba(snap.val());
    });

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

  const tambahPeserta = async () => {
    if (!namaPeserta.trim()) return;
    const pesertaRef = ref(database, `peserta/${id}`);
    await push(pesertaRef, {
      nama: namaPeserta,
      createdAt: Date.now(),
    });
    setNamaPeserta('');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Lomba: {lomba?.judul || '...'}</h1>

        {isAdmin && (
        <div className="mb-4">
        <input
          type="text"
          placeholder="Nama Peserta"
          value={namaPeserta}
          onChange={(e) => setNamaPeserta(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button onClick={tambahPeserta} className="bg-blue-600 text-white px-4 py-2 rounded">
          Tambah Peserta
        </button>
      </div>
              )}
      

      <h2 className="text-lg font-semibold mt-6 mb-2">Daftar Peserta</h2>
      <ul className="space-y-2">
        {pesertaList.map((p) => (
          <li key={p.id}   className=" border p-3 rounded text-white">
            {p.nama}
          </li>
        ))}
      </ul>
        {!isAdmin && (
                <button onClick={() => router.push(`/dashboard/nilai/${id}`)} className='cursor-pointer mt-2 py-2 px-4 rounded-sm text-white bg-green-600'>Beri Penialaian</button>
        )}
        <button onClick={()=>router.push(`/dashboard`)} className="ml-2 mt-2 cursor-pointer bg-white text-black px-4 py-2 rounded">
          Kembali
        </button>
    </div>
    
  );
}
