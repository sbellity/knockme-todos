// An example KnockMe application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Todo Model
  // ----------

  // Our basic **Todo** model has `content`, `order`, and `done` attributes.
  window.Todo = KnockMe.Model.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
      done: false
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.defaults.content});
      }
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }
    
  });

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  window.TodoList = KnockMe.Collection.extend({

    // Reference to this collection's model.
    model: Todo,
    
    // Save all of the todo items under the `"todos"` namespace.
    localStorage: new Store("todos"),
    
    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },
    
    // Todos are sorted by their original insertion order.
    comparator: function(todo) {
      return todo.get('order');
    }
    
  });
  
  // Create our global collection of **Todos**.
  window.Todos = new TodoList();
  
  window.TodoViewModel = KnockMe.ViewModel.extend({
    
    initialize: function() {},
    
    doneStatus: function() {
      return this.done() ? "done" : ""
    },
    
    clear: function() {
      this.model.destroy();
    },
    
    edit: function(e) {
      $(this.el).addClass("editing");
      $(".todo-input", e.currentTarget).focus();
    },
    
    save: function(val) {
      this.model.save({content: val});
      $(this.el).removeClass("editing");
    },
    
    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.save($(e.currentTarget).val());
    },
    
    toggleDone: function() {
      this.model.toggle();
    }
  });
  
  window.AppViewModel = KnockMe.ViewModel.extend({
    
    todos: window.TodoViewModel,
    
    doneItems: function() {
      return this.todos.filter(function(todo){ return todo.done(); });
    },
    
    remainingItems: function() {
      return this.todos.filter(function(todo){ return !todo.done(); });
    },
    
    createTodo: function(e) {
      var content = $(e.currentTarget).val()
      if (e.keyCode == 13 && content.length > 0) {
        order = Todos.nextOrder();
        this.collection.create({ content: content, order: order });
        $(e.currentTarget).val("");
      }
    },
    
    clearDone: function() {
      _.each(this.doneItems(), function(i) { i.model.destroy(); });
    },
    
    wtf: function(el, vm) {
      vm.el = el[1]; // TODO: try to find a way to get rid of that shit ?
    }
    
  });
  
  Todos.fetch();
  
  window.viewModel = new AppViewModel({ collection: Todos, collection_name: "todos" });
  
  window.App = new KnockMe.View({ model: viewModel, el: '#todoapp' });
  window.App.render();

});
