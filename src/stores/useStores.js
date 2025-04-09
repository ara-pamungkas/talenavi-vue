import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchTasks } from '../api/service';

export const useTaskStore = defineStore('tasks', () => {
  const dataSource = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const loadTasks = async () => {
    try {
      loading.value = true;
      dataSource.value = await fetchTasks();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { dataSource, loading, error, loadTasks };
});