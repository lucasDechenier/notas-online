<template>
  <section class="tw-bg-gray-50 fill-height d-flex flex-column px-6 py-6">
    <header class="d-flex pt-6 tw-justify-between fill-width tw-w-full tw-items-center">
      <v-text-field
        class="tw-max-w-96 pr-10 tw-text-indigo-800 tw-text-xs"
        v-model="search"
        label="Buscar"
        density="compact"
        hide-details
        placeholder="Buscar"
        variant="outlined" />
      <v-btn
        class="tw-bg-indigo-800 tw-text-white tw-text-xs"
        elevation="0"
        @click="changeDialog(true)"
      >
        Novo aluno
      </v-btn>
    </header>
    <body class="tw-flex-grow pt-6">
      <div class="tw-text-xl tw-font-semibold mb-4 tw-text-indigo-800 d-flex tw-justify-between tw-items-center">
        Alunos (Notas)
        <v-btn
          class="tw-bg-green-600 tw-text-white tw-text-xs"
          elevation="0"
          @click="generateExcell"
        >
          Exportar Excell
        </v-btn>
      </div>
      <v-data-table
        :headers="tableHeaders"
        :items="filteredStudents"
        autofocus
        no-data-text="Nenhuma nota configurada"
        class="elevation-1 tw-rounded-md tw-text-indigo-950 tw-text-xs"
        hide-default-footer
      >
        <template #[`item.situation`]="{ item }">
          <section class="d-flex">
            <v-chip
              class="justify-center flex-grow px-3"
              :class="setColor(item)"
              label
              small
            >
              <span class="tw-text-sm">
                {{ getSituation(item) }}
              </span>
            </v-chip>
          </section>
        </template>
        <template #[`item.actions`]="{ item }">
          <section class="d-flex tw-gap-2 transition-all tw-flex-wrap">
            <icon-btn
              size="x-small"
              icon="fas fa-trash"
              elevation="0"
              class="tw-text-sm tw-bg-indigo-100 hover:tw-text-red-500 hover:tw-bg-red-50"
              icon-class="tw-text-sm transition-all"
              @click.stop="deleteStudent(item)"
            />
            <icon-btn
              size="x-small"
              icon="fa-solid fa-pen"
              elevation="0"
              class="tw-text-sm tw-bg-indigo-100 hover:tw-text-green-500 hover:tw-bg-green-50"
              icon-class="tw-text-sm transition-all"
              @click.stop="editStudent(item)"
            />
          </section>
        </template>
      </v-data-table>
    </body>

    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <section class="d-flex flex-column bg-white tw-rounded-md tw-gap-4 px-6">
        <header class="d-flex pt-4">
          <span class="tw-text-sm tw-text-indigo-900">
            {{ edit ? 'Editar aluno': 'Criar aluno' }}
          </span>
        </header>
        <section class="d-flex flex-column overflow-auto flex-grow pt-2 pb-3" style="max-height: 60vh;">
          <v-form ref="form" class="d-flex tw-gap-6 flex-column">
            <v-text-field
              class=" tw-text-indigo-800 tw-text-xs"
              v-model="student.name"
              autofocus
              validate-on="lazy"
              label="Nome"
              density="compact"
              hide-details="auto"
              :loading="loading"
              placeholder="Nome"
              :rules="[required]"
              variant="outlined" />
            <section
              v-for="gradeConfig in gradesConfiguration"
              :key="`${gradeConfig.name}_${gradeConfig.id}`">
              <v-text-field
                type="number"
                class=" tw-text-indigo-800 tw-text-xs"
                v-model="student.grades[gradeConfig.id]"
                validate-on="lazy"
                :label="gradeConfig.name"
                density="compact"
                hide-details="auto"
                :loading="loading"
                :rules="[required]"
                variant="outlined" />
            </section>
          </v-form>
        </section>
        <footer class="d-flex align-center justify-space-between bg-white pb-6">
          <v-btn
            outlined
            :loading="loading"
            class="tw-text-red-500"
            variant="outlined"
            @click="changeDialog(false)"
          >
            Cancelar
          </v-btn>
          <v-btn
            outlined
            :loading="loading"
            class="tw-text-green-500"
            variant="outlined"
            @click="handleStudent"
          >
            {{ edit ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </footer>
      </section>
    </v-dialog>
  </section>
</template>

<script>
  import { required } from "@/utils/validations";
  import { cloneDeep } from 'lodash'
  import { useDisciplineStore } from '@/store/discipline.js'
  import { useStudentStore } from '@/store/student.js'
  import { mapState, mapActions } from "pinia";
  import IconBtn from "@/components/IconBtn.vue"
  import Swal from '@/plugins/sweetalert'
  import * as XLSX from 'xlsx';

  export default {
    name: 'Students',
    components: {
      IconBtn,
    },
    data() {
      return {
        student: {
          name: '',
          grades: {}
        },
        search: '',
        dialog: false,
        edit: false,
        loading: false,
        filter: null
      }
    },
    mounted () {
      this.loadGradesConfiguration();
      this.loadStudents()
    },
    watch: {
      selectedDiscipline() {
        this.loadStudents()
      },
      '$route.query': {
        handler(newValue) {
          const {filter} = newValue
          this.filter = filter
        },
        immediate: true,
        deep: true
      },
    },
    computed: {
      ...mapState(useDisciplineStore, ['gradesConfiguration', 'selectedDiscipline']),
      ...mapState(useStudentStore, ['students']),
      tableHeaders(){
        return [
          { title: 'Nome', value: 'name' },
          ...this.gradesConfiguration.map(grade => {
            return { title: grade.name, value: `header_${grade.id}` }
          }),
          { title: 'Media', value: 'average'},
          { title: 'Situação', value: 'situation', sortable: false },
          { title: 'Ações', value: 'actions', sortable: false },
        ]
      },
      mountedStudents(){
        const mounted_students = this.students.map(student => {
          this.gradesConfiguration.map(grade => {
            student[`header_${grade.id}`] = student.student_grades.find(
              student_grade => student_grade.grade_config_id == grade.id
            )?.value || 0
          })
          let situation = 'approved'
          const average = this.getAverage(student)
          if(average < this.selectedDiscipline.failing_grade) {
            situation = 'disapproved'
          } else if(average < this.selectedDiscipline.passing_grade) {
            situation = 'recovery'
          }
          student['average'] = average
          student['situation'] = situation
          return student
        })
        return mounted_students
      },
      filteredStudents() {
        let mountedStudents = this.mountedStudents.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()))
        if(this.filter) mountedStudents = mountedStudents.filter(student => student.situation == this.filter)
        return mountedStudents
      },
    },
    methods: {
      ...mapActions(useDisciplineStore, ['loadGradesConfiguration']),
      ...mapActions(useStudentStore, ['loadStudents', 'addStudent', 'updateStudent', 'removeStudent']),
      required: required,
      generateExcell(){
        const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).slice(0, 10).replace(/-/g, '_');
        const fileName = `${this?.selectedDiscipline?.name}_${date}`

        let data = this.mountedStudents.map(student => {
          const item = {}
          const exclude_headers = ['actions']
          this.tableHeaders.forEach(header => {
            if(exclude_headers.includes(header.value)) return;

            let value = student[header.value]

            if(header.value == 'situation') value = this.getSituation(student)
            item[header.title] = value
          })
          return item
        })
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Notas (${this?.selectedDiscipline?.name})`);
        XLSX.writeFile(workbook, fileName + '.xlsx');
      },
      deleteStudent(student){
        Swal.confirm({text: `Deseja mesmo apagar o aluno "${student.name}"?`}, () =>{
          this.loading = true
          this.removeStudent(student.id).then(() => {
            Swal.alertSuccess({title: 'Aluno apagado com sucesso'})
          }).finally(() => {
            this.loading = false
          })
        })
      },
      editStudent(student){
        let editStudent = this.students.find(findStudent => findStudent.id === student.id)
        editStudent = {
          id: editStudent.id,
          name: editStudent.name,
          grades: editStudent.student_grades.reduce((accumulator, currentValue) => {
            accumulator[currentValue.grade_config_id] = currentValue.value
            return accumulator
          }, {})
        }
        this.student = cloneDeep(editStudent)
        this.changeDialog(true, true)
      },
      getAverage(student){
        let editStudent = this.students.find(findStudent => findStudent.id === student.id);

        const totalGrades = editStudent.student_grades.length;
        const { sum, totalWeight, sumWithWeight } = editStudent.student_grades.reduce((acc, grade) => {
          const gradeConfig = this.gradesConfiguration.find(config => config.id === grade.grade_config_id);
          if (gradeConfig) {
            acc.sum += parseFloat(grade.value) || 0
            acc.sumWithWeight+= (parseFloat(grade.value) * parseFloat(gradeConfig.weight)) || 0;
            acc.totalWeight += parseFloat(gradeConfig.weight) || 0;
          }
          return acc;
        }, { sum: 0, totalWeight: 0 });

        const average = (totalWeight > 0 ? sumWithWeight / totalWeight : sum / totalGrades) || 0;
        return average;
      },
      async handleStudent(){
        const { valid } = await this.$refs.form.validate()
        if(!valid) return
        
        this.loading = true
        if(this.student.id){
          this.updateStudent(this.student).then(() => {
            Swal.alertSuccess({title: 'Aluno atualizado com sucesso'})
            this.changeDialog(false)
          }).finally(() => {
            this.loading = false
          })
        }else{
          this.addStudent(this.student).then(() => {
            Swal.alertSuccess({title: 'Aluno criado com sucesso'})
            this.changeDialog(false)
          }).finally(() => {
            this.loading = false
          })
        }
      },
      changeDialog(value, edit = false){
        this.$refs?.form?.resetValidation()
        this.edit = edit
        this.dialog = value;
        if(!value) this.student = cloneDeep({
          name: '',
          grades: {}
        })
      },
      getSituation(item){
        const options = {
          approved: 'Aprovado',
          disapproved: 'Reprovado',
          recovery: 'Em recuperação'
        }
        return options[item.situation] || 'Status inválido'
      },
      setColor(item) {
        const options = {
          approved: 'bg-green',
          disapproved: 'bg-red',
          recovery: 'bg-primary'
        }
        return options[item.situation] || 'bg-primary'
      },
    },
  }
</script>

<style scoped>

</style>