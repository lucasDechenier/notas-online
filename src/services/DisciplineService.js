import { supabase, handleResponse } from '@/services/Api';

export default {
  listDisciplines(){
    return handleResponse(supabase.from('disciplines').select())
  },
  createDiscipline(newDiscipline){
    return handleResponse(
      supabase.from('disciplines')
              .insert(newDiscipline)
              .select()
    )
  },
  deleteDiscipline(disciplineId){
    return handleResponse(
      supabase.from('disciplines')
              .delete()
              .eq('id', disciplineId)
    )
  },
  updateDiscipline(updatedDiscipline) {
    return handleResponse(
      supabase.from('disciplines')
              .update(updatedDiscipline)
              .eq('id', updatedDiscipline.id)
              .select()
    )
  }
}