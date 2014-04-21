/**
  * Custom Sort Function To Sort Facebook Pages according to descending order
    the ascending or decensing order is decided by the compare function.
  */
var CustomSort = (function() {

    function merge(left, right) {
        var sortedArray = [],
            compareResult;

        while (left.length || right.length) {

            if (left.length && right.length) {

                compareResult = compare(left[0], right[0]) || left[0] < right[0];

                if (compareResult) {
                    sortedArray.push(left.shift());
                } else {
                    sortedArray.push(right.shift());
                }

            } else if (left.length) {
                sortedArray.push(left.shift());

            } else {
                sortedArray.push(right.shift());
            }
        }
        return sortedArray;
    }

    function sort(array) {

        var arraylength = array.length,
            arraymid = Math.floor(length * 0.5),
            left = array.slice(0, arraymid),
            right = array.slice(arraymid, arraylength);

        if (arraylength === 1) {
            return array;
        }

        return merge(sort(left), sort(right));

    }

    /**
     * Custom Compare Function that tells the sort function the logic to shift elements
     * @return Should return true false
     * @type Function
     */
    function compare(a, b) {

        if (a.name.toLowerCase() < b.name.toLowerCase())
            return false;
        if (a.name.toLowerCase() > b.name.toLowerCase())
            return true;
        return true;
    }

    return {
        sort: sort
    }

})();