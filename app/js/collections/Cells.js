var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
    comparator: function (model) {
        return model.get('date').getTime();
    },
    model: Backbone.Model.extend({
        initialize: function () {
            // Transfer the data to the slot.
            this.on('change:availability', function (model, availability) {
                if (this.get('slot')) {
                    this.get('slot')
                        .set('availability', availability);
                }
            }.bind(this));
            this.on('change:end', function (model, end) {
                if (this.get('slot')) {
                    this.get('slot')
                        .set('end', end);
                }
            }.bind(this));
            this.on('change:start', function (model, start) {
                if (this.get('slot')) {
                    this.get('slot')
                        .set('start', start);
                }
            }.bind(this));
        }
    })
});
