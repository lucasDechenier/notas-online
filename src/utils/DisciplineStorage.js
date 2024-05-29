//import { useSessionStore } from '@/stores/session'

const SELECTED_DISCIPLINE_KEY = () => {
  const sessionStore = {}
  return `NOTAS_SELECTED_DISCIPLINE_KEY${sessionStore?.userLogged ? sessionStore.userLogged.id : 'GUEST'}`;
}

export default {
  saveSelectedDiscipline: (value) => {
    localStorage.setItem(SELECTED_DISCIPLINE_KEY(), JSON.stringify(value));
  },
  getSelectedDiscipline(){
    const item = localStorage.getItem(SELECTED_DISCIPLINE_KEY());
    return JSON.parse(item) || null;
  },
}
