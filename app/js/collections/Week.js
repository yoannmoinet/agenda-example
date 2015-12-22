var Backbone = require('backbone');
var Day = require('../models/Day');
var moment = require('moment');

module.exports = Backbone.Collection.extend({
    model: Day,
    comparator: 'starts_on',
    initialize: function (models, opts) {
        // Get collections' slots.
        this.slots = opts.slots;
        this.start = opts.start;
        this.offer = opts.offer;
        this.fillDays();
    },
    fillDays: function () {
        for (var i = 0, max = 7; i < max; i += 1) {
            date = moment(this.start).add(i, 'd').toDate();
            this.add({
                date: date,
                slots: this.slots.getSlots(date),
                offer: this.offer
            });
        }
    }
});
