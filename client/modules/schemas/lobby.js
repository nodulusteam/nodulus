/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | �Roi ben haim  �2016    
 */

DynamicData.
controller("LobbyController", function ($scope, $resource, $Cache, $uibModal, $IDE, $Alerts) {
    var dbApi = "";
    $scope.initLobby = function () {
        var arrOfCollectionId = [];
        arrOfCollectionId.push($scope.schemaid);
        $scope.loadComp = false;
        $scope.deepFind = function (obj, options) {
            if (options.form && options.form.lookup) {
                var val = $Cache.ready(options.form.lookup, function (data) {
                    if ($Cache[options.form.lookup][obj[options.field]] !== undefined && $Cache[options.form.lookup][obj[options.field]][options.form.lookupNameField] !== undefined)
                        obj[options.field + "_lookup"] = $Cache[options.form.lookup][obj[options.field]][options.form.lookupNameField];
                    
                });
                return;
            }
            var path = options.getter;
            if (path === undefined)
                return;
            
            
            var paths = path.split('.')
    , current = obj
    , i;
            
            for (i = 0; i < paths.length; ++i) {
                if (current[paths[i]] == undefined) {
                    return undefined;
                } else {
                    current = current[paths[i]];
                }
            }
            return current;
        }
        
        $scope.projection = {};
        $Cache.ready('schemas', arrOfCollectionId, function (data) {
            $scope.fields = {};
            $scope.columns = [];
            var fields = $Cache.schemas[$scope.schemaid].properties;
            for (var key in fields) {
                if (!fields[key].lobby)
                    continue;
                
                $scope.fields[key] = { type: fields[key].type.name };
                $scope.projection[key] = 1;
                
                if (fields[key].form && fields[key].form.lookupNameField !== undefined) {
                    $scope.columns.push({ type: fields[key].type.name, filter: 'text' , form: fields[key].form, field: key, getter: key + '.' + fields[key].form.lookupNameField   , headerName: fields[key].title });
                    
                } else if (fields[key].form && fields[key].form.key === "datepicker") {
                    $scope.columns.push({ type: fields[key].type.name, filter: 'date', headerName: fields[key].title , field: key });
                }
                else {
                    $scope.columns.push({ type: fields[key].type.name, filter: 'text', headerName: fields[key].title , field: key });
                }
            }
            
            $scope.columns.push({ headerName: "", templateUrl: "partials/gridTemplates/ViewAndDeleteBtns.html" });
            
            $scope.modelName = $Cache.schemas[$scope.schemaid].name;
            dbApi = $resource('/api/' + $scope.modelName);
            
            $scope.NextPage = function () {
                alert("next");
            }
            $scope.CurrentPage = 1;
            $scope.PageTo = function (page) {
                $scope.CurrentPage = page;
                $scope.SearchInformation.paging = { page: page, pagesize: 10 };
                
                var searchObj = {
                    "$project": $scope.projection,
                    "$skip": (($scope.SearchInformation.paging.page - 1) * $scope.SearchInformation.paging.pagesize) ,
                    "$limit": $scope.SearchInformation.paging.pagesize,
                    "$sort": $scope.SearchInformation.sort
                }
                
                if ($scope.SearchInformation.search!== undefined && $scope.SearchInformation.search.term !== undefined)
                    searchObj["$search"] = $scope.SearchInformation.search;

                dbApi.get(
                    searchObj    
                , function (data) {
                    
                    
                    $scope.LobbyItems = data.items;
                    $scope.LobbyItemsCount = data.count;
                    
                    $scope.LobbyPagesCount = data.count / $scope.SearchInformation.paging.pagesize;
                    $scope.LobbyPages = [];
                    for (var i = 0; i < $scope.LobbyPagesCount; i++) {
                        $scope.LobbyPages.push(i + 1);
                    }
                    
                    //var dataSource = new kendo.data.DataSource({
                    
                    //	data: $scope.LobbyItems,
                    //	schema: {
                    //		model: {
                    //			fields: $scope.fields,
                    //		}
                    //	},
                    //	pageSize: 5,
                    //	serverPaging: true,
                    //	serverSorting: true
                    //});
                    
                    //dataSource.schema.model.fields = $scope.fields;
                    
                    
                    $scope.gridOptions = {
                        angularCompileRows: true,
                        columnDefs: $scope.columns,
                        rowData : $scope.LobbyItems,
                        enableFilter: true,
                        enableSorting: true,
                        showToolPanel: false,
                        rowSelection: 'single',
                        enableColResize: true,
                        rowHeight: 30,
                    };
                    
                    //$scope.mainGridOptions = {
                    //	dataSource: dataSource,
                    //	sortable: true,
                    //	pageable: true,
                    //	height: 430,
                    
                    
                    
                    //};
                    
                    
                    
                    //var columns = [];
                    //            var maxCols = $scope.columns.length;
                    //            if (maxCols > 4)
                    //                maxCols = 4;
                    
                    //for (var i = 0; i < maxCols; i++) {
                    //	columns.push($scope.columns[i]);
                    //}
                    
                    
                    //            columns.push({ command: { text: "View Details", click: showDetails  }, title: " ", width: "180px" });
                    
                    
                    //$scope.mainGridOptions.columns = columns;
                    
                    $scope.loadComp = true;

                }, function () {
                    alert("ERROR");
                })
            }
            $scope.SortObject = {};
            $scope.LastSortObject = null;
            $scope.OrderBy = function (column) {
                
              
                if (column.asc) {
                    column.asc = false
                    column.desc = true;
                }else if (column.desc) {
                    column.asc = true
                    column.desc = false;
                } else {
                    column.asc = true;
                }
                
                if ($scope.LastSortObject !== null && $scope.LastSortObject !== undefined && $scope.LastSortObject!== column) {
                    delete $scope.LastSortObject.asc;
                    delete $scope.LastSortObject.desc;
                    delete $scope.SortObject[$scope.LastSortObject.field];
                }
                
                $scope.LastSortObject = column;


                if (column.asc)
                    $scope.SortObject[column.field] = 1;
                if (column.desc)
                    $scope.SortObject[column.field] = -1;
                
                
                   
                $scope.SearchInformation = { paging: { page: 1, pagesize: 10 }, sort: $scope.SortObject };
                $scope.PageTo(1);
            }
            
            $scope.SearchInformation = { paging: { page: 1, pagesize: 10 } }
            $scope.PageTo(1);
            
        })
//dbapi.get()
    }
    
    $scope.onBtExport = function () {
        var searchObj = {
          
        }
        
        if ($scope.SearchInformation.search !== undefined && $scope.SearchInformation.search.term !== undefined)
            searchObj["$search"] = $scope.SearchInformation.search;
        
        dbApi.get(
            searchObj    
                , function (data) {
                     
                var csv = Papa.unparse(data.items);
                downloadWithName("data:text/csv;charset=utf-8," + escape(csv), $scope.modelName + ".csv");
                 
                $Alerts.add({ type: 'success', msg: $scope.modelName + ".csv", autoClose: 10000000, 'icon': 'fa fa-check' });

                //var csvContent = "data:text/csv;charset=utf-8," + csv;
                
                //var encodedUri = encodeURI(csvContent);
                //window.open(encodedUri);
                

            });

        


    };
    
    function downloadWithName(uri, name) {
        function eventFire(el, etype) {
            if (el.fireEvent) {
                (el.fireEvent('on' + etype));
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
            }
        }
        
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        eventFire(link, "click");
    }
    
    $scope.refresh = function () { 
        $scope.PageTo($scope.CurrentPage);
    
    }

    $scope.showDetails = function (rowItem, e) {
        //e.preventDefault();
        //var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        var colName = $Cache.schemas[$scope.schemaid].name;
        var itemName = "";
        
        for (var key in $Cache.schemas[$scope.schemaid].properties) {
            formFragment = $Cache.schemas[$scope.schemaid].properties[key].form;
            
            if (formFragment && formFragment.nameField)
                itemName += rowItem[key] + " ";
        }
        
        
        var itemId = rowItem._id;
        var itemUrl = 'modules/schemas/item.html';
        var item = { _id: itemId , name: itemName, schemaid: $scope.schemaid };
        
        $IDE.ShowLobby(item, itemUrl);
        //angular.element("#view").scope().ShowLobby(item, itemUrl);
        return false;
    };
    
    $scope.deleteItem = function (row) {
        var Api = $resource("/api/" + $Cache.schemas[$scope.schemaid].name);
        $scope.message = "<p>Are you sure that you want to delete " + "<strong>" + row.FirstName + " " + row.LastName + "</strong> from the db?</p>";
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "partials/manage/dialogs/confirmDialog.html",
            scope: $scope,

        });
        
        modalInstance.result.then(function () {
            console.log("confirm");
            Api.delete({ _id: row._id }, function () {
                
                $scope.LobbyItems.splice($scope.LobbyItems.indexOf(row), 1);
                 
            }, function () {
                 
            });
        }, function () {
            console.log("cancel");
        });
        
        $scope.confirm = function () {
            modalInstance.close();
        };
        $scope.cancel = function () {
            modalInstance.dismiss();
        }

    };
    
    $scope.CreateNewItem = function () {
        
        var itemId = guid();
        var item = { _id: itemId, name: "New Item" , schemaid: $scope.schemaid };
        var itemUrl = "modules/schemas/item.html";
        
        $IDE.ShowLobby(item, itemUrl);
    }

    $scope.$watch("quickFilterText", function (newVal, oldVal) { 
    
        if (newVal !== undefined) {
            $scope.SearchInformation["search"] = { term: newVal };
            $scope.PageTo(1);
        }
    
       

         

    }, true);
})
.directive("updateModelOnEnterKeyPressed", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModelCtrl) {
            elem.bind("keyup", function (e) {
                if (e.keyCode === 13) {
                    ngModelCtrl.$commitViewValue();
                }
            });
        }
    }
});






