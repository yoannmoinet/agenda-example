var Marionette = require('backbone.marionette');
var WeekView = require('./WeekView');
var DaysBarView = require('./DaysBarView');
var contentTmpl = require('../templates/content.hbs');

module.exports = Marionette.LayoutView.extend({
    idAttribute: 'content',
    template: contentTmpl,
    regions: {
        days: '#head',
        hours: '#hours',
        week: '#week'
    },
    serializeData: function () {
        var data = this.model.toJSON();
        data.hours = [];
        for (var i = 0, max = 10; i < max; i += 1) {
            data.hours.push(10 + i + ':00');
        }
        return data;
    },
    onRender: function () {
        var daysView = new DaysBarView({
            model: this.model
        });

        // Bind days bar buttons to change week.
        this.listenTo(daysView, 'clickNext',
            this.model.nextWeek.bind(this.model));
        this.listenTo(daysView, 'clickPrevious',
            this.model.previousWeek.bind(this.model));

        // Render the cells.
        this.week.show(new WeekView({
            collection: this.model.get('week'),
            sort: false
        }));

        this.days.show(daysView);
    }
});
