'use strict';

module.exports = (function(){
    var gettime = function() {
        return Date.now() * 0.001;
    };
    return {
        startTime: 0.0,
        time: 0.0,
        deltaTime: 0.0,
        init: function() {
            this.startTime = gettime();
        },
        update: function() {
            var now = gettime() - this.startTime;
            this.deltaTime = now - this.time;
            this.time = now;
        }
    };
})();
