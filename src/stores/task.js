import { defineStore } from "pinia";

export const useTaskStore = defineStore("tasks", {
  state() {
    return {
      showActive: "active",
      startDate: "",
      endDate: "",
      database: [
        {
          name: "hello", 
          list: 1, 
          lastDate: 800890,
          createDate: 8098900,  
          active: false,
        },
        {
          name: "see later", 
          list: 3, 
          lastDate: 10222890932,
          createDate: 102228989080,  
          active: false,
        },
        {
          name: "not now", 
          list: 2, 
          lastDate: 222890932,
          createDate: 2228989080,  
          active: true,
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
        'active'
      ];

      for(let i of fields) {
        if(!task.hasOwnProperty(i)) {
          throw new Error(`task must have "${i}" property`);
        } 
      }

      const newTask = {};
      newTask.createDate    = Date.now();

      newTask.name          = task.name;
      newTask.active        = task.active; 
      newTask.list          = task.list;
      newTask.lastDate      = task.lastDate;

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

      updateObj.name        = task.name; 
      updateObj.active      = task.active; 
      updateObj.lastDate    = task.lastDate; 
      updateObj.list        = task.list;

      updateObj.description = task.description ? 
        task.description : 
        updateObj.description;

      updateObj.completeDate = task.completeDate ? 
        task.completeDate:
        updateObj.completeDate;
    }, 

    getIndex(id) {
      const result = this.database
        .findIndex(el=>el.createDate === id);

      if(result === -1) {
        throw new Error('Element of tasks not founded');
      }
      return result;
    },

    filters(array) {
      let result = array;

      if(this.showActive === "active") {
        result = result.filter(el=>!el.active);
      } else if(this.showActive === "inactive") {
        result = result.filter(el=>el.active);
      }

      if(this.startDate) {
      }

      if(this.endDate) {
      }

      return result;
    },
  },

  getters: {
    zeroList(state) {
      return state.filters(state.database.filter(el=>el.list === 0));
    }, 

    firstList(state) {
      return state.filters(state.database.filter(el=>el.list === 1));
    }, 

    secondList(state) {
      return state.filters(state.database.filter(el=>el.list === 2));
    }, 

    thirdList(state) {
      return state.filters(state.database.filter(el=>el.list === 3));
    },
  },
});
