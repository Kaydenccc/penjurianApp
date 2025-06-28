'use client';

import { useEffect, useState } from 'react';
import { database } from '@/lib/firebase';
import { onValue, ref, push } from 'firebase/database';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [lombaList, setLombaList] = useState([]);
  const [judulLomba, setJudulLomba] = useState('');
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

  const tambahLomba = async () => {
  console.log("➡️ Tombol diklik"); // tambahkan ini

  if (!judulLomba.trim()) {
    alert('Masukkan judul lomba');
    return;
  }

  const dbRef = ref(database, 'lomba');

  try {
    const result = await push(dbRef, {
      judul: judulLomba,
      createdAt: Date.now(),
    });

    console.log("✅ Lomba berhasil ditambahkan:", result.key); // ini juga
    setJudulLomba('');
  } catch (error) {
    console.error("❌ Gagal push ke Firebase:", error);
    alert("Gagal menyimpan: " + error.message);
  }
};

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-lg font-semibold mt-6 mb-2">Daftar Lomba</h1>
      <ul className="space-y-2">
        {lombaList.map((lomba) => (
          <li
            key={lomba.id}
            className="border p-3 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push(`/dashboard/rekap/${lomba.id}`)}
          >
            {lomba.judul}
          </li>
        ))}
      </ul>
    </div>
  );
}
