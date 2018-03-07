
(function(global) {

    // values not accessible by developer from outside
    global.TOUCHX = 100;
    global.TOUCHY = 100;


    const Vector = global.Vector;
    const Particle = global.Particle;


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
            global.TOUCHX = event.clientX;
            global.TOUCHY = event.clientY;
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
