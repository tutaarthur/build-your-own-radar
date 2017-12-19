document.title = 'Radar de Tecnologia'


const param = require('../util/parameters');
var parametros = new param();



// store data inline directly as a table...
const rawDataTable = parametros.array_tabela;



// which will need to be converted to an array of objects...
const rawData = rawDataTable.slice(1).map(function(x) {
    // likely a better way to do this ?
    var response = {}
    for (var i = 0; i < x.length; i++)  {
        response[rawDataTable[0][i]] = x[i];
    }
    return response
})

const _ = {
    map: require('lodash/map'),
    uniqBy: require('lodash/uniqBy'),
    capitalize: require('lodash/capitalize'),
    each: require('lodash/each')
};

const InputSanitizer = require('./inputSanitizer');
const Radar = require('../models/radar');
const Quadrant = require('../models/quadrant');
const Ring = require('../models/ring');
const Blip = require('../models/blip');
const GraphingRadar = require('../graphing/radar');
const MalformedDataError = require('../exceptions/malformedDataError');
const ContentValidator = require('./contentValidator');
const ExceptionMessages = require('./exceptionMessages');

const InlineSheet = function () {
    var self = {};

    self.build = function () {

       
        var columnNames = Object.keys(rawData[0])

        var contentValidator = new ContentValidator(columnNames);
        contentValidator.verifyContent();
        contentValidator.verifyHeaders();

        var all = rawData;
        var blips = _.map(all, new InputSanitizer().sanitize);
        var rings = _.map(_.uniqBy(blips, 'ring'), 'ring');
        var ringMap = {};
        var maxRings = 4;

        _.each(rings, function (ringName, i) {
            if (i == maxRings) {
                throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
            }
            ringMap[ringName] = new Ring(ringName, i);
        });

        var quadrants = {};
        _.each(blips, function (blip) {
            if (!quadrants[blip.quadrant]) {
                quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant));
            }
            quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.type, blip.topic, blip.description))
        });

        var radar = new Radar();
        _.each(quadrants, function (quadrant) {
            radar.addQuadrant(quadrant)
        });

        var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;
        new GraphingRadar(size, radar).init().plot();
    };

    return self;
};

module.exports = InlineSheet;