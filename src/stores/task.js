import { defineStore } from "pinia";

export const useTaskStore = defineStore("tasks", {
  state() {
    return {
      database: [
        {
          name: "hello", 
          list: 1, 
          lastDate: 800890,
          createDate: 8098900,  
        },
        {
          name: "see later", 
          list: 3, 
          lastDate: 10222890932,
          createDate: 102228989080,  
        },
        {
          name: "not now", 
          list: 2, 
          lastDate: 222890932,
          createDate: 2228989080,  
        },
      ],
    };
  },

  actions: {
    createTask(task) {
      const fields = [
        'name',
        'list',
        'lastDate',
      ];

      for(let i of fields) {
        if(!task.hasOwnProperty(i)) {
          throw new Error(`task must have "${i}" property`);
        } 
      }

      const newTask = {};
      newTask.createDate    = Date.now();
      newTask.name          = task.name;
      newTask.list          = task.list;
      newTask.lastDate      = task.lastDate;
      newTask.active        = task.active; 
      newTask.description   = task.description;
      newTask.completeDate  = task.completeDate ? 
        task.completeDate : 
        "";

      this.database.push(newTask);
    },

    readTask(id) {
      return this.database[this.getIndex(id)];
    },

    deleteTask(id) {
      this.database.splice(this.getIndex(id), 1);
    },

    updateTask(id, task) {
      const updateObj = this.database[this.getIndex(id)];

      updateObj.name = task.name ? 
        task.name : 
        updateObj.name;

      updateObj.description = task.description ? 
        task.description : 
        updateObj.description;

      updateObj.list = task.list ? 
        task.list : 
        updateObj.list;

      updateObj.lastDate = task.lastDate ? 
        task.lastDate :
        updateObj.lastDate;

      updateObj.completeDate = task.completeDate ? 
        task.completeDate:
        updateObj.completeDate;

      updateObj.active = task.active ? 
        task.active:
        updateObj.active;
    }, 

    getIndex(id) {
      const result = this.database.findIndex(el=>el.createDate === id);
      if(result === -1) throw new Error('Element of tasks not founded');
      return result;
    },
  },

  getters: {
    zeroList(state) {
      return state.database.filter(el=>el.list === 0);
    }, 

    firstList(state) {
      return state.database.filter(el=>el.list === 1);
    }, 

    secondList(state) {
      return state.database.filter(el=>el.list === 2);
    }, 

    thirdList(state) {
      return state.database.filter(el=>el.list === 3);
    },
  },
});
