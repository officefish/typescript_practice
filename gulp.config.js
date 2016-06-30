module.exports = function () {
    
    // Local variables
    var root = './';
    var util = root + 'util/';
    var src = root + 'source/';
    var tsSrc = src +'entities/';
    var tsDefSrc = src + 'interfaces/';
    var tsTestSrc = root + 'test/';
    var jsRoot = root + 'dev/';
    var jsDev =  jsRoot + 'source/';
    var testJsDev = jsRoot + 'test/';
    var jsDevFilesPattern = '**/*.js';
    var jsModuleFilesPattern = '**/*.module.js';
    var jsMapFilesPattern = '**/*.js.map';
    var jsTestFilesPattern = '**/*.test.js';
    var jsJasmineTestFilesPattern = '**/*.jasmine.test.js';
    var tsSrcFilesPattern = '**/*.ts';
    var tsDefFilesPattern = '**/*.d.ts';
    var tsTestFilesPattern = '**/*.test.ts';
    var tsJasmineTestFilesPattern = '**/*.jasmine.test.ts';
    var typingsDefSrc = './typings'; 
    var typingsDefFilePattern =  '/tsd.d.ts';
    var typings = typingsDefSrc + typingsDefFilePattern;
    var report = './report/';
    var specRunnerFile = 'SpecRunner.html';

    var config = {

        // Root folder
        root: root,
        
        // Source folders
        src: src,
        
        // Build output
        build: './build/',
        
        // Temp folder
        temp: './.tmp/',
        
        // Report folder
        report: report,
        
        // Spec runner html file
        specRunner: root + specRunnerFile,
        specRunnerFile: specRunnerFile,
        
        // JavaScript settings
        js: {
            root: jsRoot,
            files: [
                jsDev + jsDevFilesPattern,
                '!' + jsDev + jsMapFilesPattern,
            ],
            onlySrcFiles: [
                jsDev + jsDevFilesPattern
            ],
            maps: jsDev + jsMapFilesPattern,
            tests: [
                testJsDev + jsTestFilesPattern,
                '!'+ testJsDev + jsJasmineTestFilesPattern
            ],
            jasmineTests: [
                testJsDev + jsJasmineTestFilesPattern
            ],
            allTests: [
                testJsDev + jsTestFilesPattern,
                testJsDev + jsJasmineTestFilesPattern
            ],
            srcAndTestFiles: [
                jsDev + jsDevFilesPattern,
                testJsDev + jsTestFilesPattern,
                testJsDev + jsJasmineTestFilesPattern
            ],
        },
        
        // TypeScript settings
        ts: {
            // Folders
            source: tsSrc,
            out: jsDev,
            testOut: testJsDev,
                       
            // Source files
            files: [
                src + tsSrcFilesPattern,
                tsDefSrc + tsDefFilesPattern
            ],
            srcFilesAndTypings: [
                src + tsSrcFilesPattern,
                tsDefSrc + tsDefFilesPattern,
                typings
            ],
            tests: [
                tsTestSrc + tsTestFilesPattern,
                tsTestSrc + tsJasmineTestFilesPattern,
                typings
            ],
            allFiles: [
                tsSrc + tsSrcFilesPattern,
                tsDefSrc + tsDefFilesPattern,
                tsTestSrc + tsTestFilesPattern,
                tsTestSrc + tsJasmineTestFilesPattern
            ],
            
            // Type definitions
            typings: typingsDefSrc,
            
            // Compiled files
            outFiles: [
                jsDev + jsDevFilesPattern,
                jsDev + jsMapFilesPattern,
                testJsDev + jsTestFilesPattern,
                testJsDev + jsJasmineTestFilesPattern
            ]
        },

        // Browser sync settings
        browserSync: {
            port: 3000,
            reloadDelay: 1000,
            logLevel: 'info',
            logPrefix: 'spec-runner',
        },
        
       
    };
    
    return config;
};