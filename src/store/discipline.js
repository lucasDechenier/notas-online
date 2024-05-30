import { defineStore } from 'pinia'
import DisciplineService from '@/services/DisciplineService.js'
import GradeConfigurationService from '@/services/GradesConfigurationService.js'
import Swal from '@/plugins/sweetalert'
import DisciplineStorage from '@/utils/DisciplineStorage'

export const useDisciplineStore = defineStore('discipline', {
  state: () => {
    return {
      selectedDiscipline: DisciplineStorage.getSelectedDiscipline(),
      disciplines: [],
      gradesConfiguration: []
    }
  },
  getters: {
    hasSelectedDiscipline: (state) => {
      return !!state.selectedDiscipline
    },
    gradesWeightSum: (state) => {
      return state.gradesConfiguration.map(grade => grade.weight || 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }
  },
  actions: {
    async loadDisciplines(fillSelectedDiscipline = true){
      this.disciplines = []
      return DisciplineService.listDisciplines().then(disciplines => {
        this.disciplines = disciplines
        if(!this.disciplines.map(e => e.id).includes(this.selectedDiscipline?.id)) this.selectedDiscipline = null

        if(fillSelectedDiscipline && !this.selectedDiscipline) this.selectedDiscipline = disciplines?.[0]
      })
    },
    changeSelectedDiscipline(newDiscipline) {
      this.selectedDiscipline = newDiscipline
      DisciplineStorage.saveSelectedDiscipline(newDiscipline)
    },
    async addDiscipline(newDiscipline) {
      return DisciplineService.createDiscipline(newDiscipline).then((data) => {
        this.disciplines.push(...data)
      })
    },
    async removeDiscipline(disciplineId, fillSelectedDiscipline = true){
      return DisciplineService.deleteDiscipline(disciplineId).then(() => {
        if(disciplineId == this.selectedDiscipline?.id) this.selectedDiscipline = null
        this.disciplines = this.disciplines.filter(discipline => discipline.id !== disciplineId)

        if(fillSelectedDiscipline && !this.selectedDiscipline && (this.disciplines || []).length) this.selectedDiscipline = this.disciplines?.[0]
      })
    },
    async updateDiscipline(updatedDiscipline) {
      
      return DisciplineService.updateDiscipline(updatedDiscipline).then((data) => {
        const disciplineIndex = this.disciplines.findIndex(discipline => discipline.id === data[0].id)
        if (disciplineIndex !== -1) {
          this.disciplines.splice(disciplineIndex, 1, data[0])
        }
      })
    },

    async loadGradesConfiguration(){
      if (!this.hasSelectedDiscipline) return 
      
      this.gradesConfiguration = []
      return GradeConfigurationService.listGrades(this.selectedDiscipline?.id).then(grades => {
        this.gradesConfiguration = grades
      })
    },
    async addGradeConfiguration(newGrade) {
      if(!newGrade.discipline_id) {
        if(!this.selectedDiscipline?.id) throw Swal.alertError({title: 'Nenhuma disciplina selecionada'})

        newGrade.discipline_id = this.selectedDiscipline.id
      }

      return GradeConfigurationService.createGradeConfiguration(newGrade).then((data) => {
        this.gradesConfiguration.push(...data)
      })
    },
    async removeGradeConfiguration(gradeId){
      return GradeConfigurationService.deleteGradeConfiguration(gradeId).then(() => {
        this.gradesConfiguration = this.gradesConfiguration.filter(grade => grade.id !== gradeId)
      })
    },
    async updateGradeConfiguration(updatedGrade) {
      if(!updatedGrade.discipline_id) {
        if(!this.selectedDiscipline?.id) return Swal.alertError({title: 'Nenhuma disciplina selecionada'})
        
        updatedGrade.discipline_id = this.selectedDiscipline.id
      }

      return GradeConfigurationService.updateGradeConfiguration(updatedGrade).then((data) => {
        const gradeIndex = this.gradesConfiguration.findIndex(grade => grade.id === data[0].id)
        if (gradeIndex !== -1) {
          this.gradesConfiguration.splice(gradeIndex, 1, data[0])
        }
      })
    },
  },
})