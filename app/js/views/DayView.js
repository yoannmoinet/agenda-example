var Marionette = require('backbone.marionette');
var CellView = require('./CellView');

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
                availability: 2
            });
        }

        // Update the day's cells.
        this.model.updateSelectability();
        // Save the collection.
        this.model.get('slots').save();
    },
    removeOffer: function (c) {
        var start = c.collection.indexOf(c);
        var end = c.collection.indexOf(c);
        var cell;

        // Determine limits.
        while (c.collection.at(start - 1) &&
            c.collection.at(start - 1).get('availability') === 2) {
            start -= 1;
        }

        end = start + this.model.get('offer').get('duration') - 1;

        // Remove slot.
        for (var i = start; i <= end; i += 1) {
            cell = c.collection.at(i);
            if (!cell) {
                return;
            }
            // Set cell as free.
            cell.set({
                availability: 1
            });
        }

        // Update the day's cells.
        this.model.updateSelectability();
        // Save the collection.
        this.model.get('slots').save();
    }
});
