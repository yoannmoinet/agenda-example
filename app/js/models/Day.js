var Backbone = require('backbone');
var Cells = require('../collections/Cells');
var moment = require('moment');

module.exports = Backbone.Model.extend({
    defaults: {
        offer: undefined
    },
    comparator: 'starts_on',
    initialize: function () {
        this.on('change:offer', this.updateSelectability);
        this.set('cells', new Cells());
        this.fillCells();
        if (this.get('offer')) {
            this.updateSelectability();
        }
    },
    updateSelectability: function () {
        var duration = this.get('offer').get('duration');
        var index, selectable;
        // Determine if a cell is selectable or not.
        this.get('cells').each(function (c) {
            index = this.get('cells').indexOf(c);
            selectable = true;
            // We have to check the [duration] number of cells following.
            for (i = 0, max = duration; i < max; i += 1) {
                cell = this.get('cells').at(index + i);
                // If we're still selectable
                // and we have a cell that is also available.
                if (
                        selectable && (
                            (cell && cell.get('availability') !== 1) ||
                            !cell
                        )
                    ) {
                    selectable = false;
                }
            }
            c.set('selectable', selectable);
        }.bind(this));
    },
    fillCells: function () {
        var startsOn = moment(this.get('date'))
            .hour(10)
            .minute(0)
            .second(0).toDate();
        var endsOn = moment(this.get('date'))
            .hour(19)
            .minute(0)
            .second(0).toDate();

        var hours = moment(endsOn).diff(startsOn, 'h');

        for (var i = 0, max = hours; i < max; i += 1) {
            date = moment(startsOn).add(i, 'h').toDate();
            this.get('cells').add({
                selectable: false,
                availability: this.get('slots').getAvailability(date),
                slot: this.get('slots').getSlot(date),
                date: date
            });
        }

        this.set({
            starts_on: startsOn,
            ends_on: endsOn,
            hours: hours
        });
    }
});
