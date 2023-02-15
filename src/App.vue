<template>
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
  import { mapState } from "pinia";
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
    },

    methods: {
      openCloseModal(mode, id) {
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
