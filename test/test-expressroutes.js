'use strict';

var test = require('tape'),
    expressroutes = require('../lib/expressroutes'),
    express = require('express'),
    request = require('supertest');

test('express routes', function (t) {

    t.test('test api', function (t) {
        t.plan(6);

        var app = express(), child = express();

        child.once('mount', function (parent) {
            var stack;

            expressroutes(app, {
                api: require('./fixtures/api.json'),
                handlers: require('path').join(__dirname, 'handlers')
            });

            stack = Array.prototype.slice.call(parent._router.stack, 3);

            t.strictEqual(stack.length, 5, 'routes added.');
            t.strictEqual(stack[0].route.path, '/v1/greetings/api-docs', 'api-docs added.');
            t.strictEqual(stack[1].route.path, '/v1/greetings/hello/:subject', 'hello added.');
            t.strictEqual(stack[2].route.path, '/v1/greetings/sub/:id', 'sub added.');
            t.strictEqual(stack[3].route.path, '/v1/greetings/sub/:id', 'sub added (head).');
            t.strictEqual(stack[4].route.path, '/v1/greetings/sub/:id/path', 'sub/path added.');
        });

        app.use(child);
    });

    t.test('test no handlers', function (t) {
        t.plan(2);

        var app = express(), child = express();

        child.once('mount', function (parent) {
            var stack;

            expressroutes(app, {
                api: require('./fixtures/api.json'),
                handlers: {

                }
            });

            stack = Array.prototype.slice.call(parent._router.stack, 3);

            t.strictEqual(stack.length, 1, 'only api-docs route added.');
            t.strictEqual(stack[0].route.path, '/v1/greetings/api-docs', 'api-docs added.');
        });

        app.use(child);
    });

    t.test('test variable filenames', function (t) {
        t.plan(4);

        var app = express(), child = express();

        child.once('mount', function (parent) {
            var stack;

            expressroutes(app, {
                api: require('./fixtures/collections.json'),
                handlers: require('path').join(__dirname, 'handlers')
            });

            stack = Array.prototype.slice.call(parent._router.stack, 3);

            t.strictEqual(stack.length, 3, 'three routes added.');
            t.strictEqual(stack[0].route.path, '/v1/collections/api-docs', 'api-docs added.');
            t.strictEqual(stack[1].route.path, '/v1/collections/stuffs', '/stuffs added.');
            t.strictEqual(stack[2].route.path, '/v1/collections/stuffs/:id', '/stuffs/:id added.');
        });

        app.use(child);
    });
});