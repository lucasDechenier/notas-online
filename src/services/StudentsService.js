import { supabase, handleResponse } from '@/services/Api';

export default {
  getStudent(studentId){
    return handleResponse(
      supabase
      .from('students')
      .select(`
        id,
        name,
        student_grades (value, grade_config_id)
      `)
      .eq('id', studentId)
    )
  },
  listStudents(discipline_id){
    return handleResponse(
      supabase
      .from('students')
      .select(`
        id,
        name,
        student_grades(value, grade_config_id)
      `)
      .eq('discipline_id', discipline_id)
    )
  },
  createStudent(newStudent){
    const { name, discipline_id } = newStudent
    return handleResponse(
      supabase.from('students')
              .insert({ name, discipline_id })
              .select()
    )
  },
  updateStudent(updatedStudent) {
    const { name, discipline_id } = updatedStudent
    return handleResponse(
      supabase.from('students')
              .update({ name, discipline_id })
              .eq('id', updatedStudent.id)
              .select(`
                id,
                name,
                student_grades(value, grade_config_id, id)
              `)
    )
  },
  upsertGrades(grades){
    grades = grades.map(grade => {
      if(!grade?.id) delete grade.id
      return grade
    })
    return handleResponse(
      supabase.from('student_grades')
              .upsert(grades)
              .select()
    )
  },
  deleteStudent(studentId){
    return handleResponse(
      supabase.from('students')
              .delete()
              .eq('id', studentId)
    )
  },
}