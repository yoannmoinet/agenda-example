var Backbone = require('backbone');
var Slots = require('../collections/Slots');
var Week = require('../collections/Week');
var Day = require('./Day');
var moment = require('moment');

// Starting point, where data gets loaded.
module.exports = Backbone.Model.extend({
    url: '/agenda',
    initialize: function () {
        // Each time we change the starting day
        // we determine if we're at a limit.
        this.on('change:start', this.processLimit);
        // We update the offer as soon as we have it.
        this.on('change:offer', this.processOffer);
    },
    processLimit: function () {
        var nextWeek = moment(this.get('start')).add(7, 'days');
        var previousWeek = moment(this.get('start')).subtract(7, 'days');
        this.set({
            isLastWeek: moment(this.get('to_date')).diff(nextWeek) < 0,
            isFirstWeek: moment(this.get('from_date')).diff(previousWeek) > 0
        });
        // Update the week slots.
        this.getWeekSlots();
        this.save();
    },
    processOffer: function () {
        this.get('week').each(function (day) {
            day.set('offer', this.get('offer'));
        }.bind(this));
    },
    nextWeek: function () {
        // Add 7 days to the current starting day.
        var newDate = moment(this.get('start')).add(7, 'days');
        if (!this.get('isLastWeek')) {
            this.set('start', newDate.toDate());
        }
    },
    previousWeek: function () {
        // Remove 7 days to the current starting day.
        var newDate = moment(this.get('start')).subtract(7, 'days');
        if (!this.get('isFirstWeek')) {
            this.set('start', newDate.toDate());
        }
    },
    getWeek: function () {
        // Returns 7 days in an array.
        var week = [];
        var start = this.get('start');
        for (var i = 0, max = 7; i < max; i += 1) {
            week.push(moment(start).add(i, 'd').toDate());
        }
        return week;
    },
    getWeekSlots: function () {
        // Returns 7 days of slots.
        var weekSlots = new Week(null, {
            slots: this.get('slots'),
            start: this.get('start'),
            offer: this.get('offer')
        });
        // Update the collection.
        if (this.get('week')) {
            this.get('week').reset(weekSlots.models);
        } else {
            this.set('week', weekSlots);
        }

        return weekSlots;
    },
    save: function () {
        localStorage.setItem('start', this.get('start'));
    },
    parse: function (data) {
        var slots = new Slots(data.slots);
        slots.fetch();
        start = new Date(localStorage.getItem('start') || data.from_date);
        return {
            slots: slots,
            start: start,
            from_date: data.from_date,
            to_date: data.to_date
        };
    }
});
