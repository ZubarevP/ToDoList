<template>
  <header>
    <select v-model="showActive">
      <option value="active">активные</option>
      <option value="inactive">не активные</option>
      <option value="all">все</option>
    </select>
    <input type="date" v-model="startDate">
    <input type="date" v-model="endDate">
  </header>
  <TaskModal
    @close="openCloseModal"
    :id="id"
    :open="open"
    :mode="mode"
  ></TaskModal>
  <TaskSection
    v-for="item, i of listsNames"
    :list="this[item]"
    :level="i"
    @push="openCloseModal"
  ></TaskSection>
</template>

<script>
  import TaskSection from "@/components/taskSection.vue";
  import TaskModal from "@/components/taskModal.vue";
  import { mapState, mapWritableState } from "pinia";
  import { useTaskStore } from "@/stores/task.js"; 

  export default {
    data() {
      return {
        open: false,
        id: -1,
        mode: "info",
        listsNames: [
          'zeroList', 
          'firstList', 
          'secondList', 
          'thirdList'
        ],
      };
    },

    computed: {
      ...mapState(useTaskStore, [ 
        'zeroList', 
        'firstList', 
        'secondList', 
        'thirdList' 
      ]),

      ...mapWritableState(useTaskStore, [
        'showActive',
        'startDate',
        'endDate',
      ]),
    },

    methods: {
      openCloseModal(mode, id) {
        this.id = -1; // clear id for watch method
        if(mode) {
          this.id   = +id;
          this.open = true;
          this.mode = mode;
        } else {
          this.open = false;
        }
      },
    },

    components: { 
      TaskSection, 
      TaskModal 
    }
  };
</script>

<style lang="scss" scoped>
</style>
