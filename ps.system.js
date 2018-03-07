
(function(global) {

    // values not accessible by developer from outside
    const author = 'Juraj';


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
            return src;
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





    const Particle = function(context, position) {
        return new Particle.init(context, position);
    };

    Particle.init = function(context, position, mass=1) {
        this.context = context;
        this.position = position || Vector().randomize();
        this.direction = Vector().randomize(this.context.canvas);
        this.mass = mass;
    };

    Particle.prototype = {
        
        // default easing value
        EASING: 0.35,

        // target
        TARGET: Vector(),

        // do attract
        ATTRACT: true,

        // randomize position
        randomize: function() {
            this.position.randomize();
            this.position.x *= this.context.canvas.width;
            this.position.y *= this.context.canvas.height;
            return this;
        },

        // calculate new position
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
            
            this.mass = Math.max(1, Math.log(distance)/1.5);

            if(distance > 0) {
                this.position.add(distVector.add(this.direction).mult(this.EASING));
            }
            return this;
        },

        // render particle as circle, mass defined the size
        render: function() {
            // draw an 360 def arc, filled
            this.context.beginPath();
            this.context.arc(
                this.position.x, 
                this.position.y, 
                this.mass, 
                0, 
                2 * Math.PI,
                true
            );
            this.context.fill();
            this.context.stroke();
        }
    };


    Particle.init.prototype = Particle.prototype;






    // wrapper of function constructor
    // helps with missing "new" keyword
    const ParticleSystem = function(context, size) {
        return new ParticleSystem.init(context, size);
    };
    
    // function constructor
    ParticleSystem.init = function(context, size=20, ease=0.35) {

        this.context = context;
        this.size = size;
        this.handle = null;
        this.system = [];
        
        this.setEasing(ease);

        // create particle "cloud" or "system"
        let sx = this.size; 
        while(sx--) {
            this.system.push(
                Particle(this.context)
            );
        }

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
    };

    // define exposed methods via prototype
    ParticleSystem.prototype = {
        
        // update positions of particles and (re)render them
        update: function() {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

            let cloudSize = this.system.length;
            while(cloudSize--) {
                this.system[cloudSize].update().render();
            }
        },

        // change context (canvas)
        setContext: function(ctx) {
            this.context = ctx;
            return this;
        },

        // change easing value
        setEasing: function(value) {
            Particle.prototype.EASING = value;
            return this;
        },

        // resize cloud
        resize: function(size) {
            // to shrink it, override array length
            if (this.system.length > size) {
                this.system.length = size;
            }
            // to expand it, just add new objects 
            else {
                let toFill = size - this.system.length;
                while(toFill--) {
                    this.system.push(
                        Particle(this.context)
                    );
                }
            }
            // adjust size property
            this.size = size;
            return this;
        },

        // start the system
        start: function(fps) {
            const self = this;
            this.handle = setInterval(() => {
                this.update.call(self);
            }, 1000 / fps);
            return this;
        },

        // stop the system
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
