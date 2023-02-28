<template>
  <teleport to="body">
    <div 
      v-if="open"  
      class="back"
      @click.self="close"
    >
      <div class="before_face">
        <div class="face">
          <div class="header">
            <h2 class="h2">{{ getTitle }}</h2>
            <div 
              class="close"
              title="закрыть (esc)"
              @click="close"
            ></div>
          </div>

          <div 
            v-if="['info', 'delete', 'complete'].includes(mode)"
            class="main"
          >
            <div v-if="mode != 'info'" class="block">
              <div class="lable">название</div>
              <div class="field-show">{{ name }}</div>
            </div>
            <div v-if="description" class="block">
              <div class="lable">описание</div>
              <div class="field-show">{{ description }}</div>
            </div>
            <div class="block">
              <div class="lable">приоритет</div>
              <div class="field-show">{{ getListName }}</div>
            </div>
            <div class="block">
              <div class="lable">выполнить до</div>
              <div class="field-show">{{ new Date(lastDate).toLocaleDateString("ru-RU") }}</div>
            </div>
            <div v-if="active" class="block">
              <div class="lable">выполнено</div>
              <div class="field-show">{{ new Date(completeDate).toLocaleDateString("ru-RU") }}</div>
            </div>
          </div>

          <div 
            v-else
            class="main"
          >
            <div class="block">
              <label 
                for="nameinput"
                class="lable" 
              >название</label>
              <textarea
                id="nameinput" 
                class="field" 
                rows="4"
                v-model="name"
              ></textarea>
            </div>
            <div class="block">
              <label 
                for="description"
                class="lable" 
              >описание</label>
              <textarea
                id="description" 
                class="field" 
                rows="6"
                v-model="description "
              ></textarea>
            </div>
            <div class="block">
              <label 
                for="priority"
                class="lable" 
              >приоритет</label>
              <select 
                id="priority" 
                v-model="list"
                class="field"
              >
                <option :value="0">текущее</option>
                <option :value="1">важное</option>
                <option :value="2">срочное</option>
                <option :value="3">приоритетное</option>
              </select>
            </div>
            <div class="block">
              <label 
                for="last" 
                class="label"
              >выполнить до</label>
              <input 
                class="field date"
                id="last" 
                type="date"
                v-model="lastDate"
              >
            </div>
            <div class="block">
              <label 
                for="active" 
                class="label"
              >выполнено</label>
              <input 
                id="active"
                class="check"
                type="checkbox"
                v-model="active"
              >
            </div>
            <div 
              class="block"
              v-if="active"
            >
              <label 
                for="complete" 
                class="label"
              >дата выполнения</label>
              <input 
                id="complete"
                class="field date"
                type="date"
                v-model="completeDate"
              >
            </div>
          </div>

          <div class="footer">
            <button
              class="btn btn_cancel"
              @click="close"
            >{{ getCancelButtonName }}</button>
            <button 
              class="btn btn_agree"
              v-if="mode != 'info'"
              @click="changeDB"
            >{{ getApplyButtonName }}</button>
          </div>

        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
  import { mapActions } from "pinia";
  import { useTaskStore } from "@/stores/task.js"; 

  export default {
    props: {
      id: {
        type: Number,
        required: true,
        validator(value) {
          return value >= 0 || value === -1;
        },
      },

      level: {
        type: Number,
        required: true,
        validator(value) {
          return value >= 0 || value <= 3;
        }
      },

      open: {
        type: Boolean,
        required: true,
      },

      mode: {
        type: String,
        required: true,
        validator(value) {
          const values = [
            'info',
            'create',
            'delete',
            'complete',
            'edit',
          ];
          return value.includes(value);
        },
      },
    },

    data() {
      return {
        name: "",
        list: 0,
        lastDate: "",
        active: false,

        description: "",
        completeDate: "",
      };
    },

    watch: {
      level(value) {
        this.list = value;
      },

      id(value) {
        if(value && value != -1) {
          const task = this.readTask(value);
          this.name         = task.name;
          this.description  = task.description;
          this.list         = task.list;
          this.lastDate     = this.getDateStr(task.lastDate);
          this.completeDate = task.completeDate ? 
            this.getDateStr(task.completeDate):
            "";
          this.active       = task.active;
        }
      },

      open(value) {
        if(value === true) {
          this.$nextTick(()=>{document.getElementById("nameinput").focus()});
        }
      },

      active(value) {
        if(value && !this.completeDate) {
          this.completeDate = new Date()
            .toLocaleDateString("ru-RU")
            .split(".")
            .reverse()
            .join("-");
        }
      },
    },

    computed: {
      getTitle() {
        switch(this.mode) {
          case "info"     : return this.name        ; break;
          case "create"   : return "создать новую задачу" ; break;
          case "delete"   : return "удалить задачу"       ; break;
          case "complete" : return "завершить задачу"     ; break;
          case "edit"     : return "редактировать задачу" ; break;
        }
      },

      getCancelButtonName() {
        switch(this.mode) {
          case "info"     : return "назад"  ; break;
          case "create"   : return "отмена" ; break;
          case "delete"   : return "отмена" ; break;
          case "complete" : return "отмена" ; break;
          case "edit"     : return "отмена" ; break;
        }
      },

      getApplyButtonName() {
        switch(this.mode) {
          case "info"     : return ""          ; break;
          case "create"   : return "создать"   ; break;
          case "delete"   : return "удалить"   ; break;
          case "complete" : return "завершить" ; break;
          case "edit"     : return "применить" ; break;
        }
      },

      getListName() {
        switch(this.list) {
          case 0 : return "текущее"      ; break;
          case 1 : return "важное"       ; break;
          case 2 : return "срочное"      ; break;
          case 3 : return "приоритетное" ; break;
        }
      },
    },

    methods: {
      ...mapActions( useTaskStore, [
        'createTask',
        'readTask',
        'deleteTask',
        'updateTask',
      ]),

      close() {
        this.name         = "";
        this.description  = "";
        this.list         = 0 ;
        this.lastDate     = "";
        this.completeDate = "";
        this.active       = false;
        this.$emit('close');
      },

      getDateStr(value) {
        return new Date(value)
          .toLocaleDateString("ru-RU")
          .split(".")
          .reverse()
          .join("-")
      },

      createObj(activeValue) {
        if(this.mode === "complete") {
          this.completeDate = Date.now();
        }
        return {
          name:         this.name,
          description:  this.description,
          list:         this.list,
          lastDate:     this.lastDate ? 
                         new Date(this.lastDate).valueOf(): 
                         Date.now(),
          completeDate: this.completeDate ? 
                         new Date(this.completeDate).valueOf(): 
                         0,
          active:       activeValue,
        };
      },

      changeDB() {
        if(this.mode === "create") {
          this.createTask(this.createObj(this.active));
        } else if(this.mode === "delete") {
          this.deleteTask(this.id);
        } else if(this.mode === "complete") {
          this.updateTask(this.id, this.createObj(true));
        } else if(this.mode === "edit") {
          this.updateTask(this.id, this.createObj(this.active));
        }
        this.close();
      },
    },

    emits: [ 'close' ],
  };
