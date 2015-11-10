angular.module("reader.versionList", [])

.directive("readerVersionList", function() {
	return {
		restrict: 'A',
		scope: {
			versions: '=',
			filter: '=',
			usfm: '=',
			togglePanel: '=',
            loadParallelChapter: '=',
            setParallelVersion: '='
		},
		controller: ["$scope", "$state", function($scope, $state) {
			$scope.loadVersion = function(version) {
                $scope.togglePanel('showReaderVersions');
                $scope.filter = "";

                if ($scope.setParallelVersion) {
                    $scope.loadParallelChapter($scope.usfm, version);
                } else {
                    $state.go("reader", { usfm: $scope.usfm, version: version });
                }
			}
		}],
		templateUrl: '/reader-version-selector.tpl.html'
	};
})

;