import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile'

export default Ember.Component.extend({
	repo: Ember.inject.service(),
	tagName: 'li',
	editing: false,
	classNameBindings: ['todo.completed', 'editing'],

	actions: {
		startEditing() {
			this.get('onStartEdit')();
			this.set('editing', true);
			Ember.run.scheduleOnce('afterRender', this, 'focusInput');
		},

		doneEditing(todoTitle) {
			if (!this.get('editing')) { return; }
			if (Ember.isBlank(todoTitle)) {
				this.send('removeTodo');
			} else {
				this.set('todo.title', todoTitle.trim());
				this.set('editing', false);
				this.get('onEndEdit')();
			}
		},

		handleKeydown(e) {
      // Should respond to return and escape
		},

		toggleCompleted(e) {
			let todo = this.get('todo');
			Ember.set(todo, 'completed', e.target.checked);
			this.get('repo').persist();
		},

		removeTodo() {
			this.get('repo').delete(this.get('todo'));
		}
	},

	focusInput() {
		this.element.querySelector('input.edit').focus();
  },

  layout: hbs`
    <div class="view">
      <input type="checkbox" class="toggle" checked={{todo.completed}} onchange={{action 'toggleCompleted'}}>
      <label ondblclick={{action 'startEditing'}}>{{todo.title}}</label>
      <button onclick={{action 'removeTodo'}} class="destroy"></button>
    </div>
    <input type="text" class="edit" value={{todo.title}} onblur={{action 'doneEditing' value='target.value'}} onkeydown={{action 'handleKeydown'}} autofocus>
  `
});
