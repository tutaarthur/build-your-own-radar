const d3 = require('d3');
const d3tip = require('d3-tip');
const Chance = require('chance');
const _ = require('lodash/core');

const RingCalculator = require('../util/ringCalculator');

const MIN_BLIP_WIDTH = 12;

const Radar = function (size, radar) {
  var svg, radarElement;

  var tip = d3tip().attr('class', 'd3-tip').html(function (text) {
    return text;
  });

  tip.direction(function () {
    if (d3.select('.quadrant-table.selected').node()) {
      var selectedQuadrant = d3.select('.quadrant-table.selected');
      if (selectedQuadrant.classed('first') || selectedQuadrant.classed('fourth'))
        return 'ne';
      else
        return 'nw';
    }
    return 'n';
  });

  var ringCalculator = new RingCalculator(radar.rings().length, center());

  var self = {};

  function center() {
    return Math.round(size / 2);
  }

  function toRadian(angleInDegrees) {
    return Math.PI * angleInDegrees / 180;
  }

  function plotLines(quadrantGroup, quadrant) {
    var startX = size * (1 - (-Math.sin(toRadian(quadrant.startAngle)) + 1) / 2);
    var endX = size * (1 - (-Math.sin(toRadian(quadrant.startAngle - 90)) + 1) / 2);

    var startY = size * (1 - (Math.cos(toRadian(quadrant.startAngle)) + 1) / 2);
    var endY = size * (1 - (Math.cos(toRadian(quadrant.startAngle - 90)) + 1) / 2);

    if (startY > endY) {
      var aux = endY;
      endY = startY;
      startY = aux;
    }

    quadrantGroup.append('line')
      .attr('x1', center()).attr('x2', center())
      .attr('y1', startY - 2).attr('y2', endY + 2)
      .attr('stroke-width', 10);

    quadrantGroup.append('line')
      .attr('x1', endX).attr('y1', center())
      .attr('x2', startX).attr('y2', center())
      .attr('stroke-width', 10);
  }

  function plotQuadrant(rings, quadrant) {
    var quadrantGroup = svg.append('g')
      .attr('class', 'quadrant-group quadrant-group-' + quadrant.order)
      .on('mouseover', mouseoverQuadrant.bind({}, quadrant.order))
      .on('mouseout', mouseoutQuadrant.bind({}, quadrant.order))
      .on('click', selectQuadrant.bind({}, quadrant.order, quadrant.startAngle));

    rings.forEach(function (ring, i) {
      var arc = d3.arc()
        .innerRadius(ringCalculator.getRadius(i))
        .outerRadius(ringCalculator.getRadius(i + 1))
        .startAngle(toRadian(quadrant.startAngle))
        .endAngle(toRadian(quadrant.startAngle - 90));

      quadrantGroup.append('path')
        .attr('d', arc)
        .attr('class', 'ring-arc-' + ring.order())
        .attr('transform', 'translate(' + center() + ', ' + center() + ')');
    });

    return quadrantGroup;
  }

  function plotTexts(quadrantGroup, rings, quadrant) {
    rings.forEach(function (ring, i) {
      if (quadrant.order === 'first' || quadrant.order === 'fourth') {
        quadrantGroup.append('text').call(tip)
          .attr('class', 'line-text tooltip3')
          .attr('y', center() + 4)
          .attr('x', center() + (ringCalculator.getRadius(i) + ringCalculator.getRadius(i + 1)) / 2)
          .attr('text-anchor', 'middle')
          .text(ring.name()).append('div').attr('class', 'tooltip').style("opacity", 0).call(tip);
      } else {
        quadrantGroup.append('text').call(tip)
          .attr('class', 'line-text tooltip3')
          .attr('y', center() + 4)
          .attr('x', center() - (ringCalculator.getRadius(i) + ringCalculator.getRadius(i + 1)) / 2)
          .attr('text-anchor', 'middle')
          .text(ring.name())
            .append('div').attr('class', 'tooltip').style("opacity", 0).call(tip);


      }






    var mouseOver2 = function () {


      d3.selectAll('.tooltip3').classed('highlight', true);

      tip.show(d3.select(this).text(), d3.select(this));

    };

    var mouseOut2 = function () {

        d3.selectAll('.tooltip3').classed('highlight', false);


        tip.hide().style('left', 0).style('top', 0);
    };


//tip = tip().attr('class', 'd3-tip2').html(function(d) { return d; });

/* Invoke the tip in the context of your visualization */
d3.selectAll('.tooltip3').on('mouseover', mouseOver2).on('mouseout', mouseOut2);



 /*   var mouseOver = function () {
      d3.selectAll('g.blip-link').attr('opacity', 0.3);
      group.attr('opacity', 1.0);
      tip.show(blip.name(), group.node());
    };

    var mouseOut = function () {
      d3.selectAll('g.blip-link').attr('opacity', 1.0);
      blipListItem.selectAll('.blip-list-item').classed('highlight', false);
      tip.hide().style('left', 0).style('top', 0);
    };
*/


    });
  }

  function triangle(blip, x, y, order, group) {
    return group.append('path').attr('d', "M412.201,311.406c0.021,0,0.042,0,0.063,0c0.067,0,0.135,0,0.201,0c4.052,0,6.106-0.051,8.168-0.102c2.053-0.051,4.115-0.102,8.176-0.102h0.103c6.976-0.183,10.227-5.306,6.306-11.53c-3.988-6.121-4.97-5.407-8.598-11.224c-1.631-3.008-3.872-4.577-6.179-4.577c-2.276,0-4.613,1.528-6.48,4.699c-3.578,6.077-3.26,6.014-7.306,11.723C402.598,306.067,405.426,311.406,412.201,311.406")
      .attr('transform', 'scale(' + (blip.width / 34) + ') translate(' + (-404 + x * (34 / blip.width) - 17) + ', ' + (-282 + y * (34 / blip.width) - 17) + ')')
      .attr('class', order);
  }

  function triangleLegend(x, y, group) {
    return group.append('path').attr('d', "M412.201,311.406c0.021,0,0.042,0,0.063,0c0.067,0,0.135,0,0.201,0c4.052,0,6.106-0.051,8.168-0.102c2.053-0.051,4.115-0.102,8.176-0.102h0.103c6.976-0.183,10.227-5.306,6.306-11.53c-3.988-6.121-4.97-5.407-8.598-11.224c-1.631-3.008-3.872-4.577-6.179-4.577c-2.276,0-4.613,1.528-6.48,4.699c-3.578,6.077-3.26,6.014-7.306,11.723C402.598,306.067,405.426,311.406,412.201,311.406")
      .attr('transform', 'scale(' + (22 / 64) + ') translate(' + (-404 + x * (64 / 22) - 17) + ', ' + (-282 + y * (64 / 22) - 17) + ')');
  }





    function square(blip, x, y, order, group) {
    return (group || svg).append('path').attr('d', "M75,225 m-40,-50 h80, a10,10 0 0,1 10,10 v80 a10,10 0 0,1 -10,10 h-80 a10,10 0 0,1 -10,-10 v-80 a10,10 0 0,1 10,-10")
      .attr('transform', 'scale(' + (blip.width / 120) + ') translate(' + (-60 + x * (120 / blip.width) - 17) + ', ' + (-210 + y * (120 / blip.width) - 17) + ')')
      .attr('class', order);
  }

  function squareLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M75,225 m-40,-50 h80, a10,10 0 0,1 10,10 v80 a10,10 0 0,1 -10,10 h-80 a10,10 0 0,1 -10,-10 v-80 a10,10 0 0,1 10,-10")
      .attr('transform', 'scale(' + (22 / 180) + ') translate(' + (-60 + x * (180 / 22) - 17) + ', ' + (-210 + y * (180 / 22) - 17) + ')');
  }









  function plane(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "M406.948 45.65c-27.904 38.297-57.447 79.104-85.135 117.442-86.405 0.583-170.711-1.485-257.106-1.085-7.045 9.799-14.131 19.6-21.207 29.369 71.414 18.535 142.786 37.059 214.19 55.593-23.296 31.222-44.329 64.123-57.231 102.82-38.922 1.464-78.059 3.134-117.013 4.782-4.362 5.837-8.745 11.868-12.912 17.93 35.819 12.278 77.875 15.175 113.684 27.269 22.282 31.017 27.269 66.837 49.552 97.628 4.567-4.598 18.514-15.596 23.091-20.224-10.608-37.663-19.774-64.103-30.403-101.775 33.526-27.269 60.16-59.341 80.158-96.615 37.673 60.631 75.151 120.976 112.834 181.545 6.656-7.906 13.538-15.596 20.194-23.317-26.010-79.524-52.050-159.027-78.049-238.776 42.67-57.252 118.866-121.579 105.339-183.613-22.507-0.809-43.755 12.083-59.986 31.027z")
      .attr('transform', 'scale(' + (blip.width / 280) + ') translate(' + (-280 + x * (280 / blip.width) - 17) + ', ' + (-180 + y * (280 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function planeLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M406.948 45.65c-27.904 38.297-57.447 79.104-85.135 117.442-86.405 0.583-170.711-1.485-257.106-1.085-7.045 9.799-14.131 19.6-21.207 29.369 71.414 18.535 142.786 37.059 214.19 55.593-23.296 31.222-44.329 64.123-57.231 102.82-38.922 1.464-78.059 3.134-117.013 4.782-4.362 5.837-8.745 11.868-12.912 17.93 35.819 12.278 77.875 15.175 113.684 27.269 22.282 31.017 27.269 66.837 49.552 97.628 4.567-4.598 18.514-15.596 23.091-20.224-10.608-37.663-19.774-64.103-30.403-101.775 33.526-27.269 60.16-59.341 80.158-96.615 37.673 60.631 75.151 120.976 112.834 181.545 6.656-7.906 13.538-15.596 20.194-23.317-26.010-79.524-52.050-159.027-78.049-238.776 42.67-57.252 118.866-121.579 105.339-183.613-22.507-0.809-43.755 12.083-59.986 31.027z")
      .attr('transform', 'scale(' + (22 / 450) + ') translate(' + (-250+ x * (450 / 22) - 17) + ', ' + (-220 + y * (450 / 22) - 17) + ')');
  }












    function truck(blip, x, y, order, group) {
    return (group || svg).append('path').attr('d', "M487.932,51.1c-3.613-3.612-7.905-5.424-12.847-5.424h-292.36c-4.948,0-9.233,1.812-12.847,5.424   c-3.615,3.617-5.424,7.902-5.424,12.85v54.818h-45.683c-5.14,0-10.71,1.237-16.705,3.711c-5.996,2.478-10.801,5.518-14.416,9.135   l-56.532,56.531c-2.473,2.474-4.612,5.327-6.424,8.565c-1.807,3.23-3.14,6.14-3.997,8.705c-0.855,2.572-1.477,6.089-1.854,10.566   c-0.378,4.475-0.62,7.758-0.715,9.853c-0.091,2.092-0.091,5.71,0,10.85c0.096,5.142,0.144,8.47,0.144,9.995v91.36   c-4.947,0-9.229,1.807-12.847,5.428C1.809,347.076,0,351.363,0,356.312c0,2.851,0.378,5.376,1.14,7.562   c0.763,2.19,2.046,3.949,3.858,5.284c1.807,1.335,3.378,2.426,4.709,3.285c1.335,0.855,3.571,1.424,6.711,1.711   s5.28,0.479,6.423,0.575c1.143,0.089,3.568,0.089,7.279,0c3.715-0.096,5.855-0.144,6.427-0.144h18.271   c0,20.17,7.139,37.397,21.411,51.674c14.277,14.274,31.501,21.413,51.678,21.413c20.175,0,37.401-7.139,51.675-21.413   c14.277-14.276,21.411-31.504,21.411-51.674H310.63c0,20.17,7.139,37.397,21.412,51.674c14.271,14.274,31.498,21.413,51.675,21.413   c20.181,0,37.397-7.139,51.675-21.413c14.277-14.276,21.412-31.504,21.412-51.674c0.568,0,2.711,0.048,6.42,0.144   c3.713,0.089,6.14,0.089,7.282,0c1.144-0.096,3.289-0.288,6.427-0.575c3.139-0.287,5.373-0.855,6.708-1.711s2.901-1.95,4.709-3.285   c1.81-1.335,3.097-3.094,3.856-5.284c0.77-2.187,1.143-4.712,1.143-7.562V63.953C493.353,59.004,491.546,54.724,487.932,51.1z    M153.597,400.28c-7.229,7.23-15.797,10.854-25.694,10.854c-9.898,0-18.464-3.62-25.697-10.854   c-7.233-7.228-10.848-15.797-10.848-25.693c0-9.897,3.619-18.47,10.848-25.701c7.232-7.228,15.798-10.848,25.697-10.848   c9.897,0,18.464,3.617,25.694,10.848c7.236,7.231,10.853,15.804,10.853,25.701C164.45,384.483,160.833,393.052,153.597,400.28z    M164.45,228.403H54.814v-8.562c0-2.475,0.855-4.569,2.568-6.283l55.674-55.672c1.712-1.714,3.809-2.568,6.283-2.568h45.111   V228.403z M409.41,400.28c-7.23,7.23-15.797,10.854-25.693,10.854c-9.9,0-18.47-3.62-25.7-10.854   c-7.231-7.228-10.849-15.797-10.849-25.693c0-9.897,3.617-18.47,10.849-25.701c7.23-7.228,15.8-10.848,25.7-10.848   c9.896,0,18.463,3.617,25.693,10.848c7.231,7.235,10.852,15.804,10.852,25.701C420.262,384.483,416.648,393.052,409.41,400.28z")
      .attr('transform', 'scale(' + (blip.width / 360) + ') translate(' + (-280 + x * (360 / blip.width) - 17) + ', ' + (-210 + y * (360 / blip.width) - 17) + ')')
      .attr('class', order);
  }

  function truckLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M487.932,51.1c-3.613-3.612-7.905-5.424-12.847-5.424h-292.36c-4.948,0-9.233,1.812-12.847,5.424   c-3.615,3.617-5.424,7.902-5.424,12.85v54.818h-45.683c-5.14,0-10.71,1.237-16.705,3.711c-5.996,2.478-10.801,5.518-14.416,9.135   l-56.532,56.531c-2.473,2.474-4.612,5.327-6.424,8.565c-1.807,3.23-3.14,6.14-3.997,8.705c-0.855,2.572-1.477,6.089-1.854,10.566   c-0.378,4.475-0.62,7.758-0.715,9.853c-0.091,2.092-0.091,5.71,0,10.85c0.096,5.142,0.144,8.47,0.144,9.995v91.36   c-4.947,0-9.229,1.807-12.847,5.428C1.809,347.076,0,351.363,0,356.312c0,2.851,0.378,5.376,1.14,7.562   c0.763,2.19,2.046,3.949,3.858,5.284c1.807,1.335,3.378,2.426,4.709,3.285c1.335,0.855,3.571,1.424,6.711,1.711   s5.28,0.479,6.423,0.575c1.143,0.089,3.568,0.089,7.279,0c3.715-0.096,5.855-0.144,6.427-0.144h18.271   c0,20.17,7.139,37.397,21.411,51.674c14.277,14.274,31.501,21.413,51.678,21.413c20.175,0,37.401-7.139,51.675-21.413   c14.277-14.276,21.411-31.504,21.411-51.674H310.63c0,20.17,7.139,37.397,21.412,51.674c14.271,14.274,31.498,21.413,51.675,21.413   c20.181,0,37.397-7.139,51.675-21.413c14.277-14.276,21.412-31.504,21.412-51.674c0.568,0,2.711,0.048,6.42,0.144   c3.713,0.089,6.14,0.089,7.282,0c1.144-0.096,3.289-0.288,6.427-0.575c3.139-0.287,5.373-0.855,6.708-1.711s2.901-1.95,4.709-3.285   c1.81-1.335,3.097-3.094,3.856-5.284c0.77-2.187,1.143-4.712,1.143-7.562V63.953C493.353,59.004,491.546,54.724,487.932,51.1z    M153.597,400.28c-7.229,7.23-15.797,10.854-25.694,10.854c-9.898,0-18.464-3.62-25.697-10.854   c-7.233-7.228-10.848-15.797-10.848-25.693c0-9.897,3.619-18.47,10.848-25.701c7.232-7.228,15.798-10.848,25.697-10.848   c9.897,0,18.464,3.617,25.694,10.848c7.236,7.231,10.853,15.804,10.853,25.701C164.45,384.483,160.833,393.052,153.597,400.28z    M164.45,228.403H54.814v-8.562c0-2.475,0.855-4.569,2.568-6.283l55.674-55.672c1.712-1.714,3.809-2.568,6.283-2.568h45.111   V228.403z M409.41,400.28c-7.23,7.23-15.797,10.854-25.693,10.854c-9.9,0-18.47-3.62-25.7-10.854   c-7.231-7.228-10.849-15.797-10.849-25.693c0-9.897,3.617-18.47,10.849-25.701c7.23-7.228,15.8-10.848,25.7-10.848   c9.896,0,18.463,3.617,25.693,10.848c7.231,7.235,10.852,15.804,10.852,25.701C420.262,384.483,416.648,393.052,409.41,400.28z")
      .attr('transform', 'scale(' + (22 / 460) + ') translate(' + (-280 + x * (460 / 22) - 17) + ', ' + (-210 + y * (460 / 22) - 17) + ')');
  }











  function car(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "M65.1,23.8c-0.4-0.4-0.9-0.7-1.4-0.8l-13.6-2.5c0,0-2.9-2.4-6.4-4.9c-2.1-1.5-4.2-3.4-7.2-3.4l-1.3,0l-9.6,0l-1,0  c-1.8,0-4.2,1-6.2,2.5c-1.4,1-2.8,2.3-4,3.4c-1.4,1.2-2.8,2.6-4.5,3.8l-5.2,0.8C3.7,23,3,23.8,3,24.8v7C3,33,4,34,5.2,34h4.9  c1.1,2.9,3.9,5,7.2,5c3.3,0,6.1-2.1,7.2-5h21.2c1.1,2.9,3.9,5,7.2,5c3.3,0,6.1-2.1,7.2-5h2.3c2.7,0,4.1-1.2,4.4-2.3  C67.7,28.9,65.1,23.8,65.1,23.8z M17.3,34.2c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9c1.6,0,2.9,1.3,2.9,2.9  C20.3,32.9,18.9,34.2,17.3,34.2z M28.8,20.8h-12c0,0-0.2-0.2,0-0.4c0.5-0.5,0.8-0.8,1.3-1.2c2.2-1.9,3.9-3.6,6.6-3.6l1.4,0l2.7,0  V20.8z M31.6,20.8v-5.2l1.5,0l1.5,0c2,0,3.4,0.2,4.8,1.1c2,1.5,3.7,2.8,4.6,3.6c0.2,0.2,0.1,0.4-0.2,0.5H31.6z M52.9,34.2  c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9c1.6,0,2.9,1.3,2.9,2.9C55.8,32.9,54.5,34.2,52.9,34.2z")
      .attr('transform', 'scale(' + (blip.width / 30) + ') translate(' + (-18 + x * (30 / blip.width) - 17) + ', ' + (-10 + y * (30 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function carLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M65.1,23.8c-0.4-0.4-0.9-0.7-1.4-0.8l-13.6-2.5c0,0-2.9-2.4-6.4-4.9c-2.1-1.5-4.2-3.4-7.2-3.4l-1.3,0l-9.6,0l-1,0  c-1.8,0-4.2,1-6.2,2.5c-1.4,1-2.8,2.3-4,3.4c-1.4,1.2-2.8,2.6-4.5,3.8l-5.2,0.8C3.7,23,3,23.8,3,24.8v7C3,33,4,34,5.2,34h4.9  c1.1,2.9,3.9,5,7.2,5c3.3,0,6.1-2.1,7.2-5h21.2c1.1,2.9,3.9,5,7.2,5c3.3,0,6.1-2.1,7.2-5h2.3c2.7,0,4.1-1.2,4.4-2.3  C67.7,28.9,65.1,23.8,65.1,23.8z M17.3,34.2c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9c1.6,0,2.9,1.3,2.9,2.9  C20.3,32.9,18.9,34.2,17.3,34.2z M28.8,20.8h-12c0,0-0.2-0.2,0-0.4c0.5-0.5,0.8-0.8,1.3-1.2c2.2-1.9,3.9-3.6,6.6-3.6l1.4,0l2.7,0  V20.8z M31.6,20.8v-5.2l1.5,0l1.5,0c2,0,3.4,0.2,4.8,1.1c2,1.5,3.7,2.8,4.6,3.6c0.2,0.2,0.1,0.4-0.2,0.5H31.6z M52.9,34.2  c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9c1.6,0,2.9,1.3,2.9,2.9C55.8,32.9,54.5,34.2,52.9,34.2z")
      .attr('transform', 'scale(' + (22 / 55) + ') translate(' + (-18+ x * (55 / 22) - 17) + ', ' + (-10 + y * (55 / 22) - 17) + ')');
  }










  function baloon(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "M925.2,779.9l-95-139.9l0,0L640,360V80h35c19.3,0,35-15.7,35-35s-15.7-35-35-35h-35H360h-35c-19.3,0-35,15.7-35,35  s15.7,35,35,35h35v280L169.8,640l0,0l-95,139.9C5.5,895.5,59,990,193.8,990l0,0h612.5C941,990,994.5,895.5,925.2,779.9z")
      .attr('transform', 'scale(' + (blip.width / 700) + ') translate(' + (-500 + x * (700 / blip.width) - 17) + ', ' + (-600 + y * (700 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function baloonLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M925.2,779.9l-95-139.9l0,0L640,360V80h35c19.3,0,35-15.7,35-35s-15.7-35-35-35h-35H360h-35c-19.3,0-35,15.7-35,35  s15.7,35,35,35h35v280L169.8,640l0,0l-95,139.9C5.5,895.5,59,990,193.8,990l0,0h612.5C941,990,994.5,895.5,925.2,779.9z")
      .attr('transform', 'scale(' + (22 / 1100) + ') translate(' + (-450+ x * (1100 / 22) - 17) + ', ' + (-250 + y * (1100 / 22) - 17) + ')');
  }








  function circle(blip, x, y, order, group) {
    return (group || svg).append('path')
      .attr('d', "M420.084,282.092c-1.073,0-2.16,0.103-3.243,0.313c-6.912,1.345-13.188,8.587-11.423,16.874c1.732,8.141,8.632,13.711,17.806,13.711c0.025,0,0.052,0,0.074-0.003c0.551-0.025,1.395-0.011,2.225-0.109c4.404-0.534,8.148-2.218,10.069-6.487c1.747-3.886,2.114-7.993,0.913-12.118C434.379,286.944,427.494,282.092,420.084,282.092")
      .attr('transform', 'scale(' + (blip.width / 34) + ') translate(' + (-404 + x * (34 / blip.width) - 17) + ', ' + (-282 + y * (34 / blip.width) - 17) + ')')
      .attr('class', order);
  }

  function circleLegend(x, y, group) {
    return (group || svg).append('path')
      .attr('d', "M420.084,282.092c-1.073,0-2.16,0.103-3.243,0.313c-6.912,1.345-13.188,8.587-11.423,16.874c1.732,8.141,8.632,13.711,17.806,13.711c0.025,0,0.052,0,0.074-0.003c0.551-0.025,1.395-0.011,2.225-0.109c4.404-0.534,8.148-2.218,10.069-6.487c1.747-3.886,2.114-7.993,0.913-12.118C434.379,286.944,427.494,282.092,420.084,282.092")
      .attr('transform', 'scale(' + (22 / 64) + ') translate(' + (-404 + x * (64 / 22) - 17) + ', ' + (-282 + y * (64 / 22) - 17) + ')');
  }




















    function plataforma(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "m 230.808 102.568 c -0.365 -3.25 -4.156 -5.695 -7.434 -5.695 c -10.594 0 -19.996 -6.218 -23.939 -15.842 c -4.025 -9.855 -1.428 -21.346 6.465 -28.587 c 2.486 -2.273 2.789 -6.079 0.705 -8.721 c -5.424 -6.886 -11.586 -13.107 -18.316 -18.498 c -2.633 -2.112 -6.502 -1.818 -8.787 0.711 c -6.891 7.632 -19.27 10.468 -28.836 6.477 c -9.951 -4.187 -16.232 -14.274 -15.615 -25.101 c 0.203 -3.403 -2.285 -6.36 -5.676 -6.755 c -8.637 -1 -17.35 -1.029 -26.012 -0.068 c -3.348 0.37 -5.834 3.257 -5.723 6.617 c 0.375 10.721 -5.977 20.63 -15.832 24.667 c -9.451 3.861 -21.744 1.046 -28.621 -6.519 c -2.273 -2.492 -6.074 -2.798 -8.725 -0.731 c -6.928 5.437 -13.229 11.662 -18.703 18.492 c -2.133 2.655 -1.818 6.503 0.689 8.784 c 8.049 7.289 10.644 18.879 6.465 28.849 c -3.99 9.505 -13.859 15.628 -25.156 15.628 c -3.666 -0.118 -6.275 2.345 -6.68 5.679 c -1.016 8.683 -1.027 17.535 -0.049 26.289 c 0.365 3.264 4.268 5.688 7.582 5.688 c 10.07 -0.256 19.732 5.974 23.791 15.841 c 4.039 9.855 1.439 21.341 -6.467 28.592 c -2.473 2.273 -2.789 6.07 -0.701 8.709 c 5.369 6.843 11.537 13.068 18.287 18.505 c 2.65 2.134 6.504 1.835 8.801 -0.697 c 6.918 -7.65 19.295 -10.481 28.822 -6.482 c 9.98 4.176 16.258 14.262 15.645 25.092 c -0.201 3.403 2.293 6.369 5.672 6.755 c 4.42 0.517 8.863 0.773 13.32 0.773 c 4.23 0 8.461 -0.231 12.692 -0.702 c 3.352 -0.37 5.834 -3.26 5.721 -6.621 c -0.387 -10.716 5.979 -20.626 15.822 -24.655 c 9.514 -3.886 21.752 -1.042 28.633 6.512 c 2.285 2.487 6.063 2.789 8.725 0.73 c 6.916 -5.423 13.205 -11.645 18.703 -18.493 c 2.135 -2.65 1.832 -6.503 -0.689 -8.788 c -8.047 -7.284 -10.656 -18.879 -6.477 -28.839 c 3.928 -9.377 13.43 -15.673 23.65 -15.673 l 1.43 0.038 c 3.318 0.269 6.367 -2.286 6.768 -5.671 c 1.021 -8.691 1.032 -17.533 0.05 -26.29 Z m -86.849 17.826 c 2.113 -4.982 3.229 -10.383 3.228 -15.957 c 0 -10.915 -4.251 -21.176 -11.97 -28.893 c -7.717 -7.717 -17.978 -11.967 -28.891 -11.967 c -3.642 0 -7.267 0.484 -10.774 1.439 c -1.536 0.419 -2.792 1.685 -3.201 3.224 c -0.418 1.574 0.053 3.187 1.283 4.418 c 0 0 14.409 14.52 19.23 19.34 c 0.505 0.505 0.504 1.71 0.433 2.144 l -0.045 0.317 c -0.486 5.3 -1.423 11.662 -2.196 14.107 c -0.104 0.103 -0.202 0.19 -0.308 0.296 c -0.111 0.111 -0.213 0.218 -0.32 0.328 c -2.477 0.795 -8.937 1.743 -14.321 2.225 l 0.001 -0.029 l -0.242 0.061 c -0.043 0.005 -0.123 0.011 -0.229 0.011 c -0.582 0 -1.438 -0.163 -2.216 -0.94 c -5.018 -5.018 -18.862 -18.763 -18.862 -18.763 c -1.242 -1.238 -2.516 -1.498 -3.365 -1.498 c -1.979 0 -3.751 1.43 -4.309 3.481 c -3.811 14.103 0.229 29.273 10.546 39.591 l 66.528 -12.935 Z")
      .attr('transform', 'scale(' + (blip.width / 150) + ') translate(' + (-100 + x * (150 / blip.width) - 17) + ', ' + (-100 + y * (150 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function plataformaLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "m 230.808 102.568 c -0.365 -3.25 -4.156 -5.695 -7.434 -5.695 c -10.594 0 -19.996 -6.218 -23.939 -15.842 c -4.025 -9.855 -1.428 -21.346 6.465 -28.587 c 2.486 -2.273 2.789 -6.079 0.705 -8.721 c -5.424 -6.886 -11.586 -13.107 -18.316 -18.498 c -2.633 -2.112 -6.502 -1.818 -8.787 0.711 c -6.891 7.632 -19.27 10.468 -28.836 6.477 c -9.951 -4.187 -16.232 -14.274 -15.615 -25.101 c 0.203 -3.403 -2.285 -6.36 -5.676 -6.755 c -8.637 -1 -17.35 -1.029 -26.012 -0.068 c -3.348 0.37 -5.834 3.257 -5.723 6.617 c 0.375 10.721 -5.977 20.63 -15.832 24.667 c -9.451 3.861 -21.744 1.046 -28.621 -6.519 c -2.273 -2.492 -6.074 -2.798 -8.725 -0.731 c -6.928 5.437 -13.229 11.662 -18.703 18.492 c -2.133 2.655 -1.818 6.503 0.689 8.784 c 8.049 7.289 10.644 18.879 6.465 28.849 c -3.99 9.505 -13.859 15.628 -25.156 15.628 c -3.666 -0.118 -6.275 2.345 -6.68 5.679 c -1.016 8.683 -1.027 17.535 -0.049 26.289 c 0.365 3.264 4.268 5.688 7.582 5.688 c 10.07 -0.256 19.732 5.974 23.791 15.841 c 4.039 9.855 1.439 21.341 -6.467 28.592 c -2.473 2.273 -2.789 6.07 -0.701 8.709 c 5.369 6.843 11.537 13.068 18.287 18.505 c 2.65 2.134 6.504 1.835 8.801 -0.697 c 6.918 -7.65 19.295 -10.481 28.822 -6.482 c 9.98 4.176 16.258 14.262 15.645 25.092 c -0.201 3.403 2.293 6.369 5.672 6.755 c 4.42 0.517 8.863 0.773 13.32 0.773 c 4.23 0 8.461 -0.231 12.692 -0.702 c 3.352 -0.37 5.834 -3.26 5.721 -6.621 c -0.387 -10.716 5.979 -20.626 15.822 -24.655 c 9.514 -3.886 21.752 -1.042 28.633 6.512 c 2.285 2.487 6.063 2.789 8.725 0.73 c 6.916 -5.423 13.205 -11.645 18.703 -18.493 c 2.135 -2.65 1.832 -6.503 -0.689 -8.788 c -8.047 -7.284 -10.656 -18.879 -6.477 -28.839 c 3.928 -9.377 13.43 -15.673 23.65 -15.673 l 1.43 0.038 c 3.318 0.269 6.367 -2.286 6.768 -5.671 c 1.021 -8.691 1.032 -17.533 0.05 -26.29 Z m -86.849 17.826 c 2.113 -4.982 3.229 -10.383 3.228 -15.957 c 0 -10.915 -4.251 -21.176 -11.97 -28.893 c -7.717 -7.717 -17.978 -11.967 -28.891 -11.967 c -3.642 0 -7.267 0.484 -10.774 1.439 c -1.536 0.419 -2.792 1.685 -3.201 3.224 c -0.418 1.574 0.053 3.187 1.283 4.418 c 0 0 14.409 14.52 19.23 19.34 c 0.505 0.505 0.504 1.71 0.433 2.144 l -0.045 0.317 c -0.486 5.3 -1.423 11.662 -2.196 14.107 c -0.104 0.103 -0.202 0.19 -0.308 0.296 c -0.111 0.111 -0.213 0.218 -0.32 0.328 c -2.477 0.795 -8.937 1.743 -14.321 2.225 l 0.001 -0.029 l -0.242 0.061 c -0.043 0.005 -0.123 0.011 -0.229 0.011 c -0.582 0 -1.438 -0.163 -2.216 -0.94 c -5.018 -5.018 -18.862 -18.763 -18.862 -18.763 c -1.242 -1.238 -2.516 -1.498 -3.365 -1.498 c -1.979 0 -3.751 1.43 -4.309 3.481 c -3.811 14.103 0.229 29.273 10.546 39.591 l 66.528 -12.935 Z")
      .attr('transform', 'scale(' + (22 / 250) + ') translate(' + (-100+ x * (250 / 22) - 17) + ', ' + (-80 + y * (250 / 22) - 17) + ')');
  }




  function tecnica(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "M925.2,779.9l-95-139.9l0,0L640,360V80h35c19.3,0,35-15.7,35-35s-15.7-35-35-35h-35H360h-35c-19.3,0-35,15.7-35,35  s15.7,35,35,35h35v280L169.8,640l0,0l-95,139.9C5.5,895.5,59,990,193.8,990l0,0h612.5C941,990,994.5,895.5,925.2,779.9z")
      .attr('transform', 'scale(' + (blip.width / 700) + ') translate(' + (-500 + x * (700 / blip.width) - 17) + ', ' + (-600 + y * (700 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function tecnicaLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M925.2,779.9l-95-139.9l0,0L640,360V80h35c19.3,0,35-15.7,35-35s-15.7-35-35-35h-35H360h-35c-19.3,0-35,15.7-35,35  s15.7,35,35,35h35v280L169.8,640l0,0l-95,139.9C5.5,895.5,59,990,193.8,990l0,0h612.5C941,990,994.5,895.5,925.2,779.9z")
      .attr('transform', 'scale(' + (22 / 1100) + ') translate(' + (-450+ x * (1100 / 22) - 17) + ', ' + (-250 + y * (1100 / 22) - 17) + ')');
  }





    function framework(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "M858.6,479.4c-24.9,0-48.1,6.9-67.8,19c-7.4,4.5-16.7,4.7-24.3,0.4c-7.6-4.3-12.3-12.3-12.3-21V321.3c0-24.1-20.2-43.5-44.3-43.5H518c-8.5,0-16.4-4.5-20.7-11.8c-4.3-7.3-4.5-16.4-0.3-23.9c10.5-18.9,16.4-40.7,16.4-63.7c0-72.6-58.8-131.5-131.4-131.5c-72.6,0-131.4,58.9-131.4,131.5c0,23.1,5.9,44.8,16.4,63.7c4.1,7.5,4,16.5-0.3,23.9c-4.3,7.3-12.2,11.8-20.7,11.8H54.1C30,277.8,10,297.2,10,321.3V474c0,8.5,4.5,16.3,11.7,20.7c7.3,4.3,16.3,4.5,23.8,0.5c18.6-10,39.8-15.7,62.4-15.7c72.6,0,131.4,58.8,131.4,131.4c0,72.6-58.8,131.4-131.4,131.4c-22.6,0-43.8-5.7-62.4-15.7c-7.5-4-16.5-3.8-23.8,0.5c-7.3,4.3-11.7,12.2-11.7,20.7v161.8c0,24.1,20,43.6,44.1,43.6h655.7c24.1,0,44.3-19.5,44.3-43.6V743.8c0-8.7,4.7-16.7,12.3-21c7.6-4.3,16.9-4.1,24.3,0.4c19.7,12,42.9,19,67.8,19c72.6,0,131.4-58.8,131.4-131.4C990,538.3,931.2,479.4,858.6,479.4z")
      .attr('transform', 'scale(' + (blip.width / 600) + ') translate(' + (-400 + x * (600 / blip.width) - 17) + ', ' + (-550 + y * (600 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function frameworkLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M858.6,479.4c-24.9,0-48.1,6.9-67.8,19c-7.4,4.5-16.7,4.7-24.3,0.4c-7.6-4.3-12.3-12.3-12.3-21V321.3c0-24.1-20.2-43.5-44.3-43.5H518c-8.5,0-16.4-4.5-20.7-11.8c-4.3-7.3-4.5-16.4-0.3-23.9c10.5-18.9,16.4-40.7,16.4-63.7c0-72.6-58.8-131.5-131.4-131.5c-72.6,0-131.4,58.9-131.4,131.5c0,23.1,5.9,44.8,16.4,63.7c4.1,7.5,4,16.5-0.3,23.9c-4.3,7.3-12.2,11.8-20.7,11.8H54.1C30,277.8,10,297.2,10,321.3V474c0,8.5,4.5,16.3,11.7,20.7c7.3,4.3,16.3,4.5,23.8,0.5c18.6-10,39.8-15.7,62.4-15.7c72.6,0,131.4,58.8,131.4,131.4c0,72.6-58.8,131.4-131.4,131.4c-22.6,0-43.8-5.7-62.4-15.7c-7.5-4-16.5-3.8-23.8,0.5c-7.3,4.3-11.7,12.2-11.7,20.7v161.8c0,24.1,20,43.6,44.1,43.6h655.7c24.1,0,44.3-19.5,44.3-43.6V743.8c0-8.7,4.7-16.7,12.3-21c7.6-4.3,16.9-4.1,24.3,0.4c19.7,12,42.9,19,67.8,19c72.6,0,131.4-58.8,131.4-131.4C990,538.3,931.2,479.4,858.6,479.4z")
      .attr('transform', 'scale(' + (22 / 900) + ') translate(' + (-400+ x * (900 / 22) - 17) + ', ' + (-550 + y * (900 / 22) - 17) + ')');
  }





    function full_circle(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "M785 1575 c-157 -29 -291 -99 -400 -210 -198 -202 -264 -481 -176 -745 43 -126 104 -222 200 -312 282 -265 720 -265 1002 -1 309 292 320 756 24 1058 -111 112 -244 182 -405 211 -92 16 -153 16 -245 -1z")
      .attr('transform', 'scale(' + (blip.width / 1000) + ') translate(' + (-900 + x * (1000 / blip.width) - 17) + ', ' + (-750 + y * (1000 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function full_circleLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M785 1575 c-157 -29 -291 -99 -400 -210 -198 -202 -264 -481 -176 -745 43 -126 104 -222 200 -312 282 -265 720 -265 1002 -1 309 292 320 756 24 1058 -111 112 -244 182 -405 211 -92 16 -153 16 -245 -1z")
      .attr('transform', 'scale(' + (22 / 1700) + ') translate(' + (-600+ x * (1700 / 22) - 17) + ', ' + (-800 + y * (1700 / 22) - 17) + ')');
  }





    function half_circle(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "M745 1584 c-322 -52 -565 -282 -629 -596 -51 -246 31 -499 217 -674 89 -84 159 -126 274 -168 83 -29 96 -31 233 -31 137 0 150 2 233 31 115 42 185 84 274 168 322 302 306 819 -34 1101 -75 63 -196 125 -288 149 -62 17 -227 28 -280 20z m247 -58 c248 -53 449 -247 519 -501 18 -67 21 -97 17 -204 -7 -202 -60 -323 -203 -466 -117 -118 -251 -180 -427 -200 l-58 -6 0 695 0 696 43 0 c23 0 72 -7 109 -14z")
      .attr('transform', 'scale(' + (blip.width / 1100) + ') translate(' + (-500 + x * (1100 / blip.width) - 17) + ', ' + (-700 + y * (1100 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function half_circleLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M745 1584 c-322 -52 -565 -282 -629 -596 -51 -246 31 -499 217 -674 89 -84 159 -126 274 -168 83 -29 96 -31 233 -31 137 0 150 2 233 31 115 42 185 84 274 168 322 302 306 819 -34 1101 -75 63 -196 125 -288 149 -62 17 -227 28 -280 20z m247 -58 c248 -53 449 -247 519 -501 18 -67 21 -97 17 -204 -7 -202 -60 -323 -203 -466 -117 -118 -251 -180 -427 -200 l-58 -6 0 695 0 696 43 0 c23 0 72 -7 109 -14z")
      .attr('transform', 'scale(' + (22 / 1700) + ') translate(' + (-600+ x * (1700 / 22) - 17) + ', ' + (-700 + y * (1700 / 22) - 17) + ')');
  }





    function empty_circle(blip, x, y, order, group){

        return (group || svg).append('path').attr('d', "M832 1604 c-112 -20 -210 -63 -319 -140 -114 -81 -212 -222 -261 -374 -23 -75 -26 -101 -26 -215 0 -119 3 -138 32 -221 43 -128 103 -222 192 -307 90 -85 176 -138 285 -174 72 -24 94 -27 225 -27 131 0 153 3 225 27 116 39 199 91 296 187 75 74 93 98 137 190 65 135 87 236 79 370 -11 162 -70 311 -177 440 -85 101 -246 199 -386 235 -78 20 -216 24 -302 9z m287 -50 c200 -49 366 -179 455 -354 108 -213 109 -420 4 -639 -32 -68 -57 -101 -127 -171 -143 -143 -290 -205 -491 -205 -201 0 -348 62 -491 205 -70 70 -95 103 -127 171 -67 140 -91 268 -72 396 43 300 233 517 519 594 86 23 242 25 330 3z")
      .attr('transform', 'scale(' + (blip.width / 1100) + ') translate(' + (-800 + x * (1100 / blip.width) - 17) + ', ' + (-750 + y * (1100 / blip.width) - 17) + ')')
      .attr('class', order);
  }



    function empty_circleLegend(x, y, group) {
    return (group || svg).append('path')
    .attr('d', "M832 1604 c-112 -20 -210 -63 -319 -140 -114 -81 -212 -222 -261 -374 -23 -75 -26 -101 -26 -215 0 -119 3 -138 32 -221 43 -128 103 -222 192 -307 90 -85 176 -138 285 -174 72 -24 94 -27 225 -27 131 0 153 3 225 27 116 39 199 91 296 187 75 74 93 98 137 190 65 135 87 236 79 370 -11 162 -70 311 -177 440 -85 101 -246 199 -386 235 -78 20 -216 24 -302 9z m287 -50 c200 -49 366 -179 455 -354 108 -213 109 -420 4 -639 -32 -68 -57 -101 -127 -171 -143 -143 -290 -205 -491 -205 -201 0 -348 62 -491 205 -70 70 -95 103 -127 171 -67 140 -91 268 -72 396 43 300 233 517 519 594 86 23 242 25 330 3z")
      .attr('transform', 'scale(' + (22 / 1700) + ') translate(' + (-650+ x * (1700 / 22) - 17) + ', ' + (-700 + y * (1700 / 22) - 17) + ')');
  }










  function addRing(ring, order) {
    var table = d3.select('.quadrant-table.' + order);
    table.append('h3').text(ring);
    return table.append('ul');
  }




  function calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle) {
    var adjustX = Math.sin(toRadian(startAngle)) - Math.cos(toRadian(startAngle));
    var adjustY = -Math.cos(toRadian(startAngle)) - Math.sin(toRadian(startAngle));

    var radius = chance.floating({min: minRadius + blip.width / 2, max: maxRadius - blip.width / 2});
    var angleDelta = Math.asin(blip.width / 2 / radius) * 180 / Math.PI;
    angleDelta = angleDelta > 45 ? 45 : angleDelta;
    var angle = toRadian(chance.integer({min: angleDelta, max: 90 - angleDelta}));

    var x = center() + radius * Math.cos(angle) * adjustX;
    var y = center() + radius * Math.sin(angle) * adjustY;

    return [x, y];
  }

  function thereIsCollision(blip, coordinates, allCoordinates) {
    return allCoordinates.some(function (currentCoordinates) {
      return (Math.abs(currentCoordinates[0] - coordinates[0]) < blip.width) && (Math.abs(currentCoordinates[1] - coordinates[1]) < blip.width)
    });
  }

  function plotBlips(quadrantGroup, rings, quadrantWrapper) {
    var blips, quadrant, startAngle, order;

    quadrant = quadrantWrapper.quadrant;
    startAngle = quadrantWrapper.startAngle;
    order = quadrantWrapper.order;


    


    d3.select('.quadrant-table.' + order)
      .append('h2')
      .attr('class', 'quadrant-table__name')
      .text(quadrant.name());

    blips = quadrant.blips();



    rings.forEach(function (ring, i) {
      var ringBlips = blips.filter(function (blip) {
        return blip.ring() == ring;
      });

      if (ringBlips.length == 0) {
        return;
      }

      var maxRadius, minRadius;

      minRadius = ringCalculator.getRadius(i);
      maxRadius = ringCalculator.getRadius(i + 1);

      var sumRing = ring.name().split('').reduce(function (p, c) {
        return p + c.charCodeAt(0);
      }, 0);
      var sumQuadrant = quadrant.name().split('').reduce(function (p, c) {
        return p + c.charCodeAt(0);
      }, 0);
      var chance = new Chance(Math.PI * sumRing * ring.name().length * sumQuadrant * quadrant.name().length);

      var ringList = addRing(ring.name(), order);
      var allBlipCoordinatesInRing = [];

      ringBlips.forEach(function (blip) {
        const coordinates = findBlipCoordinates(blip,
          minRadius,
          maxRadius,
          startAngle,
          allBlipCoordinatesInRing);

        allBlipCoordinatesInRing.push(coordinates);
        drawBlipInCoordinates(blip, coordinates, order, quadrantGroup, ringList);
      });
    });
  }

  function findBlipCoordinates(blip, minRadius, maxRadius, startAngle, allBlipCoordinatesInRing) {
    const maxIterations = 200;
    var coordinates = calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle);
    var iterationCounter = 0;
    var foundAPlace = false;

    while (iterationCounter < maxIterations) {
      if (thereIsCollision(blip, coordinates, allBlipCoordinatesInRing)) {
        coordinates = calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle);
      } else {
        foundAPlace = true;
        break;
      }
      iterationCounter++;
    }

    if (!foundAPlace && blip.width > MIN_BLIP_WIDTH) {
      blip.width = blip.width - 1;
      return findBlipCoordinates(blip, minRadius, maxRadius, startAngle, allBlipCoordinatesInRing);
    } else {
      return coordinates;
    }
  }

  function drawBlipInCoordinates(blip, coordinates, order, quadrantGroup, ringList) {


    if(blip.visible() == "FALSE"){
  return;
}
    var x = coordinates[0];
    var y = coordinates[1];

    var group = quadrantGroup.append('g').attr('class', 'blip-link');









    if (blip.maturity() == "1") {

      empty_circle(blip, x, y, order, group);
    } else if(blip.maturity() == "4"){

      full_circle(blip, x, y, order, group);
    }

    else {
      half_circle(blip, x, y, order, group);
    }
    

    //if(order == "fourth"){
    if (blip.maturity() == "1") {

    group.append('text')
      .attr('x', x)
      .attr('y', y + 4)
      .attr('class', 'blip-text')
      // derive font-size from current blip width
      .style('font-size', ((blip.width * 10) / 22) + 'px')
      .attr('text-anchor', 'middle')
      .attr('style', 'fill: black;')
      .text(blip.number());

    }

    else{
    group.append('text')
      .attr('x', x)
      .attr('y', y + 4)
      .attr('class', 'blip-text')
      // derive font-size from current blip width
      .style('font-size', ((blip.width * 10) / 22) + 'px')
      .attr('text-anchor', 'middle')
      .attr('style', 'fill: white;')
      .text(blip.number());

    }








    



    var blipListItem = ringList.append('li');
    var blipText = blip.number() + '. ' + blip.name() + (blip.topic() ? ('. - ' + blip.topic()) : '');
    blipListItem.append('div')
      .attr('class', 'blip-list-item')
      .text(blipText);

    var blipItemDescription = blipListItem.append('div')
      .attr('class', 'blip-item-description');
    if (blip.description()) {
      blipItemDescription.append('p').html(blip.description());
    }

    var mouseOver = function () {
      d3.selectAll('g.blip-link').attr('opacity', 0.3);
      group.attr('opacity', 1.0);
      blipListItem.selectAll('.blip-list-item').classed('highlight', true);
      tip.show(blip.name(), group.node());
    };

    var mouseOut = function () {
      d3.selectAll('g.blip-link').attr('opacity', 1.0);
      blipListItem.selectAll('.blip-list-item').classed('highlight', false);
      tip.hide().style('left', 0).style('top', 0);
    };

    blipListItem.on('mouseover', mouseOver).on('mouseout', mouseOut);
    group.on('mouseover', mouseOver).on('mouseout', mouseOut);

    var clickBlip = function () {
      d3.select('.blip-item-description.expanded').node() !== blipItemDescription.node() &&
        d3.select('.blip-item-description.expanded').classed("expanded", false);
      blipItemDescription.classed("expanded", !blipItemDescription.classed("expanded"));

      blipItemDescription.on('click', function () {
        d3.event.stopPropagation();
      });
    };

    blipListItem.on('click', clickBlip);
  }

  function removeHomeLink(){
    d3.select('.home-link').remove();
  }

  function createHomeLink(pageElement) {
    if (pageElement.select('.home-link').empty()) {
      pageElement.append('div')
        .html('&#171; Voltar')
        .classed('home-link', true)
        .classed('selected', true)
        .on('click', redrawFullRadar)
        .append('g')
        .attr('fill', '#626F87')
        .append('path')
        .attr('d', 'M27.6904224,13.939279 C27.6904224,13.7179572 27.6039633,13.5456925 27.4314224,13.4230122 L18.9285959,6.85547454 C18.6819796,6.65886965 18.410898,6.65886965 18.115049,6.85547454 L9.90776939,13.4230122 C9.75999592,13.5456925 9.68592041,13.7179572 9.68592041,13.939279 L9.68592041,25.7825947 C9.68592041,25.979501 9.74761224,26.1391059 9.87092041,26.2620876 C9.99415306,26.3851446 10.1419265,26.4467108 10.3145429,26.4467108 L15.1946918,26.4467108 C15.391698,26.4467108 15.5518551,26.3851446 15.6751633,26.2620876 C15.7984714,26.1391059 15.8600878,25.979501 15.8600878,25.7825947 L15.8600878,18.5142424 L21.4794061,18.5142424 L21.4794061,25.7822933 C21.4794061,25.9792749 21.5410224,26.1391059 21.6643306,26.2620876 C21.7876388,26.3851446 21.9477959,26.4467108 22.1448776,26.4467108 L27.024951,26.4467108 C27.2220327,26.4467108 27.3821898,26.3851446 27.505498,26.2620876 C27.6288061,26.1391059 27.6904224,25.9792749 27.6904224,25.7822933 L27.6904224,13.939279 Z M18.4849735,0.0301425662 C21.0234,0.0301425662 23.4202449,0.515814664 25.6755082,1.48753564 C27.9308469,2.45887984 29.8899592,3.77497963 31.5538265,5.43523218 C33.2173918,7.09540937 34.5358755,9.05083299 35.5095796,11.3015031 C36.4829061,13.5518717 36.9699469,15.9439104 36.9699469,18.4774684 C36.9699469,20.1744196 36.748098,21.8101813 36.3044755,23.3844521 C35.860551,24.9584216 35.238498,26.4281731 34.4373347,27.7934053 C33.6362469,29.158336 32.6753041,30.4005112 31.5538265,31.5197047 C30.432349,32.6388982 29.1876388,33.5981853 27.8199224,34.3973401 C26.4519041,35.1968717 24.9791531,35.8176578 23.4016694,36.2606782 C21.8244878,36.7033971 20.1853878,36.9247943 18.4849735,36.9247943 C16.7841816,36.9247943 15.1453837,36.7033971 13.5679755,36.2606782 C11.9904918,35.8176578 10.5180429,35.1968717 9.15002449,34.3973401 C7.78223265,33.5978839 6.53752245,32.6388982 5.41612041,31.5197047 C4.29464286,30.4005112 3.33339796,29.158336 2.53253673,27.7934053 C1.73144898,26.4281731 1.10909388,24.9584216 0.665395918,23.3844521 C0.22184898,21.8101813 0,20.1744196 0,18.4774684 C0,16.7801405 0.22184898,15.1446802 0.665395918,13.5704847 C1.10909388,11.9962138 1.73144898,10.5267637 2.53253673,9.16153157 C3.33339796,7.79652546 4.29464286,6.55435031 5.41612041,5.43523218 C6.53752245,4.3160387 7.78223265,3.35675153 9.15002449,2.55752138 C10.5180429,1.75806517 11.9904918,1.13690224 13.5679755,0.694183299 C15.1453837,0.251464358 16.7841816,0.0301425662 18.4849735,0.0301425662 L18.4849735,0.0301425662 Z');
    }
  }

  function removeRadarLegend(){
    d3.select('.legend').remove();
  }

  function drawLegend(order) {
    removeRadarLegend();

    var full_circleKey = "Maturidade Alta";
    var half_circleKey = "Maturidade Média";
    var empty_circleKey = "Maturidade Mínima";


    var container = d3.select('svg').append('g')
      .attr('class', 'legend legend'+"-"+order);

    var x = 5;
    var y = 5;


    if(order == "first") {
      x = 4 * size / 5;
      y = 1 * size / 5;
    }

    if(order == "second") {
      x = 1 * size / 5 - 15;
      y = 1 * size / 5 - 20;
    }

    if(order == "third") {
      x = 1 * size / 5 - 15;
      y = 4 * size / 5 + 15;
    }

    if(order == "fourth") {
      x = 4 * size / 5;
      y = 4 * size / 5;
    }

    d3.select('.legend')
      .attr('class', 'legend legend-'+order)
      .transition()
      .style('visibility', 'visible');

    full_circleLegend(x, y, container);

    container
      .append('text')
      .attr('x', x + 15)
      .attr('y', y + 5)
      .attr('font-size', '0.6em')
      .text(full_circleKey);


    half_circleLegend(x, y + 20, container);

    container
      .append('text')
      .attr('x', x + 15)
      .attr('y', y + 25)
      .attr('font-size', '0.6em')
      .text(half_circleKey);


    empty_circleLegend(x, y + 40, container);

    container
      .append('text')
      .attr('x', x + 15)
      .attr('y', y + 45)
      .attr('font-size', '0.6em')
      .text(empty_circleKey);


  /*  baloonLegend(x, y + 60, container);

    container
      .append('text')
      .attr('x', x + 15)
      .attr('y', y + 65)
      .attr('font-size', '0.6em')
      .text(baloonKey);
*/

  }

  function redrawFullRadar() {
    removeHomeLink();
    removeRadarLegend();

    svg.style('left', 0).style('right', 0);

    d3.selectAll('.button')
      .classed('selected', false)
      .classed('full-view', true);

    d3.selectAll('.quadrant-table').classed('selected', false);
    d3.selectAll('.home-link').classed('selected', false);

    d3.selectAll('.quadrant-group')
      .transition()
      .duration(1000)
      .attr('transform', 'scale(1)');

    d3.selectAll('.quadrant-group .blip-link')
      .transition()
      .duration(1000)
      .attr('transform', 'scale(1)');

    d3.selectAll('.quadrant-group')
      .style('pointer-events', 'auto');
  }

  function plotRadarHeader() {
    var header = d3.select('body').insert('header', "#radar");
    header.append('div')
      .attr('class', 'radar-title')
      .append('div')
      .attr('class', 'radar-title__text')
      .append('h1')
      .text(document.title)
      .style('cursor', 'pointer')
      .on('click', redrawFullRadar);

    header.select('.radar-title')
      .append('div')
      .attr('class', 'radar-title__logo')
      .html('<a href="https://www.arkhi.com.br"> <img src="/images/logo.png" /> </a>');

    return header;
  }

  function plotQuadrantButtons(quadrants, header) {

    function addButton(quadrant) {
      radarElement
        .append('div')
        .attr('class', 'quadrant-table ' + quadrant.order);


      header.append('div')
        .attr('class', 'button ' + quadrant.order + ' full-view')
        .text(quadrant.quadrant.name())
        .on('mouseover', mouseoverQuadrant.bind({}, quadrant.order))
        .on('mouseout', mouseoutQuadrant.bind({}, quadrant.order))
        .on('click', selectQuadrant.bind({}, quadrant.order, quadrant.startAngle));
    }

    _.each([0, 1, 2, 3], function (i) {
      addButton(quadrants[i]);
    });


    header.append('div')
      .classed('print-radar button no-capitalize', true)
      .text('Imprimir este radar')
      .on('click', window.print.bind(window));
  }


  function mouseoverQuadrant(order) {
    d3.select('.quadrant-group-' + order).style('opacity', 1);
    d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')').style('opacity', 0.3);
  }

  function mouseoutQuadrant(order) {
    d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')').style('opacity', 1);
  }

  function selectQuadrant(order, startAngle) {
    d3.selectAll('.home-link').classed('selected', false);
    createHomeLink(d3.select('header'));

    d3.selectAll('.button').classed('selected', false).classed('full-view', false);
    d3.selectAll('.button.' + order).classed('selected', true);
    d3.selectAll('.quadrant-table').classed('selected', false);
    d3.selectAll('.quadrant-table.' + order).classed('selected', true);
    d3.selectAll('.blip-item-description').classed('expanded', false);

    var scale = 2;

    var adjustX = Math.sin(toRadian(startAngle)) - Math.cos(toRadian(startAngle));
    var adjustY = Math.cos(toRadian(startAngle)) + Math.sin(toRadian(startAngle));

    var translateX = (-1 * (1 + adjustX) * size / 2 * (scale - 1)) + (-adjustX * (1 - scale / 2) * size);
    var translateY = (-1 * (1 - adjustY) * (size / 2 - 7) * (scale - 1)) - ((1 - adjustY) / 2 * (1 - scale / 2) * size);

    var translateXAll = (1 - adjustX) / 2 * size * scale / 2 + ((1 - adjustX) / 2 * (1 - scale / 2) * size);
    var translateYAll = (1 + adjustY) / 2 * size * scale / 2;

    var moveRight = (1 + adjustX) * (0.8 * window.innerWidth - size) / 2;
    var moveLeft = (1 - adjustX) * (0.8 * window.innerWidth - size) / 2;

    var blipScale = 3 / 4;
    var blipTranslate = (1 - blipScale) / blipScale;

    svg.style('left', moveLeft + 'px').style('right', moveRight + 'px');
    d3.select('.quadrant-group-' + order)
      .transition()
      .duration(1000)
      .attr('transform', 'translate(' + translateX + ',' + translateY + ')scale(' + scale + ')');
    d3.selectAll('.quadrant-group-' + order + ' .blip-link text').each(function () {
      var x = d3.select(this).attr('x');
      var y = d3.select(this).attr('y');
      d3.select(this.parentNode)
        .transition()
        .duration(1000)
        .attr('transform', 'scale(' + blipScale + ')translate(' + blipTranslate * x + ',' + blipTranslate * y + ')');
    });

    d3.selectAll('.quadrant-group')
      .style('pointer-events', 'auto');

    d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')')
      .transition()
      .duration(1000)
      .style('pointer-events', 'none')
      .attr('transform', 'translate(' + translateXAll + ',' + translateYAll + ')scale(0)');



    if (d3.select('.legend.legend-' + order).empty()){
      drawLegend(order);
    }
  }

  self.init = function () {
    radarElement = d3.select('body').append('div').attr('id', 'radar');
    return self;
  };

  self.plot = function () {
    var rings, quadrants;

    rings = radar.rings();
    quadrants = radar.quadrants();
    var header = plotRadarHeader();

    plotQuadrantButtons(quadrants, header);

    radarElement.style('height', size + 14 + 'px');
    svg = radarElement.append("svg").call(tip);
    svg.attr('id', 'radar-plot').attr('width', size).attr('height', size + 14);

    _.each(quadrants, function (quadrant) {
      var quadrantGroup = plotQuadrant(rings, quadrant);
      plotLines(quadrantGroup, quadrant);
      plotTexts(quadrantGroup, rings, quadrant);
      plotBlips(quadrantGroup, rings, quadrant);
    });

  };

  return self;
};

module.exports = Radar;
