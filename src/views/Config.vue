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
        Nova nota
      </v-btn>
    </header>
    <body class="tw-flex-grow pt-6">
      <div class="tw-text-xl tw-font-semibold mb-4 tw-text-indigo-800">
        Notas cadastradas
      </div>
      <v-data-table
        :headers="headers"
        :items="filteredGrades"
        autofocus
        no-data-text="Nenhuma nota configurada"
        class="elevation-1 tw-rounded-md tw-text-indigo-950 tw-text-xs"
        hide-default-footer
      >
        <template #[`item.actions`]="{ item }">
          <section class="d-flex tw-gap-2 transition-all tw-flex-wrap">
            <icon-btn
              size="x-small"
              icon="fas fa-trash"
              elevation="0"
              class="tw-text-sm tw-bg-indigo-100 hover:tw-text-red-500 hover:tw-bg-red-50"
              icon-class="tw-text-sm transition-all"
              @click.stop="deleteGrade(item)"
            />
            <icon-btn
              size="x-small"
              icon="fa-solid fa-pen"
              elevation="0"
              class="tw-text-sm tw-bg-indigo-100 hover:tw-text-green-500 hover:tw-bg-green-50"
              icon-class="tw-text-sm transition-all"
              @click.stop="editGrade(item)"
            />
          </section>
        </template>
      </v-data-table>

      <div class="mt-5 tw-font-semibold tw-text-indigo-800 tw-text-ms">
        Soma dos pesos: {{ gradesWeightSum }}
      </div>
    </body>

    <v-dialog
      v-model="dialog"
      max-width="500px"
      @keydown.enter="confirmAction"
    >
      <section class="d-flex flex-column bg-white tw-rounded-md tw-gap-4 px-6">
        <header class="d-flex pt-4">
          <span class="tw-text-sm tw-text-indigo-900">
            {{ edit ? 'Editar nota': 'Criar nota' }}
          </span>
        </header>
        <section class="d-flex flex-column overflow-auto flex-grow pt-2 pb-3" style="max-height: 60vh;">
          <section v-if="!hasSelectedDiscipline" class="d-flex tw-items-center tw-text-sm tw-text-red-700 tw-border pa-2 tw-rounded-md tw-border-red-500 tw-bg-red-200 tw-font-semibold">
            <v-icon class="mr-2">
              fa-solid fa-circle-xmark
            </v-icon>
            Ainda não existe disciplina selecionada, escolha ou crie uma para configurar as notas
          </section>
          <v-form
            ref="form"
            class="d-flex tw-gap-6 flex-column"
            v-if="hasSelectedDiscipline">
            <v-text-field
              class=" tw-text-indigo-800 tw-text-xs"
              v-model="grade.name"
              autofocus
              validate-on="lazy"
              label="Nome"
              density="compact"
              hide-details="auto"
              :loading="loading"
              placeholder="Nome"
              :rules="[required]"
              variant="outlined" />
            <v-text-field
              type="number"
              class=" tw-text-indigo-800 tw-text-xs"
              v-model="grade.weight"
              validate-on="lazy"
              label="Peso (Se não for usar deixar 0)"
              density="compact"
              hide-details="auto"
              :loading="loading"
              placeholder="Peso (Se não for usar deixar 0)"
              :rules="[required]"
              variant="outlined" />
            <v-text-field
              class=" tw-text-indigo-800 tw-text-xs"
              v-model="grade.description"
              validate-on="lazy"
              label="Descrição (Opcional)"
              density="compact"
              hide-details="auto"
              :loading="loading"
              placeholder="Descrição (Opcional)"
              variant="outlined" />
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
            @click="handleGrade"
            :disabled="!hasSelectedDiscipline"
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
  import { mapState, mapActions } from "pinia";
  import IconBtn from "@/components/IconBtn.vue"
  import Swal from '@/plugins/sweetalert'
  export default {
    name: 'Students',
    components: {
      IconBtn,
    },
    data() {
      return {
        headers: [
          {title: 'Nome', value: 'name'},
          {title: 'Peso', value: 'weight'},
          {title: 'Descrição', value: 'description'},
          {title: 'Ações', value: 'actions', sortable: false},
        ],
        search: '',
        dialog: false,
        grade: {
          name: '',
          weight: 0,
          description: ''
        },
        edit: false,
        loading: false,
      }
    },
    mounted () {
      this.loadGradesConfiguration();
    },
    watch: {
      selectedDiscipline() {
        this.loadGradesConfiguration()
      }
    },
    computed: {
      ...mapState(useDisciplineStore, ['gradesConfiguration', 'gradesWeightSum', 'selectedDiscipline', 'hasSelectedDiscipline']),
      filteredGrades() {
        return this.gradesConfiguration.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()))
      },
    },
    methods: {
      ...mapActions(useDisciplineStore, ['addGradeConfiguration', 'updateGradeConfiguration', 'loadGradesConfiguration', 'removeGradeConfiguration']),
      required: required,
      confirmAction(){
        if(!this.hasSelectedDiscipline || this.loading) return

        this.handleGrade()
      },
      deleteGrade(grade){
        Swal.confirm({text: `Deseja mesmo apagar a nota "${grade.name}"?`}, () =>{
          this.loading = true
          this.removeGradeConfiguration(grade.id).then(() => {
            setTimeout(() => {
              Swal.alertSuccess({title: 'Nota deletada com sucesso'})
            }, 100);
          }).finally(() => {
            this.loading = false
          })
        })
      },
      editGrade(grade){
        this.grade = cloneDeep(grade)
        this.changeDialog(true, true)
      },
      async handleGrade(){
        const { valid } = await this.$refs.form.validate()
        if(!valid) return
        
        this.loading = true
        if(this.grade.id){
          this.updateGradeConfiguration(this.grade).then(() => {
            setTimeout(() => {
              Swal.alertSuccess({title: 'Nota atualizada com sucesso'})
              this.changeDialog(false)
            }, 100);
          }).finally(() => {
            this.loading = false
          })
        }else{
          this.addGradeConfiguration(this.grade).then(() => {
            setTimeout(() => {
              Swal.alertSuccess({title: 'Nota criada com sucesso'})
              this.changeDialog(false)
            }, 100);
          }).finally(() => {
            this.loading = false
          })
        }
      },
      changeDialog(value, edit = false){
        this.$refs?.form?.resetValidation()
        this.edit = edit
        this.dialog = value;
        if(!value) this.grade = cloneDeep({      
          name: '',
          weight: 0,
          description: ''
        })
      }
    },
  }
</script>

<style scoped>

</style>