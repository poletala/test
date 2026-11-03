import type { Question } from '../../types';

export const javascriptPart2: Question[] = [
  {
    id: 'js-023',
    category: 'javascript',
    topic: 'Прототипы и классы',
    difficulty: 'junior',
    type: 'single-choice',
    question: 'Класс `User` объявляет метод `greet()` в теле класса. Где находится этот метод у экземпляра `const user = new User()`?',
    options: [
      {
        id: 'a',
        text: 'В самом объекте `user` как собственное свойство, созданное конструктором',
        explanation: 'Неверно: конструктор создаёт только собственные свойства, присвоенные через `this`; методы класса в экземпляр не копируются.',
      },
      {
        id: 'b',
        text: 'В `User.prototype`; доступ идёт по цепочке прототипов через внутреннюю ссылку `[[Prototype]]`',
        explanation: 'Верно: метод лежит в `User.prototype`, а экземпляр находит его по цепочке прототипов.',
      },
      {
        id: 'c',
        text: 'В объекте `User` как статическое свойство, потому что метод объявлен в теле класса',
        explanation: 'Неверно: на самом классе оказываются только методы, объявленные со словом `static`.',
      },
      {
        id: 'd',
        text: 'Копируется в каждый экземпляр при вызове `new`',
        explanation: 'Неверно: `new` не копирует методы в объект; копирование уничтожило бы экономию памяти.',
      },
    ],
    correctAnswers: [
      'b',
    ],
    explanation: 'Верный ответ — b. Класс — это синтаксис над прототипами: методы, объявленные в теле класса без `static`, записываются в `User.prototype` как неперечисляемые свойства. `new User()` создаёт объект, у которого собственные поля — только присвоенные через `this`, а внутренняя ссылка `[[Prototype]]` ведёт на `User.prototype`. Поэтому `Object.hasOwn(user, \'greet\')` возвращает `false`, а `User.prototype.hasOwnProperty(\'greet\')` — `true`. При вызове `user.greet()` движок не находит метод в самом объекте и идёт по цепочке: `user` → `User.prototype` → `Object.prototype` → `null`. Такое хранение экономит память: функция одна на все экземпляры. Статические методы, объявленные через `static`, лежат на самом конструкторе `User`, а не на прототипе.',
    commonMistakes: [
      'Считать, что методы класса копируются в каждый экземпляр, как поля, созданные в конструкторе.',
      'Путать `User.greet` и `User.prototype.greet`: без `static` метод живёт на прототипе.',
      'Ожидать, что `Object.keys(user)` покажет `greet`.',
    ],
    codeExample: `class User {
  greet() {
    return 'привет';
  }
}

const user = new User();
console.log(Object.hasOwn(user, 'greet')); // false
console.log(Object.hasOwn(User.prototype, 'greet')); // true`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Начните с фразы «класс — это синтаксис над прототипами», затем покажите цепочку `user` → `User.prototype` → `Object.prototype` → `null` и отдельно объясните, зачем методы вынесены на прототип.',
    hint: 'Сравните `Object.hasOwn(user, \'greet\')` и `Object.hasOwn(User.prototype, \'greet\')`.',
    summary: 'Методы класса живут в `ClassName.prototype` и находятся через цепочку прототипов; в каждом экземпляре хранятся только собственные поля.',
    tags: [
      'prototypes',
      'classes',
      'methods',
    ],
  },
  {
    id: 'js-024',
    category: 'javascript',
    topic: 'Прототипы и классы',
    difficulty: 'junior-plus',
    type: 'code-output',
    question: 'Что выведет код? Укажите обе строки вывода.',
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return this.name + ' издаёт звук';
  }
}

class Dog extends Animal {
  speak() {
    return super.speak() + ' — гав';
  }
}

