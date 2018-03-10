const Vector = require('./ps.vector').P$Vector;
const expect = require('chai').expect;
const log = console.log;


describe("Vector", () => {

    const canvas = {
        width: 100,
        height: 100
    };
    const scalar = 1;
    let position, velocity;


    beforeEach(() => {
        position = Vector(x=1, y=1);
        velocity = Vector(x=1, y=1);
    })


    afterEach(() => {
        position = null;
        velocity = null;
    })


    describe("operations with vector", () => {
  
        describe("#add", () => {

            it("should be equal to (2, 2)", () => {
                position.add(velocity);
                expect(position.x === 2).to.be.true;
                expect(position.y === 2).to.be.true;
            });

        });


        describe("#sub", () => {

            it("should be equal to (0, 0)", () => {
                position.sub(velocity);
                expect(position.x === 0).to.be.true;
                expect(position.y === 0).to.be.true;
            });

        });
        

        describe("#mult", () => {

            it("should be equal to (1, 1)", () => {
                position.mult(velocity);
                expect(position.x === 1).to.be.true;
                expect(position.y === 1).to.be.true;
            });

        });
        

        describe("#div", () => {

            it("should be equal to (1, 1)", () => {
                position.div(velocity);
                expect(position.x === 1).to.be.true;
                expect(position.y === 1).to.be.true;
            });

        });

        describe("#distance", () => {

            it("should be equal to 1.414", () => {
                const position2 = Vector(2, 2);
                let distance = position.distance(position2);
                distance = Math.round(distance * 1000) / 1000;
                expect(distance === 1.414).to.be.true;
            });

        });

    });

    describe("operations with scalar", () => {
  
        describe("#add", () => {

            it("should be equal to (2, 2)", () => {
                position.add(scalar);
                expect(position.x === 2).to.be.true;
                expect(position.y === 2).to.be.true;
            });

        });


        describe("#sub", () => {

            it("should be equal to (0, 0)", () => {
                position.sub(scalar);
                expect(position.x === 0).to.be.true;
                expect(position.y === 0).to.be.true;
            });

        });
        

        describe("#mult", () => {

            it("should be equal to (1, 1)", () => {
                position.mult(scalar);
                expect(position.x === 1).to.be.true;
                expect(position.y === 1).to.be.true;
            });

        });
        

        describe("#div", () => {

            it("should be equal to (1, 1)", () => {
                position.div(scalar);
                expect(position.x === 1).to.be.true;
                expect(position.y === 1).to.be.true;
            });

        });

        describe("#distance", () => {

            it("should throw an error", () => {
                expect(() => position.distance(scalar)).to.throw();
            });

        });

    });


    describe("randomization", () => {

        describe("without canvas", () => {

            it("should stay between (0, 0) - (1, 1)", () => {
                let tests = 1000;
                while(tests--) {
                    position.randomize();
                    expect(position.x).to.be.at.most(1);
                    expect(position.y).to.be.at.most(1);
                    expect(position.x).to.be.at.least(0);
                    expect(position.y).to.be.at.least(0);
                }
            });

        });

        describe("with canvas", () => {

            it("should stay between (0, 0) - (10, 10)", () => {
                position.randomize(canvas);
                expect(position.x).to.be.at.most(10);
                expect(position.y).to.be.at.most(10);
                expect(position.x).to.be.at.least(0);
                expect(position.y).to.be.at.least(0);
            });

        });

    });

});