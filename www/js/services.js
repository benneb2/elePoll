angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('elec', function($http) {
  return {
      host:'http://10.0.0.100:8080'
      ,
      getPoll : function() {
        return $http.get(this.host + '/api/polls');
      },
      createPoll : function(formData) {
        return $http.post(this.host + '/api/polls', formData);
      },
      deletePoll : function(id) {
        return $http.delete(this.host + '/api/polls/' + id);
      },

      //QUESTIONS
      getQuestion : function(pollId) {
        return $http.get(this.host + '/api/questions/' + pollId);
      },
      createQuestion: function(formData) {
        return $http.post(this.host + '/api/questions', formData);
      },
      deleteQuestion : function(id) {
        return $http.delete(this.host + '/api/questions/' + id);
      },

      //RESULTS
      getResults : function(pollId,station) {
        return $http.get(this.host + '/api/results/' + pollId + '/' + station);
      },
      getResultUser : function(pollId,userId) {
        return $http.get(this.host + '/api/resultsUser/' + pollId + '/' + userId);
      },
      getResultQuestion : function(questionId) {
        return $http.get(this.host + '/api/resultsQuestion/' + questionId);
      },
      createResult: function(formData) {
        $http.defaults.headers.post["Content-Type"] = "application/json";
        return $http.post(this.host + '/api/results', formData);
      },
      deleteResult : function(id) {
        return $http.delete(this.host + '/api/results/' + id);
      },


      //USERS
      getManagerUsers : function(manager) {
        return $http.get(this.host + '/api/managerUser/' +  manager);
      },
      getUsers : function() {
        return $http.get(this.host + '/api/users' );
      },
      getUser : function(userName,password) {
        return $http.get(this.host + '/api/users/' + userName + '/' + password);
      },
      createUser: function(formData) {
        return $http.post(this.host + '/api/users', formData);
      },
      deleteUser : function(id) {
        return $http.delete(this.host + '/api/users/' + id);
      },
      updateUser: function(formData) {
        return $http.put(this.host + '/api/user', formData);
      },

      //STATIONS
      getStations : function() {
        return $http.get(this.host + '/api/station' );
      },
      createStation: function(formData) {
        return $http.post(this.host + '/api/station', formData);
      },
      deleteStation : function(id) {
        return $http.delete(this.host + '/api/station/' + id);
      },

  }
})

.service('LoginService', function($http) {
    return {
        getUser : function(userName,password) {
        return $http.get('http://10.0.0.100:8080/api/users/' + userName + '/' + password);
      }
    }
})

.service('myservice', function () {
        this.username = '';
        this.password = '';
        this.userRole = '';
        this.currPoll = '';
        this.loggedIn = false;
    });