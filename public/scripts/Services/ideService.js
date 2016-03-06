angular.module("IDE", [])

.service("$IDE", ['$resource', '$rootScope','$compile', function ($resource, $rootScope, $compile) {
        var instance = this;
        this.ActiveTreeNode = {};
        this.Tabs = [];
        this.TabsObject = {};
        
        
        this.setDirty = function (itemKey) {

            this.TabsObject[itemKey].dirty = true;
        }
        this.clearDirty = function (itemKey) {
            this.TabsObject[itemKey].dirty = false;
        }
        
        this.ShowLobby = function (item, itemUrl) {
          
            instance.ActiveTreeNode = item;
            
            if (item == null)
                return;
            //if(item.Url === "" || item.Url === undefined)
            //     item.Url = "lobby.html";
            
            
            
            if (item.label !== undefined)
                item.name = item.label;

            if (item.itemKey === undefined)
                item.itemKey = "b" + "_" + item._id;//.replace(/-/g, '');
            //item.itemKey = itemKey;
            if (instance.TabByKey(item.itemKey) != null) {
                
                instance.focusMe(item.itemKey);
                return;
            }
            
            item.disabled = false;
            item.style = "lobby-tab";
           
            
            
            
            //item.Url = "schemas.html";
            
             

            var tabPane = $("<div id='"+ item.itemKey+"' data-any-lobby=\"" + itemUrl + "\" itemkey='" + item.itemKey + "' schemaid='" + item.schemaid + "'></div>");
            tabwrapper = $("<div></div>");
            tabwrapper.append(tabPane);
            $("#TabContainer").append(tabwrapper);
            // item.tabPane = tabPane;
            var element = angular.element(tabPane);
            instance.Tabs.push(item);
            instance.TabsObject[item.itemKey] = item;
             
            
            var tabScope = element.scope();
            //var tabScope = $scope.$new(true);
            tabScope.item = item;
            $compile(tabwrapper.contents())(tabScope);
            instance.focusMe(item.itemKey);


        }

        this.focusMe = function (itemKey) {
            $("div[data-egen-page], div[data-egen-lobby],div[data-any-lobby]").hide();             
            $("div[itemkey='" + itemKey + "']").show();           
            
            for (var i = 0; i < instance.Tabs.length; i++)
                if (instance.Tabs[i].itemKey == itemKey) {
                    instance.selectedTabIndex = i;
                    instance.ActiveTreeNode = instance.Tabs[i];
                }





        //$("paper-tab.selected").removeClass("selected");
        //$("paper-tab[itemkey='" + itemKey + "']").addClass("selected");
        }
        
        this.CloseTab = function (tab) {
            
            
            $("div[itemkey = '" + tab.itemKey + "']").remove();
            // tab.tabPane = null;
            
            for (var i = 0; i < instance.Tabs.length; i++)
                if (instance.Tabs[i].itemKey === tab.itemKey) {
                    instance.Tabs.splice(i, 1);
                    var nextpos = i;
                    if (i > 1)
                        nextpos = i - 1;
                    else if (instance.Tabs.length === 1)
                        nextpos = 0;
                    
                    if (instance.Tabs[nextpos] !== undefined)
                        instance.focusMe(instance.Tabs[nextpos].itemKey);
                }

        }
        

        this.onTabSelected = function (tab, $event) {
            instance.focusMe(tab.itemKey);
            
            if ($event) {
                if ($event.which == 2)
                    instance.CloseTab(tab);
            } else {
                if ($event.button == 4)
                    instance.CloseTab(tab);
            }



        //tab.Selected = true;
        }
        
        this.TabByKey = function (itemKey) {
            for (var i = 0; i < this.Tabs.length; i++)
                if (this.Tabs[i].itemKey == itemKey)
                    return this.Tabs[i];
            return null;

        }
    
    }]);