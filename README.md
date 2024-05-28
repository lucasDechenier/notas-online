# **Vue3 starter kit**

Vue3 stater kit é um repositório criado por meio do [**Vite**](https://vitejs.dev/) para início rápido de aplicações em [**Vue 3**](https://vuejs.org/). Nesse repositório você irá encontrar os melhores recursos utilizados em grandes aplicações de [**Vue 3**](https://vuejs.org/).

<p align="center">
  <a href="#-Implementações">Implementações</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-Executando">Executando</a> 
</p>

## 🖥️ Implementações:

-   🔰 [Vue 3](https://vuejs.org/)
-   ⚡️  [Vite](https://vitejs.dev/)
-   🔥 [Nova `<script setup>` sintaxe](https://vuejs.org/api/sfc-script-setup.html)
-   🍩 Caixas de pop-ups com [Sweetalert2](https://sweetalert2.github.io/)
-   🎨 [Tailwind CSS](https://tailwindcss.com/)
-   ❄️  [Vuetify 3 Framework](https://next.vuetifyjs.com/en/) biblioteca de componentes moderna
-   😃 [Font Awesome](https://fontawesome.com/) utilização de ícones modernos com o v-icon do Vuetify
-   ✈️  Gerenciamento de rotas com [Vue Router](https://router.vuejs.org/)
-   📡  Requisições HTTP com [Axios](https://axios-http.com/docs/intro)
-   🌐 [Vue i18n](https://vue-i18n.intlify.dev/) para internacionalização de textos
-   🍍 Gerenciamento de estados com [Pinia](https://pinia.vuejs.org/)
-   👮 Qualidade de código garantida com [Vue ESLint](https://eslint.vuejs.org/)

## 🚀 Executando

```bash
# Clone o repositório
git clone git@github.com:lucasDechenier/starter-kit.git
# Entre no arquivo do projeto
cd starter-kit
# Crie um .env como no exemplo fornecido, necessário para consumo do axios
cp .env.example .env
# Instale as depedências com yarn
yarn install
# Levante o servidor de desenvolvimento do Vite
yarn dev
# Vá para http://localhost:8080
```

## 📃 Informações adicionais

O projeto contém o mínimo de modificações dos plugins e frameworks. 

Você irá encontrar mudanças no .eslintrc.cjs para melhoria do Eslint e foi modificado em vite.config.js a porta padrão do servidor adicionando: `server: { port: 8080 }`.