/**
 * @ngDoc directive
 * @name ng.directive:paging
 *
 * @description
 * A directive to aid in paging large datasets
 * while requiring a small amount of page
 * information.
 *
 * @element EA
 *
 */
DynamicData.directive('paging', function () {
    
    
    /**
     * The regex expression to use for any replace methods
     * Feel free to tweak / fork values for your application
     */
    var regex = /\{page\}/g;
    
    
    /**
     * The angular return value required for the directive
     * Feel free to tweak / fork values for your application
     */
    return {
        
        // Restrict to elements and attributes
        restrict: 'EA',
        
        // Assign the angular link function
        link: fieldLink,
        
        // Assign the angular directive template HTML
        template: fieldTemplate,
        
        // Assign the angular scope attribute formatting
        scope: {
            page: '=',
            pageSize: '=',
            total: '=',
            dots: '@',
            ulClass: '@',
            activeClass: '@',
            disabledClass: '@',
            adjacent: '@',
            pagingAction: '&',
            pgHref: '@',
            textFirst: '@',
            textLast: '@',
            textNext: '@',
            textPrev: '@',
            textFirstClass: '@',
            textLastClass: '@',
            textNextClass: '@',
            textPrevClass: '@',
            textTitlePage: '@',
            textTitleFirst: '@',
            textTitleLast: '@',
            textTitleNext: '@',
            textTitlePrev: '@'
        }
                    
    };
    
    
    /**
     * Link the directive to enable our scope watch values
     *
     * @param {object} scope - Angular link scope
     * @param {object} el - Angular link element
     * @param {object} attrs - Angular link attribute
     */
    function fieldLink(scope, el, attrs) {
        
        // Hook in our watched items
        scope.$watchCollection('[page,pageSize,total]', function () {
            build(scope, attrs);
        });
    }
    
    
    /**
     * Create our template html 
     * We use a function to figure out how to handle href correctly
     * 
     * @param {object} el - Angular link element
     * @param {object} attrs - Angular link attribute
     */
    function fieldTemplate(el, attrs) {
        return '<ul data-ng-hide="Hide" data-ng-class="ulClass"> ' +
                '<li ' +
                    'title="{{Item.title}}" ' +
                    'data-ng-class="Item.liClass" ' +
                    'data-ng-repeat="Item in List"> ' +
                        '<a ' + 
                            (attrs.pgHref ? 'data-ng-href="{{Item.pgHref}}" ' : 'href ') +
                            'data-ng-class="Item.aClass" ' +
                            'data-ng-click="Item.action()" ' +
                            'data-ng-bind="Item.value">' + 
                        '</a> ' +
                '</li>' +
            '</ul>'
    }
    
    
    /**
     * Assign default scope values from settings
     * Feel free to tweak / fork these for your application
     *
     * @param {Object} scope - The local directive scope object
     * @param {Object} attrs - The local directive attribute object
     */
    function setScopeValues(scope, attrs) {
        
        scope.List = [];
        scope.Hide = false;
        
        scope.page = parseInt(scope.page) || 1;
        scope.total = parseInt(scope.total) || 0;
        scope.adjacent = parseInt(scope.adjacent) || 2;
        
        scope.pgHref = scope.pgHref || '';
        scope.dots = scope.dots || '...';
        
        scope.ulClass = scope.ulClass || 'pagination';
        scope.activeClass = scope.activeClass || 'active';
        scope.disabledClass = scope.disabledClass || 'disabled';
        
        scope.textFirst = scope.textFirst || '<<';
        scope.textLast = scope.textLast || '>>';
        scope.textNext = scope.textNext || '>';
        scope.textPrev = scope.textPrev || '<';
        
        scope.textFirstClass = scope.textFirstClass || '';
        scope.textLastClass = scope.textLastClass || '';
        scope.textNextClass = scope.textNextClass || '';
        scope.textPrevClass = scope.textPrevClass || '';
        
        scope.textTitlePage = scope.textTitlePage || 'Page {page}';
        scope.textTitleFirst = scope.textTitleFirst || 'First Page';
        scope.textTitleLast = scope.textTitleLast || 'Last Page';
        scope.textTitleNext = scope.textTitleNext || 'Next Page';
        scope.textTitlePrev = scope.textTitlePrev || 'Previous Page';
        
        scope.hideIfEmpty = evalBoolAttribute(scope, attrs.hideIfEmpty);
        scope.showPrevNext = evalBoolAttribute(scope, attrs.showPrevNext);
        scope.showFirstLast = evalBoolAttribute(scope, attrs.showFirstLast);
        scope.scrollTop = evalBoolAttribute(scope, attrs.scrollTop)
    }
    
    
    /**
     * A helper to perform our boolean eval on attributes
     * This allows flexibility in the attribute for strings and variables in scope
     * 
     * @param {Object} scope - The local directive scope object
     * @param {Object} value - The attribute value of interest
     */
    function evalBoolAttribute(scope, value) {
        return angular.isDefined(value)
            ? !!scope.$parent.$eval(value)
            : false;
    }
    
    
    /**
     * Validate and clean up any scope values
     * This happens after we have set the scope values
     *
     * @param {Object} scope - The local directive scope object
     * @param {int} pageCount - The last page number or total page count
     */
    function validateScopeValues(scope, pageCount) {
        
        // Block where the page is larger than the pageCount
        if (scope.page > pageCount) {
            scope.page = pageCount;
        }
        
        // Block where the page is less than 0
        if (scope.page <= 0) {
            scope.page = 1;
        }
        
        // Block where adjacent value is 0 or below
        if (scope.adjacent <= 0) {
            scope.adjacent = 2;
        }
        
        // Hide from page if we have 1 or less pages
        // if directed to hide empty
        if (pageCount <= 1) {
            scope.Hide = scope.hideIfEmpty;
        }
    }
    
    
    /**
     * Assign the method action to take when a page is clicked
     *
     * @param {Object} scope - The local directive scope object
     * @param {int} page - The current page of interest
     */
    function internalAction(scope, page) {
        
        // Block clicks we try to load the active page
        if (scope.page == page) {
            return;
        }
        
        // Update the page in scope
        scope.page = page;
        
        // Pass our parameters to the paging action
        scope.pagingAction({
            page: scope.page,
            pageSize: scope.pageSize,
            total: scope.total
        });
        
        // If allowed scroll up to the top of the page
        if (scope.scrollTop) {
            scrollTo(0, 0);
        }
    }
    
    
    /**
     * Add the first, previous, next, and last buttons if desired
     * The logic is defined by the mode of interest
     * This method will simply return if the scope.showPrevNext is false
     * This method will simply return if there are no pages to display
     *
     * @param {Object} scope - The local directive scope object
     * @param {int} pageCount - The last page number or total page count
     * @param {string} mode - The mode of interest either prev or last
     */
    function addPrevNext(scope, pageCount, mode) {
        
        // Ignore if we are not showing
        // or there are no pages to display
        if ((!scope.showPrevNext && !scope.showFirstLast) || pageCount < 1) {
            return;
        }
        
        // Local variables to help determine logic
        var disabled, alpha, beta;
        
        // Determine logic based on the mode of interest
        // Calculate the previous / next page and if the click actions are allowed
        if (mode === 'prev') {
            
            disabled = scope.page - 1 <= 0;
            var prevPage = scope.page - 1 <= 0 ? 1 : scope.page - 1;
            
            if (scope.showFirstLast) {
                alpha = {
                    value: scope.textFirst,
                    title: scope.textTitleFirst, 
                    aClass: scope.textFirstClass,
                    page: 1
                };
            }
            
            if (scope.showPrevNext) {
                beta = {
                    value: scope.textPrev,
                    title: scope.textTitlePrev, 
                    aClass: scope.textPrevClass,
                    page: prevPage
                };
            }

        } else {
            
            disabled = scope.page + 1 > pageCount;
            var nextPage = scope.page + 1 >= pageCount ? pageCount : scope.page + 1;
            
            if (scope.showPrevNext) {
                alpha = {
                    value: scope.textNext,
                    title: scope.textTitleNext, 
                    aClass: scope.textNextClass,
                    page: nextPage
                };
            }
            
            if (scope.showFirstLast) {
                beta = {
                    value: scope.textLast,
                    title: scope.textTitleLast, 
                    aClass: scope.textLastClass,
                    page: pageCount
                };
            }
            
        }
        
        // Create the Add Item Function
        var buildItem = function (item, disabled) {
            return {
                value: item.aClass ? '' : item.value,
                title: item.title,
                liClass: disabled ? scope.disabledClass : '',
                aClass: item.aClass,
                pgHref: scope.pgHref.replace(regex, item.page),
                action: function () {
                    if (!disabled) {
                        internalAction(scope, item.page);
                    }
                }
            };
        };
        
        // Add alpha items
        if (alpha) {
            var alphaItem = buildItem(alpha, disabled);
            scope.List.push(alphaItem);
        }
        
        // Add beta items
        if (beta) {
            var betaItem = buildItem(beta, disabled);
            scope.List.push(betaItem);
        }
    }
    
    
    /**
     * Adds a range of numbers to our list
     * The range is dependent on the start and finish parameters
     *
     * @param {int} start - The start of the range to add to the paging list
     * @param {int} finish - The end of the range to add to the paging list
     * @param {Object} scope - The local directive scope object
     */
    function addRange(start, finish, scope) {
        
        // Add our items where i is the page number
        var i = 0;
        for (i = start; i <= finish; i++) {
            scope.List.push({
                value: i,
                title: scope.textTitlePage.replace(regex, i),
                liClass: scope.page == i ? scope.activeClass : '',
                pgHref: scope.pgHref.replace(regex, i),
                action: function () {
                    internalAction(scope, this.value);
                }
            });
        }
    }
    
    
    /**
     * Add Dots ie: 1 2 [...] 10 11 12 [...] 56 57
     * This is my favorite function not going to lie
     *
     * @param {Object} scope - The local directive scope object
     */
    function addDots(scope) {
        scope.List.push({
            value: scope.dots,
            liClass: scope.disabledClass
        });
    }
    
    
    /**
     * Add the first or beginning items in our paging list
     * We leverage the 'next' parameter to determine if the dots are required
     *
     * @param {Object} scope - The local directive scope object
     * @param {int} next - the next page number in the paging sequence
     */
    function addFirst(scope, next) {
        
        addRange(1, 2, scope);
        
        // We ignore dots if the next value is 3
        // ie: 1 2 [...] 3 4 5 becomes just 1 2 3 4 5
        if (next != 3) {
            addDots(scope);
        }
    }
    
    
    /**
     * Add the last or end items in our paging list
     * We leverage the 'prev' parameter to determine if the dots are required
     *
     * @param {int} pageCount - The last page number or total page count
     * @param {Object} scope - The local directive scope object
     * @param {int} prev - the previous page number in the paging sequence
     */
    // Add Last Pages
    function addLast(pageCount, scope, prev) {
        
        // We ignore dots if the previous value is one less that our start range
        // ie: 1 2 3 4 [...] 5 6  becomes just 1 2 3 4 5 6
        if (prev != pageCount - 2) {
            addDots(scope);
        }
        
        addRange(pageCount - 1, pageCount, scope);
    }
    
    
    
    /**
     * The main build function used to determine the paging logic
     * Feel free to tweak / fork values for your application
     *
     * @param {Object} scope - The local directive scope object
     * @param {Object} attrs - The local directive attribute object
     */
    function build(scope, attrs) {
        
        // Block divide by 0 and empty page size
        if (!scope.pageSize || scope.pageSize <= 0) {
            scope.pageSize = 1;
        }
        
        // Determine the last page or total page count
        var pageCount = Math.ceil(scope.total / scope.pageSize);
        
        // Set the default scope values where needed
        setScopeValues(scope, attrs);
        
        // Validate the scope values to protect against strange states
        validateScopeValues(scope, pageCount);
        
        // Create the beginning and end page values
        var start, finish;
        
        // Calculate the full adjacency value
        var fullAdjacentSize = (scope.adjacent * 2) + 2;
        
        
        // Add the Next and Previous buttons to our list
        addPrevNext(scope, pageCount, 'prev');
        
        // If the page count is less than the full adjacnet size
        // Then we simply display all the pages, Otherwise we calculate the proper paging display
        if (pageCount <= (fullAdjacentSize + 2)) {
            
            start = 1;
            addRange(start, pageCount, scope);

        } else {
            
            // Determine if we are showing the beginning of the paging list
            // We know it is the beginning if the page - adjacent is <= 2
            if (scope.page - scope.adjacent <= 2) {
                
                start = 1;
                finish = 1 + fullAdjacentSize;
                
                addRange(start, finish, scope);
                addLast(pageCount, scope, finish);
            }

            // Determine if we are showing the middle of the paging list
            // We know we are either in the middle or at the end since the beginning is ruled out above
            // So we simply check if we are not at the end
            // Again 2 is hard coded as we always display two pages after the dots
            else if (scope.page < pageCount - (scope.adjacent + 2)) {
                
                start = scope.page - scope.adjacent;
                finish = scope.page + scope.adjacent;
                
                addFirst(scope, start);
                addRange(start, finish, scope);
                addLast(pageCount, scope, finish);
            }

            // If nothing else we conclude we are at the end of the paging list
            // We know this since we have already ruled out the beginning and middle above
            else {
                
                start = pageCount - fullAdjacentSize;
                finish = pageCount;
                
                addFirst(scope, start);
                addRange(start, finish, scope);
            }
        }
        
        // Add the next and last buttons to our paging list
        addPrevNext(scope, pageCount, 'next');
    }

});

