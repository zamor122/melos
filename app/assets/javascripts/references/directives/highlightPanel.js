angular.module('reader.highlightPanel', [])

.directive("readerHighlightPanel", function() {
	return {
		restrict: 'A',
		scope: {
			selection: '=',
			version: '=',
			token: '=',
			highlights: '=',
			toggleSidePanel: '=',
			isLoggedIn: '='
		},
		templateUrl: '/reader-highlight-panel.tpl.html',
		controller: ['$scope', '$element', 'Highlights', '$timeout', '$rootScope', function($scope, $element, Highlights, $timeout, $rootScope) {
			$scope.success = false;

			if ($scope.selection && $scope.version && $scope.token) {
				$scope.highlight 	= {};
				$scope.colors 		= [];

				Highlights.getColors().success(function(data) {
					$scope.colors = data;
                    if ($scope.colors && $scope.colors.length) {
                        $scope.highlight.color = $scope.colors[0];
                    }
				}).error(function(err) {
					//TO-DO: Handle Error
				});

				$scope.submit = function(highlightForm) {
					$scope.success = false;

                    var color = highlightForm.color;
                    if (color.slice(0,1) == "#") {
                        color = color.slice(1);
                    }

					var highlight = {
						color: color,
						usfm_references: $scope.selection.join('+'),
						version_id: $scope.version
					};

					Highlights.create(highlight, $scope.token).success(function(data) {
						var highlights = angular.copy($scope.highlights);
						highlights.push(data);
						$scope.highlights = highlights;
						$scope.success = true;
						$scope.highlight = {};
                        $scope.selection = [];
                        $rootScope.$broadcast("ClearVerseSelection");
						$timeout(function() { 
							$scope.toggleSidePanel("showReaderHighlight");
							$scope.success = false;
						}, 5000);
						
					}).error(function(err) {
						$scope.success = false;
						//TO-DO: Handle Error
					});
				};
			}
		}]
	}
})

;