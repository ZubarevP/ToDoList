<template>
  <div 
    class="wrapper" 
    :class="{finish: active}"
  >
    <div 
      class="text"
      title="подробнее"
      @click="$emit('push', 'info')"
    >{{ getDate + " - " + name}}</div>
    <div class="image-wrapper">
      <EditIcon 
        class="image"
        alt="редактировать задачу"
        title="изменить"
        @click="$emit('push', 'edit')"
      />
      <CheckIcon
        class="image" 
        :active="active"
        alt="завершить задачу"
        @click="$emit('push', 'complete')"
        title="завершить"
      />
      <DeleteIcon
        class="image" 
        alt="удалить задачу"
        title="удалить"
        @click="$emit('push', 'delete')"
      />
      <DragIcon
        class="image" 
        alt="поменять приоритет задачу"
        title="перенести в другой список"
      />
    </div>
  </div>
</template>

<script>
  import EditIcon from "@/components/icons/editIcon.vue";
  import AddIcon from "@/components/icons/addIcon.vue";
  import DeleteIcon from "@/components/icons/deleteIcon.vue";
  import CheckIcon from "@/components/icons/checkIcon.vue";
  import DragIcon from "@/components/icons/dragIcon.vue";
  
  export default {
    props: {
      date: {
        type: Number,
        required: true,
      },
      active: {
        type: Boolean,
        required: true,
      },
      name: {
        type: String,
        required: true,
        validator(value) {
          return value.length;
        },
      },
    },

    computed: {
      getDate() {
        return new Date(this.date).toLocaleDateString("ru-RU");
      }
    },

    emits: [ 'push' ],

    components: { EditIcon, AddIcon, DeleteIcon, CheckIcon, DragIcon },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/variables";

  .wrapper {
    @include flex-space-between;;
    padding: 0px 10px;
    border-bottom: 1px solid silver;
    margin-bottom: 10px;

    &:hover {
      background-color: #dadaf3;
      border-radius: 0 0 4px 4px;
      border-bottom: 1px solid black;
    }
  }

  .text {
    @include flex;
    cursor: pointer;

    &:hover {
      transform: scale(1.01);
    }
  }

  .image-wrapper {
    flex-shrink: 0;
  }

  .image {
    width: 22px;
    cursor: pointer;
    opacity: .3;
    transform: scale(0.8);
    @include tremble;

    & + & {
      margin-left: 2px;
    }
  }

  .finish {
    text-decoration-line: line-through;
    opacity: 1;
  }
</style>
