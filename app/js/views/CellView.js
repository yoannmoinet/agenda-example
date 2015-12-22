var Marionette = require('backbone.marionette');
var STATES = ['', ' available', ' busy'];

module.exports = Marionette.ItemView.extend({
    className: 'cell',
    modelEvents: {
        'change:availability': 'render',
        'change:selectable': 'render'
    },
    triggers: {
        'click': 'click:cell'
    },
    template: '<div></div>',
    onRender: function () {
        this.$el
            // Reset classes
            .attr('class', 'cell')
            .addClass(STATES[this.model.get('availability')])
            .addClass(this.model.get('selectable') ? ' selectable' : '');
    }
});
