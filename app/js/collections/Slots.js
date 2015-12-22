var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');

var Slots = Backbone.Collection.extend({
    comparator: 'starts_on',
    // Returns a subset of slots for a specific date.
    getSlots: function (date) {
        var same, start, end;
        var startDate = moment(date)
            .hour(12)
            .minute(0)
            .second(0);
        // Determine which slice we need.
        this.each(function (slot, i) {
            same = moment(slot.get('starts_on')).isSame(startDate, 'day');
            if (same && start === undefined) {
                start = i;
            } else if (!same && start !== undefined && end === undefined) {
                end = i;
            }
        });

        // If we have a start we slice.
        if (start !== undefined) {
            return new Slots(this.slice(start, end));
        } else {
            // Return an empty collection otherwise.
            return new Slots();
        }
    },
    save: function () {
        this.each(function (slot) {
            localStorage.setItem(
                'slot_' + slot.get('starts_on'),
                JSON.stringify({
                    start: slot.get('start'),
                    end: slot.get('end'),
                    starts_on: slot.get('starts_on'),
                    availability: slot.get('availability')
                })
            );
        });
    },
    fetch: function () {
        this.each(function (slot) {
            var start = slot.get('starts_on');
            var ls = localStorage.getItem('slot_' + start);
            if (ls) {
                slot.set(JSON.parse(ls));
            }
        });
    },
    getSlot: function (date) {
        return this.findWhere(function (slot) {
            return moment(slot.get('starts_on')).isSame(date, 'hour');
        });
    },
    getAvailability: function (date) {
        var slot = this.find(function (slot) {
            return moment(date).isSame(slot.get('starts_on'), 'hour');
        });
        return slot ? slot.get('availability') : 0;
    }
});

module.exports = Slots;
