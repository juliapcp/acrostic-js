console.info('acrostic.js');

document.querySelector('h1').addEventListener('click', function(e) {
    e.target.textContent += '!';
});

const buttonAdd = document.querySelector('button:nth-of-type(1)');

buttonAdd.addEventListener('click', addWords);
let listOfW = [];
function addWords(e) {
    const text = document.querySelector('textarea').value;
    const words = text.split(',');
    let verify = 0;
    for (let word of words) {
        word = word.trim().toUpperCase();
        verify = verifyWords(word, false);
        if (verify === 1) listOfW.push(word);
    }
    document.querySelector('p').innerHTML = listOfW;
    document.querySelector('textarea').value = '';
}
function verifyWords(word, main = true) {
    // main -> true, database -> false
    let charAZ = 0;
    for (const letter of word) {
        if (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90) charAZ++;
    }
    if (listOfW.indexOf(word) === -1 && word !== '' &&
        charAZ === word.length && main === false) {
        return 1;
    }
    if (word !== '' && charAZ === word.length && main) {
        return 1;
    }
}
const buttonClear = document.querySelector('body > button');
buttonClear.addEventListener('click', clearWords);

function clearWords(e) {
    listOfW = [];
    document.querySelector('p').innerHTML = listOfW;
}

// Necessary code to read the word for acrostic generation
// and to assemble the table cells:

const buttonGenerate =
document.querySelector('body > fieldset:nth-child(7) > button');
buttonGenerate.addEventListener('click', generateAcrostic);
let hLength = '';
function generateAcrostic(e) {
    let verify = 0;
    verify = verifyWords(document.querySelector('input').value.
        trim().toUpperCase());
    if (verify === 1) {
        const acrostic = {
            mainWord: document.querySelector('input').value
                .trim().toUpperCase(),
            table: document.getElementById('table'),
            listOfWords: (document.querySelector('p')
                .textContent).split(','),
            biggestWLeng: function() {
                let biggest = 0;
                for (const word of this.listOfWords) {
                    if (word.length > biggest) {
                        biggest = word.length;
                    }
                }
                return biggest * 2;
            },
            createTable: function() {
                let tr = 0;
                let cells = 0;
                hLength = this.biggestWLeng();
                for (let i = 0; i < this.mainWord.length; i++) {
                    tr = (this.table).insertRow();
                    for (let i = 0; i < hLength; i++) {
                        cells = tr.insertCell(i);
                        cells.innerHTML = '  ';
                    }
                }
            },
            shuffle: function(list) {
                let arrayLength = list.length;
                let tempValue = '';
                let randomIndex = 0;
                while (arrayLength !== 0) {
                    randomIndex = Math.floor(Math.random() * arrayLength);
                    arrayLength --;
                    tempValue = list[arrayLength];
                    list[arrayLength] = list[randomIndex];
                    list[randomIndex] = tempValue;
                }
                return list;
            },
            createAcrostic: function() {
                let i = 0;
                let w = 0;
                let y = 0;
                let list = [];
                while (y < 30) {
                    list = this.shuffle(this.listOfWords);
                    w = 0;
                    i = 0;
                    for (const letter of this.mainWord) {
                        for (const word of list) {
                            if (word.indexOf(letter) !== -1) {
                                this.table.rows[i].cells[(hLength)/2]
                                    .innerHTML = letter;
                                this.table.rows[i].cells[(hLength/2)]
                                    .classList.add('main');
                                for (let c = (hLength / 2) - 1, d =
                                    word.lastIndexOf(letter) - 1;
                                    d >= 0; c--, d--) {
                                    this.table.rows[i].cells[c].innerHTML =
                                        word[d];
                                }
                                for (let d = word.lastIndexOf(letter) + 1,
                                    c = (hLength / 2) + 1; d < word.length;
                                    c++, d++) {
                                    this.table.rows[i].cells[c].innerHTML =
                                    word[d];
                                }
                                list.splice(list.indexOf(word), 1);
                                w++;
                                break;
                            }
                        }
                        i++;
                    }
                    y++;
                    if (w >= this.mainWord.length) break;
                }
                if (w < this.mainWord.length) {
                    document.querySelector('#table').innerHTML =
                        'It\'s impossible to create a acrostic with '+
                        'this word, try another one! :D';
                }
            }
        };
        document.querySelector('fieldset:nth-child(7) > input')
            .value = '';
        document.querySelector('#table').innerHTML = '';
        acrostic.createTable();
        acrostic.createAcrostic();
    }
}
