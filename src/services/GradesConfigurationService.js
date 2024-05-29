import { supabase, handleResponse } from '@/services/Api';

export default {
  listGrades(discipline_id){
    return handleResponse(
      supabase.from('grade_configurations')
      .select()
      .eq('discipline_id', discipline_id)
    )
  },
  createGradeConfiguration(newGrade){
    return handleResponse(
      supabase.from('grade_configurations')
              .insert(newGrade)
              .select()
    )
  },
  deleteGradeConfiguration(gradeId){
    return handleResponse(
      supabase.from('grade_configurations')
              .delete()
              .eq('id', gradeId)
    )
  },
  updateGradeConfiguration(updatedGrade) {
    return handleResponse(
      supabase.from('grade_configurations')
              .update(updatedGrade)
              .eq('id', updatedGrade.id)
              .select()
    )
  }
}