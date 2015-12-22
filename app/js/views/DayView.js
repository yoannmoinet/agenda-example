var Marionette = require('backbone.marionette');
var CellView = require('./CellView');
var moment = require('moment');

module.exports = Marionette.CollectionView.extend({
    className: 'day col-xs-2',
    childView: CellView,
    template: '<div></div>',
    onChildviewClickCell: function (e) {
        if (e.model.get('selectable')) {
            this.createOffer(e.model);
        } else if (e.model.get('availability') === 2) {
            this.removeOffer(e.model);
        }
    },
    createOffer: function (c) {
        var coll = c.collection;
        var duration = this.model.get('offer').get('duration');
        var index = coll.indexOf(c);
        var cell;
        for (var i = 0, max = duration; i < max; i += 1) {
            cell = coll.at(index + i);
            if (!cell) {
                return;
            }
            // Set cell as busy.
            cell.set({
                start: c.get('date'),
                end: moment(c.get('date')).add(duration, 'h').toDate(),
                availability: 2
            });
        }

        // Update the day's cells.
        this.model.updateSelectability();
        // Save the collection.
        this.model.get('slots').save();
    },
    removeOffer: function (c) {
        // Get the index of the first cell sharing the same start.
        var start = c.collection.indexOf(
            c.collection.findWhere({start: c.get('start')})
        );
        // Get the index of the ending cell.
        // or the last one having an availability.
        var end = c.collection.indexOf(
            c.collection.findWhere(function (cell) {
                return moment(cell.get('date')).isSame(c.get('end'), 'h');
            })
        );
        if (end < 0) {
            end = c.collection.indexOf(
                c.collection.where({availability: 2}).pop()
            ) + 1;
        }
        var cell;
        // Remove slot.
        for (var i = start; i < end; i += 1) {
            cell = c.collection.at(i);
            if (!cell) {
                return;
            }
            // Set cell as free.
            cell.set({
                start: undefined,
                duration: undefined,
                availability: 1
            });
        }

        // Update the day's cells.
        this.model.updateSelectability();
        // Save the collection.
        this.model.get('slots').save();
    }
});
