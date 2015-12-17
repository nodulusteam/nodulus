DynamicData.
controller("LobbyController", function ($scope, $resource, $Cache, $uibModal, $IDE) {
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
                 
                dbApi.get({
                    "$project": $scope.projection,
                    "$skip": (($scope.SearchInformation.paging.page - 1) * $scope.SearchInformation.paging.pagesize) ,
                    "$limit": $scope.SearchInformation.paging.pagesize,
                    "$sort": $scope.SearchInformation.sort
                }, function (data) {
                    
                    
                    $scope.LobbyItems = data.items;
                    $scope.LobbyItemsCount = data.count;
                    
                    $scope.LobbyPagesCount = data.count / $scope.SearchInformation.paging.pagesize;
                    $scope.LobbyPages = [];
                    for (var i = 0; i < $scope.LobbyPagesCount; i++) {
                        $scope.LobbyPages.push(i+1);
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
            $scope.OrderBy = function (column){
                var sortObject = {};
                sortObject[column.field] = 1;
               
                $scope.SearchInformation = { paging: { page: 1, pagesize: 10 }, sort: sortObject  };
                $scope.PageTo(1);
            }
            
            $scope.SearchInformation = { paging: { page: 1, pagesize: 10 } }
            $scope.PageTo(1);
            
        })
//dbapi.get()
    }
    
    $scope.onBtExport = function () {
        var params = {
            skipHeader: $scope.skipHeader === true,
            skipFooters: $scope.skipFooters === true,
            skipGroups: $scope.skipGroups === true,
            fileName: $scope.fileName
        };
        
        if ($scope.customHeader) {
            params.customHeader = '[[[ This ia s sample custom header - so meta data maybe?? ]]]\n';
        }
        if ($scope.customFooter) {
            params.customFooter = '[[[ This ia s sample custom footer - maybe a summary line here?? ]]]\n';
        }
        
        $scope.gridOptions.api.exportDataAsCsv(params);
    };
    
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


});

