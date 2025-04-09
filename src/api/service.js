import axios from "axios";

const API_URL = "https://mocki.io/v1/9d9895f9-70eb-49d2-99f7-cb3dacca8a94";

export const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      const tasks = response?.data?.data || [];
      return tasks.map((task) => ({
        ...task,
        key: task.id || Date.now().toString(), // Pastikan ada unique key
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };
  
