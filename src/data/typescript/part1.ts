import type { Question } from '../../types';

export const typescriptPart1: Question[] = [
  {
    id: 'ts-001',
    category: 'typescript',
    topic: 'Вывод типов',
    difficulty: 'junior',
    type: 'single-choice',
    question: 'Какие типы TypeScript выведет для переменных first и second в этом коде?',
    code: `const first = 'ok';
let second = 'ok';`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'first: "ok", second: string',
        explanation:
          'Верно: const нельзя переприсвоить, поэтому компилятор сохраняет литеральный тип "ok"; let подразумевает будущие присваивания, поэтому литерал расширяется до string.',
      },
      {
        id: 'b',
        text: 'first: string, second: string',
        explanation:
          'Ошибочная модель: будто const тоже расширяет литерал до string. На самом деле расширение (widening) не применяется к const-переменной, потому что её значение гарантированно не изменится.',
      },
      {
        id: 'c',
        text: 'first: "ok", second: "ok"',
        explanation:
          'Ошибочная модель: будто let сохраняет литеральный тип. Тогда присваивание second = "error" стало бы ошибкой компиляции, и let вёл бы себя как const с точки зрения типа.',
      },
      {
        id: 'd',
        text: 'first: string, second: "ok"',
        explanation:
          'Перепутаны местами правила: именно const сохраняет литерал, а let его расширяет. Такой вывод получился бы, если считать, что всё наоборот.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: first имеет тип "ok", second — тип string. Для const TypeScript знает, что переменную нельзя переприсвоить, поэтому оставляет самый узкий литеральный тип "ok" — это безопасно, значение уже не изменится. Для let компилятор обязан учитывать будущие присваивания и расширяет (widening) литерал до string, иначе код let second = \'ok\'; second = \'error\'; перестал бы компилироваться. Важная граница: вывод работает на этапе компиляции и не влияет на рантайм — в JavaScript обе переменные хранят строку. Отдельно запомните, что для свойств объекта const литерал не сохраняет: const user = { role: \'admin\' } даёт role: string, потому что объект можно мутировать; для узкого типа там нужен as const или явная аннотация.',
    commonMistakes: [
      'Считать, что const всегда выводит литеральный тип, включая свойства объекта: для { role: "admin" } свойство расширяется до string.',
      'Думать, что let и const дают одинаковый тип, потому что в рантайме это одна и та же строка.',
      'Путать вывод типа с приведением: TypeScript не меняет значение, он лишь выбирает тип для проверки.',
    ],
    codeExample: `const fixed = 'ok';        // "ok"
let mutable = 'ok';       // string
const asString: string = fixed; // ок: "ok" — подтип string
const object = { role: 'admin' }; // role: string, литерал расширен`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Отвечайте через различие «может ли переменная быть переприсвоена»: const сохраняет литерал, let расширяет его до общего типа. Добавьте, что для свойств объекта const не помогает и нужен as const — это покажет понимание, а не заученный факт.',
    hint: 'Подумайте, что компилятор знает о будущих присваиваниях в каждом случае.',
    summary:
      'const сохраняет литеральный тип, let расширяет литерал до общего типа; свойства объекта расширяются даже при const.',
    tags: ['inference', 'literal-types', 'const'],
  },
  {
    id: 'ts-002',
    category: 'typescript',
    topic: 'any, unknown и never',
    difficulty: 'junior',
    type: 'single-choice',
    question:
      'Какой из двух вызовов — unsafe.trim() и safe.trim() — вызовет ошибку компиляции при strict: true и почему?',
    code: `let unsafe: any = 'text';
let safe: unknown = 'text';

unsafe.trim();
safe.trim();`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Только safe.trim(): unknown нельзя использовать без предварительного сужения, а any разрешает любые операции',
        explanation:
          'Верно: тип unknown — верхний тип, он принимает любое значение, но до проверки компилятор не знает, что у него есть метод trim; any отключает проверку и разрешает вызов.',
      },
      {
        id: 'b',
        text: 'Только unsafe.trim(): any запрещает вызов методов, а unknown разрешает',
        explanation:
          'Ошибочная модель: будто any — более строгий тип. Всё наоборот: any полностью отключает проверку, а unknown требует сужения перед использованием.',
      },
      {
        id: 'c',
        text: 'Оба вызова: any и unknown одинаково небезопасны и не позволяют вызвать trim',
        explanation:
          'Ошибочная модель: будто any и unknown синонимы. any совместим со всеми типами в обе стороны и не проверяется, а unknown — безопасная альтернатива, которая требует явной проверки.',
      },
      {
        id: 'd',
        text: 'Ни один: после let safe: unknown = "text" тип переменной сужается до string',
        explanation:
          'Ошибочная модель: будто инициализация сужает объявленный тип. Аннотация unknown сохраняется, поэтому safe.trim() по-прежнему недопустим, хотя текущее значение — строка.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: ошибку даёт только safe.trim(). any — это «выключенная» проверка типов: значение типа any можно присвоить куда угодно и вызвать у него любой метод, компилятор не возражает, поэтому unsafe.trim() проходит. unknown — верхний тип: в переменную unknown можно положить что угодно, но использовать значение можно только после сужения (typeof, in, instanceof, Array.isArray или собственный type guard). Иначе компилятор справедливо говорит: «safe имеет тип unknown», ведь реально там может оказаться null или объект без trim. Правило безопасности: any запрещают в коде и на границах (JSON.parse, ответы API) используют unknown, а затем валидируют. Важно, что разница существует только на этапе компиляции: в рантайме обе переменные содержат строку, и оба вызова сработали бы.',
    commonMistakes: [
      'Считать unknown и any взаимозаменяемыми: any не требует проверки, unknown требует.',
      'Думать, что unknown нельзя присвоить в переменную: принимать любое значение как раз можно, нельзя лишь использовать его без сужения.',
      'Полагать, что any безопаснее, потому что «компилятор не ругается»: молчание компилятора здесь означает отсутствие проверки.',
    ],
    codeExample: `function upper(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.toUpperCase(); // здесь value сужен до string
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Сформулируйте так: unknown — безопасный верхний тип с обязательным сужением, any — отключение проверок, которое распространяется на всё выражение. Упомяните, что на границах API правильнее unknown плюс валидация.',
    hint: 'Спросите себя, что компилятор знает о значении до проверки.',
    summary:
      'any отключает проверку типов, unknown принимает любое значение, но требует сужения перед использованием.',
    tags: ['any', 'unknown', 'strict'],
  },
  {
    id: 'ts-003',
    category: 'typescript',
    topic: 'type и interface',
    difficulty: 'junior',
    type: 'single-choice',
    question: 'В модуле дважды объявлен type-алиас с одним именем. Что произойдёт при компиляции?',
    code: `type User = { id: number };
type User = { name: string };`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Ошибка TS2300 Duplicate identifier: type-алиасы не сливаются',
        explanation:
          'Верно: type-алиас — это одно объявление в области видимости, повторное объявление с тем же именем компилятор считает дублем и завершает сборку ошибкой.',
      },
      {
        id: 'b',
        text: 'Объявления сольются, и получится { id: number; name: string }',
        explanation:
          'Ошибочная модель: будто type ведёт себя как interface. Слияние объявлений (declaration merging) поддерживается только для interface и для пространств имён, но не для type-алиасов.',
      },
      {
        id: 'c',
        text: 'Второе объявление заменит первое, ошибки не будет',
        explanation:
          'Ошибочная модель: будто type-алиас можно переопределить. TypeScript запрещает повторное объявление того же имени — это защищает от случайного переопределения типа в другом месте.',
      },
      {
        id: 'd',
        text: 'Получится union: { id: number } | { name: string }',
        explanation:
          'Ошибочная модель: будто повторные объявления автоматически объединяются в union. Никакого неявного объединения нет: чтобы получить union, нужно явно написать type User = A | B.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: компилятор выдаст TS2300 Duplicate identifier, и такое объявление не скомпилируется. type-алиас — это имя, закреплённое за одним определением в области видимости; повторно объявить его нельзя, как нельзя повторно объявить const с тем же именем. Именно поэтому в декларациях библиотек часто используют interface: его можно дополнять из разных файлов. На этапе компиляции тип стирается, поэтому в рантайме никакого User не существует и ошибка не проявится — сборка просто не пройдёт. Практический вывод: если тип должен расширяться другим пакетом или модулем, берите interface; если нужен union, tuple или отображённый тип — type; и в любом случае не создавайте два одноимённых алиаса.',
    commonMistakes: [
      'Ожидать declaration merging от type-алиаса, потому что «interface и type почти одно и то же».',
      'Думать, что ошибка появится только при использовании типа, а не при объявлении.',
      'Считать, что второй алиас переопределит первый без последствий.',
    ],
    codeExample: `type Id = string | number;
interface User {
  id: Id;
}
interface User {
  name: string;
}
// Теперь User содержит и id, и name: interface слился, type — нет.`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Скажите прямо: type не сливается, duplicate identifier — ошибка компиляции; слияние объявлений — свойство interface. Это одна из практических причин выбирать interface для публичных расширяемых контрактов.',
    hint: 'Вспомните, какие объявления в TypeScript поддерживают declaration merging.',
    summary:
      'Type-алиас нельзя объявить дважды: компилятор выдаёт duplicate identifier; слияние объявлений доступно только interface.',
    tags: ['type-alias', 'interface', 'declaration-merging'],
  },
  {
    id: 'ts-004',
    category: 'typescript',
    topic: 'type и interface',
    difficulty: 'junior',
    type: 'multiple-choice',
    question: 'Выберите все верные утверждения о type и interface в TypeScript 5.4 при strict: true.',
    options: [
      {
        id: 'a',
        text: 'interface поддерживает declaration merging: два объявления с одним именем в одной области видимости объединяются',
        explanation:
          'Верно: interface можно дополнить повторным объявлением, и TypeScript сольёт поля. Это основа расширения типов из библиотек и глобальных деклараций.',
      },
      {
        id: 'b',
        text: 'type умеет описывать union, tuple и примитив, а interface — только объектные типы',
        explanation:
          'Верно: type Id = string | number или type Pair = [string, number] корректны, а записать interface в виде union нельзя — interface задаёт форму объекта.',
      },
      {
        id: 'c',
        text: 'interface может расширять type-алиас, если тот описывает объектный тип',
        explanation:
          'Верно: interface Point3D extends Point работает, когда Point — объектный type-алиас со статически известными членами; это позволяет перейти от алиаса к расширяемому интерфейсу.',
      },
      {
        id: 'd',
        text: 'type можно расширить через type B extends A и добавить поля',
        explanation:
          'Неверно: extends в type-алиасе встречается только внутри conditional types. Для расширения алиаса используют пересечение type B = A & { extra: string }.',
      },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation:
      'Верные варианты — a, b и c. type и interface во многом пересекаются, но различаются по возможностям: interface описывает объектную форму, поддерживает extends и declaration merging; type — это имя для любого типа, включая union, tuple, примитив, функцию и отображённые типы. При этом interface может наследовать объектный type-алиас, а type может пересекаться с интерфейсом через &. Синтаксис type B extends A невалиден: слово extends допустимо в объявлении интерфейса/класса либо в условном типе A extends B ? X : Y внутри type. Ошибка в варианте d типична для тех, кто механически переносит синтаксис interface на алиас. На собеседовании достаточно сказать: «type — про любые типы и композицию через &, interface — про расширяемые объектные контракты и слияние».',
    commonMistakes: [
      'Писать type B extends A — это не расширение, а невалидный синтаксис вне conditional types.',
      'Утверждать, что interface нельзя расширять алиасом: объектный алиас наследовать можно.',
      'Считать, что type поддерживает merging, потому что «два type с разными именами же сосуществуют».',
    ],
    codeExample: `type Point = { x: number; y: number };

interface Point3D extends Point {
  z: number;
}

type Named = Point & { label: string };

const point: Point3D = { x: 0, y: 0, z: 0 };
const named: Named = { x: 1, y: 2, label: 'A' };`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Не устраивайте холивар «type или interface». Скажите о практических различиях: merging и extends у interface, union/tuple/composition у type, и что для публичного API важнее возможность расширения.',
    hint: 'Вспомните, какие объявления поддерживают слияние и что умеет только type.',
    summary:
      'interface — объектные контракты с extends и merging; type — любое имя типа, включая union и tuple, с композицией через &.',
    tags: ['type-alias', 'interface', 'declaration-merging'],
  },
  {
    id: 'ts-005',
    category: 'typescript',
    topic: 'Объединения и пересечения',
    difficulty: 'junior',
    type: 'single-choice',
    question:
      'Какое значение можно присвоить переменной типа EmployeePerson без ошибки компиляции?',
    code: `type Person = { name: string };
type Employee = { company: string };
type EmployeePerson = Person & Employee;`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: "{ name: 'Ada', company: 'Acme' }",
        explanation:
          'Верно: пересечение требует наличия всех полей обоих типов, и объект содержит и name, и company без лишних свойств.',
      },
      {
        id: 'b',
        text: "{ name: 'Ada' }",
        explanation:
          'Не хватает company: переменная типа Person & Employee обязана удовлетворять обоим типам одновременно, а не только Person.',
      },
      {
        id: 'c',
        text: "{ company: 'Acme' }",
        explanation:
          'Не хватает name по той же причине: пересечение — это «И», а не «ИЛИ»; одного из наборов полей недостаточно.',
      },
      {
        id: 'd',
        text: "{ name: 'Ada', company: 'Acme', age: 36 }",
        explanation:
          'Лишнее свойство age. Для свежего объектного литерала действует проверка на избыточные свойства (excess property check), поэтому такой литерал не пройдёт, хотя структурно был бы совместим.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ — объект с обоими полями. Пересечение A & B означает значение, которое одновременно является A и B, поэтому в нём должны быть все обязательные свойства обоих типов: name из Person и company из Employee. Ключевое отличие от union: A | B допускает значение, подходящее хотя бы под один тип, а A & B — под оба сразу. Четвёртый вариант показывает отдельный механизм: TypeScript проверяет объектные литералы на лишние свойства, и age, которого нет в типе, вызывает ошибку — при этом та же переменная, полученная из другой переменной без литерала, была бы допустима. Важно, что пересечение не «объединяет» одинаковые поля в union: если в обоих типах есть поле с разными несовместимыми типами, оно превратится в never, и создать значение станет нельзя.',
    commonMistakes: [
      'Путать & и |: считать, что для пересечения хватит полей одного из типов.',
      'Ожидать, что лишнее поле в литерале допустимо: excess property check сработает.',
      'Думать, что пересечение при конфликте полей даёт union типов, а не never.',
    ],
    codeExample: `type Person = { name: string };
type Employee = { company: string };

const person: Person = { name: 'Ada' };
const employee: Employee = { company: 'Acme' };

// Значение, подходящее под оба типа сразу:
const worker: Person & Employee = { name: 'Ada', company: 'Acme' };`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Проговорите разницу через логику: union — «ИЛИ» (достаточно одного набора), intersection — «И» (нужны все). Добавьте про excess property check, чтобы объяснить, почему лишнее поле в литерале ломает присваивание.',
    hint: 'Пересечение требует удовлетворять всем типам одновременно.',
    summary:
      'Пересечение A & B требует всех полей A и B; union A | B — только одного набора; лишние поля в литерале ловит excess property check.',
    tags: ['intersection', 'union', 'excess-property-check'],
  },
  {
    id: 'ts-006',
    category: 'typescript',
    topic: 'Литеральные типы и narrowing',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question:
      'Почему внутри условия action.type === \'add\' компилятор разрешает обратиться к action.payload, хотя у второго варианта union этого поля нет?',
    code: `type Action =
  | { type: 'add'; payload: number }
  | { type: 'reset' };

function reduce(count: number, action: Action): number {
  if (action.type === 'add') {
    return count + action.payload;
  }
  return 0;
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'type — общий литеральный дискриминант: сравнение сужает union до варианта с payload',
        explanation:
          'Верно: оба члена union имеют поле type с разными литеральными типами, поэтому проверка отсекает вариант reset и оставляет { type: "add"; payload: number }.',
      },
      {
        id: 'b',
        text: 'TypeScript разрешает читать любое свойство union и в худшем случае возвращает undefined',
        explanation:
          'Ошибочная модель: будто union ведёт себя как «словарь любых ключей». Обращение к payload вне сужения — ошибка компиляции, а не undefined.',
      },
      {
        id: 'c',
        text: 'payload объявлен необязательным во всех вариантах union, поэтому доступен всегда',
        explanation:
          'Ошибочная модель: будто union добавляет отсутствующие поля как optional. payload существует только у варианта add и не является общим свойством.',
      },
      {
        id: 'd',
        text: 'Это работает только благодаря strict: true, без strict доступ к payload был бы ошибкой',
        explanation:
          'Ошибочная модель: будто дискриминированное сужение включается флагом strict. Наоборот, strict делает проверки строже, а narrowing по литеральному дискриминанту работает всегда.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: это дискриминированное объединение, и проверка литерального поля-дискриминанта сужает тип. Оба варианта Action имеют общее поле type, но с разными литеральными типами: "add" и "reset". Внутри if (action.type === \'add\') компилятор отбрасывает член, у которого type не может быть "add", и оставляет только { type: "add"; payload: number } — поэтому payload доступен и имеет тип number. В ветке после if остаётся { type: "reset" }, где payload нет вовсе, и обращение к нему там было бы ошибкой. Это чисто compile-time механизм: в рантайме остаётся обычная проверка строки, а литеральные типы стираются. Требование к дискриминанту — он должен быть общим свойством всех членов и иметь литеральный (или уникальный) тип; если объявить type: string, сужение перестанет работать, потому что значения не различимы на уровне типов.',
    commonMistakes: [
      'Объявлять дискриминант как type: string — тогда проверка не сужает union.',
      'Обращаться к payload после if без else, забывая, что в ветке reset поля нет.',
      'Считать, что сужение меняет объект в рантайме: тип стирается, проверка остаётся обычным сравнением.',
    ],
    codeExample: `type Result =
  | { ok: true; value: string }
  | { ok: false; error: Error };

function unwrap(result: Result): string {
  if (result.ok) {
    return result.value;
  }
  return result.error.message;
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Назовите три условия рабочего дискриминанта: общее поле у всех вариантов, литеральные типы, проверка этого поля перед доступом к остальным. Это сразу показывает, что вы понимаете narrowing, а не просто видели код.',
    hint: 'Обратите внимание, что поле type есть у обоих вариантов, но с разными литеральными значениями.',
    summary:
      'Литеральное поле-дискриминант позволяет компилятору сузить union до конкретного варианта и открыть его уникальные поля.',
    tags: ['discriminated-union', 'narrowing', 'literal-types'],
  },
  {
    id: 'ts-007',
    category: 'typescript',
    topic: 'Вывод типов',
    difficulty: 'junior-plus',
    type: 'code-output',
    question: 'Какой тип TypeScript выведет для переменной result в этом коде?',
    code: `function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const result = pair('id', 42);`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: '[string, number]',
        explanation:
          'Верно: литералы аргументов расширяются до string и number, а кортеж в возвращаемом типе сохраняет порядок и позиции элементов.',
      },
      {
        id: 'b',
        text: '["id", 42]',
        explanation:
          'Ошибочная модель: будто аргументы сохраняют литеральные типы. В обычной generic-функции позиция параметра не является const-позицией, поэтому "id" расширяется до string и 42 до number.',
      },
      {
        id: 'c',
        text: '(string | number)[]',
        explanation:
          'Ошибочная модель: будто кортеж превращается в обычный массив. Возвращаемый тип объявлен как [A, B], поэтому это кортеж из двух позиций, а не массив объединения.',
      },
      {
        id: 'd',
        text: '[A, B]',
        explanation:
          'Ошибочная модель: будто имена параметров остаются в типе результата. На месте вызова TypeScript подставляет конкретные типы аргументов, поэтому A и B уже не видны.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: [string, number]. При вызове generic-функции TypeScript выводит типы параметров из аргументов: для first аргумент \'id\' имеет литеральный тип "id", но в обычной (не const) позиции вывода литерал расширяется до string — иначе переменная типа A не смогла бы принимать другие строки. Для second число 42 расширяется до number. Возвращаемый тип объявлен как кортеж [A, B], поэтому результат — [string, number]: первый элемент строго строка, второй строго число, длина фиксирована. Именно аннотация возврата делает результат кортежем, а не массивом. Чтобы сохранить литералы, нужно либо объявить параметр как const A (TypeScript 5.0+), либо вызвать pair(\'id\' as const, 42 as const), и тогда получится ["id", 42]. На собеседовании полезно упомянуть, что вывод идёт от аргументов к параметрам, а затем подставляется в сигнатуру.',
    commonMistakes: [
      'Ожидать литеральные типы "id" и 42 без const-параметра или as const.',
      'Считать, что [A, B] — это массив, и получать (string | number)[].',
      'Думать, что generic-функция возвращает any, если типы не указаны явно.',
    ],
    codeExample: `function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

function tuple<const A, const B>(first: A, second: B): [A, B] {
  return [first, second];
}

const widened = pair('id', 42); // [string, number]
const exact = tuple('id', 42);  // ["id", 42]`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Опишите порядок: типы выводятся из аргументов, литералы расширяются, затем подставляются в возвращаемый кортеж. Упомяните const type parameters как способ сохранить литералы — это признак знания TS 5.x.',
    hint: 'Сравните объявленный тип возврата с типом обычного массива.',
    summary:
      'Generic-вывод расширяет литералы аргументов до string и number, а кортеж [A, B] сохраняет позиции, давая [string, number].',
    tags: ['generics', 'inference', 'tuple'],
  },
  {
    id: 'ts-008',
    category: 'typescript',
    topic: 'keyof и typeof',
    difficulty: 'junior-plus',
    type: 'multiple-choice',
    question: 'Выберите все верные утверждения о keyof и typeof в TypeScript 5.4.',
    options: [
      {
        id: 'a',
        text: 'keyof T даёт union литералов ключей T (строковых, числовых или символьных — в зависимости от ключей)',
        explanation:
          'Верно: keyof { id: number; name: string } — это "id" | "name"; для индексной сигнатуры результат может быть string | number.',
      },
      {
        id: 'b',
        text: 'typeof value в позиции типа даёт тип значения value и работает с идентификатором или обращением к свойству',
        explanation:
          'Верно: type T = typeof config допустим, как и typeof obj.prop; это type query, который компилятор вычисляет из объявления значения.',
      },
      {
        id: 'c',
        text: 'keyof typeof config даёт union ключей объекта config',
        explanation:
          'Верно: сначала typeof config даёт тип объекта, затем keyof извлекает его ключи — типичная связка для словарей и конфигов.',
      },
      {
        id: 'd',
        text: 'keyof принимает значение, поэтому keyof myObject — корректная запись',
        explanation:
          'Неверно: keyof работает только с типом. Для значения нужен keyof typeof myObject — сначала получить тип через typeof, затем взять ключи.',
      },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation:
      'Верные утверждения — a, b и c. keyof — оператор над типом: он возвращает union ключей этого типа, поэтому keyof Person для { id: number; name: string } даёт "id" | "name". typeof в позиции типа — это type query: он берёт тип уже объявленного значения, причём не только простого идентификатора, но и обращения к свойству (typeof user.role). Связка keyof typeof obj нужна, когда тип объекта не назван отдельно: typeof obj превращает значение в тип, keyof извлекает ключи. Запись keyof myObject невалидна, потому что myObject — значение, а не тип; компилятор выдаст ошибку. При этом typeof в обычном выражении (рантайм) и typeof в позиции типа — разные вещи: первый возвращает строку с названием типа, второй существует только на этапе компиляции и стирается. Для перечислений и объектов с индексной сигнатурой keyof может дать string или number — это стоит помнить, когда строится Record.',
    commonMistakes: [
      'Писать keyof myObject вместо keyof typeof myObject.',
      'Путать рантайм-оператор typeof (возвращает строку) с type query в позиции типа.',
      'Ожидать, что keyof массива даст только "0" | "1": для T[] это number и методы массива.',
    ],
    codeExample: `const settings = { theme: 'dark', fontSize: 14 };

type Settings = typeof settings;
type SettingsKey = keyof Settings; // "theme" | "fontSize"

function read(key: SettingsKey): Settings[SettingsKey] {
  return settings[key];
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Чётко разделите: keyof — про тип и даёт union ключей; typeof в позиции типа — про значение и даёт его тип. Связка keyof typeof — стандартный приём, когда отдельный тип объявлять не хочется.',
    hint: 'Один из вариантов путает тип и значение.',
    summary:
      'keyof даёт union ключей типа, typeof в позиции типа — тип значения; вместе они дают ключи объекта без отдельного объявления типа.',
    tags: ['keyof', 'typeof', 'type-query'],
  },
  {
    id: 'ts-009',
    category: 'typescript',
    topic: 'Type guards',
    difficulty: 'junior-plus',
    type: 'code-completion',
    question:
      'Введите тип возвращаемого значения функции isUser, чтобы после проверки компилятор сужал unknown до User.',
    code: `type User = { id: number; name: string };

function isUser(value: unknown): ___ {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'name' in value && typeof (value as { name: unknown }).name === 'string';
}

function greet(value: unknown): string {
  if (isUser(value)) {
    return value.name; // здесь value должен стать User
  }
  return 'Неизвестный пользователь';
}`,
    codeLanguage: 'typescript',
    completion: {
      acceptedAnswers: ['value is User'],
      placeholder: 'Введите тип возвращаемого значения',
      inputHint: 'Тип-предикат вида «параметр is Тип»',
      caseSensitive: false,
      ignoreWhitespace: true,
    },
    correctAnswers: ['value is User'],
    explanation:
      'Правильный ответ — value is User. Это type predicate: возвращаемый тип сообщает компилятору, что если функция вернула true, то аргумент value имеет тип User. Тело функции при этом возвращает обычный boolean, а предикат — обещание компилятору, которое он проверяет лишь на совместимость: тип в правой части (User) должен быть присваиваемым к типу параметра (unknown), что выполняется. Без предиката функция с типом boolean вообще не сужает unknown: в greet значение осталось бы unknown, и обращение value.name не скомпилировалось бы. Обратите внимание на защиту в теле: сначала отсекаются null и значения не-объекты, затем проверяется наличие name и его тип. Предикат не проверяет id, поэтому формально isUser обещает больше, чем проверяет; в реальном коде стоит либо проверять все поля, либо использовать валидатор. Важно и то, что предикат — compile-time договорённость, в рантайме он возвращает boolean.',
    commonMistakes: [
      'Указывать просто User в качестве возвращаемого типа: это не предикат, и сужения не будет.',
      'Писать value: User — так объявляется параметр, а не тип возврата.',
      'Считать, что предикат сам проверяет поля в рантайме: проверки должны быть в теле функции.',
    ],
    codeExample: `type Cat = { meow: () => void };

function isCat(value: unknown): value is Cat {
  return typeof value === 'object' && value !== null && 'meow' in value;
}

function speak(value: unknown): void {
  if (isCat(value)) {
    value.meow(); // value сужен до Cat
  }
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Формулировка «value is User — это type predicate, он сужает аргумент в ветке true» звучит уверенно. Добавьте, что предикат не заменяет рантайм-валидацию и должен проверять ровно те поля, которые обещает.',
    hint: 'Компилятору нужно не просто boolean, а утверждение о типе аргумента.',
    summary:
      'Type predicate вида value is User превращает boolean-функцию в type guard и сужает unknown в ветке, где проверка истинна.',
    tags: ['type-guards', 'type-predicate', 'narrowing'],
  },
  {
    id: 'ts-010',
    category: 'typescript',
    topic: 'Type guards',
    difficulty: 'junior-plus',
    type: 'find-bug',
    question:
      'Почему в printName не компилируется обращение value.name и как исправить причину, а не следствие?',
    code: `type User = { id: number; name: string };

function isUser(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as { id: unknown }).id === 'number'
  );
}

function printName(value: unknown): string {
  if (isUser(value)) {
    return value.name;
  }
  return 'Неизвестный пользователь';
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Тип возврата isUser должен быть value is User: boolean не сужает unknown, поэтому в if value остаётся unknown',
        explanation:
          'Верно: функция возвращает boolean, а не type predicate, поэтому компилятор не может сделать вывод о типе value внутри if — и доступ к name запрещён.',
      },
      {
        id: 'b',
        text: 'Нужно заменить unknown на any в параметрах isUser и printName',
        explanation:
          'Это маскировка: any отключает проверку, ошибка исчезнет, но тип value.name станет any. Причина — отсутствие предиката, а не строгость unknown.',
      },
      {
        id: 'c',
        text: 'Нужно убрать проверку value !== null: она мешает выводу типа',
        explanation:
          'Проверка на null корректна и необходима: typeof null === "object". Её удаление не даст сужения и добавит риск падения в рантайме.',
      },
      {
        id: 'd',
        text: 'Достаточно написать return (value as User).name внутри if',
        explanation:
          'Приведение уберёт ошибку в одном месте, но не сделает isUser type guard: в других вызовах проблема останется, а безопасность типа будет ложной.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Баг в сигнатуре isUser: возвращаемый тип boolean означает «я вернул истину или ложь», но ничего не сообщает компилятору о связи результата с типом аргумента. Поэтому в printName после if (isUser(value)) значение value по-прежнему unknown, и обращение к name — ошибка «value is of type unknown». Исправление — объявить предикат: function isUser(value: unknown): value is User. Тогда в ветке true компилятор сузит unknown до User, и name станет доступен с типом string. Замена unknown на any или точечный as User лишь заглушают ошибку: первый вариант теряет проверки на границе, второй оставляет другие вызовы незащищёнными. Обратите внимание: сам предикат не добавляет рантайм-проверок, поэтому тело должно проверять те поля, которые вы обещаете; здесь проверяется id, но не name — в строгом коде стоит проверять и его.',
    commonMistakes: [
      'Возвращать boolean из функции-проверки и ждать сужения в месте вызова.',
      'Лечить ошибку через as User или any вместо предиката.',
      'Считать, что предикат автоматически валидирует объект в рантайме.',
    ],
    codeExample: `type User = { id: number; name: string };

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as { id?: unknown; name?: unknown };
  return typeof candidate.id === 'number' && typeof candidate.name === 'string';
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Называйте баг точно: boolean вместо type predicate. Затем объясните, что предикат — это контракт компилятору, а валидация полей остаётся в теле функции; так вы показываете и знание типов, и понимание рантайма.',
    hint: 'Сравните, что обещает сигнатура функции и что из этого может вывести компилятор.',
    summary:
      'Функция-проверка должна возвращать value is User, а не boolean, иначе unknown не сужается и обращение к полям не компилируется.',
    tags: ['debug', 'type-guards', 'type-predicate'],
  },
  {
    id: 'ts-011',
    category: 'typescript',
    topic: 'Generics',
    difficulty: 'junior-plus',
    type: 'scenario',
    question:
      'Команда типизирует обёртку над fetch. Тип успешного ответа известен в месте вызова, но не внутри обёртки; в обработчиках уже появились касты as User, и они расползаются по коду. Какую сигнатуру выбрать, чтобы тип ответа задавался в месте вызова и касты не дублировались?',
    options: [
      {
        id: 'a',
        text: 'async function fetchJson<T>(url: string): Promise<T> и вызов fetchJson<User>("/api/me")',
        explanation:
          'Верно: generic-параметр задаётся вызывающим кодом, поэтому тип ответа известен в месте вызова, а внутри обёртки остаётся один каст к T при разборе JSON.',
      },
      {
        id: 'b',
        text: 'async function fetchJson(url: string): Promise<any>',
        explanation:
          'any вернёт свободу, но уничтожит проверку: ошибки в полях ответа проявятся в рантайме, а автодополнение перестанет помогать. Это не типизация, а её отключение.',
      },
      {
        id: 'c',
        text: 'async function fetchJson(url: string): Promise<unknown> и as User в каждом обработчике',
        explanation:
          'unknown безопаснее any, но тип по-прежнему задаётся вручную в каждом вызове через каст; дублирование кастов как раз и было проблемой, которую нужно убрать.',
      },
      {
        id: 'd',
        text: 'async function fetchJson(url: string): Promise<object> и as User в каждом обработчике',
        explanation:
          'object почти бесполезен: он не описывает ни одного поля, а касты остаются. К тому же object несовместим с примитивными ответами.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Лучший вариант — generic-обёртка: параметр T задаёт вызывающий код, поэтому fetchJson<User>(\'/api/me\') возвращает Promise<User>, и в обработчике не нужен повторный as User. Внутри реализации остаётся один контролируемый каст: const data = (await response.json()) as T — компилятор не может проверить JSON, поэтому это место явно помечается. Важно понимать границу: generic даёт compile-time контракт, но не валидацию рантайма; если сервер вернёт другую форму, TypeScript этого не заметит. Поэтому на границе сети правильнее добавлять рантайм-валидацию (например, схему) и уже её результат типизировать как T. Варианты с any и object просто отключают проверки, а unknown с кастами в каждом обработчике сохраняет дублирование, из-за которого задача и возникла. Generic также удобен тем, что тип можно вывести из аргумента-парсера или из дженерик-параметра вызывающей функции.',
    commonMistakes: [
      'Верить, что Promise<User> проверяет ответ сервера в рантайме.',
      'Ставить any, чтобы «не мешало», и терять автодополнение и проверку полей.',
      'Возвращать unknown и кастовать в каждом вызове, дублируя одну и ту же операцию.',
    ],
    codeExample: `type User = { id: number; name: string };

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  return (await response.json()) as T; // единственный контролируемый каст
}

async function loadUser(): Promise<User> {
  return fetchJson<User>('/api/me');
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Ответ сильного кандидата: generic переносит выбор типа в место вызова и убирает дубли кастов, но границу сети всё равно нужно валидировать в рантайме. Скажите это сами, до вопроса интервьюера.',
    hint: 'Кто знает конкретный тип ответа — обёртка или вызывающий код?',
    summary:
      'Generic-обёртка fetchJson<T> задаёт тип ответа в месте вызова, убирает повторные касты, но требует рантайм-валидации на границе сети.',
    tags: ['generics', 'api', 'type-safety'],
  },
  {
    id: 'ts-012',
    category: 'typescript',
    topic: 'Литеральные типы и narrowing',
    difficulty: 'junior',
    type: 'code-output',
    question: 'Что выведет этот код в консоль?',
    code: `function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(1);
}

console.log(format('ts'), format(42));`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'TS 42.0',
        explanation:
          'Верно: в первой ветке строка приводится к верхнему регистру, вторая ветка получает число 42 и toFixed(1) даёт "42.0"; console.log разделяет аргументы пробелом.',
      },
      {
        id: 'b',
        text: 'ts 42',
        explanation:
          'Ошибочно: toUpperCase и toFixed(1) меняют значения — регистр станет верхним, а число получит один знак после точки.',
      },
      {
        id: 'c',
        text: 'TS 42',
        explanation:
          'Ошибочно: toFixed(1) всегда добавляет ровно одну цифру после точки, поэтому 42 превращается в "42.0", а не в "42".',
      },
      {
        id: 'd',
        text: 'Ошибка компиляции: у value нет метода toUpperCase',
        explanation:
          'Ошибочная модель: будто union запрещает вызов методов. После typeof-проверки value сужен до string, а в ветке после if — до number, поэтому оба вызова корректны.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный вывод: TS 42.0. Внутри format параметр имеет тип string | number. Проверка typeof value === \'string\' сужает union: в ветке if значение гарантированно строка, и toUpperCase возвращает \'TS\'. После if остаётся только number, поэтому toFixed(1) доступен и даёт строку \'42.0\' — метод toFixed всегда оставляет указанное число знаков после точки. Первый вызов format(\'ts\') возвращает \'TS\', второй format(42) — \'42.0\'. console.log с двумя аргументами печатает их через пробел, поэтому в консоли будет одна строка TS 42.0. Этот пример хорошо показывает, что narrowing — чисто compile-time: в рантайме остаются обычные typeof-проверки и вызовы методов. Ошибки компиляции здесь нет: без сужения вызов toUpperCase на string | number действительно был бы ошибкой, но проверка её снимает.',
    commonMistakes: [
      'Считать, что toFixed округляет до целого: он фиксирует число знаков после точки.',
      'Думать, что union запрещает любые методы: после сужения доступны методы конкретного типа.',
      'Ожидать, что console.log склеит аргументы без пробела.',
    ],
    codeExample: `function describe(value: string | number): string {
  return typeof value === 'string'
    ? 'строка длиной ' + value.length
    : 'число ' + value.toFixed(2);
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Проговаривайте ветки по порядку: typeof-проверка сужает до string, после неё остаётся number. Назовите точный результат toFixed(1) — на таких деталях проверяют внимательность.',
    hint: 'Проследите, какой тип имеет value в каждой ветке и что возвращает toFixed(1).',
    summary:
      'typeof-проверка сужает string | number, поэтому обе ветки корректны, а код печатает TS 42.0.',
    tags: ['narrowing', 'typeof', 'union'],
  },
  {
    id: 'ts-013',
    category: 'typescript',
    topic: 'keyof и typeof',
    difficulty: 'junior',
    type: 'code-completion',
    question:
      'Введите выражение в позиции типа, которое даст тип объекта config, не объявляя интерфейс вручную.',
    code: `const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

type Config = ___;

const url: Config['apiUrl'] = 'https://api.example.com';
const timeout: Config['timeout'] = 5000;`,
    codeLanguage: 'typescript',
    completion: {
      acceptedAnswers: ['typeof config'],
      placeholder: 'Введите выражение типа',
      inputHint: 'Используйте type query от имени значения',
      caseSensitive: false,
      ignoreWhitespace: true,
    },
    correctAnswers: ['typeof config'],
    explanation:
      'Правильный ответ — typeof config. В позиции типа typeof — это type query: он берёт тип уже существующего значения config и превращает его в тип. Дальше Config[\'apiUrl\'] даёт тип свойства, то есть string, а Config[\'timeout\'] — number, поэтому обе аннотации ниже компилируются. Без typeof запись config в позиции типа была бы ошибкой: там ожидается тип, а не значение. Важная деталь: typeof в позиции типа и рантайм-оператор typeof — разные механизмы. Рантайм-версия возвращает строку (\'object\'), а type query существует только на этапе компиляции и стирается. Ещё одна тонкость: свойства config выведены с расширением литералов, поэтому Config[\'apiUrl\'] — string, а не "https://api.example.com"; для точного литерала понадобился бы as const. Такой приём удобен для конфигов и словарей: тип остаётся в одном месте, а изменение значения автоматически меняет тип.',
    commonMistakes: [
      'Писать просто config: в позиции типа нужно имя типа, а не значение.',
      'Писать keyof config: keyof работает с типом, а не со значением, и дал бы ошибку.',
      'Ожидать литеральный тип URL: без as const свойство расширяется до string.',
    ],
    codeExample: `const limits = { min: 0, max: 10 };

type Limits = typeof limits;       // { min: number; max: number }
type LimitKey = keyof Limits;      // "min" | "max"

const key: LimitKey = 'max';`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Скажите: typeof в позиции типа — это type query, он вычисляется компилятором из значения и не существует в рантайме. Это отличает уверенный ответ от путаницы с оператором typeof.',
    hint: 'Нужно получить тип из уже объявленного значения.',
    summary:
      'typeof config в позиции типа даёт тип объекта, после чего Config[ключ] обращается к типу конкретного свойства.',
    tags: ['typeof', 'type-query', 'inference'],
  },
  {
    id: 'ts-014',
    category: 'typescript',
    topic: 'Generics',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Какие вызовы printLength скомпилируются без ошибок?',
    code: `function printLength<T extends { length: number }>(value: T): number {
  return value.length;
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: "printLength('hello'); printLength([1, 2, 3]);",
        explanation:
          'Верно: и string, и массив имеют свойство length: number, поэтому оба типа удовлетворяют ограничению T extends { length: number }.',
      },
      {
        id: 'b',
        text: 'printLength(42); printLength(null);',
        explanation:
          'Оба аргумента не подходят: у number нет length, а null при strict: true не имеет свойств и не входит в ограничение.',
      },
      {
        id: 'c',
        text: "printLength({ length: '5' });",
        explanation:
          'Свойство length есть, но его тип string, а ограничение требует number: структурная совместимость не выполняется.',
      },
      {
        id: 'd',
        text: 'printLength(true); printLength({});',
        explanation:
          'У boolean нет length, а пустой объект не содержит обязательного свойства length — оба вызова нарушают constraint.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ — строка и массив. Ограничение T extends { length: number } означает: тип аргумента должен структурно иметь свойство length с типом number. Строка подходит, потому что у string есть length: number; массив тоже, потому что length у массива — number. Число 42 не подходит: у number нет length. null при strict: true несовместим с объектным ограничением: у него нет свойств, и TypeScript не делает исключений «на рантайм». Объект { length: \'5\' } не проходит, потому что string не присваивается к number — TypeScript проверяет типы свойств, а не только их наличие. Важно, что ограничение не превращает T в { length: number }: T остаётся конкретным типом аргумента (например, string), а constraint лишь гарантирует доступность length внутри функции. Возвращаемый тип здесь number, а не T[\'length\'], поэтому функция теряет точность, но для вопроса это несущественно.',
    commonMistakes: [
      'Думать, что constraint проверяет только наличие свойства, игнорируя его тип.',
      'Считать, что null пройдёт проверку, потому что «в рантайме length можно проверить».',
      'Полагать, что T внутри функции станет ровно { length: number } и потеряет исходный тип.',
    ],
    codeExample: `function firstItem<T extends { length: number }>(value: T): T {
  console.log(value.length);
  return value;
}

const text = firstItem('hello'); // T = string
const list = firstItem([1, 2, 3]); // T = number[]`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Объясните constraint как структурное требование: «аргумент обязан иметь length: number, при этом T остаётся конкретным типом». Приведите оба проходящих примера — строку и массив.',
    hint: 'Проверьте не только наличие length, но и его тип.',
    summary:
      'Constraint T extends { length: number } пропускает строки и массивы, но отклоняет number, null и объекты с length: string.',
    tags: ['generics', 'constraints', 'structural-typing'],
  },
  {
    id: 'ts-015',
    category: 'typescript',
    topic: 'Литеральные типы и narrowing',
    difficulty: 'middle',
    type: 'multiple-choice',
    question: 'Выберите все верные утверждения о сужении типов (narrowing) в TypeScript 5.4 при strict: true.',
    options: [
      {
        id: 'a',
        text: "if (typeof value === 'string') сужает string | number до string",
        explanation:
          'Верно: typeof — встроенный type guard; в ветке true компилятор оставляет только члены union, совместимые со строкой.',
      },
      {
        id: 'b',
        text: "if ('role' in user) сужает union до вариантов, у которых объявлено свойство role",
        explanation:
          'Верно: оператор in работает как guard по наличию свойства и отбрасывает членов union, где такого свойства нет.',
      },
      {
        id: 'c',
        text: 'items.filter(Boolean) не убирает null из типа элементов: тип элементов остаётся прежним, пока не добавлен предикат',
        explanation:
          'Верно: у Boolean нет type predicate, поэтому TypeScript не может вывести сужение из этого вызова; нужен явный предикат вида (x): x is T => x !== null.',
      },
      {
        id: 'd',
        text: 'if (Boolean(value)) сужает тип так же, как if (value)',
        explanation:
          'Неверно: сужение по истинности работает только для прямой проверки значения. Вызов функции Boolean возвращает boolean, и компилятор не переносит это на тип value.',
      },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation:
      'Верные варианты — a, b и c. Narrowing — это анализ потока управления: компилятор смотрит на проверки и в каждой ветке оставляет только совместимые типы. typeof, in, instanceof, Array.isArray, сравнение с литералом и пользовательский предикат — всё это guards. Но не любая функция, возвращающая boolean, является guard: Boolean(value) и items.filter(Boolean) возвращают boolean без предиката, поэтому сужения не происходит. Для filter это особенно неприятно: массив после фильтрации по-прежнему типизируется как (T | null)[], и обращение к элементу без проверки даст ошибку или потребует non-null assertion. Правильное решение — явный предикат: items.filter((item): item is T => item !== null). Отдельно стоит помнить, что сужение не «запоминается» навсегда: после присваивания или передачи в функцию, которая может изменить значение, компилятор снова расширяет тип.',
    commonMistakes: [
      'Считать, что filter(Boolean) меняет тип массива и убирает null.',
      'Ожидать сужения от if (Boolean(value)) или if (!!value).',
      'Забывать, что после мутации или вызова функции сужение может сброситься.',
    ],
    codeExample: `const values: (string | null)[] = ['a', null];

const withoutBoolean = values.filter(Boolean); // (string | null)[]
const withPredicate = values.filter((item): item is string => item !== null); // string[]`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Разделите guards и «просто boolean-функции»: typeof, in, instanceof и предикаты сужают, Boolean и filter(Boolean) — нет. Упомяните, что для filter нужен явный предикат, — это частый вопрос на практике.',
    hint: 'Проверьте, какие из конструкций объявлены как type predicate, а какие просто возвращают boolean.',
    summary:
      'typeof и in сужают union, а Boolean(value) и filter(Boolean) — нет: без предиката null остаётся в типе элементов.',
    tags: ['narrowing', 'type-guards', 'filter'],
  },
  {
    id: 'ts-016',
    category: 'typescript',
    topic: 'keyof и typeof',
    difficulty: 'middle',
    type: 'code-output',
    question: 'Что произойдёт при компиляции этого кода?',
    code: `const user = {
  id: 1,
  name: 'Ada',
};

type UserKey = keyof typeof user;

function getValue(key: UserKey): string | number {
  return user[key];
}

const value = getValue('email');`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Ошибка компиляции: "email" не присваивается типу UserKey ("id" | "name")',
        explanation:
          'Верно: keyof typeof user — это union литералов ключей, а строки "email" в нём нет, поэтому вызов не проходит проверку аргумента.',
      },
      {
        id: 'b',
        text: 'Код скомпилируется, а value получит undefined',
        explanation:
          'Ошибочная модель: будто индексный доступ по ключу из keyof возвращает undefined для неизвестного ключа. Неизвестный ключ отсекается на этапе компиляции, до рантайма.',
      },
      {
        id: 'c',
        text: 'Код скомпилируется и при выполнении вернёт строку "email"',
        explanation:
          'Ошибочная модель: будто getValue возвращает сам ключ. Функция возвращает user[key], то есть значение свойства, но до рантайма дело не дойдёт из-за ошибки типа.',
      },
      {
        id: 'd',
        text: 'Ошибка в теле getValue: user[key] имеет тип any',
        explanation:
          'Ошибочная модель: будто индексация по union-ключу теряет тип. Наоборот, key: UserKey даёт объединение типов значений string | number, что совпадает с возвращаемым типом.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: ошибка компиляции. keyof typeof user вычисляется в union литералов ключей объекта — "id" | "name". Параметр getValue принимает только этот union, а "email" в него не входит, поэтому компилятор выдаёт ошибку совместимости аргумента (TS2345). Внутри getValue индексация user[key] корректна: key относится к ключам user, а тип значения — string | number, что совпадает с объявленным возвращаемым типом. Обратите внимание, что здесь не сработает excess property check: это не литерал объекта, а строковый аргумент, поэтому проверка идёт по самому union. На этапе компиляции типы стираются, поэтому в рантайме никакой проверки ключа не останется: если бы удалось вызвать getValue(\'email\'), вернулся бы undefined. Именно поэтому такие функции безопасны только при честном соблюдении типов и при валидации внешних данных.',
    commonMistakes: [
      'Ожидать undefined вместо ошибки компиляции при неизвестном ключе.',
      'Считать, что keyof typeof user даёт string, а не union литералов.',
      'Думать, что индексация union-ключом возвращает any и отключает проверки.',
    ],
    codeExample: `const user = { id: 1, name: 'Ada' };

type UserKey = keyof typeof user; // "id" | "name"
type UserValue = (typeof user)[UserKey]; // string | number

function getValue(key: UserKey): UserValue {
  return user[key];
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Покажите цепочку: typeof user даёт тип объекта, keyof — union ключей, индексация — union значений. Скажите, что неверный ключ ловится компилятором, а не рантаймом.',
    hint: 'Посмотрите, какие именно строки входят в union ключей.',
    summary:
      'keyof typeof user даёт "id" | "name", поэтому getValue("email") — ошибка компиляции, а user[key] имеет тип string | number.',
    tags: ['keyof', 'typeof', 'indexed-access'],
  },
  {
    id: 'ts-017',
    category: 'typescript',
    topic: 'Generics',
    difficulty: 'middle',
    type: 'code-completion',
    question:
      'Введите ограничение для параметра K, чтобы key мог быть только ключом obj, а возвращаемый тип оставался T[K].',
    code: `function getProperty<T, ___>(obj: T, key: K): T[K] {
  return obj[key];
}

const title = getProperty({ title: 'TS', pages: 320 }, 'title');`,
    codeLanguage: 'typescript',
    completion: {
      acceptedAnswers: ['K extends keyof T'],
      placeholder: 'Введите ограничение типа',
      inputHint: 'Ограничение для второго параметра через keyof',
      caseSensitive: false,
      ignoreWhitespace: true,
    },
    correctAnswers: ['K extends keyof T'],
    explanation:
      'Правильный ответ — K extends keyof T. Без этого ограничения компилятор не знает, что key вообще является ключом obj, и выражение obj[key] не скомпилируется. keyof T превращает тип объекта в union его ключей, а K extends keyof T разрешает передавать только значения из этого union. Возвращаемый тип T[K] — это indexed access type: для конкретного ключа он даёт конкретный тип свойства, поэтому getProperty({ title: \'TS\', pages: 320 }, \'title\') возвращает string, а не string | number. Вывод типов работает и без явного указания generic-аргументов: T выводится из obj, K — из ключа. Если написать K extends string, проверка станет слишком слабой: строковый ключ, которого нет в объекте, пройдёт ограничение, и obj[key] снова не скомпилируется. Если убрать ограничение совсем, K не будет связан с ключами T, и уже тело obj[key] не скомпилируется: компилятор не позволит индексировать T произвольным K. Именно поэтому связка keyof T и T[K] — стандартный способ типизировать безопасный доступ к свойствам.',
    commonMistakes: [
      'Писать K extends string: это не гарантирует, что ключ существует в T.',
      'Писать K: keyof T вместо ограничения — синтаксически неверно для второго параметра.',
      'Забывать T[K] в возвращаемом типе и терять точный тип свойства.',
    ],
    codeExample: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const title = getProperty({ title: 'TS', pages: 320 }, 'title'); // string
const pages = getProperty({ title: 'TS', pages: 320 }, 'pages'); // number`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Проговорите пару: constraint K extends keyof T разрешает индексацию, а T[K] сохраняет точный тип свойства. Это канонический пример связки generics и keyof, его полезно знать наизусть.',
    hint: 'Компилятор должен знать, что key принадлежит набору ключей obj.',
    summary:
      'K extends keyof T ограничивает ключ существующими полями объекта и вместе с T[K] сохраняет точный тип значения.',
    tags: ['generics', 'keyof', 'indexed-access'],
  },
  {
    id: 'ts-018',
    category: 'typescript',
    topic: 'Вывод типов',
    difficulty: 'middle',
    type: 'find-bug',
    question:
      'Почему вызов setMode(defaults.mode) не компилируется и какое исправление устраняет причину?',
    code: `type Mode = 'fast' | 'safe';

const defaults = {
  retries: 3,
  mode: 'fast',
};

function setMode(mode: Mode): void {
  console.log(mode);
}

setMode(defaults.mode);`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Свойство mode выведено как string; нужен as const или явная аннотация defaults типом, где mode: Mode',
        explanation:
          'Верно: свойства объектного литерала расширяются, поэтому mode получает тип string. as const сохранит литерал "fast", а явная аннотация задаст Mode напрямую.',
      },
      {
        id: 'b',
        text: 'Нужно заменить const на let, тогда TypeScript сохранит литеральный тип mode',
        explanation:
          'Наоборот: let расширяет ещё сильнее. Проблема не в способе объявления переменной, а в том, что тип свойства объектного литерала расширен до string.',
      },
      {
        id: 'c',
        text: 'Нужно передать defaults.mode as string — приведение к string снимет ошибку',
        explanation:
          'Приведение к string делает тип ещё дальше от Mode: ошибка останется. Приводить нужно к "fast" или к Mode, но лучше вообще не использовать утверждение, а сузить тип объявления.',
      },
      {
        id: 'd',
        text: 'Нужно объявить type Mode = string, тогда ошибка исчезнет',
        explanation:
          'Это расширение контракта до любой строки: ошибка уйдёт, но setMode начнёт принимать "any-string", и защита от опечаток потеряется. Причина бага не устранена.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Баг в выводе типа объектного литерала. Объявление const defaults = { mode: \'fast\' } не сохраняет литерал "fast": const защищает только саму переменную от переприсваивания, а свойства объекта менять можно, поэтому TypeScript расширяет mode до string. В результате defaults.mode имеет тип string, а setMode ожидает Mode = \'fast\' | \'safe\', и вызов не компилируется (TS2345). Исправления, устраняющие причину: добавить as const к объекту — тогда mode станет readonly "fast" и подойдёт под Mode; либо явно аннотировать объект, например const defaults: { retries: number; mode: Mode } = { retries: 3, mode: \'fast\' }; либо типизировать само поле при создании. Вариант с as string не помогает, потому что string — надмножество Mode, а не подмножество; вариант с type Mode = string просто размывает контракт, и компилятор перестаёт ловить опечатки вроде \'fst\'. Это классическая ситуация на границе конфигов: литерал в объекте надо либо заморозить as const, либо описать типом.',
    commonMistakes: [
      'Считать, что const сохраняет литеральные типы свойств объекта.',
      'Лечить ошибку приведением as string вместо сужения типа.',
      'Расширять Mode до string, теряя проверку допустимых значений.',
    ],
    codeExample: `type Mode = 'fast' | 'safe';

const defaults = {
  retries: 3,
  mode: 'fast',
} as const;

function setMode(mode: Mode): void {
  console.log(mode);
}

setMode(defaults.mode); // ок: "fast" входит в Mode`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Назовите механизм: widening свойств объектного литерала. Затем предложите два корректных исправления — as const и явную аннотацию — и объясните, почему as string не помогает.',
    hint: 'Проверьте, какой тип получило свойство mode, а не сама переменная defaults.',
    summary:
      'Свойство объектного литерала расширяется до string, поэтому вызову нужен as const или явная аннотация с Mode.',
    tags: ['debug', 'inference', 'literal-types'],
  },
  {
    id: 'ts-019',
    category: 'typescript',
    topic: 'Type guards',
    difficulty: 'middle',
    type: 'single-choice',
    question:
      'Почему проверка \'permissions\' in user позволяет обратиться к user.permissions в этой ветке?',
    code: `type Admin = { role: 'admin'; permissions: string[] };
type Guest = { role: 'guest' };

function describe(user: Admin | Guest): string {
  if ('permissions' in user) {
    return user.permissions.join(', ');
  }
  return 'Гость';
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'in сужает union до вариантов, где свойство объявлено; остаётся Admin, поэтому permissions доступен',
        explanation:
          'Верно: оператор in — встроенный type guard по наличию свойства. Из Admin | Guest он оставляет только Admin, у которого permissions: string[].',
      },
      {
        id: 'b',
        text: 'in проверяет значение свойства permissions, поэтому после проверки оно точно не undefined',
        explanation:
          'Ошибочная модель: in проверяет наличие ключа, а не его значение. Свойство может существовать и содержать undefined, если так объявлено.',
      },
      {
        id: 'c',
        text: 'in работает только с необязательными свойствами и сужает их до обязательных',
        explanation:
          'Ошибочная модель: in не связан с модификатором optional. Он сужает union по факту объявления свойства в типе.',
      },
      {
        id: 'd',
        text: 'user.permissions был бы доступен и без проверки: union разрешает обращение к любому общему полю',
        explanation:
          'Ошибочная модель: permissions — не общее поле union, оно есть только у Admin. Без сужения обращение к нему — ошибка компиляции.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: in работает как type guard. Когда user имеет тип Admin | Guest, компилятор смотрит на объявления членов union и оставляет в ветке true только те, у которых есть свойство permissions, то есть Admin. Поэтому user.permissions имеет тип string[] и вызов join доступен. В ветке после if остаётся Guest, где permissions нет — и обращаться к нему там нельзя. Важно, что in проверяет наличие ключа в объекте, а не истинность значения: если объявить permissions?: string[] и свойство присутствует со значением undefined, проверка in пройдёт, а значение останется undefined; для такой формы нужен другой guard. Также стоит помнить: in сужает union объектных типов, а для unknown одной этой проверки недостаточно, чтобы получить конкретный интерфейс. В рантайме остаётся обычная проверка наличия свойства, все типы стираются.',
    commonMistakes: [
      'Считать, что in проверяет значение свойства, а не его наличие.',
      'Путать in с проверкой optional-модификатора: это разные вещи.',
      'Ожидать доступа к permissions без сужения, потому что «это же union».',
    ],
    codeExample: `type Cat = { meow: () => string };
type Dog = { bark: () => string };

function speak(animal: Cat | Dog): string {
  if ('meow' in animal) {
    return animal.meow();
  }
  return animal.bark();
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Скажите: in — guard по наличию свойства, он отбрасывает членов union без этого ключа. Добавьте ограничение: ключ должен быть объявлен хотя бы в одном члене union, а значение свойства in не проверяет.',
    hint: 'Вспомните, по какому признаку in отбирает варианты union.',
    summary:
      "in сужает union по наличию свойства: из Admin | Guest остаётся Admin, поэтому user.permissions доступен и имеет тип string[].",
    tags: ['type-guards', 'in-operator', 'narrowing'],
  },
  {
    id: 'ts-020',
    category: 'typescript',
    topic: 'Объединения и пересечения',
    difficulty: 'middle',
    type: 'scenario',
    question:
      'API отдаёт ответ в двух формах: успех { status: "ok"; data: Order[] } и ошибка { status: "error"; message: string }. Команда хочет, чтобы при добавлении третьего статуса сборка падала, а обработчик не молчал. Какой подход выбрать?',
    options: [
      {
        id: 'a',
        text: 'Discriminated union по status плюс исчерпывающая проверка через assertNever в default',
        explanation:
          'Верно: status — литеральный дискриминант, switch сужает варианты, а assertNever принимает never; новый статус сделает default недостижимым по типу и вызовет ошибку компиляции.',
      },
      {
        id: 'b',
        text: 'Один интерфейс с необязательными data и message плюс проверки на undefined',
        explanation:
          'Такая форма допускает бессмысленные состояния (status: "ok" без data) и не даёт исчерпывающей проверки: добавление статуса ничего не сломает, ошибки уйдут в рантайм.',
      },
      {
        id: 'c',
        text: 'Тип any для ответа и проверка status строкой в рантайме',
        explanation:
          'any отключает компилятор: ни один новый статус не будет замечен при сборке, а обработчик придётся проверять глазами и тестами.',
      },
      {
        id: 'd',
        text: 'Тип unknown и приведение as OrderResponse в каждом обработчике',
        explanation:
          'Касты в каждом месте дублируются и лгут компилятору: если форма ответа изменится, ошибка проявится в рантайме, а не на сборке.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Лучший вариант — discriminated union с исчерпывающей проверкой. Объявляем type ApiResponse = { status: \'ok\'; data: Order[] } | { status: \'error\'; message: string }. Литеральное поле status связывает вариант с его полезной нагрузкой: в ветке \'ok\' доступен data, в ветке \'error\' — message, и компилятор не даст перепутать. В default мы передаём остаток в assertNever с параметром типа never, и если завтра появится status: \'loading\', тип в default перестанет быть never — сборка упадёт с понятной ошибкой, а не молча вернёт undefined. Один интерфейс с optional-полями выглядит проще, но допускает невозможные состояния и не даёт исчерпывающей проверки: проверки на undefined придётся писать вручную в каждом обработчике. any и касты возвращают нас к рантайм-ошибкам. Важная оговорка: exhaustive-проверка защищает от новых вариантов только тогда, когда все места разбора действительно используют assertNever; сама по себе она не валидирует данные с сервера, поэтому на границе сети нужна рантайм-валидация.',
    commonMistakes: [
      'Описывать ответ одним интерфейсом с optional-полями и считать это безопасным.',
      'Ставить default с возвратом undefined вместо assertNever, теряя проверку исчерпываемости.',
      'Считать, что assertNever проверяет данные в рантайме: он ловит только новые варианты типа.',
    ],
    codeExample: `type Order = { id: number };

type ApiResponse =
  | { status: 'ok'; data: Order[] }
  | { status: 'error'; message: string };

function assertNever(value: never): never {
  throw new Error('Необработанный статус');
}

function handle(response: ApiResponse): Order[] {
  switch (response.status) {
    case 'ok':
      return response.data;
    case 'error':
      console.log(response.message);
      return [];
    default:
      return assertNever(response);
  }
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Опишите пользу исчерпывающей проверки: новый вариант типа ломает сборку в известном месте, а не превращается в тихий undefined в рантайме. Упомяните, что валидацию внешних данных это не заменяет.',
    hint: 'Нужен механизм, который заставит компилятор заметить новый вариант.',
    summary:
      'Discriminated union и assertNever в default дают исчерпывающую проверку: новый статус ломает сборку, а не поведение в рантайме.',
    tags: ['discriminated-union', 'exhaustiveness', 'api'],
  },
  {
    id: 'ts-021',
    category: 'typescript',
    topic: 'any, unknown и never',
    difficulty: 'junior-plus',
    type: 'multiple-choice',
    question: 'Выберите все верные утверждения о типах any, unknown и never.',
    options: [
      {
        id: 'a',
        text: 'any отключает проверку типов и распространяется на выражения, в которых участвует',
        explanation:
          'Верно: любое выражение с any становится any, поэтому ошибки не ловятся и «заражают» соседний код — это главная причина запрещать any в проекте.',
      },
      {
        id: 'b',
        text: 'unknown принимает любое значение, но использовать его можно только после проверки или сужения',
        explanation:
          'Верно: unknown — верхний тип, он совместим со всем входным, но операции над ним требуют предварительного narrowing (typeof, in, instanceof, предикат).',
      },
      {
        id: 'c',
        text: 'never — нижний тип: он присваивается любому типу, а в never нельзя присвоить ничего, кроме never',
        explanation:
          'Верно: never не имеет значений; он подтип всех типов, поэтому подходит для возврата функций, которые всегда бросают исключение, и для исчерпывающих проверок.',
      },
      {
        id: 'd',
        text: 'unknown можно присвоить в string без проверки, потому что unknown — надмножество string',
        explanation:
          'Неверно: надмножество не делает значение строкой. Присваивание unknown в string требует сужения, иначе компилятор не может гарантировать тип.',
      },
    ],
    correctAnswers: ['a', 'b', 'c'],
    explanation:
      'Верные варианты — a, b и c. any — это «дырка» в системе типов: он совместим с любым типом в обе стороны и превращает в any любое выражение, в котором участвует, поэтому ошибки не диагностируются. unknown — противоположность по безопасности: принять можно всё, но до проверки компилятор не разрешает операции, потому что реальный тип неизвестен. never — нижний тип без значений: он присваивается любому типу (never является подтипом всего), но никакой тип, кроме never, не присваивается never. Отсюда два практических применения never: возвращаемый тип функций, которые всегда бросают исключение (throw), и exhaustive-проверки, где остаток union должен схлопнуться в never. Утверждение d путает направление совместимости: unknown — надтип string, поэтому string можно положить в unknown, но не наоборот. Важно и то, что всё это compile-time: any и unknown не меняют поведение в рантайме, а never не существует как значение.',
    commonMistakes: [
      'Считать, что unknown можно использовать так же, как any, раз он принимает всё.',
      'Путать направление совместимости: string → unknown можно, unknown → string нельзя.',
      'Думать, что never — это «любой тип», хотя это тип без значений.',
    ],
    codeExample: `function fail(message: string): never {
  throw new Error(message);
}

function parse(value: unknown): string {
  if (typeof value !== 'string') {
    return fail('Ожидалась строка');
  }
  return value; // value сужен до string
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Дайте три коротких определения: any — отключение проверок, unknown — безопасный верхний тип, never — нижний тип без значений. Сразу приведите практическое применение never: throw и exhaustive switch.',
    hint: 'Сравните направления совместимости: что во что можно присвоить.',
    summary:
      'any отключает проверки, unknown требует сужения, never не имеет значений и используется для throw и исчерпывающих проверок.',
    tags: ['any', 'unknown', 'never'],
  },
  {
    id: 'ts-022',
    category: 'typescript',
    topic: 'Объединения и пересечения',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question:
      'Каким будет тип свойства value у Conflict и можно ли создать значение этого типа без утверждений?',
    code: `type WithString = { value: string };
type WithNumber = { value: number };
type Conflict = WithString & WithNumber;`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'string & number схлопывается в never, поэтому значение типа Conflict без assertion создать нельзя',
        explanation:
          'Верно: пересечение несовместимых примитивов не имеет общих значений и даёт never; ни строка, ни число не подходят под value одновременно.',
      },
      {
        id: 'b',
        text: 'value имеет тип string, потому что первый тип в пересечении побеждает',
        explanation:
          'Ошибочная модель: будто пересечение выбирает «главный» тип. Пересечение требует выполнения обоих, а не приоритета одного из них.',
      },
      {
        id: 'c',
        text: 'value имеет тип string | number: свойства одинакового имени объединяются как union',
        explanation:
          'Ошибочная модель: будто & объединяет типы свойств в union. Наоборот, пересечение сужает: значение должно быть и string, и number.',
      },
      {
        id: 'd',
        text: 'value имеет тип number, потому что последний тип в пересечении побеждает',
        explanation:
          'Ошибочная модель: будто порядок типов в & задаёт победителя. Порядок не влияет на результат, а совместимость проверяется по всем членам.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: value получает тип never, и создать корректное значение Conflict нельзя. Пересечение A & B требует, чтобы значение одновременно принадлежало A и B. Для свойства value это означает требование «string и number одновременно», а таких значений не существует, поэтому пересечение примитивов схлопывается в never. Любой объектный литерал получит ошибку: value: \'x\' не является number, value: 1 не является string, а value: never невозможно заполнить обычным значением — только утверждением или приведением, которое обманывает компилятор. Это не ошибка объявления типа: сам type Conflict валиден и даже полезен как индикатор противоречия, но использовать его для данных нельзя. Практический вывод: если в пересечении одинаковые поля имеют несовместимые типы, это почти всегда ошибка моделирования — стоит проверить, не должен ли это быть union. Исключение — пересечение объектных типов, где одинаковые поля имеют совместимые типы.',
    commonMistakes: [
      'Ожидать, что & объединит string и number в union.',
      'Считать, что порядок типов в пересечении определяет победителя.',
      'Пытаться создать { value: 1 } и удивляться ошибке: число не является строкой.',
    ],
    codeExample: `type Both = { value: string } & { value: string }; // value: string
type Merged = { id: number } & { name: string }; // поля не конфликтуют

const item: Merged = { id: 1, name: 'Ada' };`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Объясните правило: пересечение сужает, union расширяет. Конфликт типов одного свойства при & даёт never — это сигнал, что модель данных противоречива.',
    hint: 'Может ли одно значение быть строкой и числом одновременно?',
    summary:
      'Пересечение несовместимых типов свойства даёт never, поэтому Conflict невозможно корректно создать без утверждения.',
    tags: ['intersection', 'never', 'structural-typing'],
  },
  {
    id: 'ts-023',
    category: 'typescript',
    topic: 'any, unknown и never',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question:
      'Почему в ветке default параметр shape имеет тип never и какую пользу это даёт?',
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function assertNever(value: never): never {
  throw new Error('Необработанный вариант: ' + String(value));
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side * shape.side;
    default:
      return assertNever(shape);
  }
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Все варианты union обработаны, остаток — never; новый kind сломает компиляцию в assertNever',
        explanation:
          'Верно: после двух case компилятор сузил shape до never, поэтому вызов assertNever корректен. Добавление третьего kind сделает shape в default не-never — и сборка упадёт.',
      },
      {
        id: 'b',
        text: 'never появляется потому, что default недостижим в рантайме, и компилятор просто не проверяет вызов',
        explanation:
          'Ошибочная модель: будто default не анализируется. Компилятор как раз проверяет тип shape в default, и именно поэтому вызов assertNever проходит только при исчерпанном union.',
      },
      {
        id: 'c',
        text: 'never — это синоним any в default-ветке switch, поэтому ограничений нет',
        explanation:
          'Неверно: never не синоним any — это тип без значений, и он требует, чтобы в него не попадало ничего, кроме never.',
      },
      {
        id: 'd',
        text: 'Тип never появится только после приведения shape as never, сейчас там Shape',
        explanation:
          'Ошибочная модель: будто сужение в switch не работает. Дискриминированный union сужается по kind автоматически, без утверждений.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ: к моменту default компилятор уже исключил circle и square, и от Shape остался только never — тип без значений. Поэтому shape можно передать в assertNever(value: never), а возвращаемый never совместим с number. Практическая польза — исчерпывающая проверка: если в Shape добавить { kind: \'triangle\' }, то в default тип станет { kind: \'triangle\' }, который не присваивается к never, и TypeScript покажет ошибку в assertNever. Новый вариант нельзя тихо проигнорировать: сборка падает в известном месте. Подчеркнём разницу compile-time и runtime: в рантайме никогда не должно произойти вызова с неизвестным kind, но если данные пришли из внешнего источника, проверка типа их не защищает — там нужна рантайм-валидация. Важно и то, что функция assertNever действительно бросает исключение: если заменить тело на return, тип never станет ложью и ошибка исчезнет из виду. Именно поэтому шаблон требует throw, а не пустого возврата.',
    commonMistakes: [
      'Возвращать в default undefined вместо throw, теряя проверку исчерпываемости.',
      'Считать, что сужение в switch требует приведения as never.',
      'Думать, что never — синоним any, и потому «всё разрешено».',
    ],
    codeExample: `type Status = 'idle' | 'loading' | 'done';

function assertNever(value: never): never {
  throw new Error('Неизвестный статус');
}

function label(status: Status): string {
  switch (status) {
    case 'idle':
      return 'Ожидание';
    case 'loading':
      return 'Загрузка';
    case 'done':
      return 'Готово';
    default:
      return assertNever(status);
  }
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Свяжите три факта: дискриминированный union сужается в switch, после всех case остаётся never, а assertNever превращает остаток в ошибку компиляции. Упомяните throw как обязательное условие честного never.',
    hint: 'Посмотрите, что остаётся от union после обработки всех case.',
    summary:
      'После обработки всех вариантов union в default остаётся never, и assertNever превращает новый вариант в ошибку компиляции.',
    tags: ['never', 'exhaustiveness', 'discriminated-union'],
  },
];
