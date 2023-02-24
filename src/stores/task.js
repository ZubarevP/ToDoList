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
          createDate: 898900,  
          active: false,
        },
        {
          name: "see later", 
          list: 3, 
          lastDate: 10222890932,
          createDate: 102229080,  
          active: false,
        },
        {
          name: "not now", 
          list: 2, 
          lastDate: 222890932,
          createDate: 22989080,  
          completeDate: 2228989080, 
          active: true,
        },
        {
          name: "hello", 
          list: 1, 
          lastDate: 800890,
          createDate: 80980,  
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
          createDate: 2289900,  
          completeDate: 2228989080, 
          active: true,
        },
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
          createDate: 80,  
          active: false,
        },
        {
          name: "not now", 
          list: 2, 
          lastDate: 222890932,
          createDate: 2228989080,  
          completeDate: 2228989080, 
          active: true,
        },
        {
          name: "hello", 
          list: 1, 
          lastDate: 800890,
          createDate: 890,  
          active: false,
        },
        {
          name: "see later", 
          list: 3, 
          lastDate: 10222890932,
          createDate: 18902228989080,  
          active: false,
        },
        {
          name: "not now", 
          list: 2, 
          lastDate: 222890932,
          createDate: 2228980,  
          completeDate: 2228989080, 
          active: true,
        },
        {
          name: "hello", 
          list: 1, 
          lastDate: 800890,
          createDate: 808999900,  
          active: false,
        },
        {
          name: "see later", 
          list: 3, 
          lastDate: 10222890932,
          createDate: 102228989082320,  
          active: false,
        },
        {
          name: "not now", 
          list: 2, 
          lastDate: 222890932,
          createDate: 2228989084620,  
          completeDate: 2228989080, 
          active: true,
        },
        {
          name: "hello", 
          list: 1, 
          lastDate: 800890,
          createDate: 8098908900,  
          active: false,
        },
        {
          name: "see later", 
          list: 3, 
          lastDate: 10222890932,
          createDate: 10222898798789,  
          active: false,
        },
        {
          name: "not now", 
          list: 2, 
          lastDate: 222890932,
          createDate: 22289890777780,  
          completeDate: 2228989080, 
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
