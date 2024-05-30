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
        Nova disciplina
      </v-btn>
    </header>
    <body class="tw-flex-grow pt-6">
      <section class="d-flex tw-gap-4 flex-column">
        <section
          v-for="(loopDiscipline, index) in filteredDisciplines"
          :key="`${loopDiscipline.name}_${index}`"
          class="px-6 py-3 tw-bg hover:tw-bg-indigo-300 tw-bg-indigo-200 transition-all 
                 tw-rounded-lg cursor-pointer tw-justify-between d-flex tw-items-center"
          @click="editDiscipline(loopDiscipline)">
          <span class="tw-text-md tw-text-violet-950 d-flex tw-gap-3 mr-8 tw-flex-wrap flex-column tw-break-all">
            <span>
              <span class="tw-font-bold">Nome: </span>{{ loopDiscipline.name }}
            </span>
            <span class="tw-text-sm">
              <span class="tw-font-semibold">Média (Aprovação): </span>{{ loopDiscipline.passing_grade }}
            </span>
            <span class="tw-text-sm">
              <span class="tw-font-semibold">Média (Reprovação): </span>{{ loopDiscipline.failing_grade }}
            </span>
          </span>
          <section class="d-flex tw-gap-2 transition-all tw-flex-wrap">
            <icon-btn
              size="x-small"
              icon="fas fa-trash"
              elevation="0"
              class="tw-text-sm tw-bg-indigo-100 hover:tw-text-red-500 hover:tw-bg-red-50"
              icon-class="tw-text-sm transition-all"
              @click.stop="deleteDiscipline(loopDiscipline)"
            />
            <icon-btn
              size="x-small"
              icon="fa-solid fa-pen"
              elevation="0"
              class="tw-text-sm tw-bg-indigo-100 hover:tw-text-green-500 hover:tw-bg-green-50"
              icon-class="tw-text-sm transition-all"
              @click.stop="editDiscipline(loopDiscipline)"
            />
          </section>
        </section>
      </section>
    </body>

    <v-dialog
      v-model="dialog"
      max-width="500px"
      @keydown.enter="confirmAction"
    >
      <section class="d-flex flex-column bg-white tw-rounded-md tw-gap-4 px-6">
        <header class="d-flex pt-4">
          <span class="tw-text-sm tw-text-indigo-900">
            {{ edit ? 'Editar disciplina': 'Criar disciplina' }}
          </span>
        </header>
        <section class="d-flex flex-column overflow-auto flex-grow pt-2 pb-3" style="max-height: 60vh;">
          <v-form ref="form" class="d-flex tw-gap-6 flex-column">
            <v-text-field
              class=" tw-text-indigo-800 tw-text-xs"
              v-model="discipline.name"
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
              class="tw-text-green-600 tw-text-xs"
              v-model="discipline.passing_grade"
              validate-on="lazy"
              label="Média (Aprovação)"
              density="compact"
              hide-details="auto"
              :loading="loading"
              placeholder="Média (Aprovação)"
              :rules="[required]"
              variant="outlined" />
            <v-text-field
              type="number"
              class="tw-text-red-600 tw-text-xs"
              v-model="discipline.failing_grade"
              validate-on="lazy"
              label="Média (Reprovação)"
              density="compact"
              hide-details="auto"
              :loading="loading"
              placeholder="Média (Reprovação)"
              :rules="[required]"
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
            @click="handleDiscipline"
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
    name: 'Disciplines',
    components: {
      IconBtn,
    },
    data() {
      return {
        search: '',
        dialog: false,
        discipline: {
          name: '',
          passing_grade: 7,
          failing_grade: 5
        },
        edit: false,
        loading: false,
      }
    },
    computed: {
      ...mapState(useDisciplineStore, ['disciplines', 'selectedDiscipline']),
      filteredDisciplines() {
        return this.disciplines.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()))
      },
    },
    methods: {
      ...mapActions(useDisciplineStore, ['addDiscipline', 'updateDiscipline', 'removeDiscipline']),
      required: required,
      confirmAction(){
        if(this.loading) return

        this.handleDiscipline()
      },
      deleteDiscipline(discipline){
        Swal.confirm({text: `Deseja mesmo apagar a disciplina "${discipline.name}"?`}, () =>{
          this.loading = true
          this.removeDiscipline(discipline.id).then(() => {
            setTimeout(() => {
              Swal.alertSuccess({title: 'Disciplina deletada com sucesso'})
            }, 100);
          }).finally(() => {
            this.loading = false
          })
        })
      },
      editDiscipline(discipline){
        this.discipline = cloneDeep(discipline)
        this.changeDialog(true, true)
      },
      async handleDiscipline(){
        const { valid } = await this.$refs.form.validate()
        if(!valid) return
        
        this.loading = true
        if(this.discipline.id){
          this.updateDiscipline(this.discipline).then(() => {
            setTimeout(() => {
              Swal.alertSuccess({title: 'Disciplina modificada com sucesso'})
              this.changeDialog(false)
            }, 100);
          }).finally(() => {
            this.loading = false
          })
        }else{
          this.addDiscipline(this.discipline).then(() => {
            setTimeout(() => {
              Swal.alertSuccess({title: 'Disciplina adicionada com sucesso'})
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
        if(!value) this.discipline = cloneDeep({      
          name: '',
          passing_grade: 7,
          failing_grade: 5
        })
      }
    },
  }
</script>

<style scoped>

</style>