DynamicData.directive('ckEditor', [function () {
		return {
			require: '?ngModel',
			link: function ($scope, elm, attr, ngModel) {
				
				var ck = CKEDITOR.replace(elm[0]);
				
				ck.on('pasteState', function () {
					$scope.$apply(function () {
						ngModel.$setViewValue(ck.getData());
					});
				}); 
				
				ngModel.$render = function (value) {
					ck.setData(ngModel.$modelValue);
				};
			}
		};
	}]);
DynamicData.directive("egenDropdown", function (RecursionHelper) {
	return {
		restrict: "E",
		templateUrl: "partials/BaseElements/dropdown.html",
		controller: [
			"$scope", "$controller", "$rootScope", '$Broker', '$mdDialog', '$resource', function ($scope, $controller, $rootScope, $Broker, $mdDialog, $resource) {
				//$scope.ComplexType = { "src": "", "alt": "", "title": "" };             
				var collectionRes = $resource("/api/" + $scope.field.metaData.collection);
				collectionRes.get({}, function (data) {
					$scope.dropdownDataList = data.items;
				});
				$controller('Directives.BaseController', { "$scope": $scope });
				
				$scope.showAdvanced = function (ev) {
					$mdDialog.show({
						controller: DialogController,
						templateUrl: 'partials/manage/dialogs/dropdownDialog.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true
					})
    .then(function (answer) {
						var api = $resource('/api/' + answer.collection);
						api.get({}, function (data) {
						 
							$scope.data = data.items;
						});
					}, function () {
						$scope.status = 'You cancelled the dialog.';
					});
				};
				
				function DialogController($scope, $mdDialog, $resource) {
					var api = $resource('/api/schemas');
					api.get({}, function (data) {
						$scope.data = data.items;
					})
					
					$scope.$watch('collection', function (newVal, oldVal) {
						$scope.collectionSelected = angular.fromJson($scope.collection);
						$scope.dialogReturnValue = {};
						$scope.dialogReturnValue.collection = $scope.collectionSelected.name;

					});
					
					$scope.hide = function () {
						$mdDialog.hide();
					};
					$scope.cancel = function () {
						$mdDialog.cancel();
					};
					$scope.answer = function () {
						 
						$mdDialog.hide($scope.dialogReturnValue);
					};
				}
			}],
		
		compile: function (element, $controller) {
			return RecursionHelper.compile(element, {
				pre: function (scope, element, attr, ngModelCtrl) {
					 
					scope.FieldName = attr.fieldname;
				 
					scope.ApplyData();
				},
				post: function (scope, element, attr, ngModelCtrl) {
                       
				},
             
          
               
              
			});
		}
	}
});
DynamicData.directive("egenInput", function (RecursionHelper) {
	return {
		restrict: "E",
		templateUrl: "partials/BaseElements/Input.html",
		controller: [
			"$scope", "$controller", "$rootScope", '$Broker', function ($scope, $controller, $rootScope, $Broker) {
				//$scope.ComplexType = { "src": "", "alt": "", "title": "" };               
				
				$controller('Directives.BaseController', { "$scope": $scope });
			}],
		
		compile: function (element, $controller) {
			return RecursionHelper.compile(element, {
				pre: function (scope, element, attr, ngModelCtrl) {
					 
					if (attr.modelname !== undefined)
						scope.modelname = attr.modelname;
					scope.FieldName = attr.fieldname;
					 
					scope.ApplyData();
				},
				post: function (scope, element, attr, ngModelCtrl) {
                       
				},
             
          
               
              
			});
		}
	}
});
DynamicData.directive("egenDate", function (RecursionHelper) {
	return {
		restrict: "E",
		
		templateUrl: "partials/BaseElements/date.html",
		controller: [
			"$scope", "$controller", "$rootScope", '$Broker', function ($scope, $controller, $rootScope, $Broker) {
				//$scope.ComplexType = { "src": "", "alt": "", "title": "" };               
				// $controller('Directives.BaseController', { "$scope": $scope });
				
				$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
				$scope.format = $scope.formats[0];
				$scope.dateOptions = {
					formatYear: 'yy',
					startingDay: 1
				};
				$scope.showpicker = false;
				
				$scope.open = function ($event) {
					
					$scope.showpicker = true;
				};

               
			}],
		
		compile: function (element, $controller) {
			return RecursionHelper.compile(element, {
				pre: function (scope, element, attr, ngModelCtrl) {
					 
					scope.FieldName = attr.fieldname;
				 
					scope.ApplyData();


				},
				post: function (scope, element, attr, ngModelCtrl) {
                       

                   

				},
             
          
               
              
			});
		}
	}
});
DynamicData.directive("egenLabel", function (RecursionHelper) {
	return {
		restrict: "E",
		templateUrl: "partials/BaseElements/label.html",
		controller: [
			"$scope", "$controller", "$rootScope", function ($scope, $controller, $rootScope, ngModelCtrl) {
				$controller('Directives.BaseController', { $scope: $scope });
			}],
		compile: function (element, $controller) {
			return RecursionHelper.compile(element, {
				pre: function (scope, element, attr, ngModelCtrl) {
                     
				},
				post: function (scope, element, attr, ngModelCtrl) {
					
					scope.FieldName = attr.fieldname;
				},
			});
		}
	}
})
DynamicData.directive("egenEmail", function (RecursionHelper) {
	return {
		restrict: "E",
		templateUrl: "partials/BaseElements/email.html",
		controller: [
			"$scope", "$controller", "$rootScope", function ($scope, $controller, $rootScope, ngModelCtrl) {
				//$scope.ComplexType = { "src": "", "alt": "", "title": "" };               
				
				$controller('Directives.BaseController', { "$scope": $scope });
			}],
		
		compile: function (element, $controller) {
			return RecursionHelper.compile(element, {
				pre: function (scope, element, attr, ngModelCtrl) {
					 
					scope.FieldName = attr.fieldname;
					 
					scope.ApplyData();
				},
				post: function (scope, element, attr, ngModelCtrl) {
                       
				},
             
          
               
              
			});
		}
	}
});
DynamicData.directive("egenImage", function (RecursionHelper) {
	return {
		restrict: "E",
		templateUrl: "partials/BaseElements/image.html",
		controller: [
			"$scope", "$controller", "$rootScope", function ($scope, $controller, $rootScope, ngModelCtrl) {
				//$scope.ComplexType = { "src": "", "alt": "", "title": "" };               
				
				$controller('Directives.BaseController', { "$scope": $scope });
			}],
		
		compile: function (element, $controller) {
			return RecursionHelper.compile(element, {
				pre: function (scope, element, attr, ngModelCtrl) {
					 
					scope.FieldName = attr.fieldname;
					 
					scope.ApplyData();
				},
				post: function (scope, element, attr, ngModelCtrl) {
                       
				},
             
          
               
              
			});
		}
	}
});
DynamicData.directive("egenCkeditor", function (RecursionHelper) {
	return {
		restrict: "E",
		templateUrl: "partials/BaseElements/ckeditor.html",
		controller: [
			"$scope", "$controller", "$rootScope", function ($scope, $controller, $rootScope, ngModelCtrl) {
				//$scope.ComplexType = { "src": "", "alt": "", "title": "" };               
				
				$controller('Directives.BaseController', { "$scope": $scope });
			}],
		
		compile: function (element, $controller) {
			return RecursionHelper.compile(element, {
				pre: function (scope, element, attr, ngModelCtrl) {
					 
					scope.FieldName = attr.fieldname;
					 
					scope.ApplyData();
				},
				post: function (scope, element, attr, ngModelCtrl) {
                       
				},
             
          
               
              
			});
		}
	}
});

