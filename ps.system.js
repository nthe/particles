
(function(global) {

    "use strict";

    // values not accessible by developer from outside
    const author = 'Juraj';


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
         * @method random
         * @description scale vector to random size
         * @param {CanvasRenderingContext2D} canvas canvas
         * @return {Vector} self
         */
        randomize: function(canvas) {
            this.x = Math.random() * (canvas ? canvas.width  / 10 : 1);
            this.y = Math.random() * (canvas ? canvas.height / 10 : 1);
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
            return Math.sqrt(
                Math.pow(this.x - vector.x, 2) +
                Math.pow(this.y - vector.y, 2)
            );
        }
    };


    Vector.init.prototype = Vector.prototype;









    
    /**
     * @function Particle
     * @description wrapper for function constructor (avoiding 'new' keyword)
     * @constructs Particle
     * @param {Vector} position position on canvas
     * @param {number} mass weight or size
     */
    const Particle = function(position, mass) {
        return new Particle.init(position, mass);
    };


    /**
     * @description function constructor
     * @constructs Particle
     * @param {Vector} position position on canvas
     * @param {number} mass weight or size
     */
    Particle.init = function(position, mass=1) {
        // this.context = context;
        this.position = position || Vector(this.CONTEXT.canvas.width / 2, this.CONTEXT.canvas.height / 2);
        this.direction = Vector().randomize().sub(0.5).mult(50);
        this.mass = mass;
    };


    Particle.prototype = {
        
        /**
         * @property
         * @description easing (attraction force)
         * @default 0.35
         */
        EASING: 0.35,

        /**
         * @property
         * @description destination positional vector
         */
        TARGET: Vector(),

        /**
         * @property
         * @description apply attraction force
         * @default true
         */
        ATTRACT: true,

        /**
         * @property
         * @description reference to context
         */
        CONTEXT: null,

        /**
         * @method randomize
         * @description randomize own position on canvas
         * @returns {Particle} self
         */
        randomize: function() {
            this.position.randomize();
            this.position.x *= this.CONTEXT.canvas.width;
            this.position.y *= this.CONTEXT.canvas.height;
            return this;
        },

        /**
         * @method update
         * @description update particle (apply forces)
         * @returns {Particle} self
         */
        update: function() {

            // new vector is required
            const distVector = Vector(
                this.TARGET.x - this.position.x,
                this.TARGET.y - this.position.y
            );
            
            const distance = this.position.distance(this.TARGET);
            
            if(distance < 100) {
                distVector.mult(0.01);
            }
            else {
                distVector.mult(1 / Math.sqrt(distance));
            }

            distVector.mult(0.75);

            if (this.ATTRACT) {
                this.direction.add(distVector);
            }
            
            this.mass = Math.max(1, Math.log(distance) / 1.75);

            if(distance > 0) {
                this.position.add(distVector.add(this.direction).mult(this.EASING));
            }

            // constraint position to canvas
            if (this.position.x <= 1) {
                this.position.x = 1;
            }
            if (this.position.x >= this.CONTEXT.canvas.width - 1) {
                this.position.x = this.CONTEXT.canvas.width - 1;
            }
            if (this.position.y <= 1) {
                this.position.y = 1;
            }
            if (this.position.y >= this.CONTEXT.canvas.height - 1) {
                this.position.y = this.CONTEXT.canvas.height - 1;
            }
            
            return this;
        },

        /**
         * @method render
         * @description render particle as ellipse
         */
        render: function() {
            // draw an 360 def arc, filled
            this.CONTEXT.beginPath();
            this.CONTEXT.arc(
                this.position.x, 
                this.position.y, 
                this.mass, 
                0, 
                2 * Math.PI,
                true
            );
            this.CONTEXT.fill();

            // draw "beak"
            this.CONTEXT.beginPath();
            this.CONTEXT.moveTo(this.position.x, this.position.y);
            let x = (this.position.x + (this.direction.x * 0.2));
            let y = (this.position.y + (this.direction.y * 0.2));
            this.CONTEXT.lineTo(x, y);
            this.CONTEXT.stroke();
        }
    };


    Particle.init.prototype = Particle.prototype;









    
    /**
     * @function Mother
     * @description wrapper for function constructor (avoiding 'new' keyword)
     * @constructs Mother
     * @param {Vector} position position on canvas
     */
    const Mother = function(position) {
        return new Mother.init(position);
    }


    /**
     * @description function constructor
     * @constructs Mother
     * @param {Vector} position position on canvas
     */
    Mother.init = function(position) {
        Particle.init.call(this);
        this.EASING = 0.05;
        this.mass = 50;

        /** 
         * @method update
         * @description update mother (apply forces)
        */
        this.update = function() {
            const distVector = Vector(
                this.TARGET.x - this.position.x,
                this.TARGET.y - this.position.y
            );
            
            const distance = this.position.distance(this.TARGET);
        
            if(distance > 0) {
                this.position.add(distVector.mult(this.EASING));
            }
            return this;
        }

        /**
         * @method render
         * @description render particle as ellipse
         */
        this.render = function() {
            // draw an 360 def arc, filled
            this.CONTEXT.beginPath();
            this.CONTEXT.arc(
                this.position.x, 
                this.position.y, 
                this.mass, 
                0, 
                2 * Math.PI,
                true
            );
            this.CONTEXT.stroke();
        }
    };

    Mother.init.prototype = Particle.init.prototype;









    
    /**
     * @function ParticleSystem
     * @description wrapper for function constructor (avoiding 'new' keyword)
     * @constructs ParticleSystem
     * @param {CanvasRenderingContext2D} context context
     * @param {number} size size of system
     */
    const ParticleSystem = function(context, size) {
        return new ParticleSystem.init(context, size);
    };
    

    /**
     * @description function constructor
     * @constructs ParticleSystem
     * @param {CanvasRenderingContext2D} context context
     * @param {number} size size of system
     * @param {number} ease initial easing value
     */
    ParticleSystem.init = function(context, size=20, ease=0.35) {

        this.context = context;
        Particle.prototype.CONTEXT = this.context;

        this.handle = null;
        this.system = [];
        this.size = size;
        
        this.resize(size);
        this.setEasing(ease);

        Particle.prototype.TARGET = Vector(context.canvas.width / 2, context.canvas.height / 2);

        // listen to mousemoves for specific canvas
        this.context.canvas.onmousedown = function(event) {
            Particle.prototype.TARGET = Vector(event.clientX, event.clientY);
        }

        // bypass attraction forces
        this.context.canvas.onmouseenter = (event) => {
            Particle.prototype.ATTRACT = true;
        };

        // apply attraction force
        this.context.canvas.onmouseleave = (event) => {
            Particle.prototype.ATTRACT = false;
        };

        this.mother = Mother();
    };


    // define exposed methods via prototype
    ParticleSystem.prototype = {
        
        /**
         * @method update
         * @description update whole system (scene)
         */
        update: function() {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

            let cloudSize = this.system.length;
            while(cloudSize--) {
                this.system[cloudSize].update().render();
            }

            this.mother.update().render();
        },

        /**
         * @method setContext
         * @description change the context (targeting canvas)
         * @param {CanvasRenderingContext2D} ctx new context
         * @returns {ParticleSystem} self
         */
        setContext: function(ctx) {
            this.context = ctx;
            return this;
        },

        /**
         * @method setEasing
         * @description change easing value
         * @param {number} value new easing value
         * @returns {ParticleSystem} self
         */
        setEasing: function(value) {
            Particle.prototype.EASING = value;
            return this;
        },

        /**
         * @method resize
         * @description change the size of system
         * @param {number} size new size of system
         * @return {ParticleSystem} self
         */
        resize: function(size) {
            // to shrink it, override array length
            if (this.system.length > size) {
                this.system.length = size;
            }
            // to expand it, just add new objects 
            else {
                let toFill = size - this.system.length;
                while(toFill--) {
                    this.system.push(Particle());
                }
            }
            // adjust size property
            this.size = size;
            return this;
        },

        /**
         * @method start
         * @description start particle system (setup interval)
         * @param {number} fps frames per second
         * @returns {ParticleSystem} self
         */
        start: function(fps) {
            const self = this;
            this.handle = setInterval(() => {
                this.update.call(self);
            }, 1000 / fps);
            return this;
        },

        /**
         * @method stop
         * @description stop particle system (clear interval)
         */
        stop: function() {
            if(!this.handle) {
                return;
            }
            clearInterval(this.handle);
        }
    };


    // use prototype chain to expose methods
    ParticleSystem.init.prototype = ParticleSystem.prototype;


    // expose ParticleSystem to global object
    global.P$ = global.ParticleSystem = ParticleSystem;



})(window);
