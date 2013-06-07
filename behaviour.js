// Called on adjustment of any parameters to recalculate result
function refreshResult() {
}

YUI().use('overlay', 'calendar', 'node', function (Y) {
    var datePivot    = Y.one("#date-pivot");
    var dateOp       = Y.one("#date-op");
    var dateIncr     = Y.one("#date-incr");
    var dateIncrUnit = Y.one("#date-incr-unit");
    var dateResult   = Y.one("#date-result");

    datePivot.on('click', function (e) {
        // display calendar overlay
    });

    dateOp.on('click', function (e) {
        // toggle plus/minus
    });



});
