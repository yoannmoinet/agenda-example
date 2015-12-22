var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
    comparator: 'starts_on',
    model: Backbone.Model.extend({
        initialize: function () {
            // Transfert availability to the slot.
            this.on('change:availability', function (model, availability) {
                if (this.get('slot')) {
                    this.get('slot')
                        .set('availability', availability);
                }
            }.bind(this));
        }
    })
});
