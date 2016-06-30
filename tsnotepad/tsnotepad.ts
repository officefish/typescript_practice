
/*
FUNCTION TYPES
*/

/**
 * function declaration 
 * 
 * @param {string} name
 * @returns {string}
 */
function greetNamed(name: string): string {
    if (name) {
        return "Hi, " + name + "!";
    }
}

/**
 * Function expresion
 */
let greetUnnamed = function (name: string): string {
    if (name) {
        return "Hi, " + name + "!";
    }
};


/**
 * Function expresion with type declaration
 */
let greetUnnamedDeclaration: (name: string) => string;
greetUnnamedDeclaration = function (name: string): string {
    if (name) {
        return "Hi, " + name + "!";
    }
};

/**
 * Function expresion with type declaration in the same line
 */
let greetUnnamedDeclAndExp: (name: string) => string = function (name: string): string {
    if (name) {
        return "Hi, " + name + "!";
    }
};

/*
    Note
    In the preceding example, we have declared the type of the greetUnnamed variable 
    and then assigned a function as its value. The type of the function can be inferred
    from the assigned function, and for this reason, it is unnecessary to add a redundant 
    type annotation. We have done this to facilitate the understanding of this section, 
    but it is important to mention that adding redundant type annotations can
    make our code harder to read, and it is considered bad practice.
*/

/*
FUNCTIONS WITH OPTIONAL PARAMETERS
*/

/*
    Unlike JavaScript, the TypeScript compiler will throw an error if we attempt 
    to invoke a function without providing the exact number and type of parameters 
    that its signature declares.
*/

function add(foo: number, bar: number, foobar: number): number {
    return foo + bar + foobar;
}

// add(); // Supplied parameters do not match any signature
// add(2, 2); // Supplied parameters do not match any signature
// add(2, 2, 2); // returns 6

/*
We can add optional paramaters to make functions more flexible. Use '?' sympol to mark
parameter as optional;
*/

function addWithOptional(foo: number, bar: number, foobar?: number): number {
    let result = foo + bar;
    if (foobar !== undefined) {
        result += foobar;
    }
    return result;
}

// add(2, 2); // returns 4
// add(2, 2, 2); // returns 6

/*
    NOTE.
    It is important to note that the optional parameters must always be located after the required
    parameters in the function's parameters list.
*/

/*
FUNCTIONS WITH DEFAULT PARAMETERS
*/

function addWithDefault(foo: number, bar: number, foobar: number = 0): number {
    return foo + bar + foobar;
}

/*
FUNCTIONS WITH REST PARAMETERS
*/

function addWithRest(...rest: number[]): number {
    let final: number;
    for (let i: number; i < rest.length; i++) {
        final += rest[i];
    }
    return final;
}

/*
NOTE
For avoiding exrta iterations initialising rest arguments is better to use array as the only parameter
instead.
function add(rest: number[]) : number {}; 
*/











