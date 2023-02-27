<template> <header 
    class="header"
  >
    <h1 class="h1">ToDo list Эйзенхауэра</h1>
  </header>
  <aside class="aside">
    <h3 class="h3">фильтры</h3>
    <select 
      class="field select"
      v-model="showActive"
    >
      <option value="active">активные</option>
      <option value="inactive">завершенные</option>
      <option value="all">все</option>
    </select>
    <input 
      class="field date" 
      type="date" 
      v-model="startDate"
      title="начало периода"
    >
    <input 
      class="field date" 
      type="date" 
      v-model="endDate"
      title="конец периода"
    >
    <ExcelApp/>
  </aside>
  <TaskModal
    @close="openCloseModal"
    :id="id"
    :open="open"
    :mode="mode"
    :level="level"
  ></TaskModal>
  <TaskSection
    class="section"
    v-for="item, i of listsNames"
    :list="this[item]"
    :level="3 - i"
    @push="openCloseModal"
  ></TaskSection>
</template>

<script>
  import TaskSection from "@/components/taskSection.vue";
  import TaskModal from "@/components/taskModal.vue";
  import ExcelApp from "@/components/excelCreater.vue";
  import { mapState, mapWritableState, mapActions } from "pinia";
  import { useTaskStore } from "@/stores/task.js"; 

  export default {
    data() {
      return {
        open: false,
        id: -1,
        mode: "info",
        level: 0,
        listsNames: [
          'thirdList',
          'secondList', 
          'firstList', 
          'zeroList', 
        ],
      };
    },

    computed: {
      ...mapState(useTaskStore, [ 
        'zeroList', 
        'firstList', 
        'secondList', 
        'thirdList',
      ]),

      ...mapWritableState(useTaskStore, [
        'showActive',
        'startDate',
        'endDate',
      ]),
    },

    methods: {
      ...mapActions(useTaskStore, [
        'serialize',
        'unserialize',
      ]),

      openCloseModal(mode, id, level) {
        this.id       = -1; // clear id for watch method
        this.level    = 0;  // clear level for watch method
        if(mode) {
          this.id     = +id;
          this.open   = true;
          this.mode   = mode;
          this.level  = level ? level : 0;
        } else {
          this.open   = false;
        }
      },
    },

    components: { 
      TaskSection, 
      TaskModal, 
      ExcelApp
    },

    created() {
      window.addEventListener("beforeunload", ()=>{
        this.serialize();
      });

      window.addEventListener("keyup", (e)=>{
        if(e.key === "Enter" && e.ctrlKey) {
          this.openCloseModal('create', 0);
        }

        if(e.key === "Escape") {
          this.openCloseModal();
        }
      });

      this.unserialize();
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/variables";

  .header {
    grid-column: 1 / 4;
    grid-row: 1 / 2;
    @include flex;
    align-items: center;
    padding-left: 20px;
  }

  .h1 {
    color: silver;
    letter-spacing: 2px;
  }

  .h3 {
    text-align: center;
  }

  .aside {
    grid-column: 1 / 2;
    grid-row: 2 / 4;
    padding: 0 10px;
  }

  .field {
    margin-top: 10px;
    border: none;
    outline: none;
    background-color: #e3e8e8;
    border-radius: 3px;
    width: 95%;
    padding: 2px 5px;
    opacity: .7;

    &:hover {
      opacity: 1;
    }

    & + & {
      margin-top: 5px;
    }
  }

  .btn {
    display: inline-block;
    border: none; 
    padding: 5px 15px;
    background-color: #7e74d2;
    color: white;
    margin: 10px auto;
    opacity: .7;
    text-decoration: none;

    &:hover {
      opacity: 1;
    }
  }
</style>
