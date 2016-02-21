/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  
 

angular.module('nodulus').controller("ModulesConfigurationController", function ($http, $scope, $Alerts, $IDE, $translate, $resource, $Language , $mdDialog, $TreeMenu) {

    debugger
    $scope.SaveConfiguration = function () { 
    
    
    
    }
    

    $scope.form = [
        "select",
        {
            "key": "select2",
            "type": "select",
            "titleMap": {
                "a": "A",
                "b": "B",
                "c": "C"
            }
        },
        {
            "key": "noenum",
            "type": "select",
            "titleMap": [
                {
                    "value": "a",
                    "name": "A"
                },
                {
                    "value": "b",
                    "name": "B"
                },
                {
                    "value": "c",
                    "name": "C"
                }
            ]
        },
        "array",
        {
            "key": "array2",
            "type": "checkboxes",
            "titleMap": [
                {
                    "value": "a",
                    "name": "A"
                },
                {
                    "value": "b",
                    "name": "B"
                },
                {
                    "value": "c",
                    "name": "C"
                }
            ]
        },
        {
            "key": "radios",
            "type": "radios",
            "titleMap": [
                {
                    "value": "c",
                    "name": "C"
                },
                {
                    "value": "b",
                    "name": "B"
                },
                {
                    "value": "a",
                    "name": "A"
                }
            ]
        },
        {
            "key": "radiobuttons",
            "type": "radiobuttons",
            "titleMap": [
                {
                    "value": false,
                    "name": "No way"
                },
                {
                    "value": true,
                    "name": "OK"
                }
            ]
        }
    ] 
    
    
    $scope.schema = {
        "type": "object",
        "properties": {
            "select": {
                "title": "Select without titleMap",
                "type": "string",
                "enum": [
                    "a",
                    "b",
                    "c"
                ]
            },
            "select2": {
                "title": "Select with titleMap (old style)",
                "type": "string",
                "enum": [
                    "a",
                    "b",
                    "c"
                ]
            },
            "noenum": {
                "type": "string",
                "title": "No enum, but forms says it's a select"
            },
            "array": {
                "title": "Array with enum defaults to 'checkboxes'",
                "type": "array",
                "items": {
                    "type": "string",
                    "enum": [
                        "a",
                        "b",
                        "c"
                    ]
                }
            },
            "array2": {
                "title": "Array with titleMap",
                "type": "array",
                "default": [
                    "b",
                    "c"
                ],
                "items": {
                    "type": "string",
                    "enum": [
                        "a",
                        "b",
                        "c"
                    ]
                }
            },
            "radios": {
                "title": "Basic radio button example",
                "type": "string",
                "enum": [
                    "a",
                    "b",
                    "c"
                ]
            },
            "radiobuttons": {
                "title": "Radio buttons used to switch a boolean",
                "type": "boolean",
                "default": false
            }
        }
    };
    $scope.model = {};
     


})