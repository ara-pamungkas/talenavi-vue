<template>
    <div class="main-table-header">
      <Button :icon="plusIcon" type="primary" @click="showModal">New Task</Button>
  
      <Input
        v-model:value="searchQuery"
        :prefix="searchIcon"
        placeholder="Search task"
        style="width: 200px; height: 32px"
      />
  
      <Select
        v-model:value="selectedDeveloper"
        :suffix-icon="userIcon"
        allowClear
        style="width: 200px; height: 32px"
        placeholder="Person"
      >
        <SelectOption value="Alice">Alice</SelectOption>
        <SelectOption value="Bob">Bob</SelectOption>
        <SelectOption value="Charlie">Charlie</SelectOption>
      </Select>
  
      <Select
        v-model:value="selectedSort"
        placeholder="Sort"
        mode="multiple"
        style="width: 200px"
        @change="handleMultiSort"
        allowClear
        :suffix-icon="swapIcon"
      >
        <SelectOption value="title-ascend">Task (ASC)</SelectOption>
        <SelectOption value="title-descend">Task (DESC)</SelectOption>
        <SelectOption value="developer-ascend">Developer (ASC)</SelectOption>
        <SelectOption value="developer-descend">Developer (DESC)</SelectOption>
        <SelectOption value="priority-ascend">Priority (ASC)</SelectOption>
        <SelectOption value="priority-descend">Priority (DESC)</SelectOption>
        <SelectOption value="status-ascend">Status (ASC)</SelectOption>
        <SelectOption value="status-descend">Status (DESC)</SelectOption>
      </Select>
    </div>
  
    <div class="kanban-board">
      <div class="kanban-column">
        <div class="kanban-column-header">Ready to start</div>
        <div 
          class="kanban-column-content"
          @dragover.prevent
          @drop="handleDrop($event, 'Ready to start')"
        >
          <div
            v-for="(task, index) in readyTasks"
            :key="`ready-${index}-${task.title}`"
            class="task-card"
            draggable="true"
            @dragstart="startDrag($event, task, index, 'Ready to start')"
          >
            <div class="task-card-header">{{ task.title }}</div>
            <div class="task-card-content">
              <p class="task-priority" :class="priorityClass(task.priority)">{{ task.priority }}</p>
              <p class="task-type">{{ task.type }}</p>
              <p class="task-points">SP: {{ task['Estimated SP'] }}</p>
            </div>
            <div class="task-card-footer">
              <p class="task-developer">{{ task.developer }}</p>
            </div>
          </div>
          <div v-if="readyTasks.length === 0" class="empty-column">
            No tasks in this column
          </div>
        </div>
      </div>
  
      <div class="kanban-column">
        <div class="kanban-column-header">In Progress</div>
        <div 
          class="kanban-column-content"
          @dragover.prevent
          @drop="handleDrop($event, 'In Progress')"
        >
          <div
            v-for="(task, index) in inProgressTasks"
            :key="`progress-${index}-${task.title}`"
            class="task-card"
            draggable="true"
            @dragstart="startDrag($event, task, index, 'In Progress')"
          >
            <div class="task-card-header">{{ task.title }}</div>
            <div class="task-card-content">
              <p class="task-priority" :class="priorityClass(task.priority)">{{ task.priority }}</p>
              <p class="task-type">{{ task.type }}</p>
              <p class="task-points">SP: {{ task['Estimated SP'] }}</p>
            </div>
            <div class="task-card-footer">
              <p class="task-developer">{{ task.developer }}</p>
            </div>
          </div>
          <div v-if="inProgressTasks.length === 0" class="empty-column">
            No tasks in this column
          </div>
        </div>
      </div>
  
      <div class="kanban-column">
        <div class="kanban-column-header">Waiting for review</div>
        <div 
          class="kanban-column-content"
          @dragover.prevent
          @drop="handleDrop($event, 'Waiting for review')"
        >
          <div
            v-for="(task, index) in reviewTasks"
            :key="`review-${index}-${task.title}`"
            class="task-card"
            draggable="true"
            @dragstart="startDrag($event, task, index, 'Waiting for review')"
          >
            <div class="task-card-header">{{ task.title }}</div>
            <div class="task-card-content">
              <p class="task-priority" :class="priorityClass(task.priority)">{{ task.priority }}</p>
              <p class="task-type">{{ task.type }}</p>
              <p class="task-points">SP: {{ task['Estimated SP'] }}</p>
            </div>
            <div class="task-card-footer">
              <p class="task-developer">{{ task.developer }}</p>
            </div>
          </div>
          <div v-if="reviewTasks.length === 0" class="empty-column">
            No tasks in this column
          </div>
        </div>
      </div>
  
      <div class="kanban-column">
        <div class="kanban-column-header">Completed</div>
        <div 
          class="kanban-column-content"
          @dragover.prevent
          @drop="handleDrop($event, 'Completed')"
        >
          <div
            v-for="(task, index) in completedTasks"
            :key="`completed-${index}-${task.title}`"
            class="task-card"
            draggable="true"
            @dragstart="startDrag($event, task, index, 'Completed')"
          >
            <div class="task-card-header">{{ task.title }}</div>
            <div class="task-card-content">
              <p class="task-priority" :class="priorityClass(task.priority)">{{ task.priority }}</p>
              <p class="task-type">{{ task.type }}</p>
              <p class="task-points">SP: {{ task['Estimated SP'] }}</p>
            </div>
            <div class="task-card-footer">
              <p class="task-developer">{{ task.developer }}</p>
            </div>
          </div>
          <div v-if="completedTasks.length === 0" class="empty-column">
            No tasks in this column
          </div>
        </div>
      </div>
    </div>

    <CreateTask v-model:open="visible" @task-created="handleNewTask" />
  </template>
  
  <script setup>
  import { Button, Card, Input, Select, message } from "ant-design-vue";
  import {
    PlusOutlined,
    SearchOutlined,
    SwapOutlined,
    UserOutlined,
  } from "@ant-design/icons-vue";
  import { h, ref, onMounted, computed, reactive } from "vue";
  import { useTaskStore } from "../../stores/useStores";
