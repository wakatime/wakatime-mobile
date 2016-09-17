var dummyStats = {
  isEnabled: false, // prod: false
  "best_day": {
    "created_at": "2016-08-03T09:03:21Z",
    "date": "07/27/2016",
    "id": "48d1e496-a249-4099-bd6f-025d593a0134",
    "modified_at": null,
    "total_seconds": 14319
  },
  "created_at": "2016-08-03T09:03:20Z",
  "daily_average": 5632,
  "days_including_holidays": 7,
  "days_minus_holidays": 4,
  "editors": [
    {
      "digital": "4:20",
      "hours": 4,
      "minutes": 20,
      "name": "WebStorm",
      "percent": 68.5,
      "text": "4 hrs 20 mins",
      "total_seconds": 15636
    },
    {
      "digital": "1:59",
      "hours": 1,
      "minutes": 59,
      "name": "PyCharm",
      "percent": 31.5,
      "text": "1 hr 59 mins",
      "total_seconds": 7189
    }
  ],
  "end": "2016-08-03T04:59:59Z",
  "holidays": 3,
  "human_readable_daily_average": "1 hour 33 minutes",
  "human_readable_total": "6 hours 15 minutes",
  "id": "53067b47-291a-4fe8-a979-af5007653b59",
  "is_already_updating": false,
  "is_stuck": false,
  "is_up_to_date": true,
  "languages": [
    {
      "digital": "4:11",
      "hours": 4,
      "minutes": 11,
      "name": "JavaScript",
      "percent": 66.0,
      "text": "4 hrs 11 mins",
      "total_seconds": 15063
    },
    {
      "digital": "1:55",
      "hours": 1,
      "minutes": 55,
      "name": "HTML",
      "percent": 30.37,
      "text": "1 hr 55 mins",
      "total_seconds": 6930
    },
    {
      "digital": "0:06",
      "hours": 0,
      "minutes": 6,
      "name": "XML",
      "percent": 1.63,
      "text": "6 mins",
      "total_seconds": 371
    },
    {
      "digital": "0:03",
      "hours": 0,
      "minutes": 3,
      "name": "CSS",
      "percent": 1.0,
      "text": "3 mins",
      "total_seconds": 229
    },
    {
      "digital": "0:03",
      "hours": 0,
      "minutes": 3,
      "name": "Other",
      "percent": 0.94,
      "text": "3 mins",
      "total_seconds": 214
    },
    {
      "digital": "0:00",
      "hours": 0,
      "minutes": 0,
      "name": "Java",
      "percent": 0.06,
      "text": "0 secs",
      "total_seconds": 13
    },
    {
      "digital": "0:00",
      "hours": 0,
      "minutes": 0,
      "name": "Bash",
      "percent": 0.01,
      "text": "0 secs",
      "total_seconds": 2
    }
  ],
  "modified_at": "2016-08-03T09:03:21Z",
  "operating_systems": [
    {
      "digital": "6:20",
      "hours": 6,
      "minutes": 20,
      "name": "Mac",
      "percent": 100.0,
      "text": "6 hrs 20 mins",
      "total_seconds": 22825
    }
  ],
  "project": null,
  "projects": [
    {
      "digital": "4:50",
      "hours": 4,
      "minutes": 50,
      "name": "my-mobile-app",
      "percent": 50,
      "text": "4 hrs 20 mins",
      "total_seconds": 15636
    },
    {
      "digital": "1:20",
      "hours": 1,
      "minutes": 20,
      "name": "my-website",
      "percent": 31.5,
      "text": "1 hr 59 mins",
      "total_seconds": 7189
    },
    {
      "digital": "3:40",
      "hours": 3,
      "minutes": 30,
      "name": "my-api-service",
      "percent": 31.5,
      "text": "1 hr 59 mins",
      "total_seconds": 7189
    }
  ],
  "range": "last_7_days",
  "start": "2016-07-27T05:00:00Z",
  "status": "ok",
  "timeout": 15,
  "timezone": "America/Chicago",
  "total_seconds": 22526,
  "user_id": "c4360635-a6d4-4233-ad47-69b7f7bbf438",
  "username": "davidfrahm",
  "writes_only": false
};

angular.module('wakatime').controller('DashCtrl', function ($scope, SettingsService, $http, $log) {
  $log.info("DashCtrl()");

  var controller = this;

  $scope.init = function () {
    if (SettingsService.get() && SettingsService.get().apiKey) {
      $scope.isApiKeySet = true;
      var apiKey = SettingsService.get().apiKey;
      $http.get('https://wakatime.com/api/v1/users/current/?api_key=' + apiKey)
        .then(function (response) {
          $log.debug("Current user:", response.data);
        });
      $http.get('https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=' + apiKey)
        .then(function (response) {
          $log.debug("Stats:", response.data.data);
          if (dummyStats.isEnabled) {
            $log.warn("dummyStats is enabled");
            $scope.stats = dummyStats;
          } else {
            $scope.stats = response.data.data;
          }
          controller.initChart($scope.stats);
        });
    } else {
      $log.warn("No API key yet");
    }
  };

  $scope.chartOptions = {
    chart: {
      type: 'pieChart',
      height: 400,
      donut: true,
      x: function (d) {
        return d.key;
      },
      y: function (d) {
        return d.y;
      },
      showLabels: true,

      //pie: {
      //    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
      //    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
      //},
      transitionDuration: 500,
      legend: {
        margin: {
          top: 5,
          right: 100,
          bottom: 0,
          left: 0
        }
      }
    }
  };

  controller.initChart = function (stats) {
    $scope.chartProjectData = [];
    $scope.chartLanguageData = [];

    for (var i = 0; i < stats.projects.length; i++) {
      var project = stats.projects[i];
      $scope.chartProjectData.push({key: project.name, y: project.total_seconds});
    }

    for (var i = 0; i < stats.languages.length; i++) {
      var language = stats.languages[i];
      $scope.chartLanguageData.push({key: language.name, y: language.total_seconds});
    }
  };

  $scope.init();
});
