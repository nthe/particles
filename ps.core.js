
(function(global) {

    const Vector = function(x, y) {
        return new Vector.init(x, y);
    };

    Vector.init = function(x=1, y=1) {
        this.x = x;
        this.y = y;
    };

    Vector.prototype = {

        // randomize itself
        randomize: function(canvas) {
            this.x = Math.random() * (canvas ? canvas.width  / 10 : 1);
            this.y = Math.random() * (canvas ? canvas.height / 10 : 1);
            return this;
        },

        // addition
        add: function(obj) {
            if (obj instanceof Vector) {
                this.x += obj.x;
                this.y += obj.y;
            } 
            else {
                this.x += obj;
                this.y += obj;
            }
            return this;
        },

        // difference
        sub: function(obj) {
            if (obj instanceof Vector) {
                this.x -= obj.x;
                this.y -= obj.y;
            } 
            else {
                this.x -= obj;
                this.y -= obj;
            }
            return this;
        },

        // multiplication
        mult: function(obj) {
            if (obj instanceof Vector) {
                this.x *= obj.x;
                this.y *= obj.y;
            } 
            else {
                this.x *= obj;
                this.y *= obj;
            }
            return this;
        },

        // division
        div: function(obj) {
            if (obj instanceof Vector) {
                this.x /= obj.x;
                this.y /= obj.y;
            } 
            else {
                this.x /= obj;
                this.y /= obj;
            }
            return this;
        },

        // thanks, Pythagoras!
        distance: function(vector) {
            return Math.sqrt(
                Math.pow(this.x - vector.x, 2) +
                Math.pow(this.y - vector.y, 2)
            );
        }
    };

    Vector.init.prototype = Vector.prototype;

    // expose Vector to global object
    global.Vector = Vector;


})(window);
