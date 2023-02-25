<template>
  <div class="wrapper">
    <div class="title">{{ getTitle }}</div>
    <div class="tasks">
      <TaskCell
        v-for="item of list"
        :date="+item.lastDate"
        :name="item.name"
        :active="item.active"
        :key="item.createDate"
        @push="redirect($event, item.createDate)"
      ></TaskCell>
    </div>
    <AddIcon
      class="img"
      title="добавить новую задачу (ctrl + enter)"
      @click="redirect('create', 0)"
    />
  </div>
</template>

<script>
  import TaskCell from "@/components/taskCell.vue";
  import AddIcon from "@/components/icons/addIcon.vue";

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
  .tasks {
    max-height: calc(100% - 65px);
    overflow-y: scroll;  
  }

  .title {
    height: 30px;
    background-color: v-bind(getColor);
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    padding: 5px;
  }

  .img {
    display: block;
    width: 22px;
    margin: 0 auto;
    opacity: .8;
    transition: .1s;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
</style>
