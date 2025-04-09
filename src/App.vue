<script setup>
import { Tabs } from 'ant-design-vue';
import { ref } from 'vue';
import MainTable from './components/MainTable/MainTable.vue';
const { TabPane } = Tabs;

const activeKey = ref('1'); 
</script>

<template>
  <div class="app">
    <Tabs v-model:activeKey="activeKey">
    <TabPane key="1" tab="Main Table">
      <MainTable />
    </TabPane>
    <TabPane key="2" tab="Kanban" force-render>
      Content of Tab Pane 2
    </TabPane>
  </Tabs>
  </div>
</template>

<style scoped>
.app {
  padding: 50px;
}
</style>