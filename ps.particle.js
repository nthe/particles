
(function(global) {

    const Vector = global.Vector;


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
                global.TOUCHX - this.position.x,
                global.TOUCHY - this.position.y
            );

            const distance = this.position.distance(Vector(global.TOUCHX, global.TOUCHY));
            
            distVector.mult(0.999);
            
            if(distance < 100) {
                distVector.mult(0.01);
            }
            else {
                distVector.mult(1 / Math.sqrt(distance));
            }

            this.direction.add(distVector.mult(0.88));
            
            this.mass = Math.max(1, distance / 200);

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
        }
    };


    Particle.init.prototype = Particle.prototype;

    // expose Particle to global object
    global.Particle = Particle;


})(window);