const dog = new Dog('Рекс');
console.log(dog.speak());
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`Рекс издаёт звук — гав` и `true`',
        explanation: 'Верно: `super.speak()` вызывает метод `Animal.prototype` с текущим `this`, а `Dog.prototype` наследует от `Animal.prototype`.',
      },
      {
        id: 'b',
        text: '`undefined издаёт звук — гав` и `true`',
        explanation: 'Неверно: `super.speak()` не теряет `this`; вызов идёт с получателем `dog`, поэтому имя сохраняется.',
      },
      {
        id: 'c',
        text: '`Рекс издаёт звук — гав` и `false`',
        explanation: 'Неверно: при `extends` прототип `Dog.prototype` создаётся с `[[Prototype]]`, равным `Animal.prototype`, поэтому проверка даёт `true`.',
      },
      {
        id: 'd',
        text: '`TypeError: super нельзя использовать вне конструктора`',
        explanation: 'Неверно: `super` разрешён не только в конструкторе, но и в обычных методах класса.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. `dog.speak()` сначала находит метод в `Dog.prototype`. Внутри `super.speak()` выполняет поиск не в `dog`, а в прототипе домашнего объекта метода, то есть в `Animal.prototype`, и вызывает найденную функцию с текущим `this`, равным `dog`. Поэтому `this.name` внутри `Animal.prototype.speak` — это `\'Рекс\'`, и первая строка получается `\'Рекс издаёт звук — гав\'`. Вторая проверка истинна: при объявлении `class Dog extends Animal` движок устанавливает `Object.getPrototypeOf(Dog.prototype) === Animal.prototype`; именно по этой связи работает наследование методов. `super` в методах и конструкторе допустим, поэтому `TypeError` не возникает. Важно не путать прототип экземпляра (`Dog.prototype`) с прототипом самой функции-конструктора (`Animal`, связь через `Object.setPrototypeOf(Dog, Animal)`).',
    commonMistakes: [
      'Думать, что `super.speak()` теряет `this` и даёт `undefined`.',
      'Полагать, что `Object.getPrototypeOf(Dog.prototype)` — это `Object.prototype`.',
      'Считать, что `super` можно использовать только в `constructor`.',
    ],
    codeExample: `class Base {
  who() {
    return 'base';
  }
}

class Child extends Base {
  who() {
    return super.who() + ' + child';
  }
}

console.log(new Child().who()); // base + child`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Проговорите два уровня прототипов: `dog` → `Dog.prototype` → `Animal.prototype` и отдельно `Dog` → `Animal` для статических членов. Затем объясните, что `super` ищет метод по домашнему объекту, сохраняя `this`.',
    hint: 'Обратите внимание, чему равен `this` внутри `Dog.prototype.speak` и куда ведёт прототип `Dog.prototype`.',
    summary: '`super` вызывает метод прототипа домашнего объекта с текущим `this`; цепочка прототипов класса-наследника ведёт к прототипу родителя.',
    tags: [
      'classes',
      'inheritance',
      'super',
    ],
  },
  {
    id: 'js-025',
    category: 'javascript',
    topic: 'Прототипы и классы',
    difficulty: 'junior-plus',
    type: 'find-bug',
    question: 'При передаче метода в переменную и вызове без объекта код падает. В чём причина и какое исправление корректно?',
    code: `class Counter {
  constructor() {
    this.value = 0;
  }

  increment() {
    this.value += 1;
    return this.value;
  }
}

const counter = new Counter();
const increment = counter.increment;
console.log(increment());`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: 'Метод теряет `this`: при вызове `increment()` нет получателя. Нужно сохранить привязку, например `const increment = counter.increment.bind(counter)`',
        explanation: 'Верно: `bind(counter)` создаёт функцию с зафиксированным `this`, поэтому обращение к `this.value` снова работает.',
      },
      {
        id: 'b',
        text: '`value` не объявлен как приватное поле `#value`, поэтому метод не видит его после отрыва от объекта',
        explanation: 'Неверно: приватность не решает потерю `this`; ошибка возникает ещё до доступа к `value`, потому что `this` равен `undefined`.',
      },
      {
        id: 'c',
        text: 'Классовые методы нельзя вызывать через отдельную переменную, пока класс не помечен `static`',
        explanation: 'Неверно: `static` меняет место хранения метода, но не спасает вызов без получателя.',
      },
      {
        id: 'd',
        text: 'Нужно перенести объявление `increment` из тела класса в `constructor` — тогда `this` привяжется к экземпляру навсегда',
        explanation: 'Неверно: перенос объявления в конструктор без стрелочной функции или `bind` оставит динамический `this` и ту же ошибку.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. `counter.increment` возвращает ссылку на функцию из `Counter.prototype`, но не сохраняет объект-получатель. Вызов `increment()` — это обычный вызов функции без базы, поэтому `this` внутри равен `undefined`: тела классов всегда выполняются в strict mode. Строка `this.value += 1` пытается прочитать `value` у `undefined` и выбрасывает `TypeError: Cannot read properties of undefined`. Исправления: `counter.increment.bind(counter)` создаёт связанную функцию; `() => counter.increment()` сохраняет вызов через объект; поле-стрелка `increment = () => { this.value += 1; }` в классе захватывает `this` экземпляра. Приватность `#value` проблему не решает, а перенос объявления в конструктор без стрелки оставит ту же потерю контекста.',
    commonMistakes: [
      'Считать, что метод «помнит» объект, из которого его достали.',
      'Пытаться исправить ошибку приватным полем вместо привязки `this`.',
      'Забывать, что в strict mode потерянный `this` равен `undefined`, а не глобальному объекту.',
    ],
    codeExample: `class Counter {
  constructor() {
    this.value = 0;
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.value += 1;
    return this.value;
  }
}

const { increment } = new Counter();
console.log(increment()); // 1`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Объясните, что `this` определяется местом вызова, а не местом объявления. Покажите три решения — `bind`, стрелочная обёртка и поле-стрелка — и разницу между ними по памяти и возможности повторной привязки.',
    hint: 'Вызов `increment()` не содержит точки, поэтому у него нет получателя.',
    summary: 'При отрыве метода от объекта теряется `this`; исправление — `bind`, стрелочная обёртка или поле-стрелка, захватывающее экземпляр.',
    tags: [
      'this',
      'classes',
      'debug',
    ],
  },
  {
    id: 'js-026',
    category: 'javascript',
    topic: 'Копирование объектов',
    difficulty: 'junior',
    type: 'single-choice',
    question: 'Что выведет `console.log(original.user.name)` после изменения вложенного объекта через поверхностную копию?',
    code: `const original = { user: { name: 'Аня' } };
const copy = { ...original };
copy.user.name = 'Борис';
console.log(original.user.name);`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`Борис`',
        explanation: 'Верно: spread копирует ссылку на вложенный объект, поэтому изменение видно в оригинале.',
      },
      {
        id: 'b',
        text: '`Аня`',
        explanation: 'Неверно: так было бы при глубокой копии; spread вложенные объекты не клонирует.',
      },
      {
        id: 'c',
        text: '`undefined`',
        explanation: 'Неверно: свойство `user` существует в обоих объектах, значение не удаляется.',
      },
      {
        id: 'd',
        text: '`TypeError`',
        explanation: 'Неверно: присваивание свойства вложенному объекту не запрещено и не вызывает ошибку.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Оператор расширения `{ ...original }` копирует только собственные перечисляемые свойства верхнего уровня. Значением свойства `user` является ссылка на вложенный объект, и в копию попадает та же самая ссылка, а не новый объект. Поэтому `copy.user === original.user` истинно, и изменение `copy.user.name` видно через `original.user.name`. Это поверхностная (shallow) копия. Если бы мы заменили ссылку целиком — `copy.user = { name: \'Борис\' }`, — исходный объект не изменился бы. Для глубокой копии подходят `structuredClone(original)` или ручное копирование вложенных уровней; спред сам по себе глубоким не становится.',
    commonMistakes: [
      'Считать `{ ...obj }` глубокой копией и удивляться общим вложенным объектам.',
      'Ожидать, что `structuredClone` склонирует функции или DOM-узлы.',
      'Путать замену вложенной ссылки (`copy.user = { name: \'Борис\' }`) с мутацией вложенного объекта (`copy.user.name = \'Борис\'`).',
    ],
    codeExample: `const original = { user: { name: 'Аня' } };
const deep = structuredClone(original);
deep.user.name = 'Борис';
console.log(original.user.name); // Аня`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Сразу разделите копирование ссылки, поверхностную и глубокую копию. Затем назовите цену: глубокая копия обходит граф и может быть дорогой, а `structuredClone` не умеет клонировать функции.',
    hint: 'Сравните `copy.user === original.user`.',
    summary: 'Spread создаёт поверхностную копию: вложенные объекты остаются общими, поэтому мутация через копию видна в оригинале.',
    tags: [
      'shallow-copy',
      'spread',
      'references',
    ],
  },
  {
    id: 'js-027',
    category: 'javascript',
    topic: 'Копирование объектов',
    difficulty: 'junior-plus',
    type: 'code-output',
    question: 'Что выведет этот код после JSON-клонирования объекта с `Date` и `undefined`? Укажите обе строки вывода.',
    code: `const source = {
  date: new Date('2024-01-01T00:00:00.000Z'),
  tags: ['js'],
  meta: undefined,
};
const cloned = JSON.parse(JSON.stringify(source));
console.log(cloned.date instanceof Date);
console.log(Object.hasOwn(cloned, 'meta'));`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`false` и `false`',
        explanation: 'Верно: `Date` превращается в строку, а свойство со значением `undefined` при сериализации объекта опускается.',
      },
      {
        id: 'b',
        text: '`true` и `true`',
        explanation: 'Неверно: JSON-цикл не сохраняет тип `Date` и не сохраняет ключи со значением `undefined`.',
      },
      {
        id: 'c',
        text: '`true` и `false`',
        explanation: 'Неверно: первая проверка ложна, потому что после `JSON.parse` дата — обычная строка.',
      },
      {
        id: 'd',
        text: '`false` и `true`',
        explanation: 'Неверно: `JSON.stringify` не записывает `meta: undefined` в объект, поэтому ключа после разбора нет.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. `JSON.stringify` вызывает у `Date` метод `toJSON()` и получает строку в ISO-формате; `JSON.parse` возвращает уже строку, поэтому `cloned.date instanceof Date` — `false`. Свойство со значением `undefined` при сериализации объекта просто опускается, поэтому после разбора у `cloned` нет ключа `meta`, и `Object.hasOwn(cloned, \'meta\')` — `false`. Тот же приём теряет функции, символы, `Map`, `Set`, `NaN` и `Infinity` (последние два превращаются в `null`), а `undefined` внутри массива становится `null`. `structuredClone(source)` сохранил бы и `Date`, и свойство `meta: undefined`, но не смог бы клонировать функции.',
    commonMistakes: [
      'Верить, что JSON-цикл сохраняет даты, `Map`, `Set` и `undefined`.',
      'Забывать, что `undefined` в массиве превращается в `null`, а в объекте — исчезает.',
      'Считать `structuredClone` полной заменой сериализации: функции и DOM-узлы он не клонирует.',
    ],
    codeExample: `const source = {
  date: new Date('2024-01-01T00:00:00.000Z'),
  meta: undefined,
};
const clone = structuredClone(source);
console.log(clone.date instanceof Date); // true
console.log(Object.hasOwn(clone, 'meta')); // true`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Перечислите ограничения JSON-цикла по категориям: типы, `undefined`, специальные числа, циклические ссылки. Затем предложите `structuredClone` и назовите его собственные ограничения.',
    hint: 'Сначала проследите, что именно `JSON.stringify` делает с `Date` и со свойством `meta`.',
    summary: 'JSON-клонирование теряет типы: `Date` становится строкой, а свойства со значением `undefined` исчезают.',
    tags: [
      'deep-copy',
      'json',
      'structured-clone',
    ],
  },
  {
    id: 'js-028',
    category: 'javascript',
    topic: 'Деструктуризация и операторы',
    difficulty: 'junior',
    type: 'single-choice',
    question: 'Что выведет `greet(null)`, если у параметра есть значение по умолчанию `гость`?',
    code: `function greet(name = 'гость') {
  return 'Привет, ' + name;
}
console.log(greet(null));`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`Привет, null`',
        explanation: 'Верно: значение по умолчанию не применяется к `null`, а конкатенация приводит `null` к строке.',
      },
      {
        id: 'b',
        text: '`Привет, гость`',
        explanation: 'Неверно: значение по умолчанию подставляется только для `undefined`, но не для `null`.',
      },
      {
        id: 'c',
        text: '`Привет, undefined`',
        explanation: 'Неверно: `undefined` появился бы только при вызове без аргумента, а здесь передан `null`.',
      },
      {
        id: 'd',
        text: '`TypeError`',
        explanation: 'Неверно: конкатенация строки с `null` допустима и даёт строку `null`.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Значение по умолчанию для параметра подставляется только тогда, когда аргумент равен `undefined` или не передан вовсе. `null` — это явно переданное значение, поэтому параметр `name` остаётся `null`, а конкатенация со строкой приводит его к `\'null\'`. Если вызвать `greet()` без аргумента, получится `\'Привет, гость\'`. Чтобы подставлять запасное значение и для `null`, нужна проверка `name ?? \'гость\'` или явное условие. Путаница между «отсутствующим» и «нулевым» значением — частая причина багов в API и формах, где `null` означает осознанно очищенное поле.',
    commonMistakes: [
      'Считать, что параметр по умолчанию сработает для `null`, `0`, `false` и пустой строки.',
      'Путать `??` (только `null`/`undefined`) с `||` (любое falsy-значение).',
      'Ожидать, что `null` автоматически превратится в `undefined` при передаче в параметр.',
    ],
    codeExample: `function greet(name = 'гость') {
  return 'Привет, ' + name;
}

console.log(greet()); // Привет, гость
console.log(greet(null)); // Привет, null`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Чётко разделите «аргумент не передан» и «передано значение `null`». Затем покажите, как `??` и проверка на `undefined` меняют поведение, и приведите пример из формы с очищенным полем.',
    hint: 'Значение по умолчанию — это не проверка на falsy, а проверка на `undefined`.',
    summary: 'Параметр по умолчанию срабатывает только для `undefined`; `null` остаётся значением и приводится к строке `null`.',
    tags: [
      'default-parameters',
      'null',
      'functions',
    ],
  },
  {
    id: 'js-029',
    category: 'javascript',
    topic: 'Деструктуризация и операторы',
    difficulty: 'junior-plus',
    type: 'multiple-choice',
    question: 'Выберите все верные утверждения о деструктуризации и операторах rest/spread.',
    options: [
      {
        id: 'a',
        text: '`const [first, ...rest] = [1, 2, 3]` создаёт новый массив `rest` со значениями `[2, 3]`',
        explanation: 'Верно: rest-элемент собирает оставшиеся элементы в новый массив, не изменяя исходный.',
      },
      {
        id: 'b',
        text: '`const { a, ...rest } = obj` копирует в `rest` все собственные перечисляемые свойства `obj`, кроме `a`',
        explanation: 'Верно: object rest копирует собственные перечисляемые свойства, включая символьные ключи, на один уровень вглубь.',
      },
      {
        id: 'c',
        text: '`const [a, ...rest, b] = arr` корректно соберёт середину массива в `rest`',
        explanation: 'Неверно: rest-элемент обязан быть последним, иначе код не компилируется (`SyntaxError`).',
      },
      {
        id: 'd',
        text: '`const { a: b } = obj` создаёт переменную `a` со значением одноимённого свойства',
        explanation: 'Неверно: слева от двоеточия — имя свойства, справа — новая переменная; создаётся `b`.',
      },
    ],
    correctAnswers: [
      'a',
      'b',
    ],
    explanation: 'Верные ответы — a и b. Rest-элемент массива действительно собирает оставшиеся элементы в новый массив, а object rest копирует собственные перечисляемые свойства, которых не было в шаблоне; копирование поверхностное, вложенные объекты остаются общими. Вариант c неверен синтаксически: rest-элемент обязан быть последним в шаблоне, поэтому `[a, ...rest, b]` — `SyntaxError`. Вариант d описывает переименование наоборот: в `const { a: b } = obj` слева от двоеточия стоит имя свойства, справа — новая переменная, поэтому создаётся `b`, а не `a`. Отдельно стоит помнить, что rest в параметрах функции собирает оставшиеся аргументы в массив, а spread в вызове, наоборот, разворачивает итерируемое значение.',
    commonMistakes: [
      'Пытаться поставить rest-элемент в середину деструктуризации.',
      'Путать `{ a: b }` с `{ b: a }`: слева ключ, справа новое имя.',
      'Считать object rest глубокой копией и мутировать общие вложенные объекты.',
    ],
    codeExample: `const [first, ...rest] = [1, 2, 3];
console.log(first, rest); // 1 [2, 3]

const { id, ...fields } = { id: 1, name: 'Аня' };
console.log(fields); // { name: 'Аня' }`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Назовите три роли `...`: rest в шаблоне, spread в литерале и rest/spread в параметрах и вызове функции. Для каждой покажите, создаётся ли новый массив или объект.',
    hint: 'Проверьте порядок rest-элемента и направление переименования.',
    summary: 'Rest собирает остаток и обязан быть последним, object rest копирует собственные перечисляемые свойства поверхностно, а `{ a: b }` переименовывает свойство `a` в переменную `b`.',
    tags: [
      'destructuring',
      'rest',
      'spread',
    ],
  },
  {
    id: 'js-030',
    category: 'javascript',
    topic: 'Деструктуризация и операторы',
    difficulty: 'junior-plus',
    type: 'code-completion',
    question: 'Введите выражение, которое создаёт объект `next` с теми же полями, что у `state`, но со значением `count: 1`, не изменяя `state`.',
    code: `const state = { count: 0, theme: 'dark' };
const next = /* введите выражение */;
console.log(next, state.count);`,
    codeLanguage: 'javascript',
    correctAnswers: [
      '{ ...state, count: 1 }',
    ],
    completion: {
      acceptedAnswers: [
        '{ ...state, count: 1 }',
        '{...state, count: 1}',
        'Object.assign({}, state, { count: 1 })',
      ],
      placeholder: 'Введите выражение',
      inputHint: 'Используйте литерал объекта и spread, не меняя `state`.',
      caseSensitive: false,
      ignoreWhitespace: true,
    },
    explanation: 'Верный ответ — `{ ...state, count: 1 }`. Литерал создаёт новый объект, spread копирует в него собственные перечисляемые свойства `state`, а следующее за ним свойство `count` перезаписывает скопированное значение. Исходный `state` не меняется, потому что присваивание идёт в новый объект. Порядок важен: в `{ count: 1, ...state }` последним применился бы `...state`, и `count` снова стал бы `0`. Эквивалентная запись — `Object.assign({}, state, { count: 1 })`, где первый аргумент защищает исходный объект от мутации. Копия поверхностная: вложенные объекты останутся общими, если они есть.',
    commonMistakes: [
      'Ставить `...state` после `count: 1` и получать исходный `0`.',
      'Мутировать `state.count = 1` и возвращать тот же объект.',
      'Забывать, что полученная копия поверхностная.',
    ],
    codeExample: `const state = { count: 0, theme: 'dark' };
const next = { ...state, count: 1 };
console.log(next); // { count: 1, theme: 'dark' }
console.log(state.count); // 0`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Объясните, что неизменяемое обновление — это создание новой ссылки с переопределением одного поля. Подчеркните порядок ключей и разницу между поверхностной копией и глубоким обновлением вложенного объекта.',
    hint: 'Порядок ключей в литерале важен: последнее значение побеждает.',
    summary: 'Новый объект с изменённым полем создаётся через `{ ...state, field: value }`; порядок ключей определяет, какое значение останется.',
    tags: [
      'spread',
      'immutability',
      'objects',
    ],
  },
  {
    id: 'js-031',
    category: 'javascript',
    topic: 'Массивы и коллекции',
    difficulty: 'junior',
    type: 'single-choice',
    question: 'Что выведет `console.log(numbers)` после `numbers.sort()` без компаратора?',
    code: `const numbers = [10, 9, 1, 100];
numbers.sort();
console.log(numbers);`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`[1, 10, 100, 9]`',
        explanation: 'Верно: без компаратора элементы сравниваются как строки, поэтому `100` идёт раньше `9`.',
      },
      {
        id: 'b',
        text: '`[1, 9, 10, 100]`',
        explanation: 'Неверно: так выглядела бы числовая сортировка с компаратором `(a, b) => a - b`, но по умолчанию она не применяется.',
      },
      {
        id: 'c',
        text: '`[10, 9, 1, 100]`',
        explanation: 'Неверно: `sort` мутирует массив, поэтому исходный порядок не сохраняется.',
      },
      {
        id: 'd',
        text: '`TypeError: sort требует функцию-компаратор`',
        explanation: 'Неверно: компаратор необязателен; без него используется строковое сравнение.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Без компаратора `sort` приводит элементы к строкам и сравнивает их как последовательности кодовых единиц UTF-16. Строки `\'1\'`, `\'10\'`, `\'100\'`, `\'9\'` упорядочиваются лексикографически, поэтому `9` оказывается последней, а `100` — перед ней. Метод сортирует массив на месте и возвращает ссылку на тот же массив, поэтому исходный `numbers` тоже изменён. Для чисел нужен компаратор `numbers.sort((a, b) => a - b)`. Ошибка ожидать числовую сортировку по умолчанию: `sort` не угадывает тип элементов и не пытается привести их к числам. Если нужен новый массив без мутации, в ES2023 есть `toSorted`, но в допущении этого банка — ES2022.',
    commonMistakes: [
      'Ожидать числовой порядок от `sort()` без компаратора.',
      'Забывать, что `sort` мутирует исходный массив.',
      'Сравнивать числа как строки и удивляться, почему `100` меньше `9`.',
    ],
    codeExample: `const numbers = [10, 9, 1, 100];
const sorted = [...numbers].sort((a, b) => a - b);
console.log(sorted); // [1, 9, 10, 100]
console.log(numbers); // [10, 9, 1, 100]`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Скажите, что `sort` по умолчанию строковый, мутирующий и нестабильный по смыслу для чисел. Затем покажите безопасный вариант: копия через spread плюс явный компаратор.',
    hint: 'Сравните, как выглядят числа после приведения к строкам.',
    summary: '`sort()` без компаратора сортирует как строки и мутирует исходный массив; для чисел нужен явный компаратор.',
    tags: [
      'arrays',
      'sort',
      'mutation',
    ],
  },
  {
    id: 'js-032',
    category: 'javascript',
    topic: 'Массивы и коллекции',
    difficulty: 'junior',
    type: 'multiple-choice',
    question: 'Выберите все методы массива, которые не мутируют исходный массив.',
    options: [
      {
        id: 'a',
        text: '`map`',
        explanation: 'Верно: `map` возвращает новый массив той же длины, исходный не меняется.',
      },
      {
        id: 'b',
        text: '`splice`',
        explanation: 'Неверно: `splice` изменяет массив на месте, удаляя или вставляя элементы.',
      },
      {
        id: 'c',
        text: '`slice`',
        explanation: 'Верно: `slice` копирует диапазон в новый массив, не трогая исходный.',
      },
      {
        id: 'd',
        text: '`sort`',
        explanation: 'Неверно: `sort` сортирует массив на месте и возвращает ссылку на него.',
      },
    ],
    correctAnswers: [
      'a',
      'c',
    ],
    explanation: 'Верные ответы — a и c. `map` и `slice` возвращают новый массив, не изменяя исходный: `map` применяет функцию к каждому элементу, `slice` копирует выбранный диапазон. `splice` изменяет массив на месте (удаляет, вставляет элементы) и возвращает массив удалённых элементов, а `sort` сортирует исходный массив на месте. В ES2023 появились неизменяющие `toSorted`, `toReversed`, `toSpliced`, но в допущении этого банка — ES2022, поэтому опираться на них в общем случае нельзя. Проверять мутацию стоит по документации метода, а не по названию: `slice` и `splice` отличаются одной буквой, но ведут себя принципиально по-разному.',
    commonMistakes: [
      'Путать `slice` (копия) и `splice` (мутация).',
      'Считать `sort` безопасным, потому что он возвращает массив.',
      'Думать, что `map` мутирует исходный массив, если колбэк меняет элементы.',
    ],
    codeExample: `const source = [3, 1, 2];
const mapped = source.map((n) => n * 2);
const sliced = source.slice(0, 2);
console.log(source, mapped, sliced); // [3, 1, 2] [6, 2, 4] [3, 1]`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Разделите методы на три группы: возвращающие новый массив, мутирующие и возвращающие одно значение. Для каждой группы приведите по два примера и упомяните `toSorted` как современную безопасную альтернативу.',
    hint: 'Сравните `slice` и `splice`: одна буква меняет контракт метода.',
    summary: '`map` и `slice` не мутируют массив, а `splice` и `sort` изменяют его на месте.',
    tags: [
      'arrays',
      'mutation',
      'methods',
    ],
  },
  {
    id: 'js-033',
    category: 'javascript',
    topic: 'Массивы и коллекции',
    difficulty: 'junior-plus',
    type: 'code-output',
    question: 'Что выведет код с двумя объектными ключами `Map`? Укажите обе строки вывода.',
    code: `const map = new Map();
map.set({ id: 1 }, 'первый');
map.set({ id: 1 }, 'второй');
console.log(map.size);
console.log(map.get({ id: 1 }));`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`2` и `undefined`',
        explanation: 'Верно: каждый литерал — новый объект, поэтому записей две, а третий объект не найден.',
      },
      {
        id: 'b',
        text: '`1` и `второй`',
        explanation: 'Неверно: `Map` не сравнивает объекты по содержимому; две записи не схлопываются в одну.',
      },
      {
        id: 'c',
        text: '`2` и `второй`',
        explanation: 'Неверно: ключа, равного третьему литералу, в `Map` нет, поэтому значение не вернётся.',
      },
      {
        id: 'd',
        text: '`1` и `undefined`',
        explanation: 'Неверно: записей две, потому что объекты сравниваются по ссылке, а не по полям.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. `Map` сравнивает ключи по алгоритму SameValueZero, а для объектов это сравнение по ссылке, а не по содержимому. Каждый объектный литерал `{ id: 1 }` создаёт новый объект, поэтому два `set` добавляют две разные записи: `map.size` равен `2`. Третий литерал в `map.get({ id: 1 })` — снова новый объект, которого нет среди ключей, поэтому возвращается `undefined`. Чтобы искать по идентификатору, используют примитивный ключ (`map.set(user.id, user)`) либо сохраняют ссылку на объект-ключ. `Map` не делает структурное сравнение и не сериализует ключи автоматически.',
    commonMistakes: [
      'Ожидать, что `Map` сравнит объектные ключи по полям.',
      'Создавать новый объект для `get`, когда ключом был другой литерал.',
      'Путать `Map` с `WeakMap`: у `WeakMap` объектов-ключей тоже нет структурного сравнения.',
    ],
    codeExample: `const byId = new Map();
const user = { id: 1 };
byId.set(user.id, user);
console.log(byId.get(1)); // { id: 1 }`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Скажите, что `Map` — это хеш-таблица по ссылкам для объектов и по значению для примитивов. Затем предложите два практических решения: примитивный ключ или хранение ссылки на объект.',
    hint: 'Сравните ссылки трёх объектов `{ id: 1 }`: они различны.',
    summary: '`Map` сравнивает объектные ключи по ссылке, поэтому одинаковые по содержимому литералы — разные ключи.',
    tags: [
      'map',
      'collections',
      'references',
    ],
  },
  {
    id: 'js-034',
    category: 'javascript',
    topic: 'Обработка ошибок',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Что выведет `run()`, если блок `finally` содержит `return`?',
    code: `function run() {
  try {
    throw new Error('сбой');
  } finally {
    return 'из finally';
  }
}
console.log(run());`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`из finally`',
        explanation: 'Верно: `return` в `finally` завершает функцию и отменяет ожидавшее исключение.',
      },
      {
        id: 'b',
        text: 'Выброшенную наружу ошибку `сбой`',
        explanation: 'Неверно: исключение не выйдет наружу, потому что `finally` завершает функцию нормально.',
      },
      {
        id: 'c',
        text: '`undefined`',
        explanation: 'Неверно: функция возвращает строку, а не `undefined`.',
      },
      {
        id: 'd',
        text: 'Сначала `сбой`, затем `из finally`',
        explanation: 'Неверно: исключение не печатается и не пробрасывается; `finally` перекрывает его возвратом.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Сначала выполняется `try`, где создаётся и выбрасывается ошибка. Блок `finally` выполняется всегда — и при исключении, и при обычном выходе, и при `return` из `try`. Но `return \'из finally\'` внутри `finally` завершает функцию нормально и отменяет ожидающее исключение: ошибка `сбой` не пробрасывается наружу, а `console.log` печатает `\'из finally\'`. Именно поэтому `return` и `throw` внутри `finally` считаются опасными: они молча перекрывают результат `try` или `catch`. Если нужен и результат, и проброс ошибки, `finally` должен только освобождать ресурсы, не возвращая значение.',
    commonMistakes: [
      'Считать, что `finally` выполняется только при ошибке.',
      'Думать, что `return` в `finally` не может отменить исключение.',
      'Использовать `finally` для возврата значения и терять исходную ошибку.',
    ],
    codeExample: `function readConfig() {
  try {
    return 'из try';
  } finally {
    console.log('cleanup');
  }
}

console.log(readConfig()); // cleanup, затем 'из try'`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Опишите порядок завершения: `try` → `catch` при необходимости → `finally` → возврат или проброс. Подчеркните, что `finally` не должен менять результат, иначе теряется диагностика.',
    hint: 'Что важнее: завершение из `finally` или ожидающее исключение?',
    summary: '`finally` выполняется всегда, но `return` внутри него отменяет ожидающее исключение и возвращает своё значение.',
    tags: [
      'try-catch',
      'finally',
      'errors',
    ],
  },
  {
    id: 'js-035',
    category: 'javascript',
    topic: 'Обработка ошибок',
    difficulty: 'junior-plus',
    type: 'find-bug',
    question: 'Почему `render` получает промис вместо пользователя и какое исправление устраняет причину?',
    code: `async function loadUser(id) {
  try {
    const response = await fetch('/api/users/' + id);
    return response.json();
  } catch (error) {
    console.error('Не удалось загрузить пользователя', error);
    return null;
  }
}

function init() {
  try {
    const user = loadUser(1);
    render(user);
  } catch (error) {
    console.error('Ошибка инициализации', error);
  }
}`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`init` не ожидает результат: нужно сделать её `async` и написать `const user = await loadUser(1)`, иначе `render` получает `Promise`',
        explanation: 'Верно: `async`-функция всегда возвращает промис, поэтому без `await` в `user` оказывается `Promise`.',
      },
      {
        id: 'b',
        text: '`catch` внутри `loadUser` не перехватывает ошибки `await`; нужно добавить `.catch()` после `response.json()`',
        explanation: 'Неверно: `await` внутри `try` нормально перехватывается `catch`; проблема не в этом.',
      },
      {
        id: 'c',
        text: '`fetch` нельзя вызывать без `await` внутри `try`, поэтому возвращается промис',
        explanation: 'Неверно: `fetch` можно вызывать без `await`, он возвращает промис; здесь он как раз ожидается.',
      },
      {
        id: 'd',
        text: 'Нужно обернуть вызов `init()` в `try/catch` на верхнем уровне — это автоматически развернёт промис',
        explanation: 'Неверно: внешний `try/catch` не разворачивает промис; без `await` ошибка останется необработанным отклонением.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Любая `async`-функция всегда возвращает промис; `loadUser(1)` не блокирует `init`, поэтому в `user` оказывается `Promise`, и `render` получает промис вместо объекта. Внешний `try/catch` тоже не спасает: он видит только синхронный вызов, а отклонение промиса произойдёт позже, в микрозадаче, если его не `await`-ить. Исправление — сделать `init` асинхронной и написать `const user = await loadUser(1)`; вызов `init()` на верхнем уровне стоит дополнить `.catch((error) => console.error(error))`. Внутренний `catch` в `loadUser` при этом действительно обрабатывает сетевые ошибки, но не делает результат синхронным.',
    commonMistakes: [
      'Считать, что `try/catch` вокруг вызова `async`-функции поймает её отклонение без `await`.',
      'Забывать, что `async`-функция возвращает промис даже при мгновенном `return`.',
      'Ожидать, что `render` сам развернёт промис.',
    ],
    codeExample: `async function init() {
  try {
    const response = await fetch('/api/users/1');
    const user = await response.json();
    console.log(user);
  } catch (error) {
    console.error('Ошибка инициализации', error);
  }
}

init();`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Начните с правила: `async` всегда возвращает промис. Затем покажите, что `try/catch` работает только вокруг `await`, и назовите два уровня обработки: локальный в загрузчике и внешний `catch` на инициализации.',
    hint: 'Посмотрите на тип значения, которое возвращает `loadUser(1)` без `await`.',
    summary: '`async`-функция возвращает промис; без `await` вызывающий код получает промис, а не данные, и `try/catch` не ловит отклонение.',
    tags: [
      'async-await',
      'promises',
      'debug',
    ],
  },
  {
    id: 'js-036',
    category: 'javascript',
    topic: 'Обработка ошибок',
    difficulty: 'middle',
    type: 'multiple-choice',
    question: 'Выберите все верные утверждения об обработке ошибок в JavaScript (ES2022).',
    options: [
      {
        id: 'a',
        text: '`new Error(\'x\', { cause: original })` сохраняет исходную ошибку в `error.cause`',
        explanation: 'Верно: опция `cause` появилась в ES2022 и сохраняет исходную ошибку.',
      },
      {
        id: 'b',
        text: '`AggregateError` хранит несколько ошибок в массиве `errors` и используется, например, в `Promise.any`',
        explanation: 'Верно: `AggregateError.errors` — массив ошибок; `Promise.any` отклоняется именно таким объектом.',
      },
      {
        id: 'c',
        text: '`try/catch` вокруг `setTimeout(() => { throw new Error(\'x\'); }, 0)` перехватит ошибку, потому что колбэк вызывается в том же стеке',
        explanation: 'Неверно: колбэк таймера выполнится позже в отдельной задаче, когда `try/catch` уже завершён.',
      },
      {
        id: 'd',
        text: '`throw \'текст\'` допустим только в строгом режиме, иначе возникает `SyntaxError`',
        explanation: 'Неверно: `throw` принимает любое значение в любом режиме; ограничение про строгий режим неверно.',
      },
    ],
    correctAnswers: [
      'a',
      'b',
    ],
    explanation: 'Верные ответы — a и b. С ES2022 конструктор `Error` принимает вторым аргументом объект опций, и `new Error(\'x\', { cause: original })` сохраняет исходную ошибку в `error.cause`; это удобно для обёртки ошибок без потери контекста. `AggregateError` хранит несколько ошибок в свойстве `errors` и используется, например, в `Promise.any`, когда отклонены все промисы. Вариант c неверен: колбэк `setTimeout` выполняется в новой задаче с другим стеком, поэтому окружающий `try/catch` его не перехватит. Вариант d тоже неверен: `throw` принимает любое значение, включая строку, и это не зависит от strict mode.',
    commonMistakes: [
      'Ожидать, что `try/catch` поймает ошибку из асинхронного колбэка.',
      'Считать, что `throw` обязан принимать экземпляр `Error`.',
      'Забывать свойство `cause` и терять исходную ошибку при обёртке.',
    ],
    codeExample: `try {
  throw new Error('не удалось сохранить', { cause: new Error('нет сети') });
} catch (error) {
  console.error(error.cause.message); // нет сети
}`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Разделите синхронные и асинхронные ошибки. Для обёрток назовите `cause`, для параллельных операций — `AggregateError`, для колбэков — отдельные обработчики или промисы.',
    hint: 'Спросите, в каком стеке и в какой задаче выполняется каждый фрагмент.',
    summary: '`cause` и `AggregateError` — стандартные инструменты ES2022; `try/catch` не ловит ошибки из отдельных асинхронных задач.',
    tags: [
      'errors',
      'error-cause',
      'aggregate-error',
    ],
  },
  {
    id: 'js-037',
    category: 'javascript',
    topic: 'Модули и функциональный стиль',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question: 'Модуль `counter.js` экспортирует `let count` и функцию `increment`. Что выведет `main.js` после вызова `increment()`?',
    code: `// counter.js
export let count = 0;
export function increment() {
  count += 1;
}

// main.js
import { count, increment } from './counter.js';
increment();
console.log(count);`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '`1`',
        explanation: 'Верно: импорт — живая привязка, поэтому после `increment()` видно новое значение `1`.',
      },
      {
        id: 'b',
        text: '`0`',
        explanation: 'Неверно: значение не копируется при импорте, поэтому `0` не останется.',
      },
      {
        id: 'c',
        text: '`undefined`',
        explanation: 'Неверно: `count` инициализирован нулём, а не `undefined`.',
      },
      {
        id: 'd',
        text: '`TypeError`',
        explanation: 'Неверно: ошибка возникла бы при попытке присвоить импортированной привязке, а чтение разрешено.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. ES-модули экспортируют не копию значения, а живую привязку (live binding). Импортированный `count` — это ссылка на переменную модуля `counter.js`, доступная только для чтения. Функция `increment` увеличивает эту переменную, и импорт сразу видит новое значение `1`. Если попытаться выполнить `count = 5` в `main.js`, получим `TypeError`, потому что импортированные привязки нельзя переприсваивать. В CommonJS через `module.exports` экспортировался бы снимок значения на момент вызова, если бы экспортировали примитив, поэтому поведение там отличается. Именно живые привязки позволяют модулям синхронизировать состояние без геттеров.',
    commonMistakes: [
      'Считать, что `import` копирует значение на момент импорта.',
      'Пытаться присвоить импортированной привязке и получать `TypeError`.',
      'Путать живую привязку ES-модулей с обычным свойством объекта в CommonJS.',
    ],
    codeExample: `// counter.js
export let count = 0;
export function increment() {
  count += 1;
}

// main.js
import { count, increment } from './counter.js';
increment();
console.log(count); // 1`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Сформулируйте разницу: ES-модули дают живые привязки (live bindings) и статический анализ, CommonJS — значения и динамический `require`. Приведите пример счётчика и ошибку при попытке присваивания импорту.',
    hint: 'Импорт — это не копия значения, а ссылка на binding модуля.',
    summary: 'ES-модули экспортируют живые привязки: изменение переменной в модуле сразу видно импортирующему коду, но переприсваивать импорт нельзя.',
    tags: [
      'es-modules',
      'live-bindings',
      'imports',
    ],
  },
  {
    id: 'js-038',
    category: 'javascript',
    topic: 'Модули и функциональный стиль',
    difficulty: 'middle',
    type: 'scenario',
    question: 'Общий UI-пакет реэкспортирует все компоненты через `index.ts`. Приложение импортирует из него одну кнопку, но в бандл попадают все компоненты, а сборка предупреждает о циклических зависимостях. Какое действие наиболее обоснованно?',
    options: [
      {
        id: 'a',
        text: 'Импортировать компонент из его конкретного модуля и убрать побочные эффекты и циклы из barrel-файла, проверив `sideEffects`',
        explanation: 'Верно: прямой импорт и корректные метаданные пакета уменьшают граф модулей и позволяют tree-shaking.',
      },
      {
        id: 'b',
        text: 'Перевести пакет на CommonJS: тогда tree-shaking заработает и лишние модули исчезнут',
        explanation: 'Неверно: CommonJS сам по себе не включает tree-shaking и ухудшает статический анализ.',
      },
      {
        id: 'c',
        text: 'Пометить весь пакет `sideEffects: false`, не проверяя файлы, — этого достаточно',
        explanation: 'Неверно: неверный флаг `sideEffects` заставит сборщик выбросить нужные побочные эффекты.',
      },
      {
        id: 'd',
        text: 'Заменить именованный импорт на `import * as UI` и обращаться к `UI.Button`',
        explanation: 'Неверно: namespace-импорт тянет весь модуль и не уменьшает граф зависимостей.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Barrel-файл `index.ts` создаёт рёбра графа модулей ко всем реэкспортам; сборщик может удалить неиспользуемые экспорты, только если модули не имеют побочных эффектов и граф не содержит циклов. Циклические зависимости и побочные эффекты (например, регистрация стилей или глобальных обработчиков) заставляют включать лишний код. Практичный шаг — импортировать компонент из конкретного модуля, разорвать циклы и проверить, что `sideEffects` в `package.json` отражает реальность. Слепо ставить `sideEffects: false` опасно: сборщик выбросит нужные побочные эффекты. Перевод на CommonJS и `import * as UI` задачу не решают.',
    commonMistakes: [
      'Считать, что любой barrel-файл безопасен для tree-shaking.',
      'Ставить `sideEffects: false` всему пакету без аудита побочных эффектов.',
      'Лечить циклические зависимости переводом на CommonJS.',
    ],
    codeExample: `// ui/index.ts
export { Button } from './Button';
export { Modal } from './Modal';

// app.ts
import { Button } from './ui/Button';`,
    codeExampleLanguage: 'typescript',
    interviewTip: 'Объясните, что tree-shaking — это анализ графа модулей и побочных эффектов, а не магия сборщика. Назовите три условия: статические импорты, отсутствие циклов и корректный `sideEffects`.',
    hint: 'Подумайте, какие рёбра графа модулей создаёт реэкспорт и какие из них действительно нужны приложению.',
    summary: 'Barrel-файлы и побочные эффекты раздувают бандл; помогают прямые импорты, разрыв циклов и честный `sideEffects`.',
    tags: [
      'es-modules',
      'tree-shaking',
      'barrel',
    ],
  },
  {
    id: 'js-039',
    category: 'javascript',
    topic: 'Итераторы и генераторы',
    difficulty: 'middle',
    type: 'code-completion',
    question: 'Введите выражение, которое соберёт все значения генератора `ids()` в массив, вызвав генератор ровно один раз.',
    code: `function* ids() {
  yield 'a';
  yield 'b';
}

// Требуется получить массив всех значений за один вызов ids()`,
    codeLanguage: 'javascript',
    correctAnswers: [
      '[...ids()]',
    ],
    completion: {
      acceptedAnswers: [
        '[...ids()]',
        'Array.from(ids())',
      ],
      placeholder: 'Введите выражение',
      inputHint: 'Разверните итерируемый объект в массив, вызвав генератор один раз.',
      caseSensitive: false,
      ignoreWhitespace: true,
    },
    explanation: 'Верный ответ — `[...ids()]`; также корректен `Array.from(ids())`. Вызов генератора возвращает генераторный объект, который одновременно является итератором (у него есть `next`) и итерируемым (его `Symbol.iterator` возвращает его же). Spread и `Array.from` последовательно вызывают `next()`, пока не получат `done: true`, и собирают значения в массив `[\'a\', \'b\']`. Важно: генератор одноразовый, поэтому второй `[...ids()]` без нового вызова вернул бы пустой массив. Нельзя использовать `ids()` без разворота — тогда в переменной окажется сам генераторный объект, а не массив.',
    commonMistakes: [
      'Забывать вызвать генератор и пытаться развернуть саму функцию `ids`.',
      'Использовать один и тот же генераторный объект для двух проходов.',
      'Ожидать, что `ids()` вернёт массив значений сразу.',
    ],
    codeExample: `function* ids() {
  yield 'a';
  yield 'b';
}

console.log([...ids()]); // ['a', 'b']
console.log(Array.from(ids())); // ['a', 'b']`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Объясните разницу между генераторной функцией, генераторным объектом и итерируемым протоколом. Покажите, что spread работает с любым iterable, а не только с массивами.',
    hint: 'Генераторный объект реализует `Symbol.iterator`, поэтому его можно развернуть в массив.',
    summary: 'Генератор возвращает одноразовый итерируемый объект; `[...ids()]` или `Array.from(ids())` собирают его значения в массив.',
    tags: [
      'generators',
      'iterators',
      'spread',
    ],
  },
  {
    id: 'js-040',
    category: 'javascript',
    topic: 'Итераторы и генераторы',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Генератор открывает ресурс и освобождает его в `finally`. Потребитель перебирает генератор через `for...of` и прерывает цикл `break` на первом значении. Что произойдёт с `finally`?',
    options: [
      {
        id: 'a',
        text: 'Он выполнится: при досрочном завершении `for...of` вызывает у итератора `return()`, а генератор выполняет `finally`',
        explanation: 'Верно: IteratorClose вызывает `return()`, генератор возобновляется как при `return` и проходит через `finally`.',
      },
      {
        id: 'b',
        text: 'Он не выполнится: `finally` срабатывает только при исключении, а `break` — не исключение',
        explanation: 'Неверно: `finally` выполняется и при `return`, и при досрочном закрытии итератора, не только при исключении.',
      },
      {
        id: 'c',
        text: 'Он выполнится только после сборки мусора, когда генератор станет недостижим',
        explanation: 'Неверно: `for...of` закрывает итератор сразу, не дожидаясь сборки мусора.',
      },
      {
        id: 'd',
        text: 'Возникнет `SyntaxError`: `yield` нельзя использовать внутри `try/finally`',
        explanation: 'Неверно: `yield` внутри `try/finally` синтаксически допустим и часто используется для очистки.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Протокол итераторов предусматривает необязательный метод `return()`, который вызывается при досрочном завершении перебора. `for...of` при `break`, `return` или исключении выполняет IteratorClose и вызывает у итератора `return()`, если он есть. У генератора этот метод возобновляет выполнение так, будто на месте `yield` произошёл `return`: управление попадает в `finally`, ресурс освобождается, после чего генератор завершается. Поэтому очистка выполнится сразу после `break`, а не при сборке мусора. Если потребитель вручную вызывает `next()` и просто бросает итератор, `return()` может не вызваться — на это нельзя полагаться.',
    commonMistakes: [
      'Считать, что `finally` в генераторе сработает только при выброшенном исключении.',
      'Полагаться на сборку мусора для освобождения ресурса.',
      'Забывать, что ручное использование `next()` без `return()` не гарантирует очистку.',
    ],
    codeExample: `function* resource() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log('cleanup');
  }
}

for (const value of resource()) {
  console.log(value);
  break;
}
// 1
// cleanup`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Опишите IteratorClose: `for...of` вызывает `return()` при досрочном выходе. Затем покажите, как это связано с `try/finally` в генераторе и почему ресурс освобождается детерминированно.',
    hint: 'Вспомните, какой метод вызывает `for...of`, если цикл завершается досрочно.',
    summary: 'При досрочном выходе `for...of` вызывает `iterator.return()`, поэтому `finally` в генераторе выполняется сразу и освобождает ресурс.',
    tags: [
      'generators',
      'iterator-protocol',
      'cleanup',
    ],
  },
  {
    id: 'js-041',
    category: 'javascript',
    topic: 'Итераторы и генераторы',
    difficulty: 'middle',
    type: 'find-bug',
    question: 'Второй массив оказался пустым. В чём причина и какое исправление корректно?',
    code: `function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}

const iterator = numbers();
const first = [...iterator];
const second = [...iterator];
console.log(first, second);`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: 'Генератор одноразовый: после первого полного перебора он завершён. Нужно создавать новый итератор: `[...numbers()]` в обоих местах',
        explanation: 'Верно: исчерпанный генератор навсегда возвращает `done: true`, поэтому нужен новый вызов `numbers()`.',
      },
      {
        id: 'b',
        text: 'Spread не поддерживает генераторы; второй массив пуст, потому что нужен `Array.from(iterator)`',
        explanation: 'Неверно: spread работает с любым итерируемым объектом; `Array.from` на исчерпанном итераторе тоже дал бы пустой массив.',
      },
      {
        id: 'c',
        text: 'Константа `iterator` не может хранить два результата, её нужно объявить через `let`',
        explanation: 'Неверно: `const` запрещает переприсваивание переменной, но не мешает хранить результат перебора.',
      },
      {
        id: 'd',
        text: 'Нужно вызвать `iterator.rewind()` перед вторым spread, чтобы вернуть генератор в начало',
        explanation: 'Неверно: метода `rewind()` у генераторов нет; это выдуманный API.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Генераторный объект — это одноразовый итератор: после того как он вернул `done: true`, повторные `next()` навсегда возвращают `{ value: undefined, done: true }`. Первый `[...iterator]` полностью исчерпал генератор, поэтому второй spread сразу получает `done: true` и создаёт пустой массив. Исправление — создавать новый генератор для каждого прохода: `[...numbers()]` и ещё раз `[...numbers()]`. Метода `rewind()` у генераторов не существует, а `Array.from` на том же исчерпанном итераторе дал бы тот же пустой результат. `const` здесь ни при чём: переменная не переприсваивается.',
    commonMistakes: [
      'Считать генератор многоразовой коллекцией, как массив.',
      'Пытаться перемотать итератор несуществующим `rewind()`.',
      'Передавать один и тот же генераторный объект в несколько независимых потребителей.',
    ],
    codeExample: `function* numbers() {
  yield 1;
  yield 2;
}

console.log([...numbers()]); // [1, 2]
console.log([...numbers()]); // [1, 2] — новый генератор`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Скажите, что генератор — это итератор с состоянием и однократным проходом. Если нужен повторный проход, создавайте новый объект или материализуйте значения в массив.',
    hint: 'Проверьте, что вернёт `iterator.next()` после первого spread.',
    summary: 'Генераторный объект исчерпывается за один проход; для повторного перебора нужен новый вызов генераторной функции.',
    tags: [
      'generators',
      'debug',
      'iterators',
    ],
  },
  {
    id: 'js-042',
    category: 'javascript',
    topic: 'Память и производительность',
    difficulty: 'middle',
    type: 'scenario',
    question: 'Виджет `mountWidget()` вешает обработчик на `window` и запускает `setInterval`, сохраняя ссылку на DOM-узел в замыкании. `unmountWidget()` лишь удаляет узел из DOM. В SPA память растёт, а обработчики продолжают срабатывать. Какое исправление устраняет причину?',
    options: [
      {
        id: 'a',
        text: 'Хранить ссылки на обработчик и `timerId`, а в `unmountWidget` вызывать `removeEventListener` с той же функцией и `clearInterval`',
        explanation: 'Верно: симметричное снятие подписки и остановка таймера разрывают сильные ссылки на замыкание и DOM-узел.',
      },
      {
        id: 'b',
        text: 'В обработчике проверять `document.body.contains(node)` и выходить: этого достаточно, чтобы сборщик мусора освободил узел',
        explanation: 'Неверно: проверка в обработчике не снимает подписку и не останавливает таймер, поэтому утечка остаётся.',
      },
      {
        id: 'c',
        text: 'Увеличить интервал `setInterval` и вызывать `node.remove()` дважды',
        explanation: 'Неверно: увеличение интервала и повторное удаление узла не освобождают замыкание и обработчик.',
      },
      {
        id: 'd',
        text: 'Обернуть создание виджета в `try/catch`, чтобы ошибки не удерживали память',
        explanation: 'Неверно: `try/catch` обрабатывает ошибки, но не управляет временем жизни подписок и таймеров.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. Зарегистрированный на `window` обработчик и активный `setInterval` — это корни достижимости: они хранят функции, а те через замыкание держат DOM-узел. Удаление узла из DOM не снимает подписку и не останавливает таймер, поэтому сборщик мусора не может освободить ни узел, ни замыкание, а повторный монтаж добавляет новые обработчики. Правильное исправление — симметричное освобождение: сохранить ссылку на ту же функцию-обработчик и `timerId`, затем в `unmountWidget` вызвать `removeEventListener` с этой же ссылкой и `clearInterval`. Современная альтернатива — передать `AbortController.signal` в `addEventListener` и вызвать `abort()`. Проверка `contains` только маскирует симптом.',
    commonMistakes: [
      'Вызывать `removeEventListener` с новой стрелочной функцией вместо исходной ссылки.',
      'Удалять DOM-узел и считать, что вместе с ним исчезли обработчики и таймеры.',
      'Проверять актуальность узла в обработчике вместо снятия подписки.',
    ],
    codeExample: `function mountWidget(node) {
  const onResize = () => {
    node.dataset.width = String(window.innerWidth);
  };
  const timerId = setInterval(() => node.classList.toggle('pulse'), 1000);

  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    clearInterval(timerId);
  };
}`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Опишите утечку через достижимость: корни → обработчик/таймер → замыкание → DOM-узел. Затем покажите симметричную очистку и упомяните `AbortController` как способ снять сразу группу подписок.',
    hint: 'Подумайте, какие сильные ссылки продолжают существовать после `node.remove()`.',
    summary: 'Глобальные подписки и таймеры удерживают замыкание и DOM-узел; лечится симметричным `removeEventListener` с той же функцией и `clearInterval`.',
    tags: [
      'memory-leaks',
      'event-listeners',
      'cleanup',
    ],
  },
  {
    id: 'js-043',
    category: 'javascript',
    topic: 'Память и производительность',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Как `WeakMap` взаимодействует со сборкой мусора?',
    options: [
      {
        id: 'a',
        text: 'Ключи удерживаются слабо: когда на объект-ключ не остаётся сильных ссылок, запись исчезает, а перебрать ключи нельзя',
        explanation: 'Верно: `WeakMap` не продлевает жизнь ключа и не предоставляет `size`, `clear` и перебора.',
      },
      {
        id: 'b',
        text: '`WeakMap` хранит ключи как строки, поэтому примитивы тоже подходят в качестве ключей',
        explanation: 'Неверно: ключами `WeakMap` могут быть объекты, а примитивы не имеют идентичности для слабых ссылок.',
      },
      {
        id: 'c',
        text: '`WeakMap` сам удаляет записи по таймеру через `setTimeout`',
        explanation: 'Неверно: никакого таймера внутри `WeakMap` нет; очистка происходит силами сборщика мусора.',
      },
      {
        id: 'd',
        text: '`WeakMap` держит ключи сильно, но у него есть `clear()` для ручной очистки',
        explanation: 'Неверно: `WeakMap` не имеет `clear`, `size` и перебора; ключи в нём слабые.',
      },
    ],
    correctAnswers: [
      'a',
    ],
    explanation: 'Верный ответ — a. `WeakMap` хранит ключи слабо: запись не считается сильной ссылкой на объект-ключ, поэтому сборщик мусора может освободить ключ, даже если запись ещё существует; после этого запись становится недоступной и удаляется. Из этого следуют ограничения: у `WeakMap` нет `size`, `clear`, перебора ключей и значений — иначе можно было бы наблюдать недетерминированный результат сборки мусора. Примитивы (числа, строки, `null`) ключами быть не могут, потому что они не объекты и не имеют идентичности. `WeakMap` удобен для метаданных и кэшей, привязанных к объектам, без продления их жизни.',
    commonMistakes: [
      'Ожидать у `WeakMap` методы `size`, `clear` и `forEach`.',
      'Пытаться использовать строку или число как ключ `WeakMap`.',
      'Считать, что `WeakMap` очищается по таймеру, а не сборщиком мусора.',
    ],
    codeExample: `const meta = new WeakMap();
let node = document.createElement('div');
meta.set(node, { clicks: 0 });
node = null;
// после сборки мусора запись для узла больше недоступна`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Свяжите `WeakMap` с достижимостью: слабая ссылка не удерживает ключ. Затем назовите практические сценарии — метаданные DOM-узлов, приватные данные, кэш без утечек — и ограничения API.',
    hint: 'Слабая ссылка не должна продлевать жизнь объекта-ключа.',
    summary: '`WeakMap` держит ключи слабо, не мешает сборке мусора и не поддерживает перебор, `size` и `clear`.',
    tags: [
      'weakmap',
      'garbage-collection',
      'memory',
    ],
  },
  {
    id: 'js-044',
    category: 'javascript',
    topic: 'Память и производительность',
    difficulty: 'middle',
    type: 'multiple-choice',
    question: 'Выберите все ситуации, в которых объект, скорее всего, не будет освобождён сборщиком мусора.',
    options: [
      {
        id: 'a',
        text: 'На объект ссылается замыкание активного `setInterval`, который никогда не очищается',
        explanation: 'Верно: активный таймер держит замыкание, а значит, и объекты, на которые оно ссылается.',
      },
      {
        id: 'b',
        text: 'Объект используется как ключ в `WeakMap` и больше нигде не упоминается',
        explanation: 'Неверно: `WeakMap` не создаёт сильной ссылки на ключ, поэтому объект может быть собран.',
      },
      {
        id: 'c',
        text: 'Объект добавлен в глобальный массив-кэш без ограничения размера и никогда не удаляется',
        explanation: 'Верно: глобальный массив — корень достижимости, и без удаления элемент остаётся навсегда.',
      },
      {
        id: 'd',
        text: 'Узел удалён из DOM, но на него ссылается обработчик, всё ещё зарегистрированный на `window`',
        explanation: 'Верно: обработчик на `window` удерживает замкнутый узел даже после удаления из DOM.',
      },
    ],
    correctAnswers: [
      'a',
      'c',
      'd',
    ],
    explanation: 'Верные ответы — a, c и d. Сборщик мусора освобождает объект, когда до него не остаётся пути сильных ссылок от корней. Активный `setInterval` держит замыкание, глобальный кэш-массив хранит элемент явно, а зарегистрированный на `window` обработчик удерживает замкнутый DOM-узел — во всех трёх случаях путь сохраняется, поэтому объект остаётся достижимым. Вариант b не подходит: `WeakMap` как раз не мешает сборке, его ключи слабые. Оговорка «скорее всего» важна: точный момент сборки не гарантирован спецификацией, но причины утечки здесь детерминированы архитектурно.',
    commonMistakes: [
      'Считать `WeakMap` причиной утечки, хотя он использует слабые ссылки.',
      'Забывать, что глобальные кэши и таймеры являются корнями достижимости.',
      'Думать, что удаление узла из DOM автоматически снимает все обработчики.',
    ],
    codeExample: `const listeners = new Set();

function subscribe(handler) {
  listeners.add(handler);
  return () => listeners.delete(handler);
}

const unsubscribe = subscribe(() => {});
unsubscribe(); // ссылка удалена, обработчик больше не удерживается`,
    codeExampleLanguage: 'javascript',
    interviewTip: 'Проверяйте каждый случай вопросом «есть ли путь сильных ссылок от корней?». Корни — глобальные объекты, активные таймеры, зарегистрированные обработчики и стек вызовов.',
    hint: 'Спросите про каждый случай: существует ли путь сильных ссылок от корней (window, глобальные переменные, активные таймеры)?',
    summary: 'Утечку создают сильные ссылки из таймеров, глобальных кэшей и зарегистрированных обработчиков; слабые ссылки `WeakMap` сборке не мешают.',
    tags: [
      'memory',
      'garbage-collection',
      'leaks',
    ],
  },
];
