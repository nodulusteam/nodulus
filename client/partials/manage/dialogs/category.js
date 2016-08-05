angular.module('nodulus')
    .controller('CategoryDialog', function ($scope, $resource, $location, $compile, $DataTable, $mdDialog, $Theme, $Config) {

        $scope.$Theme = $Theme;
        $DataTable.Load();
        $scope.DataTables = $DataTable.Tables;
        $scope.DataTablesDic = $DataTable.TablesDic;
        $scope.RequestActive = false;
    $scope.fromJson = false;
        $scope.GetTable = function (id) {
            return $scope.DataTablesDic[id];
        }

    

        var lobbyResource = $resource(apiUrl + '/Bones/', { boneid: "@boneid" });
        $scope.ParentCategory = null;
        $scope.LoadData = function (boneid) {
            $scope.RequestActive = true;
            lobbyResource.get({ boneid: boneid }, function (data) {

                for (var i = 0; i < data.BonesDTs.length; i++) {
                    data.BonesDTs[i].Name = $scope.GetTable(data.BonesDTs[i].DTId).Name;
                }
                $scope.EditCategory = data;

                lobbyResource.get({ boneid: data.ParentId }, function (data) {
                    $scope.ParentCategory = data;
                    var finallist = [];
                    for (var i = 0; i < data.BonesDTs.length; i++) {
                        data.BonesDTs[i].Name = $scope.GetTable(data.BonesDTs[i].DTId).Name;
                        var notfound = true;

                        for (var x = 0; x < $scope.EditCategory.BonesDTs.length; x++) {
                            if ($scope.EditCategory.BonesDTs[x].DTId == data.BonesDTs[i].DTId)
                                notfound = false;
                        }
                        if (notfound)
                            finallist.push(data.BonesDTs[i]);
                    }
                    $scope.ParentCategory.BonesDTs = finallist;
                    // $scope.ParentCategory = data;
                    $scope.RequestActive = false;
                });
            });


        }

        $scope.LoadForParent = function (parentid) {
            $scope.RequestActive = true;
            lobbyResource.get({ boneid: parentid }, function (data) {
                $scope.RequestActive = false;
                $scope.Results = data.d;
            });


        }

    $scope.Update = function () {
         
            $scope.RequestActive = true;
            if ($scope.EditCategory.Id > 0) {

                lobbyResource.update($scope.EditCategory, function (data) {
                    $scope.RequestActive = false;

                     $mdDialog.hide();
                });
            }
            else {

                lobbyResource.save($scope.EditCategory, function (data) {
                    $scope.RequestActive = false;

                     $mdDialog.hide();
                });
            }


    };
 
        $scope.Cancel = function () {
            $mdDialog.hide();
    };

   

    })