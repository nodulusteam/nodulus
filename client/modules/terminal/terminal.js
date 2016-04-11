/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */




angular.module('nodulus').controller("terminalController",
    function ($scope, $Alerts, $IDE, $translate, $resource, $Language, hotkeys) {
        
        
        

        // hotkeys.bindTo($scope)
        //.add({
        //    combo: 'enter',
        //    description: 'save document',
        //    callback: $scope.SendCommand
        //});


    });


angular.module('nodulus').
  directive('terminal', function ($parse, $resource, $timeout) {
      return {
          restrict: 'A', // only activate on element attribute
          // require: '?ngModel', // get a hold of NgModelController
          link: function (scope, element, attrs) {
              scope.active_terminal = null;
              scope.active_terminals = {};

              scope.lines = [];
              scope.PaneHeight = $(window).height() - 100;
               
              scope.terminals = [];

              scope.init_terminal = function (data) {

                  var terminal_id = data || guid();
                  socket.emit('terminal.init', terminal_id);


                  //scope.active_terminal = { id: terminal_id };

              }
              var textbox = element.find("textarea");
              var console = element.find("div.terminal");
              //// Specify how UI should be updated
              //ngModel.$render = function () {
              //    element.html(ngModel.$viewValue || '');
              //};

              // Listen for change events to enable binding
              textbox.on('blur keyup change', function (event) {

                  if (event.preventDefault) {
                      event.preventDefault();

                  }

               
                  var keyCode = event.which || event.keyCode;
                  if (keyCode == 13) {

                      
                      socket.emit('terminal.command', {'id': scope.active_terminal.id,  'command': scope.commandLine });
                      //commandRes.save({ 'command': scope.commandLine  }, function (data) {
                      //    scope.stdout = data.stdout;
                      //    scope.lines.push({ 'text': data.stdout, 'command': scope.commandLine });


                           
                      //    $timeout(function () {
                      //        console[0].scrollTop = console[0].scrollHeight;
                      //    }, 500);
                          
                      //   // alert(console);


                      //    scope.stderr = data.stderr;

                      //    scope.commandLine = '';

                           
                      //})

                       
                      //scope.$parent.$apply(expressionHandler);
                      
                  }

              });

              socket.on('terminal.result', function (data) {
               

                  scope.$apply(function () {
                      scope.active_terminals[data.id].lines.push({ 'text': data.stdout, 'command': scope.commandLine });
                      $timeout(function () {
                          console[0].scrollTop = console[0].scrollHeight;
                      }, 100);
                      scope.commandLine = '';
                  });

              });
 

              socket.on('terminal.list', function (data) {
                  scope.$apply(function () {
                      scope.terminals = data.terminals;
                  });
              });

              socket.on('terminal.init', function (data) {
                
                  scope.$apply(function () {
                      if (!scope.active_terminals[data.id])
                      {
                       
                          scope.active_terminals[data.id] = { id: data.id, lines: [] };
                          socket.emit('terminal.list');
                      }
                  
                 
                      scope.active_terminal = scope.active_terminals[data.id];
                  })
              });

              socket.emit('terminal.list');
             

              }
      };
  });


