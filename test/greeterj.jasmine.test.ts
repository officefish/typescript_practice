/// <reference path="../typings/tsd.d.ts" />
/// <refrence path="../source/interfaces/interfaces.d.ts" />
import Greeter from "../source/entities/greeter";

describe("Jasmine Greeter", () => {

    describe("greet", () => {

        it("returns Hello World", () => {

            // Arrange
            let greeter = new Greeter("World");

            // Act
            let result = greeter.greet();

            // Assert
            expect(result).toEqual("Hello, World");
        });
    });
});

