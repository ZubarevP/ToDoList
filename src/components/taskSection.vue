<template>
  <div 
    class="wrapper"
    @dragover.prevent
    @dragenter.prevent
    @drop.prevent="onDrop($event, level)"
  >
    <div class="title">{{ getTitle }}</div>
    <div class="tasks"
    >
      <TaskCell
        v-for="item of list"
        :date="+item.lastDate"
        :name="item.name"
        :active="item.active"
        :key="item.createDate"
        draggable="true"
        @dragstart="dragStart($event, item.createDate)"
        @push="redirect($event, item.createDate)"
      ></TaskCell>
    </div>
    <AddIcon
      class="img"
      title="добавить новую задачу (ctrl + enter)"
      @click="redirect('create', 0, level)"
    />
  </div>
</template>

<script>
  import TaskCell from "@/components/taskCell.vue";
  import AddIcon from "@/components/icons/addIcon.vue";
  import { mapActions } from "pinia";
  import { useTaskStore } from "@/stores/task.js"; 

  export default {
    props: {
      level: {
        type: Number,
        required: true,
        validator(value) {
          return [ 0, 1, 2, 3 ].includes(value);
        },
      },
      list: {
        type: Array,
        required: true,
      },
    },

    methods: {
      ...mapActions(useTaskStore, ['changeList']),

      dragStart(evt, id) {
        if(evt && id) {
          evt.dataTransfer.dropEffect = "move";
          evt.dataTransfer.effectAllowed = "move";
          evt.dataTransfer.setData('itemID', id.toString());
        }
      },

      onDrop(evt, list) {
        if(evt && typeof(list) === "number") {
          const itemID = evt.dataTransfer.getData('itemID');
          this.changeList(+itemID, +list);
        }
      },

      redirect(mode, id, level) {
        this.$emit("push", mode, id, level);
      },
    },

    computed: {
      getTitle() {
        switch(this.level) {
          case 0: return "текущие дела"; break;
          case 1: return "важные дела"; break;
          case 2: return "срочные дела"; break;
          case 3: return "приоритетные дела"; break;
        }
      },

      getColor() {
        switch(this.level) {
          case 0: return "#c7fb97"; break;
          case 1: return "#fbf397"; break;
          case 2: return "#fbc598"; break;
          case 3: return "#fb9797"; break;
        }
      },
    },

    emits: ['push'],

    components: { TaskCell, AddIcon },
  };
</script>

<style lang="scss" scoped>
.wrapper::backdrop {
  background-color: lightblue;
}

  .tasks {
    max-height: calc(100% - 65px);
    overflow-y: auto;  
  }

  .title {
    height: 30px;
    background-color: v-bind(getColor);
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    padding: 5px;
    user-select: none;
  }

  .img {
    display: block;
    width: 22px;
    margin: 5px auto 0;
    opacity: .8;
    transition: .1s;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
</style>
