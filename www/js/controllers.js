angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('LoginCtrl', function($scope, $ionicPopup, $state,elec,myservice) {
    $scope.data = {};
 
    $scope.data.username = myservice.username;
    $scope.data.password = myservice.password;

    $scope.login = function() {

        elec.getUser($scope.data.username,$scope.data.password).success(function(data) 
        {
          if(data == 'fail')
          {
             var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'The username and password combination does not match.'
            });
          }else
          {
            myservice.username = $scope.data.username;
            myservice.password = $scope.data.password;

            myservice.userRole = data.userRole;

            myservice.loggedIn = true;

            $scope.$parent.loggedIn = true;

            if(myservice.userRole == 'admin')
              $scope.$parent.isAdmin = true;
            else
              $scope.$parent.isAdmin = false;

            $scope.$parent.userRole = myservice.userRole;
            if(myservice.userRole == 'manager')
            {
              $state.go('manager');      
              // $location.path('manager');  
            }
            else if(myservice.userRole == 'admin')
            {
              $state.go('admin');
              // $location.path('admin');  
            }
            else if(myservice.userRole == 'user')
            {   
              myservice.currUser = data;
              $state.go('polls');
              // $location.path('polls');  
            }
            else
              alert('NO USER ROLE???? Contact Administrator');  
          }

          
         

        }).error(function(data,status) {
             var alertPopup = $ionicPopup.alert({
                title: 'Login failed!' + status,
                template: status
            });
        });

        // LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        //     $state.go('tab.dash');
        // }).error(function(data) {
        //     var alertPopup = $ionicPopup.alert({
        //         title: 'Login failed!',
        //         template: 'Please check your credentials!'
        //     });
        // });
    }
})

.controller('pollsController', function($scope, myservice, $ionicPopup, $state,elec) {
        // create a message to display in our view
        // $scope.message = myservice.user;
        // alert(myservice.username);
        elec.getPoll().success(function(data) {
            $scope.loading = false;
            $scope.polls = data;

        });

        $scope.pollClick = function(_id)
        {
            myservice.currPoll = _id;
            $state.go('questions');
        }


    })

.controller('questionsController', function($scope, myservice, $ionicPopup, $state,elec) {
        // create a message to display in our view
        elec.getQuestion(myservice.currPoll)
            .success(function(data) {

                $scope.questions = data;
                 elec.getResults(myservice.currPoll,myservice.currUser.userPollingStation)
                    .success(function(data) {

                        $scope.answers = data;
                        $scope.mapData();
                        $scope.loading = false;
                    });
            });



        $scope.mapData = function()
        {
            for(var i in $scope.questions) 
            {
                for(var j in $scope.answers)
                {
                    if($scope.questions[i].questionNumber == $scope.answers[j].q)
                    {
                        $scope.questions[i].questionResult = $scope.answers[j].r;
                        break;
                    }
                }
            }
        }  

        $scope.submit = function()
        {
            var data = {
                resultPoll : myservice.currPoll,
                resultStation : myservice.currUser.userPollingStation,
                resultAnswers : [],
            }

            for(var i in $scope.questions)
            {
                var result = {
                    q:$scope.questions[i].questionNumber,
                    r:$scope.questions[i].questionResult
                };
                data.resultAnswers.push(result);
            }

            elec.createResult(data).success(function(data) {

                // if(data == 'station exist')
                // {
                if(data == 'success')
                {
                    // $mdDialog.show(
                    //     $mdDialog.alert()
                    //         .parent(angular.element(document.querySelector('#popupContainer')))
                    //         .clickOutsideToClose(true)
                    //         .title('Submit Successfull.')
                    //         .content(JSON.stringify(data))
                    //         .ariaLabel('')
                    //         .ok('Ok')
                    // );
                    alert('Submit Successfull.');
                    $state.go('polls');
                }else
                {
                    // $mdDialog.show(
                    //     $mdDialog.alert()
                    //         .parent(angular.element(document.querySelector('#popupContainer')))
                    //         .clickOutsideToClose(true)
                    //         .title('Submit failed.')
                    //         .content(JSON.stringify(data))
                    //         .ariaLabel('')
                    //         .ok('Ok')
                    // );
                    alert('Submit failed.');
                }
            });
        }

    })