</script>

<style lang="scss" scoped>
@import "@/assets/variables";

  .back {
    @include flex-center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
  }

  .before_face {
    width: 510px;
    border-radius: 4px;
    background: linear-gradient(to top, #c7fb97, #fbf397, #fbc598, #fb9797);
  }

  .face {
    width: 500px;
    padding: 10px 20px 15px;
    background-color: white;
    border-radius: 4px;
  }

  .header {
    @include flex-space-between;
    margin-bottom: 15px;
  }

  .block {
    @include flex-space-between;

    & + & {
      margin-top: 5px;
    }
  }

  .field-show {
    width: 60%;
  }

  .field{
    width: 60%;
    outline: none;
    border: none;
    padding: 4px 15px;
    background-color: #e3e8e8;
    border-radius: 4px;
  }

  .date {
    width: 200px;
  }

  .close,
  .btn {
    cursor: pointer;
  }

  .close:before {
    content: "\2716";
  }

  .footer {
    margin-top: 15px;
  }

  .btn {
    padding: 5px 15px;
    border: none;
    color: white;
    opacity: .7;

    & + & {
      margin-left: 10px;
    }

    &_agree {
      background-color: #7e74d2;
    }

    &_cancel {
      background-color: #f94a4a;
    }

    &:hover {
      opacity: 1;
    }
  }
</style>
