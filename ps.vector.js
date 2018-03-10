
(function(global) {


    /**
     * @function Vector
     * @description wrapper for function constructor (avoiding 'new' keyword)
     * @constructs Vector
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     */
    const Vector = function(x, y) {
        return new Vector.init(x, y);
    };

    
    /**
     * @description function constructor
     * @constructs Vector
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     */
    Vector.init = function(x=1, y=1) {
        this.x = x;
        this.y = y;
    };


    Vector.prototype = {

        /**
         * @property
         * @description randomizing function (for testing purposes)
         * @default Math.random
         */
        randomFunction: Math.random,

        /**
         * @method random
         * @description scale vector to random size
         * @param {CanvasRenderingContext2D} canvas canvas
         * @return {Vector} self
         */
        randomize: function(canvas) {
            this.x = this.randomFunction() * (canvas ? canvas.width  / 10 : 1);
            this.y = this.randomFunction() * (canvas ? canvas.height / 10 : 1);
            return this;
        },

        /**
         * @method add
         * @description add two vectors
         * @param {(Vector|number)} obj vector or scalar
         * @return {Vector} self
         */
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

        /**
         * @method sub
         * @description subtract two vectors
         * @param {(Vector|number)} obj vector or scalar
         * @return {Vector} self
         */
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

        /**
         * @method mult
         * @description multiply two vectors
         * @param {(Vector|number)} obj vector or scalar
         * @return {Vector} self
         */
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

        /**
         * @method div
         * @description divide two vectors
         * @param {(Vector|number)} obj vector or scalar
         * @return {Vector} self
         */
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

        /**
         * @method distance
         * @description calculate distance between two vectors (thanks, Pythagoras!)
         * @param {Vector} vector target vector
         * @return {number} distance
         */
        distance: function(vector) {
            if (!(vector instanceof Vector)) {
                throw `expected instance of Vector`;
            }
            return Math.sqrt(
                Math.pow(this.x - vector.x, 2) +
                Math.pow(this.y - vector.y, 2)
            );
        }
    };


    Vector.init.prototype = Vector.prototype;


    global.P$V = global.P$Vector = Vector;


})(typeof exports === 'undefined' ? window : exports);
