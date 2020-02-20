// Subject
class Subject {
    constructor() {
        this.ObserverCollection = [];
    }

    registerObserver(observer) {
        this.ObserverCollection.push(observer);
    }

    unregisterObserver(observer) {
        let idx = this.ObserverCollection.findIndex(
            observerItem => observerItem == observer
        );
        this.ObserverCollection.splice(idx, 1);
    }

    notifyObservers(data) {
        this.ObserverCollection.forEach(observer => observer.notify(data));
    }
}

// Observer
class Observer {
    notify() {}
}

// State
class State extends Subject {
    constructor() {
        super();
        this.state = {};
    }

    getState(key) {
        if (key) {
            return this.state[key];
        } else {
            return this.state;
        }
    }

    setState(obj) {
        this.state = { ...this.state, ...obj };
    }
}

class outputObserver extends Observer {
    constructor(realDOM) {
        super();
        this.state = {};
    }

    getState(key) {
        if (key) {
            return this.state[key];
        } else {
            return this.state;
        }
    }

    setState(obj) {
        this.state = { ...this.state, ...obj };
    }
}

class inputState extends State {
    // func calc() will be called when user type keyboard
    onInput(calc) {
        let elm = this.getState('dom');
        elm.addEventListener('input', event => {
            // when user types --> update state
            this.setState({ userInput: event.target.value });
            // when state is updated, recall method notifyObservers as render() in Reactjs
            let data = calc(this.getState('userInput')); // calc func always return a string as final result
            this.notifyObservers(data);
        });
    }
}

function common(idInput, idOutput, calc) {
    let inputSubject = new inputState();
    let output = new outputObserver();

    inputSubject.setState({ dom: document.getElementById(idInput) });
    output.setState({ dom: document.getElementById(idOutput) });
    inputSubject.registerObserver(output);

    // override method notify of Observer
    output.notify = function(data) {
        output.getState('dom').value = data;
    };

    inputSubject.onInput(calc);
}

function baitap3() {
    function calc(str) {
        let temp = true;
        for (let i = 1; i < str.length; i++) {
            if (Number(str[i]) - Number(str[i - 1]) < 1) {
                temp = false;
                break;
            }
        }
        let result = new RegExp('^[0-9]+$').test(str) && temp;
        return result;
    }

    let inputSubject = new inputState();
    let output = new outputObserver();

    inputSubject.setState({ dom: document.getElementById('input3') });
    output.setState({ dom: document.getElementById('output3') });
    inputSubject.registerObserver(output);

    // override method notify of Observer
    output.notify = function(data) {
        output.getState('dom').value = data;
    };

    inputSubject.onInput(calc);
}
baitap3();

common('input4', 'output4', function(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str[i].charCodeAt() + 1);
    }
    return result;
});

common('input5', 'output5', function(str) {
    function generateID(secretArray, lengthId) {
        let store = '';
        // 0 <= Math.random() < 1
        for (let i = 1; i <= lengthId; i++) {
            let randomIdx = Math.floor(Math.random() * 3);
            store += secretArray[randomIdx];
        }
        return store;
    }

    let result = '';
    let length = str.length;
    if (length % 2 && length >= 3) {
        let mid = Math.floor(length / 2);
        result = generateID([str[mid - 1], str[mid], str[mid + 1]], 20);
    } else {
        result = 'Vui lòng nhập đúng yêu cầu!';
    }
    return result;
});

common('input6', 'output6', function(str) {
    let result = [];
    let arr = str.split(';');
    let length = arr.length;

    // case: 2;5;3;2;3; ==> ['2','5','3','2', '3', ''] ==> ['2','5','3','2', '3']
    if (arr[length - 1] === '') arr.splice(length-- - 1, 1);
    arr = arr.map(e => +e);

    let temp = arr.reduce((acc, cur) => {
        acc[cur] = acc[cur] + 1 || 1;
        return acc;
    }, {});
    const max = Math.max(...Object.values(temp));
    for (let key in temp) {
        if (temp[key] === max) result.push(key);
    }
    return result.join(', ');
});

common('input7', 'output7', function(str) {
    return str.includes('java');
});

common('input8', 'output8', function(str) {
    let result = '';
    let num = +str;

    num <= 12 && num >= 1
        ? (result = `Tháng ${num}`)
        : (result = 'Vui lòng nhập đúng cú pháp');
    return result;
});

common('input9', 'output9', function(str) {
    let trimArr = str.split(' ').filter(elm => elm !== '');
    let max = Math.max(...trimArr.map(elm => elm.length));
    let result = trimArr.filter(elm => elm.length === max);
    return result.join(', ');
});

common('input10', 'output10', function(str) {
    let arr = str.split(';').map(elm => +elm);

    let start = arr[0] > 2 ? arr[0] : 2;
    let n = arr[1];
    let result = arr[1] >= 2 ? '' : 'khong co';

    // seive Eratosthenes
    let temp = [];
    for (let i = 0; i <= n; i++) {
        temp.push(1);
    }

    for (let i = 2; i <= n; i++) {
        if (temp[i])
            for (let j = i * 2; j <= n; j += i) {
                temp[j] = 0;
            }
    }

    // return result;
    for (let i = start; i <= n; i++) {
        if (temp[i]) {
            result += `${i}, `;
        }
    }
    return result;
});

(function bt1() {
    setInterval(() => {
        document.getElementById('output1').value = new Date();
    }, 300);
})();

(function bt2() {
    setInterval(() => {
        let time = new Date();
        let day = time.getDate();
        let month = time.getMonth() + 1;
        let year = time.getFullYear();
        let result = [
            `${month}-${day}-${year}`,
            `${month}/${day}/${year}`,
            `${day}-${month}-${year}`,
            `${day}/${month}/${year}`
        ].join(' ; ');
        document.getElementById('output2').value = result;
    }, 300);
})();
