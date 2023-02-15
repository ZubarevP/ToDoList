<template>
  <div class="wrapper">
    <div class="title">{{ getTitle }}</div>
    <TaskCell
      v-for="item of list"
      :date="+item.lastDate"
      :name="item.name"
      :key="item.createDate"
      @push="redirect($event, item.createDate)"
    ></TaskCell>
    <button 
      class="button"
      @click="redirect('create', 0)"
    >добавить задание</button>
  </div>
</template>

<script>
  import TaskCell from "@/components/taskCell.vue";

  export default {
    props: {
      level: {
        type: Number,
        required: true,
        validator(value) {
          const values = [ 0, 1, 2, 3];
          return values.includes(value);
        },
      },
      list: {
        type: Array,
        required: true,
      },
    },

    methods: {
      redirect(mode, id) {
        this.$emit("push", mode, id);
      },
    },

    computed: {
      getTitle() {
        switch(this.level) {
          case 0: return "текущие дела"; break;
          case 1: return "важные дела"; break;
          case 2: return "срочные дела"; break;
          case 3: return "первоочередные дела"; break;
        }
      },

      getColor() {
        switch(this.level) {
          case 0: return "green"; break;
          case 1: return "yellow"; break;
          case 2: return "orange"; break;
          case 3: return "red"; break;
        }
      },
    },

    emits: ['push'],

    components: { TaskCell },
  };
</script>

<style lang="scss" scoped>
  .title {
    background-color: v-bind(getColor);
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    padding: 5px;
  }
</style>
