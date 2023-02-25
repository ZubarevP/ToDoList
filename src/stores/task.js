import { defineStore } from "pinia";

export const useTaskStore = defineStore("tasks", {
  state() {
    return {
      showActive: "active",
      startDate: "",
      endDate: "",
      database: [],
    };
  },

  actions: {
    serialize() {
      window
        .localStorage
        .setItem("tasks", JSON.stringify(this.database));
    },

    unserialize() {
      const data = window
        .localStorage
        .getItem("tasks");

      if(data) {
        this.database = JSON.parse(data);
      }
    },

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

    filters(array, active, start, end) {
      let result = array;

      if(active === "active") {
        result = result.filter(el=>!el.active);
      } else if(active === "inactive") {
        result = result.filter(el=>el.active);
      }

      if(start) {
        const date = new Date(start).valueOf();
        result = result.filter(
          el=>!el.active || el.completeDate >= date
        );
      }

      if(end) {
        const date = new Date(end).valueOf();
        result = result.filter(
          el=>el.createDate <= (date + 1000 * 60 * 60 * 24)
        );
      }

      return result;
    },

    getList(value, active, start, end) {
      return this.filters(
        this.database.filter(el=>el.list === value),
        active,
        start,
        end
      );
    }
  },

  getters: {
    zeroList(state) {
      return state.getList(
        0, 
        state.showActive, 
        state.startDate, 
        state.endDate
      );
    }, 

    firstList(state) {
      return state.getList(
        1,
        state.showActive, 
        state.startDate, 
        state.endDate
      );
    }, 

    secondList(state) {
      return state.getList(
        2,
        state.showActive, 
        state.startDate, 
        state.endDate
      );
    }, 

    thirdList(state) {
      return state.getList(
        3,
        state.showActive, 
        state.startDate, 
        state.endDate
      );
    },
  },
});