import CreateTask from "../../utils/CreateTask.vue";
  
  const { Option: SelectOption } = Select;
  
  const searchQuery = ref("");
  const selectedDeveloper = ref(null);
  const selectedSort = ref([]);
  
  const searchIcon = h(SearchOutlined);
  const plusIcon = h(PlusOutlined);
  const userIcon = h(UserOutlined);
  const swapIcon = h(SwapOutlined);
  
  const taskStore = useTaskStore();
  const visible = ref(false);
  const currentDragItem = reactive({
    task: null,
    sourceStatus: null
  });

  const handleNewTask = (newTask) => {
  taskStore.addTask(newTask);
};
  
  const showModal = () => {
    visible.value = true;
  };
  
  const readyTasks = computed(() => {
    return filterTasks('Ready to start');
  });
  
  const inProgressTasks = computed(() => {
    return filterTasks('In Progress');
  });
  
  const reviewTasks = computed(() => {
    return filterTasks('Waiting for review');
  });
  
  const completedTasks = computed(() => {
    return filterTasks('Completed');
  });
  
  function filterTasks(status) {
    if (!taskStore.dataSource || !Array.isArray(taskStore.dataSource)) {
      return [];
    }
    
    let filtered = taskStore.dataSource.filter(task => task.status === status);
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(task => 
        (task.title && task.title.toLowerCase().includes(query)) || 
        (task.developer && task.developer.toLowerCase().includes(query)) ||
        (task.type && task.type.toLowerCase().includes(query))
      );
    }
    
    if (selectedDeveloper.value) {
      filtered = filtered.filter(task => 
        task.developer && task.developer.includes(selectedDeveloper.value)
      );
    }
    
    return filtered;
  }
  
  function priorityClass(priority) {
    if (!priority) return '';
    
    const priorityLower = priority.toLowerCase();
    if (priorityLower.includes('critical')) return 'priority-critical';
    if (priorityLower.includes('high')) return 'priority-high';
    if (priorityLower.includes('medium')) return 'priority-medium';
    if (priorityLower.includes('low')) return 'priority-low';
    
    return '';
  }
  
  const handleMultiSort = () => {
    if (!selectedSort.value || selectedSort.value.length === 0) return;
  
    const sorted = [...taskStore.dataSource].sort((a, b) => {
      for (let sortKey of selectedSort.value) {
        const [field, order] = sortKey.split("-");
        const valA = (a[field] || "").toString().toLowerCase();
        const valB = (b[field] || "").toString().toLowerCase();
  
        if (valA < valB) return order === "ascend" ? -1 : 1;
        if (valA > valB) return order === "ascend" ? 1 : -1;
      }
      return 0;
    });
  
    taskStore.dataSource = sorted;
  };
  
  function startDrag(event, task, index, sourceStatus) {
    currentDragItem.task = task;
    currentDragItem.sourceStatus = sourceStatus;
    
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    
    event.dataTransfer.setData("text/plain", JSON.stringify({
      title: task.title,
      sourceStatus: sourceStatus
    }));
  }
  
  function handleDrop(event, targetStatus) {
    event.preventDefault();
    
    if (!currentDragItem.task) {
      console.error("No task is being dragged");
      return;
    }
    
    if (currentDragItem.sourceStatus === targetStatus) {
      return;
    }
    
    try {
      const taskIndex = taskStore.dataSource.findIndex(t => 
        t.title === currentDragItem.task.title && 
        t.status === currentDragItem.sourceStatus
      );
      
      if (taskIndex === -1) {
        console.error("Task not found in dataSource", currentDragItem.task);
        message.error("Failed to move task: Task not found");
        return;
      }
      
      const updatedDataSource = [...taskStore.dataSource];
      
      updatedDataSource[taskIndex] = {
        ...updatedDataSource[taskIndex],
        status: targetStatus
      };
      
      taskStore.dataSource = updatedDataSource;
      
      message.success(`Moved "${currentDragItem.task.title}" to ${targetStatus}`);
      
    } catch (error) {
      console.error("Error during drag and drop:", error);
      message.error("Failed to move task: " + error.message);
    } finally {
      currentDragItem.task = null;
      currentDragItem.sourceStatus = null;
    }
  }
  
  onMounted(() => {
    taskStore.loadTasks();
  });
  </script>
  
  <style scoped>
  .kanban-board {
    display: flex;
    gap: 16px;
    margin-top: 20px;
    overflow-x: auto;
    min-height: 500px;
    padding-bottom: 16px;
  }
  
  .kanban-column {
    flex: 1;
    min-width: 250px;
    background-color: #f7f7f7;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
  }
  
  .kanban-column-header {
    padding: 12px;
    font-weight: bold;
    background-color: #e0e0e0;
    border-radius: 8px 8px 0 0;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  .kanban-column-content {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 200px;
  }
  
  .task-card {
    background-color: white;
    border-radius: 6px;
    padding: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: grab;
    border-left: 4px solid #d9d9d9;
    transition: all 0.2s ease;
  }
  
  .task-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  .task-card[draggable=true]:active {
    cursor: grabbing;
    opacity: 0.7;
  }
  
  .task-card-header {
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .task-card-content {
    margin-bottom: 12px;
  }
  
  .task-card-content p {
    margin: 4px 0;
  }
  
  .task-priority {
    font-weight: 500;
  }
  
  .priority-critical {
    color: #f5222d;
  }
  
  .priority-high {
    color: #fa8c16;
  }
  
  .priority-medium {
    color: #1890ff;
  }
  
  .priority-low {
    color: #52c41a;
  }
  
  .task-card-footer {
    border-top: 1px solid #eee;
    padding-top: 8px;
    font-size: 0.9em;
    color: #666;
  }
  
  /* Main header spacing */
  .main-table-header {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  
  .empty-column {
    padding: 16px;
    color: #999;
    text-align: center;
    font-style: italic;
    border: 2px dashed #ddd;
    border-radius: 6px;
  }
  </style>