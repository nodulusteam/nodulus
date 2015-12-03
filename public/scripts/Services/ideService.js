angular.module("IDE", [])

.service("$Ide", ['$resource', '$rootScope','$compile', function ($resource, $compile) { 
        this.ActiveTreeNode = {};
        this.Tabs = [];
        this.ShowLobby = function (item, itemUrl) {
            
            this.ActiveTreeNode = item;
            
            if (item == null)
                return;
            //if(item.Url === "" || item.Url === undefined)
            //     item.Url = "lobby.html";
			if (item.itemKey === undefined) {
				 
				item.itemKey = "b" + item._id.replace(/-/g, '');
			}
            //item.itemKey = itemKey;
            if (this.TabByKey(item.itemKey) != null) {
                
                this.focusMe(item.itemKey);
                return;
            }
            
            item.disabled = false;
            item.style = "lobby-tab";
            
            this.Tabs.push(item);
            
            //debugger
            //item.Url = "schemas.html";
            
            var tabPane = $("<div data-any-lobby=\"" + itemUrl + "\" itemkey='" + item.itemKey + "' schemaid='" + item.schemaid + "'></div>");
            tabwrapper = $("<div></div>");
            tabwrapper.append(tabPane);
            $("#TabContainer").append(tabwrapper);
            // item.tabPane = tabPane;
            var element = angular.element(tabPane);
            $compile(tabwrapper.contents())(this);
            
            this.focusMe(item.itemKey);

        }

        this.focusMe = function (itemKey) {
            
            $("div[data-egen-page], div[data-egen-lobby],div[data-any-lobby]").hide();
            $("div[itemkey='" + itemKey + "']").show();
            
            
            for (var i = 0; i < this.Tabs.length; i++)
                if (this.Tabs[i].itemKey == itemKey) {
                    this.selectedTabIndex = i;
                    this.ActiveTreeNode = this.Tabs[i];
                }




        //$("paper-tab.selected").removeClass("selected");
        //$("paper-tab[itemkey='" + itemKey + "']").addClass("selected");
        }

        
        this.TabByKey = function (itemKey) {
            for (var i = 0; i < this.Tabs.length; i++)
                if (this.Tabs[i].itemKey == itemKey)
                    return this.Tabs[i];
            return null;

        }
    
    }]);