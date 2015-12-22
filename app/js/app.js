var Backbone = require('backbone');
var Marionette = require('backbone.marionette');

var Agenda = require('./models/Agenda');
var Offer = require('./models/Offer');

var ContentView = require('./views/ContentView');

var appTmpl = require('./templates/app.hbs');

var moment = require('moment');
var hbs = require('hbsfy/runtime');

// Handlebars Helpers.
hbs.registerHelper('formatDate', function (st) {
    return moment(st).format('<b>ddd.</b><br/>D MMM.<br/>YYYY');
});

// Configure app
var App = new Marionette.Application({
    agenda: new Agenda(),
    offer: new Offer()
});

// Inject template
document.body.innerHTML = appTmpl();

// Regions
App.addRegions({
    content: '#content'
});

App.on('start', function () {
    App.agenda.once('sync', function () {
        // Show content
        App.content.show(new ContentView({
            model: App.agenda
        }));
        // Get the offer.
        App.offer.fetch();
    });

    App.offer.once('sync', function () {
        App.agenda.set('offer', App.offer);
    });

    // Fetch the data.
    App.agenda.fetch();
});

// Start
App.start();
