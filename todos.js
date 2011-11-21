(function() {
  var AppView, Todo, TodoList, TodoView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Todo = (function() {
    __extends(Todo, KnockMe.Model);
    function Todo() {
      Todo.__super__.constructor.apply(this, arguments);
    }
    Todo.prototype.defaults = {
      done: false
    };
    Todo.prototype.toggle = function() {
      return this.save({
        done: !this.get("done")
      });
    };
    return Todo;
  })();
  TodoList = (function() {
    __extends(TodoList, KnockMe.Collection);
    function TodoList() {
      TodoList.__super__.constructor.apply(this, arguments);
    }
    TodoList.prototype.model = Todo;
    TodoList.prototype.localStorage = new Store("todos");
    TodoList.prototype.nextOrder = function() {
      if (!this.length) {
        return 1;
      }
      return this.last().get('order') + 1;
    };
    TodoList.prototype.comparator = function(todo) {
      return todo.get('order');
    };
    return TodoList;
  })();
  TodoView = (function() {
    __extends(TodoView, KnockMe.ViewModel);
    function TodoView() {
      TodoView.__super__.constructor.apply(this, arguments);
    }
    TodoView.prototype.doneStatus = function() {
      if (this.done()) {
        return "done";
      }
    };
    TodoView.prototype.clear = function() {
      return this.model.destroy();
    };
    TodoView.prototype.edit = function(e) {
      $(this.el).addClass("editing");
      return $(".todo-input", e.currentTarget).focus();
    };
    TodoView.prototype.save = function(val) {
      this.model.save({
        content: val
      });
      return $(this.el).removeClass("editing");
    };
    TodoView.prototype.updateOnEnter = function(e) {
      var val;
      if (e.keyCode !== 13) {
        return;
      }
      val = $(e.currentTarget).val();
      return this.save(val);
    };
    TodoView.prototype.toggleDone = function() {
      return this.model.toggle();
    };
    return TodoView;
  })();
  AppView = (function() {
    __extends(AppView, KnockMe.ViewModel);
    function AppView() {
      AppView.__super__.constructor.apply(this, arguments);
    }
    AppView.prototype.todos = TodoView;
    AppView.prototype.initialize = function() {
      return this.collection.fetch();
    };
    AppView.prototype.doneItems = function() {
      return this.todos.filter(function(todo) {
        return todo.done();
      });
    };
    AppView.prototype.remainingItems = function() {
      return this.todos.filter(function(todo) {
        return !todo.done();
      });
    };
    AppView.prototype.createTodo = function(e) {
      var content;
      content = $(e.currentTarget).val();
      if (e.keyCode !== 13 || content.length === 0) {
        return;
      }
      this.collection.create({
        content: content,
        order: this.collection.nextOrder()
      });
      return $(e.currentTarget).val("");
    };
    AppView.prototype.clearDone = function() {
      return _.each(this.doneItems(), function(i) {
        return i.model.destroy();
      });
    };
    AppView.prototype.wtf = function(el, vm) {
      return vm.el = el[1];
    };
    return AppView;
  })();
  $(function() {
    window.App = new AppView({
      el: '#todoapp',
      collection: new TodoList,
      collection_name: 'todos'
    });
    return window.App.render();
  });
}).call(this);
