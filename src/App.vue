<template>
  <v-app>
    <section class="progress-bar ">
      <v-progress-linear
        v-if="isLoading"
        :model-value="progress"
        color="blue"
        height="4"
        absolute
        top
      />
    </section>
    <v-navigation-drawer
      permanent
      elevation="2"
      class="tw-border-r-1 tw-border-gray-700"
    >
      <section class="d-flex flex-column align-center justiy-center px-2 fill-height tw-bg-indigo-600 gap-4 full-width">
        <header class="d-flex flex-column align-center justiy-center flex-wrap full-width">
          <span class="mt-8 mb-8 tw-font-semibold tw-text-center tw-text-indigo-50 tw-text-xl ">Notas Online</span>
          <div style="overflow: hidden; border-radius: 50%;">
            <img
              src="@/assets/logotipo.jpg"
              alt="Vue logo"
              style="max-width: 120px;"
            >
          </div>
        </header>
        <body class="d-flex tw-gap-4 flex-column tw-flex-grow mt-15">
          <section
            v-for="(option, index) in options"
            :key="index"
            class="px-6 py-3 tw-bg hover:tw-bg-indigo-700 transition-all tw-rounded-lg cursor-pointer tw-text-indigo-50"
            :class="isSeletected(option.value) ? 'tw-bg-indigo-800' : ''"
            @click="open(option)">
            <v-icon class="mr-5" size="18">
              {{ option.icon }}
            </v-icon>
            <span class="tw-text-sm">{{ option.name }}</span>
          </section>
        </body>
      </section>
    </v-navigation-drawer>

    <v-app-bar elevation="0">
      <section class="d-flex px-6 tw-justify-between tw-bg-gray-100 tw-h-full tw-flex-grow tw-items-center tw-border-b tw-border-gray-200">
        <span v-if="hasSelectedDiscipline" class="tw-font-semibold tw-text-md tw-text-indigo-800">
          Disciplina: {{ selectedDiscipline.name }}
        </span>
        <section v-else class="d-flex tw-items-center tw-text-sm tw-text-red-700 tw-border pa-2 tw-rounded-md tw-border-red-500 tw-bg-red-200 tw-font-semibold">
          <v-icon class="mr-2">
            fa-solid fa-circle-xmark
          </v-icon>
          Não há disciplina selecionada
        </section>

        <v-autocomplete
          label="Escolher disciplina"
          density="compact"
          class="tw-max-w-96 tw-text-indigo-800"
          hide-details
          item-title="name"
          return-object
          :rules="[required]"
          :model-value="selectedDiscipline"
          @update:modelValue="(value) => changeSelectedDiscipline(value)"
          :items="disciplines"
        />
      </section>
    </v-app-bar>

    <v-main style="min-height: 300px;">
      <router-view />
    </v-main>
  </v-app>
</template>


<script>
import { useDisciplineStore } from '@/store/discipline.js'
import { mapState, mapActions } from "pinia";
import { required } from "@/utils/validations";
import { useLoadingStore } from '@/store/loading';

export default {
  name: "App",
  components: {},
  data() {
    return {
      selected: '/students',
    }
  },
  computed: {
    ...mapState(useDisciplineStore, ['disciplines', 'selectedDiscipline', 'hasSelectedDiscipline']),
    ...mapState(useLoadingStore, ['isLoading', 'progress']),
    options() {
      return [{
          name: 'Disciplinas', 
          icon: 'fa-solid fa-school', 
          value: '/disciplines', 
          path: '/disciplines'
        },{
          name: 'Alunos', 
          icon: 'fas fa-user-graduate', 
          value: '/students', 
          path: '/students'
        },{
          name: 'Aprovados', 
          icon: 'fas fa-thumbs-up', 
          value: 'approved', 
          path: '/students/?filter=approved'
        },{
          name: 'Em recuperação', 
          icon: 'fas fa-book-reader', 
          value: 'recovery', 
          path: '/students/?filter=recovery'
        },{
          name: 'Reprovados', 
          icon: 'fas fa-thumbs-down', 
          value: 'disapproved', 
          path: '/students/?filter=disapproved'
        },{
          name: 'Configurar Notas', 
          icon: 'fa-solid fa-gear', 
          value: '/config', 
          path: '/config'
        }
      ]
    }
  },
  mounted () {
    this.loadDisciplines();
  },
  watch: {
    '$route.query': {
      handler(newValue) {
        const {filter} = newValue
        this.selected = filter
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(useDisciplineStore, ['changeSelectedDiscipline', 'loadDisciplines']),
    required: required,
    isSeletected(value){
      const { path } = this.$route
      return this.selected === value || value == path
    },
    open(option){ 
      const {path} = option
      if(path !== this.$router.currentRoute.fullPath) this.$router.replace(path)
    }
  },
}
</script>

<style scoped>
.progress-bar {
  z-index: 9999;
}
</style>
