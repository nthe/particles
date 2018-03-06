
(function(global) {


    const EASING = 0.35;
    let TOUCHX = 100;
    let TOUCHY = 100;


    /**
     *      ======
     *      VECTOR
     *      ======
     */

    const Vector = function(x, y) {
        return new Vector.init(x, y);
    };

    Vector.init = function(x=1, y=1) {
        this.x = x;
        this.y = y;
    };

    Vector.prototype = {
        randomize: function(canvas) {
            this.x = Math.random() * (canvas ? canvas.width  / 10 : 1);
            this.y = Math.random() * (canvas ? canvas.height / 10 : 1);
            return this;
        },
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
        distance: function(vector) {
            return (
                Math.abs(this.x - vector.x) +
                Math.abs(this.y - vector.y)
            );
        }
    };

    Vector.init.prototype = Vector.prototype;





    /**
     *      ========
     *      PARTICLE
     *      ========
     */

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

        // randomize position
        randomize: function() {
            this.position.randomize();
            this.position.x *= this.context.canvas.width;
            this.position.y *= this.context.canvas.height;
            return this;
        },

        // calculate new position
        update: function() {

            const distVector = Vector(
                TOUCHX - this.position.x,
                TOUCHY - this.position.y
            );

            const distance = this.position.distance(Vector(TOUCHX, TOUCHY));
            
            distVector.mult(0.999);
            
            if(distance < 100) {
                distVector.mult(1 / distance);
            }
            else {
                distVector.mult(1 / Math.sqrt(distance));
            }

            this.direction.add(distVector.mult(0.88));

            if(distance > 1) {
                this.position.add(distVector.add(this.direction).mult(EASING));
            }
            return this;
        },
        // render particle as circle, mass defined the size
        render: function() {
            this.context.beginPath();
            this.context.arc(
                this.position.x, 
                this.position.y, 
                this.mass, 
                0, 
                2 * Math.PI
            );
            this.context.stroke();
        }
    };

    Particle.init.prototype = Particle.prototype;





    /**
     *      ===============
     *      PARTICLE SYSTEM
     *      ===============
     */

    // wrapper of function constructor
    // helps with missing "new" keyword
    const ParticleSystem = function(context, size) {
        return new ParticleSystem.init(context, size);
    };
    
    // function constructor
    ParticleSystem.init = function(context, size=20, ease=0.05) {
        this.context = context;
        this.size = size;
        this.ease = ease;
        this.handle = null;
        this.system = [];
        
        // create particle "cloud" or "system"
        let sx = this.size; 
        while(sx--) {
            this.system.push(
                Particle(this.context)
            );
        }

        this.context.canvas.onmousemove = function(event) {
            TOUCHX = event.clientX;
            TOUCHY = event.clientY;
        }
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
