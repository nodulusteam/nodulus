/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | �Roi ben haim  �2016    
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

