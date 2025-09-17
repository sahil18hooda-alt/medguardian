'use client';

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL, getBlob } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import firebaseConfig from '@/lib/firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFile = async (file: File) => {
  const storageRef = ref(storage, `uploads/${uuidv4()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return { path: storageRef.fullPath };
};

export const getFiles = async () => {
  const listRef = ref(storage, 'uploads');
  const res = await listAll(listRef);
  return res.items.map((itemRef) => ({ name: itemRef.name }));
};

export const downloadFile = async (fileName: string) => {
  const storageRef = ref(storage, `uploads/${fileName}`);
  const url = await getDownloadURL(storageRef);
  const blob = await fetch(url).then((res) => res.blob());
  return blob;

};
