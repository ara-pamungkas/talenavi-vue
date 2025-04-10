<template>
    <Modal
      :open="modelValue"
      title="New Task"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :style="{ zIndex: 1000 }"
    >
      <Form :model="form" ref="formRef" layout="vertical">
        <FormItem
          label="Title"
          name="title"
          :rules="[{ required: true, message: 'Please input title!' }]"
        >
          <Input v-model:value="form.title" />
        </FormItem>
        
        <FormItem
          label="Developer"
          name="developer"
          :rules="[{ required: true, message: 'Please select developer!' }]"
        >
          <Select 
            v-model:value="form.developer" 
            mode="multiple"
            placeholder="Select developers"
          >
            <SelectOption v-for="dev in developers" :key="dev" :value="dev">
              {{ dev }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem
          label="Priority"
          name="priority"
          :rules="[{ required: true, message: 'Please select priority!' }]"
        >
          <Select v-model:value="form.priority" placeholder="Select priority">
            <SelectOption 
              v-for="priority in priorities" 
              :key="priority" 
              :value="priority"
            >
              {{ priority }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem
          label="Status"
          name="status"
          :rules="[{ required: true, message: 'Please select status!' }]"
        >
          <Select v-model:value="form.status" placeholder="Select status">
            <SelectOption 
              v-for="status in statuses" 
              :key="status" 
              :value="status"
            >
              {{ status }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem
          label="Type"
          name="type"
          :rules="[{ required: true, message: 'Please select type!' }]"
        >
          <Select v-model:value="form.type" placeholder="Select type">
            <SelectOption 
              v-for="type in types" 
              :key="type" 
              :value="type"
            >
              {{ type }}
            </SelectOption>
          </Select>
        </FormItem>
        
        <FormItem
          label="Estimated SP"
          name="estimatedSP"
          :rules="[{ required: true, message: 'Please input estimated SP!' }]"
        >
          <InputNumber v-model:value="form.estimatedSP" :min="0" />
        </FormItem>
        
        <FormItem
          label="Actual SP"
          name="actualSP"
          :rules="[{ required: true, message: 'Please input actual SP!' }]"
        >
          <InputNumber v-model:value="form.actualSP" :min="0" />
        </FormItem>
      </Form>
    </Modal>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { 
    Form, 
    FormItem, 
    Input, 
    InputNumber, 
    Modal, 
    Select, 
    message 
  } from "ant-design-vue";
  
  const { Option: SelectOption } = Select;
  
  const props = defineProps({
    modelValue: Boolean,
  });
  
  const emit = defineEmits(["update:modelValue", "created"]);
  
  const formRef = ref();
  
  const developers = ['Alice', 'Bob', 'Charlie'];
  const priorities = ['Low', 'Medium', 'High', 'Critical', 'Best Effort'];
  const statuses = ['In Progress', 'Ready to start', 'Waiting for review', 'Done', 'Stuck', 'Pending Deploy'];
  const types = ['Other', 'Bug', 'Feature Enhancement'];
  
  const form = ref({
    title: '',
    developer: [],
    priority: '',
    status: '',
    type: '',
    estimatedSP: 0,
    actualSP: 0
  });
  
  const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    
    const newTask = {
      title: form.value.title,
      developer: form.value.developer,
      priority: form.value.priority,
      status: form.value.status,
      type: form.value.type,
      'Estimated SP': form.value.estimatedSP,
      'Actual SP': form.value.actualSP,
      key: Date.now()
    };
    
    emit('task-created', newTask);
    message.success('Task created!');
    formRef.value.resetFields();
    emit('update:modelValue', false);
    
  } catch (error) {
    message.error('Validation failed');
  }
};
  
  const handleCancel = () => {
    formRef.value.resetFields();
    emit('update:modelValue', false);
  };
  </script>