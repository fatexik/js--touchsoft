/**
 * Написать фукнцию сумматор, которая будет работать
 * var s = sum();
 * console.log(s); // 0
 * console.log(s(1)); // 1
 * console.log(s(1)(2)); //3
 * console.log(s(3)(4)(5)); // 12
 * Число вызовов может быть неограниченым
 */


function sum(value){
    var summ = value || 0;
    function add(value) {
        summ = summ + value;
        return add;
    }
    add.toString = function () {
        return summ;
    }
    return add;
}


