'use strict';

var test = require('tape'),
    api = require('./fixtures/api.json'),
    path = require('path'),
    buildroutes = require('../lib/buildroutes');

test('routebuilder', function (t) {

    t.test('build', function (t) {
        var routes;

        routes = buildroutes({ api: api, handlers: path.join(__dirname, 'handlers') });

        t.strictEqual(routes.length, 5, 'added 5 routes.');

        routes.forEach(function (route) {
            t.ok(route.hasOwnProperty('method'), 'has method property.');
            t.ok(route.hasOwnProperty('name'), 'has name property.');
            t.ok(route.hasOwnProperty('path'), 'has path property.');
            t.ok(route.hasOwnProperty('validators'), 'has validators property.');
        });

        t.end();
    });

    t.test('collections', function (t) {
        var routes;

        routes = buildroutes({ api: require('./fixtures/collections.json'), handlers: path.join(__dirname, 'handlers') });

        t.strictEqual(routes.length, 2, 'added 2 routes.');

        routes.forEach(function (route) {
            t.ok(route.hasOwnProperty('method'), 'has method property.');
            t.ok(route.hasOwnProperty('name'), 'has name property.');
            t.ok(route.hasOwnProperty('path'), 'has path property.');
            t.ok(route.hasOwnProperty('validators'), 'has validators property.');
        });

        t.end();
    });

    t.test('bad dir', function (t) {
        t.plan(1);

        t.throws(function () {
            buildroutes({ api: api, handlers: 'asdf' });
        }, 'throws error for bad directory.');
    });

});
