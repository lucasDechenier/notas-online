import { defineStore } from 'pinia'
import StudentsService from '@/services/StudentsService.js'
import Swal from '@/plugins/sweetalert'
import { useDisciplineStore } from '@/store/discipline'

export const useStudentStore = defineStore('student', {
  state: () => {
    return {
      students: [],
    }
  },
  getters: {
    selectedDiscipline() {
      const disciplineStore = useDisciplineStore()
      return disciplineStore.selectedDiscipline
    }
  },
  actions: {
    async loadStudents(){
      if(!this.selectedDiscipline) return
      
      this.students = []
      return StudentsService.listStudents(this.selectedDiscipline?.id).then(students => {
        this.students = students
      })
    },
    async addStudent(newStudent) {
      if(!newStudent.discipline_id) {
        if(!this.selectedDiscipline?.id) throw Swal.alertError({title: 'Nenhuma disciplina selecionada'})

        newStudent.discipline_id = this.selectedDiscipline.id
      }

      let student = (await StudentsService.createStudent(newStudent))[0];

      let grades = []
      if (newStudent.grades) {
        grades = Object.entries(newStudent.grades).map(([key, value]) => { 
          return { student_id: student.id, grade_config_id: key, value: value }
        })
      }
      await StudentsService.upsertGrades(grades);
      student = (await StudentsService.getStudent(student.id))[0]
      this.students.push(student)
      return student
    },
    async updateStudent(newStudent){
      if(!newStudent.discipline_id) {
        if(!this.selectedDiscipline?.id) throw Swal.alertError({title: 'Nenhuma disciplina selecionada'})

        newStudent.discipline_id = this.selectedDiscipline.id
      }

      let student = (await StudentsService.updateStudent(newStudent))[0];

      let grades = []
      if (student.student_grades) {
        grades = Object.entries(newStudent.grades).map(([key, value]) => { 
          return { student_id: student.id, grade_config_id: parseInt(key), value: parseFloat(value), id: parseInt(student.student_grades.find(e => e.grade_config_id == key)?.id) }
        })
      }
      await StudentsService.upsertGrades(grades);

      student = (await StudentsService.getStudent(student.id))[0]
      const studentIndex = this.students.findIndex(findStudent => findStudent.id === student.id)
      if (studentIndex !== -1) {
        this.students.splice(studentIndex, 1, student)
      }

      return student
    },
    async removeStudent(studentId){
      return StudentsService.deleteStudent(studentId).then(() => {
        this.students = this.students.filter(student => student.id !== studentId)
      })
    },
  },
})