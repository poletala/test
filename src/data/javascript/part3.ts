import type { Question } from '../../types';

export const javascriptPart3: Question[] = [
  {
    id: 'js-045',
    category: 'javascript',
    topic: 'Event Loop и асинхронность',
    difficulty: 'junior-plus',
    type: 'code-output',
    question:
      'Что выведет этот код в браузере и в Node.js 20+? Укажите точный порядок строк в консоли.',
    code: `console.log('start');

setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(() => console.log('promise'));

queueMicrotask(() => console.log('microtask'));

console.log('end');`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: 'start, end, promise, microtask, timeout',
        explanation:
          'Верно: сначала отрабатывает весь синхронный код, затем очередь микрозадач в порядке постановки (сначала promise, потом microtask), и только после её опустошения — таймер.',
      },
      {
        id: 'b',
        text: 'start, end, timeout, promise, microtask',
        explanation:
          'Неверно: setTimeout с задержкой 0 — это макрозадача, она не может обогнать микрозадачи, которые уже стоят в очереди к моменту опустошения стека.',
      },
      {
        id: 'c',
        text: 'start, promise, microtask, end, timeout',
        explanation:
          'Неверно: console.log("start") и console.log("end") — синхронные строки одной и той же задачи, между ними нет точек выхода, поэтому колбэки выполниться не успевают.',
      },
      {
        id: 'd',
        text: 'start, end, microtask, promise, timeout',
        explanation:
          'Неверно: queueMicrotask вызывается позже, чем .then, поэтому его колбэк стоит в очереди микрозадач вторым, а не первым.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Правильный порядок: start, end, promise, microtask, timeout. Скрипт — это одна задача: пока стек не опустеет, выполняются только синхронные строки, поэтому start и end идут первыми, а setTimeout лишь регистрирует макрозадачу в очереди таймеров. Promise.resolve().then и queueMicrotask кладут колбэки в очередь микрозадач в порядке вызова: сначала promise, затем microtask. Когда синхронный код закончился, Event Loop полностью опустошает очередь микрозадач — по FIFO, включая те микрозадачи, которые добавляются изнутри уже выполняющихся микрозадач. Только после этого наступает черёд макрозадач, и срабатывает таймер: задержка 0 в браузере клампится (минимум около 4 мс при вложенности таймеров больше пяти), в Node.js — до 1 мс, но на порядок вывода это не влияет. Для этого фрагмента браузер и Node.js 20+ ведут себя одинаково; расхождения начинаются на setImmediate и фазах libuv.',
    commonMistakes: [
      'Считать setTimeout(fn, 0) немедленным вызовом и ставить timeout раньше промисов.',
      'Думать, что постановка колбэка прерывает текущий синхронный код, и выводить end после promise.',
      'Путать порядок микрозадач и считать queueMicrotask приоритетнее уже запланированного .then.',
    ],
    codeExample: `setTimeout(() => console.log('macro'), 0);
Promise.resolve().then(() => console.log('micro'));
console.log('sync');
// sync, micro, macro`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Отвечайте по шагам: синхронный код → полное опустошение очереди микрозадач (FIFO) → рендер → следующая макрозадача. Сразу проговорите, что задержка 0 не означает «немедленно».',
    hint: 'Разложите колбэки по двум очередям и вспомните, какую из них Event Loop опустошает первой.',
    summary:
      'Синхронный код выполняется до конца, затем все микрозадачи по порядку постановки, и только после них — макрозадача из setTimeout.',
    tags: ['event-loop', 'microtasks', 'setTimeout'],
  },
  {
    id: 'js-046',
    category: 'javascript',
    topic: 'Event Loop и асинхронность',
    difficulty: 'junior',
    type: 'single-choice',
    question: 'Что гарантирует вызов setTimeout(callback, 0) в браузере?',
    options: [
      {
        id: 'a',
        text: 'Колбэк попадёт в очередь макрозадач и выполнится после того, как завершится текущий синхронный код и опустеет очередь микрозадач.',
        explanation:
          'Верно: таймер лишь планирует макрозадачу. Раньше, чем закончится текущая задача и все микрозадачи, её колбэк не запустится.',
      },
      {
        id: 'b',
        text: 'Колбэк выполнится сразу после текущей строки, до остального синхронного кода.',
        explanation:
          'Неверно: планирование таймера не прерывает текущую задачу — оставшийся синхронный код выполнится полностью.',
      },
      {
        id: 'c',
        text: 'Колбэк выполнится раньше любых промисов, потому что у таймеров более высокий приоритет.',
        explanation:
          'Неверно: приоритета между очередями нет, есть жёсткий порядок — микрозадачи всегда разбираются до следующей макрозадачи.',
      },
      {
        id: 'd',
        text: 'Колбэк выполнится синхронно, если стек вызовов в этот момент пуст.',
        explanation:
          'Неверно: даже при пустом стеке колбэк таймера запускается только из Event Loop на следующей итерации, а не внутри вызова setTimeout.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'setTimeout(callback, 0) не вызывает функцию немедленно: он добавляет задачу в очередь таймеров с истёкшим дедлайном. Event Loop добирается до неё только тогда, когда текущая задача завершена и очередь микрозадач пуста — поэтому колбэк гарантированно увидит все синхронные изменения и все промисы, запланированные до него. Задержка 0 не означает «сразу»: по HTML-спецификации при вложенности таймеров глубже пяти уровней минимальная задержка поднимается до 4 мс, а в Node.js 0 превращается в 1 мс. Практический вывод: setTimeout(fn, 0) — способ отложить работу до следующей макрозадачи (разгрузить длинную задачу, дать браузеру отрисовать кадр), но не инструмент точной синхронизации.',
    commonMistakes: [
      'Использовать setTimeout(fn, 0) как замену прямому вызову и удивляться, что код после него выполняется раньше колбэка.',
      'Ожидать от задержки 0 точного времени выполнения и строить на этом синхронизацию.',
      'Считать, что таймеры имеют приоритет над промисами, и ставить их первыми в ожидаемом порядке вывода.',
    ],
    codeExample: `setTimeout(() => console.log('timer'), 0);
console.log('sync');
// sync, timer`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Сформулируйте так: setTimeout планирует макрозадачу, а задержка — лишь минимальный порог. Упомяните клампинг задержки и то, что микрозадачи всегда идут раньше.',
    hint: 'Спросите себя, чем планирование задачи отличается от её выполнения.',
    summary:
      'setTimeout(fn, 0) планирует макрозадачу: колбэк выполнится после текущего синхронного кода и всех микрозадач, с задержкой не меньше ~4 мс в браузере.',
    tags: ['event-loop', 'macrotasks', 'timers'],
  },
  {
    id: 'js-047',
    category: 'javascript',
    topic: 'Promise и async/await',
    difficulty: 'junior-plus',
    type: 'code-output',
    question: 'Что и в каком порядке выведет этот код?',
    code: `async function run() {
  console.log('1');
  await null;
  console.log('3');
}

console.log('0');
run();
console.log('2');`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '0, 1, 2, 3',
        explanation:
          'Верно: тело async-функции до первого await выполняется синхронно, поэтому 1 идёт до 2, а продолжение после await попадает в микрозадачи.',
      },
      {
        id: 'b',
        text: '0, 1, 3, 2',
        explanation:
          'Неверно: await не блокирует вызывающий код — управление сразу возвращается из run(), и console.log("2") выполняется до продолжения функции.',
      },
      {
        id: 'c',
        text: '0, 2, 1, 3',
        explanation:
          'Неверно: тело async-функции не откладывается целиком, синхронная часть до первого await выполняется в момент вызова.',
      },
      {
        id: 'd',
        text: '1, 0, 2, 3',
        explanation:
          'Неверно: функция не запускается при объявлении, вызов run() стоит после console.log("0"), поэтому 0 выводится первым.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Порядок: 0, 1, 2, 3. Вызов async-функции не откладывает её тело: функция начинает выполняться синхронно и идёт до первого await. Поэтому сразу после console.log("0") печатается 1, затем await null приостанавливает run(): значение оборачивается в уже выполненный промис, а продолжение функции ставится в очередь микрозадач, самой функции возвращается pending-промис. Управление возвращается в вызывающий код, и console.log("2") выполняется раньше продолжения. Когда синхронный код завершён, Event Loop разбирает микрозадачи, и печатается 3. Тот же результат был бы с await Promise.resolve() и с await 42. Отсюда практическое правило: код до первого await — синхронный, и именно поэтому в async-функциях до первого await часто успевают выполниться побочные эффекты.',
    commonMistakes: [
      'Считать, что async-функция целиком уходит в микрозадачу и не выполняется до конца текущего синхронного кода.',
      'Думать, что await блокирует поток и останавливает выполнение вызывающего кода.',
      'Ожидать, что await null даст исключение, потому что await якобы работает только с промисами.',
    ],
    codeExample: `async function load() {
  console.log('request');
  const data = await Promise.resolve('ok');
  console.log('response', data);
}
load();
console.log('after call');
// request, after call, response ok`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Ключевая фраза: async-функция синхронна до первого await, а сам await — это точка приостановки, продолжение уходит в микрозадачи. Приведите этот короткий пример.',
    hint: 'Проследите, где именно выполнение покидает функцию и куда возвращается.',
    summary:
      'Тело async-функции выполняется синхронно до первого await; продолжение после await становится микрозадачей и идёт после текущего синхронного кода.',
    tags: ['async-await', 'microtasks', 'promises'],
  },
  {
    id: 'js-048',
    category: 'javascript',
    topic: 'Promise и async/await',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question:
      'Есть три промиса: p1 и p3 завершатся успешно, а p2 отклонится. Что произойдёт с Promise.all([p1, p2, p3])?',
    options: [
      {
        id: 'a',
        text: 'Промис all отклонится с причиной из p2 сразу, как только p2 отклонится; p1 и p3 продолжат выполняться, но их результаты будут проигнорированы.',
        explanation:
          'Верно: Promise.all работает по принципу fail-fast — первое отклонение немедленно переводит агрегат в rejected, отменить остальные промисы он не может.',
      },
      {
        id: 'b',
        text: 'Промис all дождётся завершения всех трёх промисов и вернёт массив, в котором на месте p2 будет объект ошибки.',
        explanation:
          'Неверно: это поведение Promise.allSettled. Promise.all не собирает частичный результат и не дожидается остальных после первого отклонения.',
      },
      {
        id: 'c',
        text: 'Промис all отклонится только после того, как завершатся все три промиса, — быстрое отклонение запрещено спецификацией.',
        explanation:
          'Неверно: спецификация требует отклонить агрегат при первом же отказе; ожидание всех промисов характерно для allSettled.',
      },
      {
        id: 'd',
        text: 'Промис all никогда не отклонится: ошибка p2 попадёт только в событие unhandledrejection.',
        explanation:
          'Неверно: обработчик отклонения у Promise.all есть, он переводит агрегат в rejected, а само событие unhandledrejection не возникает.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Promise.all возвращает агрегирующий промис, который резолвится массивом значений, когда выполнены все входные промисы, и отклоняется с первой же причиной отказа. Внутри он подписывается на каждый промис через then, поэтому при отклонении p2 срабатывает reject агрегата ровно один раз, а последующие отклонения и успехи игнорируются. Важная деталь: остальные промисы не отменяются — отмены в промисах нет, p1 и p3 доработают до конца, просто их значения никто не получит. При этом их отклонения (если бы они были) не станут unhandledrejection, потому что обработчик у all уже прикреплён. Если нужны результаты всех промисов независимо от ошибок — берите Promise.allSettled, если нужен первый успешный — Promise.any.',
    commonMistakes: [
      'Путать Promise.all с Promise.allSettled и ждать массив со статусами.',
      'Считать, что отклонение одного промиса отменяет остальные запросы.',
      'Думать, что ошибка «потеряется» и вызовет unhandledrejection, если агрегат уже отклонён.',
    ],
    codeExample: `const results = await Promise.allSettled([ok(), fail()]);
// [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: Error }]`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Сравните три комбинатора одной фразой каждый: all — fail-fast, allSettled — всегда массив статусов, any — первый успех и AggregateError при полном провале.',
    hint: 'Вспомните, чем all отличается от allSettled по моменту завершения.',
    summary:
      'Promise.all отклоняется при первом отказе, не дожидаясь остальных и не отменяя их; для сбора всех результатов нужен allSettled.',
    tags: ['promises', 'promise-all', 'error-handling'],
  },
  {
    id: 'js-049',
    category: 'javascript',
    topic: 'Обработка ошибок',
    difficulty: 'middle',
    type: 'code-output',
    question: 'Что выведет этот код? Укажите точную строку.',
    code: `class ValidationError extends Error {}

try {
  throw new ValidationError('bad');
} catch (error) {
  console.log(error instanceof ValidationError, error instanceof Error, error.name, error.message);
}`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: 'true true Error bad',
        explanation:
          'Верно: наследование прототипа даёт instanceof для обоих классов, но name не переопределяется автоматически и наследуется от Error.prototype.',
      },
      {
        id: 'b',
        text: 'true true ValidationError bad',
        explanation:
          'Неверно: class ValidationError extends Error {} не задаёт name само по себе; для этого нужно присвоить this.name = "ValidationError" в конструкторе.',
      },
      {
        id: 'c',
        text: 'false true Error bad',
        explanation:
          'Неверно: extends Error связывает прототипы, поэтому объект действительно является экземпляром ValidationError.',
      },
      {
        id: 'd',
        text: 'true false ValidationError bad',
        explanation:
          'Неверно: цепочка прототипов ведёт от ValidationError к Error, так что instanceof Error тоже истинно.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Код печатает true true Error bad. Класс ValidationError extends Error создаёт функцию-конструктор, у которой прототип связан с Error.prototype, поэтому выброшенный объект проходит обе проверки instanceof: сначала по ValidationError, затем по Error. А вот свойство name при наследовании не меняется: оно читается из Error.prototype и остаётся "Error", потому что конструктор по умолчанию вызывает super(message) и не присваивает this.name. Чтобы в логах было осмысленное имя, его задают явно: this.name = "ValidationError" в конструкторе (или через статическое поле класса). message = "bad" приходит из super(message). Практическая граница: instanceof ломается, если в приложении оказались две копии класса (например, из разных бандлов) или ошибка пришла из другого realm — в таких случаях надёжнее проверять собственное поле-маркер, скажем error.code.',
    commonMistakes: [
      'Ожидать, что name автоматически станет именем класса при наследовании от Error.',
      'Считать, что класс, унаследованный от Error, перестаёт быть экземпляром Error.',
      'Ловить ошибку через instanceof, когда в проекте может быть несколько копий класса ошибки.',
    ],
    codeExample: `class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}
console.log(new HttpError('Not found', 404).name); // HttpError`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Расскажите про цепочку прототипов и про то, что name — обычное свойство, а не магия наследования. Добавьте, как отличить свои ошибки от чужих в catch.',
    hint: 'Проверьте отдельно цепочку прототипов и то, откуда берётся свойство name.',
    summary:
      'Наследник Error проходит instanceof по обоим классам, но name остаётся "Error", пока его не задать вручную.',
    tags: ['errors', 'error-classes', 'instanceof'],
  },
  {
    id: 'js-050',
    category: 'javascript',
    topic: 'Event Loop и асинхронность',
    difficulty: 'middle',
    type: 'find-bug',
    question:
      'Почему collect() возвращает пустой массив, хотя промисы в колбэках успешно резолвятся? Выберите верную причину.',
    code: `function fetchValue(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(id * 10), 0);
  });
}

async function collect(ids) {
  const results = [];

  ids.forEach(async (id) => {
    results.push(await fetchValue(id));
  });

  return results;
}

collect([1, 2, 3]).then((results) => console.log(results));`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: 'forEach не дожидается промисов из async-колбэков: возвращаемое колбэком значение игнорируется, поэтому collect() возвращает results ещё до срабатывания таймеров.',
        explanation:
          'Верно: forEach синхронно вызывает колбэки и не смотрит на их возвращаемые значения, поэтому await внутри колбэка останавливает только сам колбэк, но не forEach и не collect.',
      },
      {
        id: 'b',
        text: 'Стрелочная функция не может быть async внутри forEach — интерпретатор молча игнорирует ключевое слово async и выполняет тело синхронно.',
        explanation:
          'Неверно: async-стрелочная функция синтаксически корректна и возвращает промис; проблема не в синтаксисе, а в том, что forEach этот промис не ждёт.',
      },
      {
        id: 'c',
        text: 'Массив results объявлен через const, поэтому push внутри колбэка не изменяет его.',
        explanation:
          'Неверно: const запрещает переприсваивание переменной, но не мутацию массива — push работает и меняет содержимое.',
      },
      {
        id: 'd',
        text: 'setTimeout с задержкой 0 не успевает выполниться до конца функции, поэтому промисы отклоняются, а не резолвятся.',
        explanation:
          'Неверно: промисы не отклоняются, они нормально резолвятся позже. Ошибка в том, что результат уже отдан наружу до их завершения.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'for (и forEach) не является async-aware: forEach синхронно перебирает массив, вызывает колбэк и выбрасывает то, что колбэк вернул. async-колбэк возвращает промис, но forEach его игнорирует, поэтому после трёх итераций управление сразу доходит до return results — массив ещё пуст, и наружу уходит уже выполненный промис со значением []. Таймеры сработают позже и допишут значения в тот же массив, но вызывающий код их уже не увидит: console.log получает снимок [], зафиксированный при резолве. Верные исправления: последовательно — for (const id of ids) { results.push(await fetchValue(id)); } и затем return results; параллельно — return Promise.all(ids.map((id) => fetchValue(id))). Второй вариант сохраняет порядок результатов, потому что Promise.all возвращает значения в порядке входного массива, а не в порядке завершения.',
    commonMistakes: [
      'Считать, что await внутри forEach останавливает весь перебор.',
      'Думать, что forEach возвращает промисы колбэков и их можно дождаться через Promise.all.',
      'Заменять forEach на map без Promise.all и получать массив промисов вместо значений.',
    ],
    codeExample: `async function collect(ids) {
  const results = await Promise.all(ids.map((id) => fetchValue(id)));
  return results;
}`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Сразу назовите правило: await работает только там, где он написан, — во внешней функции нужно дождаться. Затем покажите оба исправления: последовательное for...of и параллельное Promise.all(map).',
    hint: 'Спросите себя, что forEach делает с возвращаемым значением колбэка.',
    summary:
      'forEach игнорирует промисы async-колбэков, поэтому await внутри него не останавливает перебор; нужен for...of с await или Promise.all с map.',
    tags: ['debug', 'async-await', 'arrays'],
  },
  {
    id: 'js-051',
    category: 'javascript',
    topic: 'Promise и async/await',
    difficulty: 'middle',
    type: 'multiple-choice',
    question: 'Выберите все верные варианты утверждений о комбинаторах промисов.',
    options: [
      {
        id: 'a',
        text: 'Promise.allSettled всегда резолвится массивом объектов со статусом fulfilled или rejected и не отклоняется из-за ошибок входных промисов.',
        explanation:
          'Верно: allSettled дожидается всех промисов и описывает каждый результат объектом { status, value } или { status, reason }.',
      },
      {
        id: 'b',
        text: 'Promise.race завершается по первому завершившемуся промису: если тот отклонён — отклоняется, если выполнен — резолвится его значением.',
        explanation:
          'Верно: race передаёт наружу состояние первого завершившегося участника, независимо от того, успех это или ошибка.',
      },
      {
        id: 'c',
        text: 'Promise.any резолвится значением первого успешного промиса, а если отклонились все — отклоняется с AggregateError.',
        explanation:
          'Верно: any игнорирует отдельные отказы и «сдаётся» только после полного провала, складывая причины в AggregateError.',
      },
      {
        id: 'd',
        text: 'Promise.allSettled отклоняется с AggregateError, если хотя бы один из входных промисов отклонён.',
        explanation:
          'Неверно: отклонение с AggregateError — поведение Promise.any; allSettled никогда не отклоняется из-за ошибок участников.',
      },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation:
      'Различайте комбинаторы по моменту и способу завершения. Promise.all резолвится массивом значений только при полном успехе и отклоняется при первом отказе (fail-fast). Promise.allSettled дожидается всех и всегда резолвится массивом описаний: для успеха { status: "fulfilled", value }, для отказа { status: "rejected", reason }, поэтому он удобен, когда нужны все результаты независимо от ошибок. Promise.race отдаёт состояние первого завершившегося промиса — и успех, и ошибку, — поэтому его часто используют для таймаутов. Promise.any ждёт первый успех и отклоняется с AggregateError только если отклонились все участники; свойства errors в AggregateError содержат причины по порядку. Общее ограничение: ни один комбинатор не отменяет «проигравшие» промисы — для отмены нужен AbortController на уровне самого запроса.',
    commonMistakes: [
      'Считать, что allSettled может отклониться при ошибке одного из промисов.',
      'Ожидать от Promise.race только успешный результат и не обрабатывать отказ.',
      'Путать Promise.any с Promise.all: any игнорирует отказы, all — нет.',
    ],
    codeExample: `const [first] = await Promise.race([fetchData(), timeout(1000)]);
const settled = await Promise.allSettled([fetchData(), fetchData()]);
// settled: [{ status, value | reason }, ...]`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Держите в голове таблицу: all — все успехи, allSettled — все результаты, race — первый любой, any — первый успех. Добавьте, что отмены промисов не существует.',
    hint: 'Сравните поведение при отказе одного из участников — это и разделяет комбинаторы.',
    summary:
      'all падает при первой ошибке, allSettled собирает все статусы, race отдаёт первый завершившийся, any — первый успешный и AggregateError при полном провале.',
    tags: ['promises', 'promise-allsettled', 'promise-any'],
  },
  {
    id: 'js-052',
    category: 'javascript',
    topic: 'Event Loop и асинхронность',
    difficulty: 'middle',
    type: 'scenario',
    question:
      'При клике на кнопку запускается синхронная функция, которая обрабатывает 50 000 строк и занимает около 1 200 мс. Всё это время ввод и анимации не работают. Нужно сохранить отзывчивый интерфейс, оставив вычисление в главном потоке. Какой вариант лучший?',
    options: [
      {
        id: 'a',
        text: 'Разбить обработку на порции и между ними возвращать управление Event Loop, например через await new Promise((resolve) => setTimeout(resolve, 0)), чтобы браузер успевал отрисовать кадр и обработать ввод.',
        explanation:
          'Верно: длинную задачу нужно разрезать на короткие макрозадачи; между ними браузер получает шанс отрисовать кадр и обработать пользовательские события.',
      },
      {
        id: 'b',
        text: 'Обернуть всю обработку в Promise.resolve().then(processRows), чтобы она стала асинхронной и перестала блокировать интерфейс.',
        explanation:
          'Неверно: микрозадача выполняется в том же проходе Event Loop до рендера, поэтому 1 200 мс блокировки просто переедут в очередь микрозадач.',
      },
      {
        id: 'c',
        text: 'Перенести весь расчёт в setTimeout(processRows, 0): код станет асинхронным и перестанет блокировать интерфейс.',
        explanation:
          'Неверно: работа останется одной длинной задачей — интерфейс лишь заблокируется чуть позже, но на те же 1 200 мс.',
      },
      {
        id: 'd',
        text: 'Обернуть расчёт в async-функцию и дождаться её результата через await — этого достаточно, чтобы не блокировать главный поток.',
        explanation:
          'Неверно: async-функция без точек реального выхода синхронна от начала до конца, await сам по себе не создаёт паузу для рендера.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Отрисовка и обработка ввода происходят в том же главном потоке, поэтому любая задача длиннее кадра (~16 мс) ощущается как подвисание. Единственный способ остаться отзывчивым, не уходя в Web Worker, — нарезать работу на порции и между ними отдавать управление: await new Promise((resolve) => setTimeout(resolve, 0)) ставит продолжение в очередь макрозадач, и перед ней браузер успевает выполнить рендер и обработать накопленные события. Микрозадачи (Promise.resolve().then, queueMicrotask) для этого не годятся: Event Loop опустошает их полностью до рендера, поэтому цикл из микрозадач блокирует экран так же, как синхронный код. Перенос всего расчёта в один setTimeout меняет только момент старта. Дополнительные варианты: тяжёлую часть вынести в Web Worker, использовать scheduler.yield() или requestIdleCallback для фоновых порций — но базовый приём остаётся тем же: короткие задачи плюс уступка управления.',
    commonMistakes: [
      'Считать, что обёртка в промис или async-функция сама по себе снимает блокировку главного потока.',
      'Использовать queueMicrotask или цепочку .then как «уступку» — микрозадачи не дают браузеру отрисовать кадр.',
      'Дробить работу на порции, которые всё равно длиннее кадра, и удивляться, что интерфейс дёргается.',
    ],
    codeExample: `async function processInChunks(items, chunkSize = 500) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(heavyWork);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Назовите бюджет кадра (~16 мс) и объясните, что уступать управление нужно макрозадачей, а не микрозадачей. Упомяните Web Worker как варианта «убрать работу из главного потока».',
    hint: 'Подумайте, что именно браузер не успевает сделать, пока выполняется одна длинная задача.',
    summary:
      'Долгую синхронную работу дробят на порции и уступают управление макрозадачей, чтобы между ними прошёл рендер; микрозадачи и обёртка в промис не помогают.',
    tags: ['event-loop', 'performance', 'responsiveness'],
  },
  {
    id: 'js-053',
    category: 'javascript',
    topic: 'Итераторы и генераторы',
    difficulty: 'middle',
    type: 'code-output',
    question: 'Что выведет этот код? Перечислите четыре строки в порядке вывода.',
    code: `function* ids() {
  yield 1;
  yield 2;
  return 99;
}

const iterator = ids();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '{ value: 1, done: false }, { value: 2, done: false }, { value: 99, done: true }, { value: undefined, done: true }',
        explanation:
          'Верно: return внутри генератора завершает его и отдаёт значение 99 с done: true, а последующие вызовы next() возвращают { value: undefined, done: true }.',
      },
      {
        id: 'b',
        text: '{ value: 1, done: false }, { value: 2, done: false }, { value: 99, done: false }, { value: undefined, done: true }',
        explanation:
          'Неверно: return не может отдать значение с done: false — значение из return всегда приходит вместе с завершением генератора.',
      },
      {
        id: 'c',
        text: '{ value: 1, done: false }, { value: 2, done: false }, { value: undefined, done: true }, { value: undefined, done: true }',
        explanation:
          'Неверно: значение из return попадает в поле value третьего результата — генератор возвращает его, а не отбрасывает.',
      },
      {
        id: 'd',
        text: '{ value: 1, done: false }, { value: 2, done: false }, { value: 99, done: true }, TypeError: генератор уже завершён',
        explanation:
          'Неверно: повторный next() у завершённого генератора не бросает исключение, а стабильно возвращает { value: undefined, done: true }.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Генератор — это фабрика итераторов: вызов ids() не выполняет тело, а создаёт объект с методом next(). Первый next() запускает тело до yield 1 и возвращает { value: 1, done: false }, второй продолжает с того же места и возвращает { value: 2, done: false }. Третий next() выполняет return 99: генератор завершается, значение попадает в поле value вместе с done: true. Четвёртый и все последующие вызовы возвращают { value: undefined, done: true } — это не ошибка, а штатное состояние «итератор исчерпан». Практическая деталь: for...of перебирает только значения с done: false, поэтому 99 в цикл не попадёт, и это частая причина потерянных данных, когда return используют вместо последнего yield. Если нужно отдать и это значение, используйте yield 99 либо соберите результат вручную через next(), как в примере.',
    commonMistakes: [
      'Ожидать, что значение из return будет выдано как обычный элемент перебора через for...of.',
      'Считать, что повторный next() после завершения бросает TypeError.',
      'Путать done: true с ошибкой генератора и оборачивать последний next() в try/catch.',
    ],
    codeExample: `function* take(iterable, limit) {
  let count = 0;
  for (const value of iterable) {
    if (count >= limit) return;
    count += 1;
    yield value;
  }
}
console.log([...take([1, 2, 3, 4], 2)]); // [1, 2]`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Опишите протокол итератора: next() возвращает { value, done }, значение из return приходит с done: true и не участвует в for...of. Это же объясняет, почему генератор нельзя перезапустить.',
    hint: 'Проследите, что именно делает return внутри генератора и что происходит после его завершения.',
    summary:
      'return внутри генератора отдаёт { value, done: true }, а последующие next() возвращают { value: undefined, done: true }; for...of такие значения пропускает.',
    tags: ['generators', 'iterators', 'return'],
  },
  {
    id: 'js-054',
    category: 'javascript',
    topic: 'Итераторы и генераторы',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question: 'Что обязательно должен предоставить объект, чтобы его можно было перебрать через for...of?',
    options: [
      {
        id: 'a',
        text: 'Метод с ключом Symbol.iterator, который возвращает итератор — объект с методом next(), возвращающим { value, done }.',
        explanation:
          'Верно: это протокол итерируемости. for...of вызывает Symbol.iterator, получает итератор и дёргает next() до done: true.',
      },
      {
        id: 'b',
        text: 'Метод с ключом Symbol.asyncIterator, возвращающий промис с очередным значением.',
        explanation:
          'Неверно: Symbol.asyncIterator — протокол для for await...of, обычный for...of его не использует.',
      },
      {
        id: 'c',
        text: 'Быть массивом, строкой или другим встроенным перебираемым типом — пользовательские объекты перебирать нельзя.',
        explanation:
          'Неверно: итерируемость определяется наличием Symbol.iterator, поэтому обычный объект со своим итератором отлично работает в for...of.',
      },
      {
        id: 'd',
        text: 'Свойство length и числовые индексы — for...of работает с любым array-like объектом.',
        explanation:
          'Неверно: array-like без Symbol.iterator не итерируем; for...of бросает TypeError, даже если length и индексы на месте.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'for...of не смотрит на тип значения, он использует протокол итерируемости: вызывает метод объекта по ключу Symbol.iterator, ожидает от него итератор, а затем на каждой итерации вызывает next(). Цикл продолжается, пока в результате next() поле done не станет true, а в тело цикла попадает value. Поэтому массив, строка, Map, Set, NodeList и типизированные массивы итерируемы — у них этот метод встроен, — а обычный объект без метода нет (его перебирают через for...of Object.entries(obj)). Важное требование: метод Symbol.iterator должен возвращать новый итератор при каждом вызове, иначе второй проход по тому же объекту окажется пустым. Генераторы удобны тем, что сами возвращают итератор и одновременно являются итерируемыми.',
    commonMistakes: [
      'Считать, что свойств length и числовых индексов достаточно для for...of, и получать TypeError.',
      'Возвращать из Symbol.iterator сам объект, а не итератор, и ломать протокол.',
      'Путать Symbol.iterator с Symbol.asyncIterator и использовать for...of для асинхронного источника.',
    ],
    codeExample: `const box = {
  value: 7,
  *[Symbol.iterator]() {
    yield this.value;
  },
};
console.log([...box]); // [7]`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Назовите два уровня протокола: итерируемый объект (Symbol.iterator) и итератор (next). Упомяните, что generator-функция закрывает оба уровня сразу.',
    hint: 'Речь о специальном символе-ключе метода, а не о структуре данных.',
    summary:
      'Объект итерируем, если у него есть метод Symbol.iterator, возвращающий итератор с next(); for...of работает именно через этот протокол.',
    tags: ['iterators', 'symbol-iterator', 'for-of'],
  },
  {
    id: 'js-055',
    category: 'javascript',
    topic: 'Память и производительность',
    difficulty: 'middle',
    type: 'code-completion',
    question:
      'В реализации debounce пропущена одна строка, поэтому обработчик срабатывает на каждое событие, а не только после паузы. Впишите выражение, которое отменяет ранее запланированный таймер.',
    code: `function debounce(fn, delay) {
  let timerId = null;

  return function debounced(...args) {
    // пропуск: отменить предыдущий запланированный вызов
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
    codeLanguage: 'javascript',
    completion: {
      acceptedAnswers: ['clearTimeout(timerId)', 'clearTimeout(timerId);'],
      placeholder: 'Введите вызов',
      inputHint: 'Например: имяФункции(переменная)',
      caseSensitive: false,
      ignoreWhitespace: true,
    },
    correctAnswers: ['clearTimeout(timerId)'],
    explanation:
      'Нужен вызов clearTimeout(timerId) перед планированием нового таймера. Без него каждый вызов debounced создаёт ещё один таймер, и все они срабатывают: обработчик выполняется столько раз, сколько было событий, а очередь таймеров и замыкания с аргументами живут до срабатывания — это и лишняя работа, и лишнее удержание памяти. С clearTimeout предыдущий таймер отменяется, и остаётся только последний, поэтому fn вызывается один раз через delay после последнего события. Первый вызов безопасен: timerId равен null, а clearTimeout(null) по спецификации ничего не делает и не бросает исключение. Дальше достаточно помнить, что debounce откладывает работу до паузы, а throttle ограничивает частоту вызовов; для отмены отложенного вызова в продакшене в возвращаемую функцию добавляют метод cancel, который тоже вызывает clearTimeout(timerId) и обнуляет идентификатор.',
    commonMistakes: [
      'Ожидать, что debounce вызовет обработчик сразу и затем ещё раз после паузы: по умолчанию у debounce только trailing-вызов.',
      'Забывать про отмену и получать «дребезг»: обработчик вызывается на каждое событие, просто с задержкой.',
      'Пытаться отменить таймер по ссылке на функцию вместо идентификатора, возвращённого setTimeout.',
    ],
    codeExample: `function throttle(fn, limit) {
  let inThrottle = false;

  return function throttled(...args) {
    if (inThrottle) return;
    inThrottle = true;
    fn.apply(this, args);
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
}`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Объясните разницу debounce и throttle на одном примере (поиск при вводе против скролла) и покажите, что отмена предыдущего таймера — суть debounce.',
    hint: 'Таймер уже запланирован, его нужно снять до постановки нового.',
    summary:
      'debounce требует отмены предыдущего таймера через clearTimeout, иначе сработают все запланированные вызовы; clearTimeout(null) безопасен.',
    tags: ['debounce', 'performance', 'timers'],
  },
  {
    id: 'js-056',
    category: 'javascript',
    topic: 'Память и производительность',
    difficulty: 'middle',
    type: 'find-bug',
    question:
      'Функция subscribe возвращает unsubscribe, но после её вызова listenerCount не уменьшается и обработчик продолжает вызываться. Где ошибка?',
    code: `import { EventEmitter } from 'node:events';

const bus = new EventEmitter();

function subscribe(onMessage) {
  const handler = (payload) => onMessage(payload);

  bus.on('message', handler);

  return function unsubscribe() {
    bus.off('message', onMessage);
  };
}`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: 'В unsubscribe отписываются от onMessage, а подписывались на handler: emitter сравнивает ссылки на функции и не находит совпадения, поэтому слушатель остаётся и удерживает замыкание.',
        explanation:
          'Верно: on и off сопоставляют конкретную ссылку на функцию. handler — другая функция, поэтому off ничего не удаляет, а слушатель продолжает жить вместе с захваченным onMessage.',
      },
      {
        id: 'b',
        text: 'Нужно вызывать bus.removeAllListeners("message"), потому что off не работает для стрелочных функций.',
        explanation:
          'Неверно: off корректно удаляет стрелочные функции — важно лишь передать ту же самую ссылку. removeAllListeners снесли бы и чужие подписки.',
      },
      {
        id: 'c',
        text: 'Проблема в том, что handler объявлен через const: функцию из const нельзя передать в off.',
        explanation:
          'Неверно: const ограничивает переприсваивание переменной, а не использование значения; ссылку на handler можно передавать куда угодно.',
      },
      {
        id: 'd',
        text: 'Перед отпиской нужно вызвать bus.emit("message"), чтобы emitter обновил внутренний список слушателей.',
        explanation:
          'Неверно: emit только вызывает слушателей и никак не связан с удалением подписки — список обновляется самим off.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'EventEmitter хранит слушателей массивом ссылок и при off ищет точное совпадение переданной функции. В subscribe подписались на handler, а в unsubscribe передают onMessage — другую функцию, поэтому поиск не даёт результата: подписка остаётся, listenerCount растёт с каждым вызовом subscribe, а emitter продолжает удерживать handler, который через замыкание держит onMessage и все захваченные им данные. Это классическая утечка: источник живёт дольше подписчика (например, глобальная шина или window), и без корректной отписки подписчик не может быть собран. Исправление — передавать в off ту же ссылку: bus.off("message", handler). Дополнительно помогает { once: true } для одноразовых подписок и AbortController с signal — тогда отписка происходит автоматически при abort().',
    commonMistakes: [
      'Считать, что off сравнивает функции по содержимому, а не по ссылке.',
      'Отписываться «похожей» функцией, созданной заново в обработчике.',
      'Лечить утечку через removeAllListeners и заодно ломать подписки других модулей.',
    ],
    codeExample: `function subscribe(target, onMessage) {
  const handler = (payload) => onMessage(payload);
  target.on('message', handler);

  return () => {
    target.off('message', handler);
  };
}`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Проговорите правило идентичности ссылок: подписались на X — отписывайтесь от X. Затем объясните, как подписка удерживает объекты через замыкание и почему источник жизни важнее.',
    hint: 'Сравните, какая именно функция была передана в on и какая — в off.',
    summary:
      'EventEmitter удаляет слушателя только по той же ссылке, что была при подписке; off с другой функцией оставляет подписку и утечку.',
    tags: ['debug', 'memory-leaks', 'event-emitter'],
  },
  {
    id: 'js-057',
    category: 'javascript',
    topic: 'Обработка ошибок',
    difficulty: 'junior-plus',
    type: 'multiple-choice',
    question: 'Выберите все верные варианты утверждений о try/catch в синхронном и асинхронном коде.',
    code: `try {
  // проверяемый код
} catch (error) {
  console.log('caught', error);
}`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: 'Выражение throw new Error("x") внутри try будет перехвачено этим catch.',
        explanation:
          'Верно: throw внутри блока try передаёт управление в его catch без поиска обработчика выше по стеку.',
      },
      {
        id: 'b',
        text: 'Вызов JSON.parse("{bad") внутри try выбросит SyntaxError, и его перехватит этот catch.',
        explanation:
          'Верно: JSON.parse синхронен и бросает SyntaxError при некорректном JSON, поэтому ошибка попадает в тот же try/catch.',
      },
      {
        id: 'c',
        text: 'Ошибка, выброшенная внутри setTimeout(() => { throw new Error("x"); }, 0), запланированного в try, не будет перехвачена этим catch.',
        explanation:
          'Верно: колбэк выполняется в отдельной задаче, когда блок try уже завершён, поэтому локальный catch к этому моменту не активен.',
      },
      {
        id: 'd',
        text: 'Отклонение промиса, который не ожидали через await, будет перехвачено синхронным catch этого try.',
        explanation:
          'Неверно: отклонение происходит асинхронно, уже после выхода из try, и проявится как unhandledrejection, а не как пойманное исключение.',
      },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation:
      'try/catch работает только с ошибками, которые произошли синхронно внутри блока или в await-выражении внутри него. throw new Error("x") и JSON.parse("{bad") дают ровно такой случай: исключение разворачивает стек до ближайшего активного catch. А вот колбэк setTimeout выполняется позже, в отдельной макрозадаче, когда блок try давно завершён и его catch уже не в стеке — ошибка уйдёт в глобальный обработчик (window.onerror в браузере, uncaughtException в Node.js). То же с промисами: отклонение без await не превращается в синхронное исключение, оно станет unhandledrejection и уронит процесс в Node.js 15+. Поэтому асинхронный код оборачивают в try/catch вокруг await либо используют .catch и process.on("unhandledRejection") как последнюю линию обороны.',
    commonMistakes: [
      'Ждать, что try/catch поймает ошибку из setTimeout или event-обработчика.',
      'Считать, что обёрнутый в try вызов, создающий промис, поймает его отклонение без await.',
      'Ловить ошибки только в глобальном обработчике и терять контекст места сбоя.',
    ],
    codeExample: `try {
  await fetchUser();
} catch (error) {
  console.log('caught', error);
}`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Сформулируйте границу: catch ловит только синхронный путь. Дальше назовите три способа работы с асинхронными ошибками — await в try, .catch и глобальные обработчики.',
    hint: 'Подумайте, существует ли блок try к моменту, когда сработает отложенный колбэк.',
    summary:
      'try/catch перехватывает синхронные исключения и ошибки awaited-промисов, но не ошибки из setTimeout и не отклонения необработанных промисов.',
    tags: ['error-handling', 'try-catch', 'async-errors'],
  },
  {
    id: 'js-058',
    category: 'javascript',
    topic: 'Модули и функциональный стиль',
    difficulty: 'middle',
    type: 'scenario',
    question:
      'В проекте api.ts импортирует getToken из auth.ts, а auth.ts импортирует createClient из api.ts. На старте приложение падает с ошибкой «Cannot access \'createClient\' before initialization». Какой шаг правильнее всего устраняет причину?',
    options: [
      {
        id: 'a',
        text: 'Вынести общий http-клиент и хранилище токена в отдельные модули без обратных зависимостей, чтобы граф модулей стал ациклическим.',
        explanation:
          'Верно: цикл — это архитектурная проблема слоёв; разрыв цикла через независимый модуль устраняет и TDZ-ошибку, и скрытые побочные эффекты порядка инициализации.',
      },
      {
        id: 'b',
        text: 'Переставить импорт в auth.ts ниже кода, который использует createClient: тогда модуль успеет инициализироваться.',
        explanation:
          'Неверно: статические import поднимаются в начало модуля и вычисляются до его тела, поэтому порядок строк в файле ничего не меняет.',
      },
      {
        id: 'c',
        text: 'Обернуть вызов createClient в setTimeout(createClient, 0), чтобы модули успели инициализироваться.',
        explanation:
          'Неверно: это лишь откладывает обращение к уже сломанной привязке; цикл остаётся, а ошибка может проявиться позже и в другом месте.',
      },
      {
        id: 'd',
        text: 'Переписать импорт через require(), потому что CommonJS загружает модули лениво и цикл исчезнет.',
        explanation:
          'Неверно: в ESM-модуле require не определён, а переход на CommonJS не убирает цикл — он лишь меняет момент получения частичного экспорта.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'ES-модули вычисляются по графу зависимостей: сначала зависимости, потом импортирующий модуль, а сами import поднимаются и выполняются до тела файла. При цикле api.ts ↔ auth.ts один из модулей начинает работу, пока второй ещё не дошёл до объявления createClient. Для let, const и class это даёт TDZ и ошибку «Cannot access before initialization», для function declaration — тихое undefined, что ещё опаснее. Порядок строк в файле и setTimeout не помогают: привязка либо уже инициализирована, либо нет. Правильное лечение — разорвать цикл архитектурно: вынести общий код (http-клиент, хранилище токена) в третий модуль, от которого зависят оба, или инвертировать зависимость — передавать клиент в auth.ts параметром. Тогда граф остаётся ациклическим, а порядок инициализации перестаёт влиять на поведение.',
    commonMistakes: [
      'Лечить цикл перестановкой строк import, не зная, что импорты поднимаются.',
      'Прятать проблему в setTimeout или динамический import вместо разрыва зависимости.',
      'Считать, что функция всегда доступна, потому что function declaration поднимается, и получать undefined вместо ошибки.',
    ],
    codeExample: `// api.js: клиент создаётся здесь и передаётся зависимому модулю снаружи,
// поэтому auth.js больше ничего не импортирует из api.js и цикл исчезает
import { createAuth } from './auth.js';

const client = { request: (path) => fetch(path) };

export const auth = createAuth(client);
export { client };`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Объясните, что цикл модулей — это запах архитектуры, а не синтаксиса. Покажите два приёма: вынести общий модуль и инвертировать зависимость через параметр.',
    hint: 'Подумайте, почему порядок строк не влияет на результат и к чему приводит взаимная зависимость модулей.',
    summary:
      'Циклический импорт даёт TDZ-ошибку или undefined; лечится разрывом цикла — общим модулем или инверсией зависимости, а не перестановкой импортов.',
    tags: ['modules', 'circular-deps', 'architecture'],
  },
  {
    id: 'js-059',
    category: 'javascript',
    topic: 'Модули и функциональный стиль',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question:
      'counter.js экспортирует let count = 0 и функцию increment(), которая увеличивает count. main.js делает import { count, increment } from "./counter.js" и затем вызывает increment(). Что покажет console.log(count) после вызова?',
    options: [
      {
        id: 'a',
        text: '1: импортированное имя — live binding, оно всегда отражает текущее значение переменной в модуле-источнике.',
        explanation:
          'Верно: ESM-импорт — это не копия значения, а живая привязка к переменной экспортирующего модуля, поэтому чтение даёт актуальное значение.',
      },
      {
        id: 'b',
        text: '0: импорт копирует значение на момент подключения модуля, как это происходило бы с CommonJS.',
        explanation:
          'Неверно: снимок значения — это поведение CommonJS. В ES-модулях привязка живая, и изменение в источнике видно импортёру.',
      },
      {
        id: 'c',
        text: 'TypeError: импортированную let-переменную нельзя читать после изменения в другом модуле.',
        explanation:
          'Неверно: читать live binding можно в любой момент; запрещено только присваивать импортированному имени новое значение.',
      },
      {
        id: 'd',
        text: 'ReferenceError: count нельзя импортировать напрямую, только через объект import * as counter.',
        explanation:
          'Неверно: именованный импорт let-переменной допустим; namespace-импорт — лишь альтернативный синтаксис доступа к тем же привязкам.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'ES-модули связывают импорт с переменной источника, а не копируют её значение: это live bindings. После increment() переменная count в counter.js стала равна 1, и импортированное имя при следующем чтении отдаёт именно 1. Привязка при этом доступна только на чтение: строка count = 5 в main.js — синтаксическая ошибка, потому что импортированные имена неизменяемы. Для сравнения, CommonJS делает снимок значения на момент require: деструктуризация const { count } = require("./counter") сохранит 0 навсегда, хотя обращение к свойству модуля (module.exports.count) увидит обновление. Отдельная тонкость: const { count } = namespaceObject тоже создаёт локальную копию на момент чтения, так что «живость» сохраняется только при обращении через имя импорта или через свойство namespace-объекта.',
    commonMistakes: [
      'Переносить в ESM модель CommonJS и ждать снимок значения.',
      'Пытаться присвоить импортированной переменной новое значение и получать SyntaxError.',
      'Считать, что деструктуризация namespace-объекта сохраняет live binding.',
    ],
    codeExample: `import { count, increment } from './counter.js';

const snapshot = count; // снимок значения на момент чтения

increment();
console.log(snapshot); // 0 — копия, взятая вручную
console.log(count); // 1 — живая привязка к переменной модуля`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Скажите прямо: ESM — live bindings, CommonJS — снимок. Добавьте, что импорт только для чтения, и это осознанное ограничение, а не баг.',
    hint: 'Сравните, что именно импортируется: значение или привязка к переменной.',
    summary:
      'Импорт ES-модуля — живая привязка: изменение переменной в источнике видно импортёру, но присваивать импортированному имени нельзя.',
    tags: ['modules', 'esm', 'live-bindings'],
  },
  {
    id: 'js-060',
    category: 'javascript',
    topic: 'Итераторы и генераторы',
    difficulty: 'middle',
    type: 'code-completion',
    question:
      'Дополните генератор letters так, чтобы между "a" и "z" он отдавал все значения генератора numbers() по порядку. Впишите одну строку — выражение делегирования.',
    code: `function* numbers() {
  yield 1;
  yield 2;
}

function* letters() {
  yield 'a';
  // пропуск: передать управление генератору numbers()
  yield 'z';
}

console.log([...letters()]);`,
    codeLanguage: 'javascript',
    completion: {
      acceptedAnswers: ['yield* numbers();', 'yield* numbers()', 'yield * numbers();', 'yield * numbers()'],
      placeholder: 'Введите строку',
      inputHint: 'Например: yield ... generator()',
      caseSensitive: false,
      ignoreWhitespace: true,
    },
    correctAnswers: ['yield* numbers();'],
    explanation:
      'Нужна строка yield* numbers(); — это делегирование: текущий генератор передаёт управление внутреннему итератору и пробрасывает ему next(), throw() и return(), а полученные значения отдаёт наружу как свои собственные. Поэтому [...letters()] вернёт ["a", 1, 2, "z"]: сначала внешний yield "a", затем два значения из numbers(), затем "z". Делегирование завершается, когда внутренний итератор отдаёт done: true, после чего выполнение продолжается со следующей строки внешнего генератора. Альтернатива без делегирования — for (const value of numbers()) { yield value; } — даёт тот же поток значений, но не пробрасывает return() и throw() внутрь, поэтому при досрочном выходе из цикла внутренний генератор не получит сигнал на очистку. Если бы numbers() был async-генератором, делегировать его через yield* из синхронного генератора было бы нельзя: понадобилась бы async function* и for await...of.',
    commonMistakes: [
      'Писать yield numbers() и получать в массиве сам объект-генератор вместо значений.',
      'Пытаться делегировать async-генератор через yield* из синхронного генератора и получать TypeError.',
      'Считать, что yield* копирует значения, и ожидать независимый проход по внутреннему генератору.',
    ],
    codeExample: `function* inner() {
  yield 1;
  return 'done';
}
function* outer() {
  const result = yield* inner();
  console.log('inner finished:', result);
}
console.log([...outer()]); // [1], затем 'inner finished: done'`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Объясните, что yield* — это делегирование протокола, а не копирование значений, и что возвращаемое значение внутреннего генератора становится результатом выражения yield*.',
    hint: 'В языке есть оператор, который передаёт управление другому итератору целиком.',
    summary:
      'yield* передаёт управление другому итератору и пробрасывает значения и завершение; [...letters()] даст ["a", 1, 2, "z"].',
    tags: ['generators', 'yield-delegation', 'iterators'],
  },
  {
    id: 'js-061',
    category: 'javascript',
    topic: 'Обработка ошибок',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question:
      'Что вернёт вызов test() и почему именно это значение, а не то, что указано в try?',
    code: `function test() {
  try {
    return 'try';
  } finally {
    return 'finally';
  }
}`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: '"finally": return в finally выполняется после вычисления return из try и заменяет возвращаемое значение.',
        explanation:
          'Верно: блок finally выполняется до фактического выхода из функции, и собственный return в нём перекрывает уже подготовленное значение из try.',
      },
      {
        id: 'b',
        text: '"try": finally не может повлиять на возвращаемое значение, он только для очистки ресурсов.',
        explanation:
          'Неверно: return внутри finally не только допустим, но и перекрывает return из try — именно поэтому такой код считается опасным.',
      },
      {
        id: 'c',
        text: 'Массив ["try", "finally"]: функция вернёт оба значения по порядку.',
        explanation:
          'Неверно: функция возвращает ровно одно значение; второй return не добавляет элемент, а заменяет результат.',
      },
      {
        id: 'd',
        text: 'SyntaxError: return нельзя использовать внутри finally.',
        explanation:
          'Неверно: синтаксис допустим, ошибка здесь логическая, а не синтаксическая — код выполнится, но вернёт неожиданное значение.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Порядок такой: выражение "try" вычисляется, но фактический выход из функции откладывается — управление обязано пройти через finally. В finally срабатывает второй return "finally", и именно он становится результатом функции; первый return теряется. Тот же механизм работает и с исключениями: return или throw внутри finally подавляет исключение из try, из-за чего ошибка молча исчезает — это одна из самых коварных ловушек языка. Правило: finally предназначен для освобождения ресурсов (закрыть соединение, снять блокировку), а return и throw там лучше не писать; ESLint-правило no-unsafe-finally ловит именно это. Если нужно вернуть значение из try, оставьте finally без return — блок выполнится, а возврат придёт из try.',
    commonMistakes: [
      'Считать, что finally только для очистки и не может изменить результат функции.',
      'Не замечать, что return в finally проглатывает исключение из try.',
      'Ожидать выполнения обоих return и получения массива значений.',
    ],
    codeExample: `function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  } finally {
    console.log('parse finished');
  }
}`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Расскажите про гарантированное выполнение finally и про его право перекрыть return или проглотить исключение. Добавьте, чем это опасно в реальном коде.',
    hint: 'Проследите, какой return выполнится последним перед реальным выходом из функции.',
    summary:
      'finally выполняется всегда и перед фактическим выходом; return из finally перекрывает результат try и может проглотить исключение.',
    tags: ['error-handling', 'finally', 'control-flow'],
  },
  {
    id: 'js-062',
    category: 'javascript',
    topic: 'Память и производительность',
    difficulty: 'middle',
    type: 'multiple-choice',
    question:
      'Выберите все верные варианты утверждений о сборке мусора и структурах данных в JavaScript.',
    options: [
      {
        id: 'a',
        text: 'WeakMap не удерживает ключи: если на объект-ключ больше нет других ссылок, запись может быть удалена сборщиком.',
        explanation:
          'Верно: ключи WeakMap — слабые ссылки, поэтому кэш на WeakMap не мешает собрать объекты, на которые больше никто не ссылается.',
      },
      {
        id: 'b',
        text: 'Map-кэш, растущий без ограничения, удерживает и ключи, и значения, поэтому долгоживущий кэш нужно ограничивать по размеру или времени жизни.',
        explanation:
          'Верно: обычный Map держит сильные ссылки на ключи и значения, поэтому неограниченный кэш превращается в утечку.',
      },
      {
        id: 'c',
        text: 'Замыкание удерживает захваченные переменные, только пока на саму функцию есть ссылки; когда ссылок не остаётся, и функция, и данные становятся доступны сборщику.',
        explanation:
          'Верно: замыкание — это функция плюс её окружение; пока функция достижима, достижимо и окружение, а вместе с ней уходят и данные.',
      },
      {
        id: 'd',
        text: 'WeakRef гарантирует, что объект не будет собран, пока на него существует WeakRef.',
        explanation:
          'Неверно: WeakRef намеренно не препятствует сборке; deref() может вернуть undefined, если объект уже собран.',
      },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation:
      'Сборщик мусора в JS освобождает то, что стало недостижимым от корней (глобальный объект, стек, активные замыкания), поэтому «утечка» — это всегда лишняя достижимость. WeakMap и WeakSet держат ключи слабо: наличие записи не делает ключ достижимым, поэтому они годятся для кэшей и метаданных, привязанных к объектам. Обычный Map, наоборот, держит и ключи, и значения сильно — неограниченный кэш в долгоживущем модуле растёт вместе с числом уникальных ключей и не освобождается, поэтому ему нужен лимит или TTL. Замыкание удерживает переменные ровно до тех пор, пока достижима сама функция: убрали ссылку на обработчик — уйдёт и его окружение. WeakRef и FinalizationRegistry — инструменты продвинутые и недетерминированные: WeakRef не удерживает объект, а момент сборки не гарантирован, поэтому полагаться на них в бизнес-логике нельзя.',
    commonMistakes: [
      'Использовать Map как кэш для сущностей и хранить его вечно.',
      'Верить, что WeakRef удерживает объект живым, и строить на этом логику.',
      'Считать, что замыкание держит данные, даже когда ссылок на функцию уже нет.',
    ],
    codeExample: `const cache = new WeakMap();

function metaFor(node) {
  if (!cache.has(node)) {
    cache.set(node, { createdAt: Date.now() });
  }
  return cache.get(node);
}`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Объясните достижимость как единственный критерий, затем сравните Map и WeakMap и добавьте, что замыкание — тоже ссылка, просто невидимая.',
    hint: 'Проверяйте каждое утверждение вопросом: удерживает ли структура объект от сборки.',
    summary:
      'GC освобождает недостижимое; WeakMap/WeakSet и WeakRef не удерживают объекты, а сильные ссылки в Map, замыканиях и подписках — удерживают.',
    tags: ['memory', 'garbage-collection', 'weakmap'],
  },
  {
    id: 'js-063',
    category: 'javascript',
    topic: 'Promise и async/await',
    difficulty: 'junior',
    type: 'single-choice',
    question: 'Что возвращает вызов async-функции, внутри которой нет ни одного await?',
    options: [
      {
        id: 'a',
        text: 'Promise, который резолвится значением из return (или undefined), а при выброшенном исключении отклоняется с этой ошибкой.',
        explanation:
          'Верно: async-функция всегда возвращает промис; return задаёт значение, throw превращается в отклонение.',
      },
      {
        id: 'b',
        text: 'Значение из return напрямую — функция становится асинхронной только при наличии await.',
        explanation:
          'Неверно: async меняет контракт возврата независимо от тела функции, await на это не влияет.',
      },
      {
        id: 'c',
        text: 'undefined, пока внутри функции не выполнится хотя бы один await.',
        explanation:
          'Неверно: вызов сразу возвращает промис, а его состояние зависит от выполнения тела, а не от наличия await.',
      },
      {
        id: 'd',
        text: 'Объект вида { value, done } — итератор по результату функции.',
        explanation:
          'Неверно: { value, done } — результат next() итератора; async-функция возвращает промис.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'async-функция всегда возвращает промис, даже если внутри нет ни одного await. Тело при вызове начинает выполняться синхронно; когда оно доходит до return, возвращённое значение становится значением промиса, а отсутствие return даёт промис с undefined. Если тело выбрасывает исключение, промис отклоняется с этой ошибкой — поэтому try/catch снаружи без await её не поймает. Если вернуть промис или thenable, он будет «усыновлён»: результирующий промис повторит его состояние, а не обернёт его в значение. Практический вывод: вызывающий код обязан обработать промис через await, .then или .catch; вызов async-функции без ожидания — это типичный источник unhandledrejection, особенно в обработчиках событий и конструкторах.',
    commonMistakes: [
      'Ждать синхронного значения от async-функции и получать промис.',
      'Забывать await или .catch и получать unhandledrejection.',
      'Считать, что исключение внутри async-функции до вызова await поймает внешний try/catch.',
    ],
    codeExample: `async function value() {
  return 42;
}
value(); // Promise { 42 }
value().then(console.log); // 42`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Одна фраза: async — это синтаксический сахар, который всегда возвращает промис и превращает throw в отклонение. Дальше можно говорить про усыновление и обработку ошибок.',
    hint: 'Подумайте, что происходит с return и throw внутри такой функции.',
    summary:
      'async-функция всегда возвращает промис: return задаёт значение, throw — причину отклонения, а отсутствие return даёт undefined.',
    tags: ['async-await', 'promises', 'return'],
  },
  {
    id: 'js-064',
    category: 'javascript',
    topic: 'Promise и async/await',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Что выведет этот код в Node.js 20+?',
    code: `async function get() {
  return Promise.resolve(42);
}

get().then((value) => console.log(typeof value, value));`,
    codeLanguage: 'javascript',
    options: [
      {
        id: 'a',
        text: 'number 42: промис, возвращённый из async-функции, усыновляется, и результирующий промис резолвится его значением.',
        explanation:
          'Верно: алгоритм резолва промиса распаковывает вложенный промис, поэтому наружу приходит уже 42, а не промис.',
      },
      {
        id: 'b',
        text: 'object Promise: значение return попадает в результат как есть, без распаковки.',
        explanation:
          'Неверно: промисы не вкладываются друг в друга — резолв промисом запускает процедуру усыновления его состояния.',
      },
      {
        id: 'c',
        text: 'object 42: typeof всегда даёт "object" для значений, полученных из промиса.',
        explanation:
          'Неверно: typeof возвращает тип фактического значения, а 42 — число, поэтому "number".',
      },
      {
        id: 'd',
        text: 'TypeError: из async-функции нельзя возвращать промис.',
        explanation:
          'Неверно: возвращать промис из async-функции можно и нужно — это стандартный способ вернуть результат другого асинхронного вызова.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Когда колбэк обрабатывает промис, спецификация выполняет процедуру resolution: если значение — промис или thenable, его состояние «усыновляется» и наружу пробрасывается уже финальное значение. async-функция возвращает промис самостоятельно, поэтому return Promise.resolve(42) даёт промис, который резолвится числом 42, а не промисом. В колбэк .then попадает именно 42, и typeof value — "number". Тот же эффект у .then, возвращающего промис, и у await: await распаковывает цепочку, поэтому await get() тоже даст 42. Следствие: лишний уровень промиса не «ломает» типы, но каждая распаковка добавляет микрошаг — порядок относительно других then может отличаться от наивных ожиданий, хотя итоговое значение всегда развёрнутое. Ошибкой было бы считать, что async-функция оборачивает возвращённый промис в дополнительную обёртку.',
    commonMistakes: [
      'Ожидать, что из async-функции можно вернуть промис как значение и получить вложенную структуру.',
      'Забывать, что await и .then одинаково распаковывают вложенные промисы.',
      'Считать, что typeof для значения из промиса всегда "object".',
    ],
    codeExample: `Promise.resolve(1)
  .then((value) => Promise.resolve(value + 1))
  .then((value) => console.log(value)); // 2, а не Promise`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Назовите это «усыновлением» или resolution procedure: промис, возвращённый из then или async-функции, не вкладывается, а разворачивается. Это же объясняет, почему await работает рекурсивно.',
    hint: 'Вспомните, что происходит, когда .then возвращает промис.',
    summary:
      'Вложенный промис распаковывается: get() резолвится числом 42, поэтому в колбэк попадает number 42, а не объект промиса.',
    tags: ['promises', 'async-await', 'resolution'],
  },
  {
    id: 'js-065',
    category: 'javascript',
    topic: 'Модули и функциональный стиль',
    difficulty: 'middle',
    type: 'multiple-choice',
    question: 'Выберите все верные варианты утверждений об ES-модулях.',
    options: [
      {
        id: 'a',
        text: 'Модули всегда выполняются в строгом режиме, даже без директивы "use strict".',
        explanation:
          'Верно: strict mode — часть семантики модулей, поэтому неявные глобальные переменные и подобные поблажки в них недоступны.',
      },
      {
        id: 'b',
        text: 'Статические import поднимаются: зависимости вычисляются до тела импортирующего модуля, а имена доступны как live bindings.',
        explanation:
          'Верно: граф зависимостей вычисляется до выполнения тела, а импортированные имена — живые привязки, а не копии значений.',
      },
      {
        id: 'c',
        text: 'Динамический import() возвращает промис и позволяет загрузить модуль по требованию, в том числе условно.',
        explanation:
          'Верно: import() асинхронен, возвращает промис с namespace-объектом и может стоять внутри условий и функций.',
      },
      {
        id: 'd',
        text: 'Один и тот же модуль выполняется заново при каждом импорте, поэтому его побочные эффекты повторяются.',
        explanation:
          'Неверно: модуль вычисляется один раз, результат кэшируется, а повторные импорты получают уже готовые привязки.',
      },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation:
      'ES-модуль — это отдельная область видимости в strict mode, которая вычисляется один раз при первом импорте; результат кэшируется, поэтому побочные эффекты модуля не повторяются, сколько бы раз его ни импортировали. Статические import поднимаются и разрешаются до выполнения тела модуля: сначала вычисляются зависимости, затем сам модуль, а имена связываются как живые привязки только для чтения. Динамический import() — другой инструмент: он возвращает промис с namespace-объектом, работает внутри условий и функций и позволяет отложить загрузку (ленивые маршруты, тяжёлые редакторы). Он же остаётся единственным способом сослаться на модуль, путь которого вычисляется в рантайме. Отдельно стоит помнить, что из-за кэша модулей состояние в модульной переменной общее для всего приложения — это удобно для синглтонов и опасно для тестов.',
    commonMistakes: [
      'Ждать повторного выполнения модуля при повторном импорте и полагаться на это в тестах.',
      'Считать, что import() и статический import различаются только синтаксисом, а не моментом загрузки.',
      'Пытаться присвоить импортированной привязке новое значение и получать SyntaxError.',
    ],
    codeExample: `// ленивая загрузка по действию пользователя
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js');
  openEditor();
});`,
    codeExampleLanguage: 'javascript',
    interviewTip:
      'Разделите три темы: строгий режим, одноразовое вычисление с кэшем и live bindings. Затем добавьте динамический import() как инструмент ленивой загрузки.',
    hint: 'Обратите внимание, сколько раз вычисляется модуль и когда именно разрешаются статические импорты.',
    summary:
      'ES-модули строгие, вычисляются один раз и кэшируются, импорты поднимаются и дают живые привязки, а import() грузит модуль асинхронно по требованию.',
    tags: ['modules', 'esm', 'dynamic-import'],
  },
];
