var Marionette = require('backbone.marionette');
var daysTmpl = require('../templates/days.hbs');

module.exports = Marionette.ItemView.extend({
    template: daysTmpl,
    ui: {
        next: '#next',
        previous: '#previous'
    },
    modelEvents: {
        'change:start': 'render'
    },
    triggers: {
        'click @ui.next': 'clickNext',
        'click @ui.previous': 'clickPrevious'
    },
    serializeData: function () {
        var data = this.model.toJSON();
        data.days = this.model.getWeek();
        return data;
    }
});
