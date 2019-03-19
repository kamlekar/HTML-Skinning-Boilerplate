function getDate(time) {
    // Refer: http://stackoverflow.com/a/10589791/1577396
    // Refer: http://stackoverflow.com/a/1353711/1577396
    if (!time) {
        return false;
    }
    var dateTime = new Date(time);
    // Valid date
    if (
        Object.prototype.toString.call(dateTime) === '[object Date]' &&
        !isNaN(dateTime.getTime())
    ) {
        return dateTime;
    }
    // Invalid date (The above condition will be invalid for some time formats in firefox)
    else {
        // Refer: http://stackoverflow.com/a/3075893/1577396
        var t = time.split(/[- :]/);
        try {
            return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        } catch (ex) {
            // Invalid date
            return false;
        }
    }
}
