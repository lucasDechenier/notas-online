import { createClient } from '@supabase/supabase-js'
import Swal from '@/plugins/sweetalert'

const notifyError = (message) => {
  Swal.alertError({title: message})
};

export const handleResponse = async (promise) => {
  const { data, error } = await promise;
  if (error) {
    notifyError(error.message);
    throw error;
  }
  return data;
};

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)