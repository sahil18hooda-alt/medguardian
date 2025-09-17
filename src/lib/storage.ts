import { supabase } from './supabase';

export const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('medical_records')
    .upload(`${Date.now()}-${file.name}`, file);
  if (error) throw error;
  return data;
};

export const getFiles = async () => {
  const { data, error } = await supabase.storage
    .from('medical_records')
    .list();
  if (error) throw error;
  return data;
};

export const downloadFile = async (fileName: string) => {
  const { data, error } = await supabase.storage
    .from('medical_records')
    .download(fileName);
  if (error) throw error;
  return data;
};