DynamicData.directive("egenGrid", function (RecursionHelper) {
	return {
		restrict: "E",
		templateUrl: "partials/BaseElements/grid.html",
		controller: [
			"$scope", "$controller", "$rootScope", '$Broker', function ($scope, $controller, $rootScope, $Broker) {
				//$scope.ComplexType = { "src": "", "alt": "", "title": "" };               
				
				$controller('Directives.BaseController', { "$scope": $scope });
				
				
				$scope.$watch("GridOptions.data", function (newVal, oldVal) {
					alert("change");
                
				});
			}],
		
		compile: function (element, $controller) {
			return RecursionHelper.compile(element, {
				pre: function (scope, element, attr, ngModelCtrl) {
				 
					scope.FieldName = attr.fieldname;
					
					scope.check = "Check IT OUT!!!";
					scope.ApplyData();
				},
				post: function (scope, element, attr, ngModelCtrl) {
				 
					scope.gridOptions = { columnDefs: [] , rowHeight: 50, enableCellEditOnFocus: true};
					for (var i = 0; i < scope.field.children.length; i++) {
						var directive = "<egen-{0} fieldname='{1}' modelname='{3}' label={2} external-scopes='myExternalScope'></egen-{0}>".format(scope.field.children[i].type, scope.field.children[i].name, scope.field.children[i].label, scope.model);
						scope.gridOptions.columnDefs.push({field: scope.field.children[i].name, displayName: scope.field.children[i].label, enableCellEdit:true });
					}
					//scope.gridOptions.columnDefs = [{ field: 'name', displayName: "FirstName", enableCellEdit: true  }, { field: 'Last', displayName: "Last Name", enableCellEdit: true }]
					var data = [];
					scope.gridOptions.data = data;
					scope.myExternalScope = scope;
					scope.d = [];
					scope.$watch('gridOptions.data', function (newVal, oldVal) {
						 
						scope.$Broker["Objects"][scope.schemaName + '_' + scope.dataId][scope.model] = newVal;

					}, true);
					scope.addRow = function () {
						scope.gridOptions.data.push({});
						scope.d.push({});
					}
					 
				},
             
          
               
              
			});
		}
	}
});
DynamicData.directive('fillHeight', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {
        return {
            restrict: 'A',
            scope: {
                footerElementId: '@',
                additionalPadding: '@',
                debounceWait: '@'
            },
            link: function (scope, element, attrs) {
                if (scope.debounceWait === 0) {
                    angular.element($window).on('resize', windowResize);
                } else {
                    // allow debounce wait time to be passed in.
                    // if not passed in, default to a reasonable 250ms
                    angular.element($window).on('resize', debounce(onWindowResize, scope.debounceWait || 250));
                }
                
                onWindowResize();
                
                // returns a fn that will trigger 'time' amount after it stops getting called.
                function debounce(fn, time) {
                    var timeout;
                    // every time this returned fn is called, it clears and re-sets the timeout
                    return function () {
                        var context = this;
                        // set args so we can access it inside of inner function
                        var args = arguments;
                        var later = function () {
                            timeout = null;
                            fn.apply(context, args);
                        };
                        $timeout.cancel(timeout);
                        timeout = $timeout(later, time);
                    };
                }
                
                function onWindowResize() {
                    
                    var footerElement = angular.element($document[0].getElementById(scope.footerElementId));
                    var footerElementHeight;
                    
                    if (footerElement.length === 1) {
                        footerElementHeight = footerElement[0].offsetHeight 
                              + getTopMarginAndBorderHeight(footerElement) 
                              + getBottomMarginAndBorderHeight(footerElement);
                    } else {
                        footerElementHeight = 0;
                    }
                    
                    var elementOffsetTop = element[0].offsetTop;
                    var elementBottomMarginAndBorderHeight = getBottomMarginAndBorderHeight(element);
                    
                    var additionalPadding = scope.additionalPadding || 0;
                    
                    var elementHeight = $window.innerHeight 
                                        - elementOffsetTop 
                                        - elementBottomMarginAndBorderHeight 
                                        - footerElementHeight 
                                        - additionalPadding;
                    
                    console.log(elementHeight);
                    element.css('height', elementHeight + 'px');
                }
                
                function getTopMarginAndBorderHeight(element) {
                    var footerTopMarginHeight = getCssNumeric(element, 'margin-top');
                    var footerTopBorderHeight = getCssNumeric(element, 'border-top-width');
                    return footerTopMarginHeight + footerTopBorderHeight;
                }
                
                function getBottomMarginAndBorderHeight(element) {
                    var footerBottomMarginHeight = getCssNumeric(element, 'margin-bottom');
                    var footerBottomBorderHeight = getCssNumeric(element, 'border-bottom-width');
                    return footerBottomMarginHeight + footerBottomBorderHeight;
                }
                
                function getCssNumeric(element, propertyName) {
                    return parseInt(element.css(propertyName), 10) || 0;
                }
            }
        };
    }]);

 



//function myCtrl($scope) {
//	$scope.ckEditors = [];
//	$scope.addEditor = function () {
//		var rand = "" + (Math.random() * 10000);
//		$scope.ckEditors.push({ value: rand });
//	}
//}