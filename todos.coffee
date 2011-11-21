class Todo extends KnockMe.Model
  defaults: 
    done: false
    
  toggle: ->
    @save({ done: !@get("done") })
  
class TodoList extends KnockMe.Collection
  
  model: Todo
  
  localStorage: new Store("todos")
    
  nextOrder: ->
    return 1 if (!@length)
    return @last().get('order') + 1
    
  comparator: (todo)->
    todo.get('order')


class TodoView extends KnockMe.ViewModel
  
  doneStatus: ->
    return "done" if @done()
  
  clear: ->
    @model.destroy()
    
  edit: (e)->
    $(@el).addClass("editing")
    $(".todo-input", e.currentTarget).focus()
    
  save: (val)->
    @model.save({content: val})
    $(@el).removeClass("editing")
    
  updateOnEnter: (e)->
    return if e.keyCode != 13
    val = $(e.currentTarget).val()
    @save(val)
    
  toggleDone: ->
    @model.toggle()

class AppView extends KnockMe.ViewModel

  todos: TodoView
  
  initialize: ->
    @collection.fetch()
    
  doneItems: ->
    @todos.filter (todo)-> todo.done()
    
  remainingItems: ->
    @todos.filter (todo)-> !todo.done()
  
  createTodo: (e)->
    content = $(e.currentTarget).val()
    return if e.keyCode != 13 || content.length == 0
    @collection.create({ content: content, order: @collection.nextOrder() })
    $(e.currentTarget).val("")
    
  clearDone: ->
    _.each @doneItems(), (i)-> i.model.destroy()
    
  wtf: (el, vm)->
    vm.el = el[1] # TODO: try to find a way to get rid of that shit ?

$ ->
  window.App = new AppView({ el: '#todoapp', collection: new TodoList, collection_name: 'todos' })
  window.App.render()

