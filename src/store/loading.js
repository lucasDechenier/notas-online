// stores/loading.js
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loadingCount: 0,
    progress: 0,
    isLoading: false,
  }),
  actions: {
    setLoading(isLoading) {
      if (isLoading) {
        this.loadingCount++;
        if (this.loadingCount === 1) {
          this.startProgress();
        }
      } else {
        if (this.loadingCount > 0) {
          this.loadingCount--;
          if (this.loadingCount === 0) {
            this.completeProgress();
          }
        }
      }
    },
    startProgress() {
      this.isLoading = true
      this.progress = 0;
      const interval = setInterval(() => {
        if (this.loadingCount > 0) {
          if (this.progress < 99) {
            this.progress += 1;
          } else {
            clearInterval(interval);
          }
        } else {
          clearInterval(interval);
        }
      }, 100);
    },
    completeProgress() {
      const totalIncrement = 100 - this.progress
      const duration = 200;
      const interval = 1;
      const steps = duration / interval; // quantas vezes o intervalo será chamado
      const increment = totalIncrement / steps; // quanto o progresso deve aumentar a cada intervalo
    
      const intervalId = setInterval(() => {
        this.progress += increment; // incrementa o progresso
        if (this.progress >= 100) {
          clearInterval(intervalId); // limpa o intervalo quando o progresso atinge ou ultrapassa 100%
          setTimeout(() => {
            this.isLoading = false; // define o estado de carregamento como falso
            this.progress = 0
          }, 210);
        }
      }, interval);
    }
    
  },
});
