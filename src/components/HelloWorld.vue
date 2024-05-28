<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button
      type="button"
      @click="increment"
      class="border-2 px-2 rounded hover:border-blue-600 border-solid">
      count is {{ count }}
    </button>
    <div>Double count is {{ doubleCount }}</div>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a
      href="https://vuejs.org/guide/quick-start.html#local"
      target="_blank"
    >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">
    Click on the Vite and Vue logos to learn more
  </p>

  <v-card
    class="mx-auto text-justify mt-5"
    width="400"
    prepend-icon="fas fa-home"
  >
    <template #title>
      {{ $t('address') }}
    </template>


    <v-card-text>
      <p class="pb-4">
        Nesse card deve mostrar uma requisição feita para o ViaCep com objetivo de testar o Axios
      </p>
      <p>{{ `${$t('street')}: ${address.logradouro}` }}</p>
      <p>{{ `${$t('neighborhood')}: ${address.bairro}` }}</p>
      <p>{{ `${$t('city')}: ${address.localidade}` }}</p>
    </v-card-text>
  </v-card>

  <v-text-field
    v-model="cep" 
    label="Cep"
    placeholder="Digite seu cep" 
    class="mt-4" />

  <v-btn @click="getAddress">
    Buscar endereço
  </v-btn>
</template>

<script setup>
  import { ref, onMounted, } from 'vue'
  import CepService from '@/services/public/CepService.js'
  import { countStore } from '@/store/count.js'
  import Swal from '@/plugins/sweetalert'
  import { storeToRefs } from 'pinia'

  defineProps({
    msg: { type: String, default: '' },
  })

  const store = countStore()
  const { count, doubleCount } = storeToRefs(store)

  const increment = store.increment;

  const address = ref({})
  onMounted(() => {
    CepService.getCep('70150-900').then((response) => {
      address.value = response
    })

    Swal.alertSuccess({title: 'Toast sucesso, testando sweet alert2'})
  })


  const cep = ref('')
  function getAddress(){
    CepService.getCep(cep.value).then((response) => {
      address.value = response
    })
  }

</script>

<style scoped>
.read-the-docs {
  color: #888;
}

.card {
  padding: 2em;
}
</style>
