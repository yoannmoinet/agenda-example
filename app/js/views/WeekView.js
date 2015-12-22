var Marionette = require('backbone.marionette');
var DayView = require('./DayView');

module.exports = Marionette.CollectionView.extend({
    idAttribute: 'week',
    template: '<div></div>',
    childView: DayView,
    childViewOptions: function (model) {
        return {
            collection: model.get('cells')
        };
    }
});
