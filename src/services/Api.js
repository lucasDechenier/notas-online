import { createClient } from '@supabase/supabase-js';
import Swal from '@/plugins/sweetalert';
import { useLoadingStore } from '@/store/loading';

const notifyError = (message) => {
  Swal.alertError({ title: message });
};

export const handleResponse = async (promise) => {
  const loadingStore = useLoadingStore();
  loadingStore.setLoading(true)
  try {
    const { data, error } = await promise;
    if (error) {
      notifyError(error.message);
      throw error;
    }
    return data;
  } finally {
    loadingStore.setLoading(false)
  }
};

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