.controller('managerController',function($scope, myservice, $ionicPopup, $state,elec) {

        elec.getManagerUsers(myservice.username).success(function(data) {
            $scope.loading = false;
            $scope.users = data;
        });

        $scope.openUser = function(index)
        {
            myservice.currUser = $scope.users[index];
            $state.go('polls');
        }

    })

  .controller('adminController',function($scope, myservice,elec,$ionicPopup,$state) {
        // create a message to display in our view
        $scope.page = "";
        $scope.roles = ['user','manager','admin'];
        $scope.types = ['multichoice','number'];
        //Get Date Beforehand
        $scope.refreshUsers = function()
        {
            elec.getUsers().success(function(data) {
                $scope.users = data;
                $scope.managers = [];
                for(var i in $scope.users)
                {
                    if($scope.users[i].userRole == 'manager')
                        $scope.managers.push($scope.users[i]);
                }
            });
        }

        $scope.refreshStations = function()
        {
            elec.getStations().success(function(data) {
                    $scope.stations = data;
            })
        }

        $scope.refreshPolls = function()
        {
            elec.getPoll().success(function(data) {
                $scope.loading = false;
                $scope.polls = data;
            });
        }

        $scope.refreshUsers();
        $scope.refreshStations();
        $scope.refreshPolls();

        $scope.page = 'users';//Default Page

        $scope.showPollingStations = function()
        {
            $scope.page = 'stations';   
            $scope.refreshStations();
        }

        $scope.openStation = function(index)
        {
            $scope.page = 'station'; 
            $scope.isNew = false; 
            $scope.station = $scope.stations[index];
        }

        $scope.newStation = function()
        {
            elec.createStation($scope.station).success(function(data) {

                if(data == 'station exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Station create failed.')
                            .content('Station alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $scope.showPollingStations();
                }else
                {
                    alert(JSON.stringify(data));
                }
            });

        }
        
        $scope.delStation = function()
        {
            elec.deleteStation($scope.station._id).success(function(data) {
                $scope.showPollingStations();
            });
        }
        
        $scope.addStation = function()
        {
            $scope.page = 'station';  
            $scope.isNew = true;
            $scope.station = 
            {
                stationName:''
            }
        }

        $scope.showUsers = function()
        {
            $scope.page = 'users'; 
        }

        $scope.openUser = function(index)
        {
            $scope.newUser = false;  
            elec.getStations().success(function(data) {
                $scope.stations = data;
                $scope.page = 'user';  
                $scope.user = $scope.users[index];
            })

        }

        $scope.updateUser = function()
        {
            if($scope.user.userRole != 'user')
                $scope.user.userManager = '';

            elec.updateUser($scope.user).success(function(data) {
                if(data == 'success')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('User Update')
                            .content('User update successfully')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                    $scope.page = 'users';  
                }else
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('User Update failed.')
                            .content(data.err)
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }
            });
        }

        $scope.addUser = function()
        {
            $scope.page = 'user';  
            $scope.newUser = true;
            $scope.user = {};         
        }


        $scope.signup = function()
        {
            elec.createUser($scope.user).success(function(data) {
                if(data == 'user exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Sign up failed.')
                            .content('User alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $scope.page = 'users';
                    $scope.refreshUsers();
                }else
                {
                    alert(JSON.stringify(data));
                }
            });
        }

        $scope.showPolls = function()
        {
            $scope.page = 'polls';
            $scope.refreshPolls();
        }

        $scope.openPoll = function(index)
        {
            $scope.page = 'poll'; 
            $scope.isNew = false; 
            $scope.poll = $scope.polls[index];
            $scope.poll._id = $scope.poll._id + '';
        }

        $scope.newPoll = function()
        {
            elec.createPoll($scope.poll).success(function(data) {

                if(data == 'poll exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Poll create failed.')
                            .content('Poll alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $scope.showPolls();
                }else
                {
                    alert(JSON.stringify(data));
                }
            });


        }

        $scope.addPoll = function()
        {
            $scope.page = 'poll';  
            $scope.isNew = true;
            $scope.poll = {};  

        }

        $scope.delPoll = function()
        {
           elec.deletePoll($scope.poll._id).success(function(data) {
                $scope.showPolls();
            });       
        }

        $scope.openQuestions = function()
        {   
            $scope.questions = [];
            $scope.page = 'questions';
            elec.getQuestion($scope.poll._id).success(function(data) {
                $scope.questions = data;
            }); 
        }

        $scope.openQuestion = function(index)
        {
            $scope.page = 'question'; 
            $scope.isNew = false; 
            $scope.question = $scope.questions[index];
        }

        $scope.addQuestion = function()
        {
            $scope.page = 'question';
            $scope.isNew = true;
            $scope.question = {};
        }

        $scope.delQuestion = function()
        {
            elec.deleteQuestion($scope.question._id).success(function(data) {
                $scope.openQuestions();
            }); 
        }

        $scope.addAnswer = function()
        {
            if(typeof $scope.question.questionAnswers == 'undefined')
                $scope.question.questionAnswers = [];
            $scope.question.questionAnswers.push('');
        }

        $scope.deleteAnswer = function(index)
        {
            $scope.question.questionAnswers.splice(index, 1);
        }

        $scope.newQuestion = function()
        {

            $scope.question.questionPoll = $scope.poll._id ;
            elec.createQuestion($scope.question).success(function(data) {

                if(data == 'question exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Question create failed.')
                            .content('Question Number alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $scope.openQuestions();
                }else
                {
                    alert(JSON.stringify(data));
                }
            });
        }

    });;;
