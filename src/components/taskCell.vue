<template>
  <div class="wrapper" :class="{finish: active}">
    <div 
      class="text"
      title="подробнее"
      @click="$emit('push', 'info')"
    >{{ getDate + " - " + name}}</div>
    <div class="imaga-wrapper">
      <img 
        class="image" 
        src="edit.svg" 
        alt="редактировать задачу"
        title="изменить"
        @click="$emit('push', 'edit')"
      >
      <img 
        class="image" 
        src="check.svg" 
        alt="завершить задачу"
        title="завершить"
        @click="$emit('push', 'complete')"
      >
      <img 
        class="image" 
        src="delete.svg" 
        alt="удалить задачу"
        title="удалить"
        @click="$emit('push', 'delete')"
      >
      <img 
        class="image" 
        src="drag.svg" 
        alt="поменять приоритет задачу"
        title="перенести в другой список"
      >
    </div>
  </div>
</template>

<script>
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
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/variables";

  .wrapper {
    @include flex-space-between;;
    padding: 0px 10px;

    &:hover {
      background-color: #f5ebeb;
    }
  }

  .text {
    @include flex;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }

  .finish {
    text-decoration-line: line-through;
  }

  .image {
    width: 22px;
    cursor: pointer;
    opacity: .6;

    & + & {
      margin-left: 5px;
    }

    &:hover {
      transform: scale(1.1);
      opacity: 1;
    }
  }
</style>
