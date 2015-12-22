var Backbone = require('backbone');
var moment = require('moment');

module.exports = Backbone.Model.extend({
    url: '/agenda/offer',
    parse: function (data) {
        var duration = data.service_duration;
        return {
            duration: moment.duration(duration, 's').hours()
        };
    }
});
