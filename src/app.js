
var fs = require('fs');
var anypixel = require('anypixel');
var THREE = require('three');
var Time = require('./Time.js');

var app = {
    color: (new THREE.Color()).setHSL(Math.random(), 1, 0.5),
};

var buttons = {
    map: {},
    buttonKey: function(x,y) {
        return x + ':' + y;
    },
    isPressed: function(x, y) {
        if (this.buttonKey(x,y) in this.map) {
            return true;
        }
        return false;
    },
    onDown: function(detail) {
        this.map[this.buttonKey(detail.x, detail.y)] = detail;
    },
    onUp: function(detail) {
        var key = this.buttonKey(detail.x, detail.y);
        if (key in this.map) {
            delete this.map[key];
        }
    },
};

function getColor(x,y) {
    var color = new THREE.Color();
    let left = x == 0;
    let right = x == anypixel.config.width - 1;
    let topbottom = y == 0 || y == anypixel.config.height - 1;
    if (topbottom) {
        color.setHSL(x / anypixel.config.width, 1, 0.5);
    }
    else if (left) {
        var hsl = app.color.getHSL();
        var val = Math.max(0, Math.min(1, (y-3) / (anypixel.config.height-6) + 0.0001 ));
        color.setHSL(hsl.h, hsl.s, val);
    }
    else if (right) {
        var hsl = app.color.getHSL();
        var val = Math.max(0, Math.min(1, (y-3) / (anypixel.config.height-6) ));
        color.setHSL(hsl.h, val, hsl.l);
    }
    else {
        return null;
    }
    return color;
}

document.addEventListener('onButtonDown', function(event) {
    buttons.onDown(event.detail);

    var color = getColor(event.detail.x,event.detail.y);
    if (color) {
        app.color = color;
    }
});

document.addEventListener('onButtonUp', function(event) {
    buttons.onUp(event.detail);
});

document.addEventListener('DOMContentLoaded', function() {
    var ctx = anypixel.canvas.getContext2D();
    var imgData = ctx.createImageData(1, 1);
    var data = imgData.data;

    var setPixel = function(x,y,color) {
        data[0] = 255*color.r;
        data[1] = 255*color.g;
        data[2] = 255*color.b;
        data[3] = 255;
        ctx.putImageData(imgData, x, y);
    };

    var update = function () {
        //if (!(Object.keys(buttons.map).length === 0)) 
        //    console.log(buttons.map);

        for (var i in buttons.map) {
            setPixel(buttons.map[i].x, buttons.map[i].y, app.color);
        }

        for (var x = 0; x < anypixel.config.width; x++) {
            for (var y = 0; y < anypixel.config.height; y++) {
                var color = getColor(x, y);
                if (color) {
                    setPixel(x, y, color);
                }
            }
        }
    };

    Time.init();
    var gameloop = function () {
        Time.update();
        update();

        window.requestAnimationFrame(gameloop);
    };
	window.requestAnimationFrame(gameloop);
});
