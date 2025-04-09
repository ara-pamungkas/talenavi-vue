<template>
  <div class="main-table-header">
    <Button type="primary" :icon="plusIcon">New Task</Button>

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
  <div>
    <Table
      :dataSource="filteredData"
      :columns="columns"
      :loading="taskStore.loading"
      rowKey="id"
    />
  </div>
</template>

<script setup>
import { Button, Input, Select, Table, Tag } from "ant-design-vue";
import {
  PlusOutlined,
  SearchOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { h, ref, onMounted, computed } from "vue";
import { useTaskStore } from "../../stores/useStores";
import {
  PRIORITY_COLOROS,
  STATUS_COLORS,
  TYPE_COLORS,
} from "../../constants/mainTable.constants";

const { Option: SelectOption } = Select;

const searchQuery = ref("");
const selectedDeveloper = ref(null);
const selectedSort = ref([]);

const searchIcon = h(SearchOutlined);
const plusIcon = h(PlusOutlined);
const userIcon = h(UserOutlined);
const swapIcon = h(SwapOutlined);

const renderTag = (value, colorMap) => {
  const color = colorMap[value] || "default";
  return h(Tag, { color }, () => value);
};

const taskStore = useTaskStore();

const columns = ref([
  {
    title: "Task",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Developer",
    dataIndex: "developer",
    key: "developer",
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    customRender: ({ text }) => renderTag(text, PRIORITY_COLOROS),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    customRender: ({ text }) => renderTag(text, STATUS_COLORS),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    customRender: ({ text }) => renderTag(text, TYPE_COLORS),
  },
  {
    title: "Estimated SP",
    dataIndex: "Estimated SP",
    key: "Estimated SP",
  },
  {
    title: "Actual SP",
    dataIndex: "Actual SP",
    key: "Actual SP",
  },
]);

const handleMultiSort = () => {
  if (!selectedSort.value || selectedSort.value.length === 0) return;

  const sorted = [...taskStore.dataSource].sort((a, b) => {
    for (let sortKey of selectedSort.value) {
      const [field, order] = sortKey.split("-");
      const valA = a[field]?.toString().toLowerCase() ?? "";
      const valB = b[field]?.toString().toLowerCase() ?? "";

      if (valA < valB) return order === "ascend" ? -1 : 1;
      if (valA > valB) return order === "ascend" ? 1 : -1;
      // If equal, check next field
    }
    return 0;
  });

  taskStore.dataSource = sorted;
};

const filteredData = computed(() => {
  let data = taskStore.dataSource;

  if (selectedDeveloper.value) {
    data = data.filter((task) => task.developer === selectedDeveloper.value);
  }

  if (searchQuery.value) {
    data = data.filter((task) =>
      task.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return data;
});

onMounted(() => {
  taskStore.loadTasks();
});
</script>

<style scoped>
.main-table-header {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
