import type { Question } from '../../types';

export const typescriptPart2: Question[] = [
  {
    id: 'ts-024',
    category: 'typescript',
    topic: 'Utility types',
    difficulty: 'junior',
    type: 'single-choice',
    question:
      'Интерфейс `User` содержит поля `id`, `name`, `email` и `password`. Для публичного API нужен тип со всеми полями, кроме `password`. Какой вариант решает задачу без ручного перечисления полей?',
    options: [
      {
        id: 'a',
        text: 'type PublicUser = Omit<User, "password">',
        explanation:
          'Верно: `Omit` строит объектный тип из ключей `User`, исключая перечисленные, и сохраняет типы оставшихся полей.',
      },
      {
        id: 'b',
        text: 'type PublicUser = Pick<User, "password">',
        explanation:
          'Ошибочная модель: `Pick` делает обратное — оставляет в типе только перечисленные ключи, поэтому получился бы тип с одним паролем.',
      },
      {
        id: 'c',
        text: 'type PublicUser = Partial<User>',
        explanation:
          'Ошибочная модель: `Partial` не удаляет поля, а делает все их необязательными, поэтому `password` остался бы в публичном типе.',
      },
      {
        id: 'd',
        text: 'type PublicUser = Exclude<User, "password">',
        explanation:
          'Ошибочная модель: `Exclude` фильтрует union-типы, а не свойства объекта; `User` не union, поэтому тип вернулся бы без изменений и без ошибки.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный вариант — `Omit<User, "password">`. Внутри утилита определена как `Pick<T, Exclude<keyof T, K>>`: сначала `keyof User` даёт объединение "id" | "name" | "email" | "password", затем `Exclude` вычитает из него "password", а `Pick` собирает оставшиеся свойства вместе с их типами и модификаторами. Результат — `{ id: number; name: string; email: string }`. Дальше работает обычная структурная совместимость: объект `User` подходит под `PublicUser`, потому что содержит все требуемые поля, а лишнее поле не мешает присваиванию (кроме проверки excess property у объектного литерала). Главная ловушка — `Exclude<User, "password">`: он работает с union-членами, а не с ключами, поэтому молча вернёт исходный `User`, и ошибки компиляции не будет. Всё это чисто типовые вычисления, в runtime ничего не выполняется.',
    commonMistakes: [
      'Путают `Omit` и `Pick`: считают, что `Pick` исключает перечисленные ключи, хотя он их оставляет.',
      'Применяют `Exclude` к объектному типу, ожидая удаления свойства; на не-union он возвращает тип без изменений.',
      'Думают, что `Partial<User>` скрывает поле `password`, хотя оно остаётся в типе, просто становится необязательным.',
    ],
    codeExample: `interface Account {
  id: number;
  name: string;
  token: string;
}

type PublicAccount = Omit<Account, 'token'>;
const account: PublicAccount = { id: 7, name: 'Ада' };`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Сформулируйте через реализацию: «Omit — это Pick плюс Exclude по ключам». Так сразу видно, что вы понимаете устройство, а не запомнили имя утилиты.',
    hint: 'Подумайте, какая утилита сначала вычисляет объединение ключей, а потом выбирает подмножество.',
    summary:
      'Omit удаляет ключи из объектного типа и реализован через Pick и Exclude. Exclude фильтрует union-значения, а не свойства объекта.',
    tags: ['utility-types', 'omit', 'pick', 'type-level'],
  },
  {
    id: 'ts-025',
    category: 'typescript',
    topic: 'Discriminated unions',
    difficulty: 'junior',
    type: 'single-choice',
    question:
      'Почему в объединении ниже поле `kind` объявлено литералами "circle" и "square", а не как `kind: string`?',
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number };

function area(shape: Shape): number {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
  }
  return shape.size ** 2;
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Литеральные типы делают члены объединения различимыми: после проверки `shape.kind === "circle"` тип сужается до одного члена, и `shape.radius` становится допустимым.',
        explanation:
          'Верно: уникальный литерал в каждом члене — это дискриминант, по которому работает control flow analysis.',
      },
      {
        id: 'b',
        text: 'Потому что тип `string` нельзя использовать в качестве типа свойства объектного литерала.',
        explanation:
          'Ошибочная модель: `string` — совершенно нормальный тип свойства; проблема не в допустимости, а в потере различимости членов union.',
      },
      {
        id: 'c',
        text: 'Потому что при `kind: string` TypeScript автоматически превращает объединение в `any`.',
        explanation:
          'Ошибочная модель: никакого неявного `any` не возникает; объединение остаётся объединением, но сузить его по `string` невозможно.',
      },
      {
        id: 'd',
        text: 'Потому что литеральные типы проверяются в runtime, а `string` — только на этапе компиляции.',
        explanation:
          'Ошибочная модель: литеральные типы существуют только на этапе компиляции и полностью стираются; в runtime остаётся обычная строка.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ — литеральные типы делают объединение различимым, то есть превращают его в discriminated union. `kind` в каждом члене имеет собственный одиночный литерал, поэтому проверка `shape.kind === "circle"` в control flow analysis отбрасывает все члены, где `kind` не равен этому литералу, и оставляет `{ kind: "circle"; radius: number }`. Внутри ветки `radius` существует, а `size` — нет; вне ветки наоборот. Если объявить `kind: string`, дискриминанта нет: каждый член допускает любое строковое значение, поэтому после проверки компилятор не может исключить второй член, а обращение к `radius` даст ошибку «Property does not exist on type Shape». Сужение работает только на чтении: присваивание `shape.kind = "square"` в переменную типа `Shape` компилятор запретит, потому что это изменило бы форму объекта. Всё это проверки времени компиляции, в JavaScript останется обычное сравнение строк.',
    commonMistakes: [
      'Объявляют дискриминант как `string` или `number` и удивляются, что сужение не работает.',
      'Делают дискриминант необязательным (`kind?: "circle"`), из-за чего пропадает однозначность сужения.',
      'Пытаются присвоить `shape.kind = "square"` и ждут, что тип «переключится»: сужение не меняет объявленный тип переменной.',
    ],
    codeExample: `type Response =
  | { status: 'ok'; data: string }
  | { status: 'error'; message: string };

function describe(response: Response): string {
  return response.status === 'ok' ? response.data : response.message;
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Назовите три условия работоспособности: общее поле-дискриминант, уникальные литеральные значения, проверка на чтение. Это исчерпывающий ответ.',
    hint: 'Речь о том, что происходит с типом переменной внутри `if` после сравнения с литералом.',
    summary:
      'Дискриминант — общее поле с уникальными литеральными типами в каждом члене union. По нему TypeScript сужает тип в `if` и `switch`.',
    tags: ['discriminated-unions', 'narrowing', 'union-types'],
  },
  {
    id: 'ts-026',
    category: 'typescript',
    topic: 'keyof и typeof',
    difficulty: 'junior',
    type: 'code-output',
    question: 'Что выведет в консоль код с объектом sizes и обращением по keyof?',
    code: `const sizes = {
  small: 1,
  medium: 2,
  large: 3,
};

type Size = keyof typeof sizes;

const label: Size = 'medium';
const value = sizes[label];

console.log(value, typeof label);`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: '2 string',
        explanation:
          'Верно: `sizes[label]` равно числу 2, а `typeof` — рантайм-оператор JavaScript, который вернёт строку "string".',
      },
      {
        id: 'b',
        text: '2 "medium"',
        explanation:
          'Ошибочная модель: предполагается, что тип-литерал `"medium"` виден в runtime; на самом деле литеральный тип стёрт, осталось обычное строковое значение.',
      },
      {
        id: 'c',
        text: 'medium 2',
        explanation:
          'Ошибочная модель: перепутан порядок аргументов `console.log`; первым печатается значение из объекта, а не ключ.',
      },
      {
        id: 'd',
        text: 'undefined undefined',
        explanation:
          'Ошибочная модель: считается, что типы нужны для доступа к свойствам в runtime; индекс вычисляется обычным JavaScript и находит свойство.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Ответ — `2 string`. Сначала разберём типы: `typeof sizes` даёт тип объекта `{ small: number; medium: number; large: number }`; без `as const` числовые литералы 1, 2, 3 расширяются до `number`, а не сохраняются как литералы. `keyof` превращает этот объект в объединение ключей "small" | "medium" | "large", поэтому `label` может принимать только одно из трёх значений, и "medium" подходит. `sizes[label]` типизирован как `number` и в runtime возвращает 2. Дальше начинается главное различие: `label` имеет тип-литерал "medium", но выражение `typeof label` — это оператор JavaScript, который выполняется в runtime и всегда возвращает строку "string", потому что все типы TypeScript к этому моменту стёрты. Именно поэтому в выводе `string`, а не "medium". Ошибки компиляции нет: индекс разрешён, так как `label: Size` гарантированно является ключом `sizes`.',
    commonMistakes: [
      'Считают, что `typeof` в выражении — это типовая операция TypeScript, и ждут имя литерала.',
      'Думают, что `keyof typeof obj` даёт `string`, а не объединение конкретных ключей.',
      'Забывают, что без `as const` числовые и строковые значения в объекте расширяются до `number` и `string`.',
    ],
    codeExample: `const route = {
  home: '/',
  about: '/about',
} as const;

type RouteKey = keyof typeof route;
const key: RouteKey = 'home';`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Сразу разделите две вещи: `typeof` в позиции типа — запрос типа, `typeof` в выражении — оператор JavaScript. Это ровно та граница compile-time и runtime, которую проверяют.',
    hint: 'Один `typeof` здесь — типовая конструкция, другой — оператор JavaScript.',
    summary:
      '`typeof obj` в позиции типа даёт тип объекта, `keyof` — объединение его ключей. В выражении `typeof` возвращает строку с именем рантайм-типа.',
    tags: ['keyof', 'typeof', 'type-operators', 'compile-time'],
  },
  {
    id: 'ts-033',
    category: 'typescript',
    topic: 'Utility types',
    difficulty: 'junior',
    type: 'multiple-choice',
    question:
      'Выберите все верные утверждения о встроенных utility-типах TypeScript 5.4.',
    options: [
      {
        id: 'a',
        text: '`Required<T>` убирает необязательность со всех свойств верхнего уровня.',
        explanation:
          'Верно: `Required` — это mapped type с модификатором `-?`, он снимает `?` у каждого ключа `keyof T`.',
      },
      {
        id: 'b',
        text: '`Readonly<T>` делает `readonly` и у вложенных объектов, то есть работает рекурсивно.',
        explanation:
          'Ошибочная модель: `Readonly` поверхностный, он меняет только свойства первого уровня; для глубины нужен собственный рекурсивный mapped type.',
      },
      {
        id: 'c',
        text: '`Record<K, V>` требует, чтобы `K` был `keyof` какого-нибудь существующего интерфейса.',
        explanation:
          'Ошибочная модель: `Record` принимает любой `K extends string | number | symbol`, включая простой union литералов, не связанный ни с каким интерфейсом.',
      },
      {
        id: 'd',
        text: '`NonNullable<T>` убирает из `T` значения `null` и `undefined`.',
        explanation:
          'Верно: `NonNullable` реализован как `T & {}` или как условный тип, вычитающий `null` и `undefined` из union.',
      },
    ],
    correctAnswers: ['a', 'd'],
    explanation:
      'Верны первое и четвёртое. Все utility-типы — это либо mapped types, либо условные типы, и их поведение определяется реализацией. `Required<T>` — это `{ [K in keyof T]-?: T[K] }`: модификатор `-?` снимает необязательность, поэтому `Required<{ a?: number }>` равен `{ a: number }`. `NonNullable<T>` вычитает из union `null` и `undefined`, поэтому `NonNullable<string | null | undefined>` равен `string`; для типа без этих значений он возвращает исходный тип. Утверждение про рекурсивность `Readonly` неверно: `Readonly<T>` — это `{ readonly [K in keyof T]: T[K] }`, то есть `readonly` добавляется только свойствам первого уровня, а вложенный объект остаётся изменяемым. Глубокая версия пишется вручную и требует рекурсии через условный тип. Утверждение про `Record` тоже неверно: `K` ограничен только `string | number | symbol`, поэтому `Record<"a" | "b", number>` совершенно легален. Важная деталь: `Readonly` не замораживает объект в runtime, это исключительно типовая проверка на этапе компиляции.',
    commonMistakes: [
      'Считают `Readonly<T>` глубоким и пытаются менять вложенные поля — компилятор это разрешит.',
      'Думают, что `Record` связан с конкретным интерфейсом и не принимает произвольный union литералов.',
      'Ожидают, что `Readonly` вызовет `Object.freeze`; в runtime объект остаётся обычным и изменяемым.',
    ],
    codeExample: `interface Settings {
  theme?: string;
  lang?: string;
}

type Filled = Required<Settings>;
type Nested = Readonly<{ inner: { value: number } }>;

const nested: Nested = { inner: { value: 1 } };
nested.inner.value = 2;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Отвечайте через определения: `Required` — это `-?`, `Readonly` — это `+readonly` по `keyof T`. Такая формулировка мгновенно показывает глубину.',
    hint: 'Один из вариантов путает поверхностную и глубокую версию утилиты.',
    summary:
      '`Required` снимает `?`, `Readonly` добавляет `readonly` только на первом уровне, `NonNullable` вычитает `null` и `undefined`, а `Record<K, V>` принимает любой `K extends string | number | symbol`.',
    tags: ['utility-types', 'readonly', 'mapped-types', 'record'],
  },
  {
    id: 'ts-027',
    category: 'typescript',
    topic: 'satisfies и as const',
    difficulty: 'junior-plus',
    type: 'multiple-choice',
    question:
      'Выберите все верные утверждения о конструкции `as const satisfies Record<string, string>` в этом коде.',
    code: `const palette = {
  primary: '#0d6efd',
  danger: '#dc3545',
} as const satisfies Record<string, string>;

type Primary = typeof palette.primary;`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: '`satisfies` проверяет совместимость с `Record<string, string>`, но не расширяет выведенный тип: `Primary` остаётся литералом "#0d6efd".',
        explanation:
          'Верно: `satisfies` только валидирует выражение против типа-цели и не меняет тип самого выражения.',
      },
      {
        id: 'b',
        text: 'Без `as const` значения расширились бы до `string`: одного `satisfies` для сохранения литералов недостаточно.',
        explanation:
          'Верно: контекстный тип `Record<string, string>` расширяет значения до `string`, литералы сохраняет именно `as const`.',
      },
      {
        id: 'c',
        text: '`satisfies` заменяет `as const`, поэтому свойства `palette` становятся `readonly` без дополнительных аннотаций.',
        explanation:
          'Ошибочная модель: `satisfies` не добавляет `readonly`; неизменяемость свойств даёт только const-утверждение.',
      },
      {
        id: 'd',
        text: 'Если убрать `satisfies`, `as const` сам проверит, что все значения совместимы с `Record<string, string>`, и проверка не потеряется.',
        explanation:
          'Ошибочная модель: `as const` ничего не проверяет против внешнего типа-цели, поэтому несовместимое значение прошло бы компиляцию.',
      },
    ],
    correctAnswers: ['a', 'b'],
    explanation:
      'Верны первое и второе. Конструкция `as const satisfies T` — это два независимых оператора. `satisfies` проверяет, что тип выражения совместим с `T`, но результат выражения сохраняет свой выведенный тип, а не тип-цель: именно поэтому `typeof palette.primary` остаётся литералом "#0d6efd", а не `string`. `as const` идёт первым и меняет сам выведенный тип: свойства становятся `readonly`, а строковые литералы сохраняются без расширения. Если оставить только `satisfies Record<string, string>`, контекстный тип от `Record` заставит вывести значения как `string`, и литералы потеряются — это самая частая ошибка при попытке «сделать и проверку, и литеральный тип». Если оставить только `as const`, проверки против `Record<string, string>` не будет вообще: неверное значение, например число, спокойно скомпилируется. Отсюда практический вывод: `satisfies` даёт валидацию формы и сохранение вывода, `as const` — литеральность и `readonly`, и вместе они закрывают обе задачи без потери информации о типе.',
    commonMistakes: [
      'Считают, что `satisfies` сам сохраняет литеральные типы, и теряют литералы при выводе.',
      'Думают, что `satisfies` делает объект неизменяемым, и забывают про `as const`.',
      'Пишут `satisfies` вместо `as const` и ждут проверки на этапе компиляции от одного оператора.',
    ],
    codeExample: `type Variant = 'primary' | 'ghost';

const variants = {
  primary: 'primary',
  ghost: 'ghost',
} as const satisfies Record<string, Variant>;

type Known = typeof variants.primary;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Ключевая формулировка: `satisfies` проверяет, но не меняет тип; `as const` меняет тип, но ничего не проверяет. Этого достаточно для полного ответа.',
    hint: 'Сравните, что именно делает каждый из двух операторов: проверку или изменение выведенного типа.',
    summary:
      '`satisfies` валидирует выражение против типа-цели, сохраняя выведенный тип. `as const` фиксирует литералы и `readonly`, но не проверяет форму.',
    tags: ['satisfies', 'as-const', 'type-inference'],
  },
  {
    id: 'ts-028',
    category: 'typescript',
    topic: 'Mapped types',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question: 'Какой тип получится у `UserFlags` после компиляции этого кода?',
    code: `type Flags<T> = {
  [K in keyof T]: boolean;
};

type User = { id: number; name: string };
type UserFlags = Flags<User>;`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: '{ id: boolean; name: boolean }',
        explanation:
          'Верно: mapped type перебирает `keyof User` и для каждого ключа ставит тип `boolean`.',
      },
      {
        id: 'b',
        text: '{ [key: string]: boolean }',
        explanation:
          'Ошибочная модель: это index signature, которая разрешает любые строковые ключи, тогда как mapped type фиксирует ровно `id` и `name`.',
      },
      {
        id: 'c',
        text: '{ id?: boolean; name?: boolean }',
        explanation:
          'Ошибочная модель: необязательность не добавляется сама; для этого нужен модификатор `?` или утилита `Partial`.',
      },
      {
        id: 'd',
        text: '{ id: number; name: string }',
        explanation:
          'Ошибочная модель: правая часть `boolean` заменяет исходные типы значений, а не дополняет их.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный ответ — `{ id: boolean; name: boolean }`. Mapped type `{ [K in keyof T]: boolean }` работает как цикл по объединению ключей: `keyof User` даёт "id" | "name", для каждого ключа создаётся свойство, а тип значения берётся из правой части — здесь это фиксированный `boolean`, поэтому исходные `number` и `string` не используются вообще. Модификаторы при этом переносятся: если бы у `User` было `readonly id`, в результате осталось бы `readonly id: boolean`, потому что `+readonly` или `-readonly` не указаны, а TypeScript по умолчанию копирует модификаторы исходного свойства. Если бы свойство было необязательным, оно тоже осталось бы необязательным. Различие с index signature принципиально: `{ [key: string]: boolean }` разрешает любое строковое имя свойства, а mapped type порождает закрытый набор ключей, и обращение к несуществующему `flags.age` даст ошибку компиляции. Вариант с `?` — это `Partial<Flags<User>>`, то есть другой тип.',
    commonMistakes: [
      'Считают, что mapped type сохраняет исходные типы значений и добавляет к ним новый.',
      'Путают mapped type с index signature и ждут произвольных ключей в результате.',
      'Забывают, что модификаторы `readonly` и `?` копируются, если их явно не изменить.',
    ],
    codeExample: `type Nullable<T> = { [K in keyof T]: T[K] | null };
type Point = { x: number; y: number };
const shifted: Nullable<Point> = { x: null, y: 5 };`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Опишите mapped type как цикл по `keyof T` с копированием модификаторов. Упомяните, что `+?`, `-?`, `readonly` и `-readonly` — это и есть весь механизм utility-типов.',
    hint: 'Смотрите на правую часть определения: она задаёт тип значения для каждого ключа.',
    summary:
      'Mapped type перебирает ключи `keyof T` и задаёт тип значения по единому правилу, копируя модификаторы исходных свойств.',
    tags: ['mapped-types', 'keyof', 'type-level'],
  },
  {
    id: 'ts-029',
    category: 'typescript',
    topic: 'Conditional types и infer',
    difficulty: 'junior-plus',
    type: 'single-choice',
    question: 'Какие типы получат `A` и `B` в этом коде?',
    code: `type ElementType<T> = T extends (infer U)[] ? U : never;

type A = ElementType<string[]>;
type B = ElementType<number>;`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'A = string, B = never',
        explanation:
          'Верно: `string[]` совместим с `(infer U)[]` и выводит `U = string`, а `number` не массив, поэтому выбирается ветвь `never`.',
      },
      {
        id: 'b',
        text: 'A = string[], B = never',
        explanation:
          'Ошибочная модель: `infer U` выводит тип элемента массива, а не сам массив целиком.',
      },
      {
        id: 'c',
        text: 'A = string, B = number',
        explanation:
          'Ошибочная модель: ветвь `: never` не игнорируется; при невыполнении проверки возвращается именно она.',
      },
      {
        id: 'd',
        text: 'A = unknown, B = never',
        explanation:
          'Ошибочная модель: `infer U` выводит конкретный тип из позиции, а не `unknown` по умолчанию.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Ответ — `A = string, B = never`. Условный тип проверяет `T extends (infer U)[]`: для `string[]` это истинно, а `infer U` в позиции элемента массива выводит `string`, поэтому результат `A = string`. Для `number` проверка ложна, потому что число не является массивом, и выбирается вторая ветвь — `never`. Здесь нет дистрибуции по union: дистрибуция включается только тогда, когда проверяемый тип является «голым» параметром `T`, а он и есть голый параметр, но аргумент `string[]` — не union, поэтому распределять нечего. Если бы аргументом был `string[] | number[]`, тип распределился бы по членам и дал `string | number`, а `number` из второго члена дал бы `never`, который в union исчезает. `infer` — чисто типовая конструкция: в рантайме от неё не остаётся ничего, а `never` — это тип «значение невозможно», а не `undefined` и не `null`.',
    commonMistakes: [
      'Думают, что `infer U` выводит весь проверяемый тип, а не его часть из указанной позиции.',
      'Забывают про ветвь ложной проверки и ждут `undefined` вместо `never`.',
      'Путают `never` с `undefined` и `null`, хотя `never` означает невозможность значения.',
    ],
    codeExample: `type Unwrap<T> = T extends Promise<infer U> ? U : T;

type Loaded = Unwrap<Promise<number>>;
type Plain = Unwrap<string>;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Проговорите механизм: проверка `extends`, вывод `infer` из позиции, выбор ветви. Затем добавьте, что дистрибуция включается только для голого параметра-union.',
    hint: 'Проверьте, совместим ли `number` с массивом и что возвращает ложная ветвь.',
    summary:
      'Условный тип выбирает ветвь по совместимости, а `infer` выводит тип из указанной позиции. Ложная ветвь `never` — обычный результат.',
    tags: ['conditional-types', 'infer', 'type-level'],
  },
  {
    id: 'ts-030',
    category: 'typescript',
    topic: 'Utility types',
    difficulty: 'junior-plus',
    type: 'code-completion',
    question:
      'Введите правую часть определения (после знака `=`), которая делает все свойства `Task` необязательными с помощью встроенной утилиты TypeScript: `type DraftTask = ___;`. Введите только тип-выражение.',
    code: `interface Task {
  id: number;
  title: string;
  done: boolean;
}

type DraftTask = ___;`,
    codeLanguage: 'typescript',
    correctAnswers: ['Partial<Task>'],
    completion: {
      acceptedAnswers: ['Partial<Task>'],
      placeholder: 'Введите тип-выражение',
      inputHint: 'Например: Utility<Type>',
      caseSensitive: true,
      ignoreWhitespace: true,
    },
    explanation:
      'Правильный ответ — `Partial<Task>`. Утилита `Partial<T>` реализована как mapped type `{ [K in keyof T]?: T[K] }`: она перебирает все ключи `T` и добавляет каждому модификатор необязательности `?`, сохраняя исходный тип значения. Для `Task` результат — `{ id?: number; title?: string; done?: boolean }`, поэтому допустим объект с любым подмножеством полей, включая пустой. Важно, что `Partial` не удаляет поля и не меняет их типы: `id` по-прежнему `number`, просто может отсутствовать, и при строгом режиме чтение такого свойства даёт `number | undefined`. Если нужен только один необязательный ключ, используют пересечение `Omit<T, "k"> & { k?: T["k"] }`, а не `Partial`. Обратная операция — `Required<T>`, снимающая `?`. Всё это чисто типовые вычисления: в runtime объект остаётся обычным, проверка полноты происходит только на этапе компиляции.',
    commonMistakes: [
      'Пишут `Readonly<Task>`, путая необязательность с неизменяемостью.',
      'Пытаются вручную перечислить все ключи и забывают, что утилита уже делает mapped type за них.',
      'Считают, что `Partial<T>` удаляет свойства, и ждут ошибку при обращении к `draft.id`.',
    ],
    codeExample: `interface Task {
  id: number;
  title: string;
  done: boolean;
}

const draft: Partial<Task> = { title: 'Позвонить' };`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Назовите определение через `?` в mapped type — это показывает, что вы знаете реализацию, а не только имя утилиты. Упомяните, что чтение поля даёт `T | undefined`.',
    hint: 'Утилита называется так же, как слово «частичный».',
    summary:
      '`Partial<T>` делает все свойства необязательными через `?` в mapped type, не удаляя их и не меняя типы значений.',
    tags: ['utility-types', 'partial', 'mapped-types'],
  },
  {
    id: 'ts-031',
    category: 'typescript',
    topic: 'Mapped types',
    difficulty: 'junior-plus',
    type: 'code-output',
    question: 'Что выведет этот код, если он скомпилирован и запущен?',
    code: `type Base = {
  readonly id: number;
  size?: number;
};

type Draft<T> = { -readonly [K in keyof T]-?: T[K] };

const draft: Draft<Base> = { id: 1, size: 2 };
draft.id = 42;

console.log(draft.id, draft.size);`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: '42 2',
        explanation:
          'Верно: `-readonly` снимает запрет на запись, а `-?` делает `size` обязательным, поэтому присваивание проходит и значение равно 2.',
      },
      {
        id: 'b',
        text: '42 undefined',
        explanation:
          'Ошибочная модель: считается, что `-?` не влияет на инициализацию и `size` остаётся пустым, хотя он передан явно.',
      },
      {
        id: 'c',
        text: '1 2',
        explanation:
          'Ошибочная модель: предполагается, что присваивание `draft.id = 42` не сработало, но `readonly` в типе уже снят.',
      },
      {
        id: 'd',
        text: 'Ошибка компиляции: свойство `id` доступно только для чтения',
        explanation:
          'Ошибочная модель: `-readonly` в mapped type как раз убирает модификатор, поэтому запрета на запись нет.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Ответ — `42 2`. Разберём mapped type `{ -readonly [K in keyof T]-?: T[K] }`. Два префикса делают всю работу: `-readonly` снимает модификатор `readonly` с каждого свойства, `-?` снимает необязательность. Поэтому `Draft<Base>` превращается в `{ id: number; size: number }`: оба свойства обязательны и изменяемы. Инициализация `{ id: 1, size: 2 }` проходит, потому что перечислены оба обязательных поля; объект без `size` не скомпилировался бы именно из-за `-?`. Присваивание `draft.id = 42` разрешено, потому что `readonly` в типе больше нет. Переменная объявлена через `const`, но это ограничивает только переприсваивание ссылки, а не мутацию свойств объекта. В итоге `draft.id` равен 42, `draft.size` по-прежнему 2, и в консоль печатается `42 2`. Все ограничения живут только в типах: в JavaScript остаётся обычный изменяемый объект.',
    commonMistakes: [
      'Думают, что `-readonly` и `-?` — это декоративные модификаторы, а не снятие ограничений.',
      'Путают запрет переприсваивания у `const` с запретом менять свойства объекта.',
      'Считают, что `-?` делает свойство обязательным только в аннотации, но не при инициализации литералом.',
    ],
    codeExample: `type Locked = { readonly id: number };
type Unlocked = { -readonly [K in keyof Locked]: Locked[K] };

const item: Unlocked = { id: 1 };
item.id = 2;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Назовите, что делают оба модификатора, и отдельно подчеркните разницу между `const` и `readonly`: это два разных ограничения на разных уровнях.',
    hint: 'Смотрите на префиксы `-readonly` и `-?` в определении `Draft`.',
    summary:
      '`-readonly` снимает неизменяемость, `-?` снимает необязательность. `const` запрещает переприсваивание ссылки, но не мутацию свойств.',
    tags: ['mapped-types', 'readonly', 'modifiers'],
  },
  {
    id: 'ts-032',
    category: 'typescript',
    topic: 'Перегрузки и assertions',
    difficulty: 'junior-plus',
    type: 'find-bug',
    question:
      'Код компилируется, но при открытии страницы падает с ошибкой в runtime. Где причина?',
    code: `type User = { id: number; name: string };

function findUser(id: number): User | undefined {
  return id === 1 ? { id: 1, name: 'Ада' } : undefined;
}

const user = findUser(2) as User;
console.log(user.name.toUpperCase());`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: '`as User` не проверяет значение в runtime: `findUser(2)` вернул `undefined`, поэтому обращение к `user.name` падает с `TypeError`. Нужно проверить результат на `undefined`.',
        explanation:
          'Верно: утверждение типа отключает проверку компилятора, но не создаёт данные; проверка на `undefined` возвращает безопасность.',
      },
      {
        id: 'b',
        text: 'Причина в объявлении возвращаемого типа: достаточно указать `User` вместо `User | undefined`, и приведение станет безопасным.',
        explanation:
          'Ошибочная модель: сужение объявленного типа не меняет фактическое поведение функции, `undefined` всё равно вернётся.',
      },
      {
        id: 'c',
        text: 'Причина в `toUpperCase`: строковые методы недоступны для свойства, тип которого выведен из объектного типа.',
        explanation:
          'Ошибочная модель: `name` имеет тип `string`, и метод существует; падение происходит раньше — при чтении `name` у `undefined`.',
      },
      {
        id: 'd',
        text: 'TypeScript обязан выдать ошибку компиляции на `as User`, потому что union нельзя сузить утверждением типа.',
        explanation:
          'Ошибочная модель: `as` как раз разрешает сужение union, в этом и опасность; компилятор молчит, а ошибка возникает в runtime.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Причина — утверждение типа `as User`. `findUser` возвращает `User | undefined`, и для `id = 2` реально возвращается `undefined`. Оператор `as` в TypeScript — это не преобразование и не проверка: он лишь сообщает компилятору «считай это значение типом `User`», а весь код проверки стирается при сборке. Поэтому `user` получает статический тип `User`, компилятор разрешает `user.name`, а в runtime происходит чтение свойства `name` у `undefined` и выбрасывается `TypeError: Cannot read properties of undefined`. Правильное решение — не утверждать, а проверить: `if (user) { console.log(user.name.toUpperCase()); }` или использовать `user?.name.toUpperCase()`. Утверждение уместно только тогда, когда вы знаете инвариант, который компилятор вывести не может, например после собственной проверки или при работе с внешними данными, и тогда его нужно сопровождать реальной валидацией.',
    commonMistakes: [
      'Верят, что `as` проверяет значение в runtime, как приведение типов в других языках.',
      '«Чинят» ошибку объявлением более узкого возвращаемого типа вместо проверки значения.',
      'Путают `as User` и `as User | undefined`: второй вариант хотя бы не скрывает возможный `undefined`.',
    ],
    codeExample: `function findUser(id: number): User | undefined {
  return id === 1 ? { id: 1, name: 'Ада' } : undefined;
}

const user = findUser(2);
if (user) {
  console.log(user.name.toUpperCase());
}`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Скажите прямо: `as` — это обещание разработчика, а не проверка. Затем предложите `if (user)` или `?.` как безопасную альтернативу.',
    hint: 'Проверьте, что именно возвращает функция при `id = 2` и что делает `as` в runtime.',
    summary:
      'Утверждение типа `as` не влияет на runtime и не проверяет значение. Оно лишь заставляет компилятор поверить в тип, поэтому `undefined` проникает дальше и падает при обращении к свойству.',
    tags: ['debug', 'type-assertions', 'type-safety', 'undefined'],
  },
  {
    id: 'ts-034',
    category: 'typescript',
    topic: 'React и типизация',
    difficulty: 'junior-plus',
    type: 'scenario',
    question:
      'Компонент `Button` должен принимать обязательный проп `variant` ("primary" или "ghost") и при этом все нативные атрибуты `<button>`: `type`, `disabled`, `onClick`, `aria-*` и остальные. Проект использует React 18 и `@types/react`. Какой тип пропсов выбрать?',
    code: `<Button variant="ghost" type="submit" onClick={handleClick}>
  Отправить
</Button>`,
    codeLanguage: 'tsx',
    options: [
      {
        id: 'a',
        text: 'type ButtonProps = { variant: "primary" | "ghost" } & React.ComponentPropsWithoutRef<"button">',
        explanation:
          'Верно: объединение собственных пропсов с полным набором атрибутов кнопки даёт и проверку `variant`, и все нативные свойства с корректными обработчиками.',
      },
      {
        id: 'b',
        text: 'type ButtonProps = React.FC<{ variant: "primary" | "ghost" }>',
        explanation:
          'Ошибочная модель: `React.FC` — это тип компонента, а не тип пропсов; кроме того, такой компонент не примет `type`, `disabled` и остальные нативные атрибуты.',
      },
      {
        id: 'c',
        text: 'type ButtonProps = { variant: "primary" | "ghost"; onClick: () => void }',
        explanation:
          'Ошибочная модель: ручное перечисление сужает `onClick` до функции без аргумента и теряет все остальные атрибуты кнопки.',
      },
      {
        id: 'd',
        text: 'type ButtonProps = HTMLButtonElement',
        explanation:
          'Ошибочная модель: `HTMLButtonElement` — это DOM-инстанс с методами вроде `click()`, а не объект пропсов React.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный вариант — пересечение собственных пропсов с `React.ComponentPropsWithoutRef<"button">`. Этот тип извлекает пропсы нативного элемента `button` из JSX-типов: `type`, `disabled`, `form`, `aria-*`, `onClick` с правильной сигнатурой `MouseEvent<HTMLButtonElement>`. Пересечение добавляет обязательный `variant` с union литералов, поэтому `variant="ghost"` проходит, а `variant="secondary"` — нет. `WithoutRef` используют, потому что `ref` в React 18 не является обычным пропсом: он передаётся через `forwardRef`, и если оставить `ref` в типе пропсов, компонент начнёт обещать поддержку, которой у него нет. Порядок в пересечении важен в другом смысле: если пересекать с типом, где есть конфликтующее свойство с более широким типом, оно может «размыть» узкий литерал, поэтому в реальных проектах собственные пропсы иногда добавляют к результату `Omit<React.ComponentProps<"button">, "variant">`. Ручное перечисление атрибутов плохо тем, что оно отстаёт от изменений в DOM-типах и легко теряет события и `aria`-атрибуты.',
    commonMistakes: [
      'Пишут `React.FC<Props>`, хотя нужен именно тип пропсов, и теряют нативные атрибуты.',
      'Забывают, что `React.ComponentProps<"button">` включает `ref`, и обещают поддержку ссылки без `forwardRef`.',
      'Ручное перечисление `onClick` без аргумента, из-за чего обработчик несовместим с реальным событием мыши.',
    ],
    codeExample: `import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = {
  variant: 'primary' | 'ghost';
} & ComponentPropsWithoutRef<'button'>;

export function Button({ variant, type, disabled }: ButtonProps) {
  return (
    <button data-variant={variant} type={type} disabled={disabled}>
      Отправить
    </button>
  );
}`,
    codeExampleLanguage: 'tsx',
    interviewTip:
      'Назовите `ComponentPropsWithoutRef<"button">` и объясните, почему `WithoutRef`: это показывает понимание того, как `ref` устроен в React 18.',
    hint: 'Нужен способ получить уже существующий тип нативных пропсов, а не переписать их руками.',
    summary:
      'Пропсы-обёртки над нативным элементом типизируют как пересечение собственных пропсов с `ComponentPropsWithoutRef<"element">`.',
    tags: ['react', 'props', 'component-props', 'tsx'],
  },
  {
    id: 'ts-035',
    category: 'typescript',
    topic: 'Conditional types и infer',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Чему равен `A` и почему?',
    code: `type IsNever<T> = T extends never ? true : false;

type A = IsNever<never>;`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'never: `never` — пустой union, дистрибутивный условный тип по нему не выполняется ни для одного члена.',
        explanation:
          'Верно: при дистрибуции по пустому union результат тоже пустой, то есть `never`, а не `true`.',
      },
      {
        id: 'b',
        text: 'true: `never` совместим с любым типом, поэтому проверка всегда истинна.',
        explanation:
          'Ошибочная модель: совместимость здесь ни при чём, `never` распределяется по членам, а членов нет.',
      },
      {
        id: 'c',
        text: 'false: `never` не является полноценным типом, поэтому ветвь `extends` не выбирается.',
        explanation:
          'Ошибочная модель: `never` — полноценный тип; проблема именно в дистрибуции по пустому объединению.',
      },
      {
        id: 'd',
        text: 'boolean: TypeScript не может выбрать ветвь и объединяет `true` и `false`.',
        explanation:
          'Ошибочная модель: в условных типах нет «неопределённого» выбора, компилятор детерминированно берёт одну ветвь.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Ответ — `never`. Когда проверяемый тип является «голым» параметром `T`, условный тип дистрибутивен: он применяется к каждому члену union отдельно, а результаты объединяются. `never` — это пустой union, у него ноль членов, поэтому дистрибуция не выполняется ни разу, и объединение пустого множества результатов — снова `never`. Именно поэтому `IsNever<never>` не даёт `true`: ветвь `true` не выбирается никогда. Для `string` дистрибуция по одному члену даст `false`, и разница проявится только на `never`. Классическое решение — отключить дистрибуцию, обернув параметр в кортеж: `type IsNever<T> = [T] extends [never] ? true : false`. Теперь `T` не голый, проверка идёт целиком, и `IsNever<never>` даёт `true`. То же самое нужно учитывать при проверках вроде `T extends any[]` для объединений: результат может оказаться не тем, что ожидается по интуиции.',
    commonMistakes: [
      'Считают, что `T extends never` — это проверка «является ли тип never», и получают неожиданный `never`.',
      'Забывают, что дистрибутивность включается только для голого параметра, и удивляются поведению на union.',
      'Используют `[T] extends [never]`, не понимая, что кортеж отключает дистрибуцию, и не могут объяснить зачем.',
    ],
    codeExample: `type IsNever<T> = [T] extends [never] ? true : false;
type WithTuple = IsNever<never>;
type WithoutTuple = IsNever<string>;

type Distributed<T> = T extends never ? 'empty' : 'filled';`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Назовите три слова: «дистрибутивность по пустому union». Затем покажите обёртку в кортеж как стандартный приём отключения дистрибуции.',
    hint: 'Что происходит с условным типом, когда объединение пустое?',
    summary:
      'Условный тип по голому параметру дистрибутивен, а `never` — пустой union. Поэтому `T extends never ? true : false` при `T = never` даёт `never`, а не `true`.',
    tags: ['conditional-types', 'never', 'distributive-types'],
  },
  {
    id: 'ts-036',
    category: 'typescript',
    topic: 'Utility types',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Какой тип получит `Parsed` в этом коде?',
    code: `function parse(input: string): string[];
function parse(input: number): number;
function parse(input: string | number) {
  return typeof input === 'string' ? input.split(',') : input;
}

type Parsed = ReturnType<typeof parse>;`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'number',
        explanation:
          'Верно: `ReturnType` выводит результат из последней сигнатуры перегрузки, а последняя объявленная перегрузка возвращает `number`.',
      },
      {
        id: 'b',
        text: 'string[]',
        explanation:
          'Ошибочная модель: берётся первая перегрузка, тогда как вывод идёт с конца списка сигнатур.',
      },
      {
        id: 'c',
        text: 'string[] | number',
        explanation:
          'Ошибочная модель: `ReturnType` не объединяет сигнатуры, он выводит результат из одной — последней.',
      },
      {
        id: 'd',
        text: 'string | number',
        explanation:
          'Ошибочная модель: это типы входных параметров, а не возвращаемого значения; `Parsed` описывает результат.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Ответ — `number`. `ReturnType<T>` — это условный тип, который выводит результат `R` из типа функции: он проверяет совместимость `T` с сигнатурой, возвращающей `R`, и подставляет выведенный тип. У перегруженной функции `typeof parse` содержит несколько сигнатур вызова, а сигнатура реализации снаружи вообще не видна: её нельзя вызвать напрямую. При выводе из набора сигнатур TypeScript берёт последнюю сигнатуру вызова, поэтому `R` выводится из `(input: number) => number`, и `Parsed` равен `number`, хотя первая перегрузка возвращает `string[]`. Это распространённое место ошибок: люди ожидают объединение всех возвращаемых типов и получают тип, который выглядит «случайным». То же правило действует для `Parameters<typeof parse>` — это кортеж `[input: number]`. Если объединение действительно нужно, перегрузки заменяют одной сигнатурой с union параметров и union результата либо описывают тип результата вручную. Это исключительно типовая операция: тело функции тут ни при чём.',
    commonMistakes: [
      'Считают, что `ReturnType` собирает объединение всех перегрузок.',
      'Думают, что в тип попадает сигнатура реализации, и ждут `string[] | number`.',
      'Забывают, что перегрузки — это только типы, а рантайм-функция одна и её тело не влияет на вывод.',
    ],
    codeExample: `function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}

type Formatted = ReturnType<typeof format>;
type Args = Parameters<typeof format>;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Скажите: «для перегруженных функций ReturnType и Parameters описывают последнюю перегрузку». Это конкретный факт, который отличает знание от догадки.',
    hint: 'Посмотрите, какая сигнатура объявлена последней, и вспомните, что реализация снаружи не видна.',
    summary:
      '`ReturnType` выводит результат из последней сигнатуры перегрузки, а не из объединения всех и не из реализации.',
    tags: ['utility-types', 'return-type', 'overloads'],
  },
  {
    id: 'ts-037',
    category: 'typescript',
    topic: 'Conditional types и infer',
    difficulty: 'middle',
    type: 'multiple-choice',
    question: 'Выберите все верные утверждения об `infer` в условных типах.',
    options: [
      {
        id: 'a',
        text: '`infer` допустим только в ветви `extends` условного типа и вводит переменную, значение которой выводится из проверяемого типа.',
        explanation:
          'Верно: `infer` работает как образец в проверке совместимости, и из него TypeScript выводит конкретный тип.',
      },
      {
        id: 'b',
        text: 'Если один и тот же `infer U` встречается в нескольких позициях, TypeScript берёт первый по порядку записи.',
        explanation:
          'Ошибочная модель: несколько ковариантных кандидатов объединяются в union, а контравариантные — в пересечение.',
      },
      {
        id: 'c',
        text: '`infer` работает в runtime и возвращает фактический тип значения, поэтому его можно применить к переменной.',
        explanation:
          'Ошибочная модель: `infer` существует только на этапе компиляции и стирается вместе с остальными типами.',
      },
      {
        id: 'd',
        text: 'Начиная с TypeScript 4.7 переменную `infer` можно ограничить: `infer U extends string`.',
        explanation:
          'Верно: ограничение проверяет кандидата, и несовместимый тип отсекается, что позволяет точнее описывать шаблоны.',
      },
    ],
    correctAnswers: ['a', 'd'],
    explanation:
      'Верны первое и четвёртое. `infer` — это конструкция условного типа, которая объявляет переменную прямо в проверке `extends`: `T extends (infer U)[] ? U : never` означает «если `T` — массив, выведи тип его элемента в `U`». Использовать `infer` вне ветви `extends` нельзя, а в правой (истинной или ложной) ветви он уже считается обычной типовой переменной. С TypeScript 4.7 у переменной появилось ограничение: `T extends (infer U extends string)[] ? U : never` проверяет, что выведенный кандидат совместим с `string`, и при несовместимости ветвь не выбирается. Утверждение про «первый по порядку» неверно: если один и тот же `infer U` стоит в нескольких ковариантных позициях, например `{ a: infer U; b: infer U }`, TypeScript объединяет кандидатов в union, а в контравариантных позициях — пересекает. И `infer` не имеет никакого отношения к runtime: после компиляции от него не остаётся ни кода, ни метаданных, поэтому «применить к переменной» невозможно.',
    commonMistakes: [
      'Пытаются использовать `infer` вне условного типа, например в обычном generic-параметре.',
      'Ждут, что при нескольких позициях `infer U` возьмётся первый кандидат, а получают union.',
      'Считают, что `infer` доступен в runtime и может дать имя типа значения.',
    ],
    codeExample: `type SecondArg<F> = F extends (first: infer A, second: infer B) => unknown ? B : never;

type Name = SecondArg<(id: number, name: string) => void>;
type Numeric<T> = T extends infer U extends number ? U : never;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Разделите три факта: где разрешён `infer`, как объединяются кандидаты и что с 4.7 появилось ограничение `extends`. Этого достаточно для уверенного ответа.',
    hint: 'Один из вариантов путает вывод типа с работой в runtime.',
    summary:
      '`infer` объявляет типовую переменную только в `extends`-ветви и выводит её из позиции. Ковариантные кандидаты объединяются в union, а с 4.7 доступно ограничение `infer U extends T`.',
    tags: ['conditional-types', 'infer', 'type-inference'],
  },
  {
    id: 'ts-038',
    category: 'typescript',
    topic: 'Conditional types и infer',
    difficulty: 'middle',
    type: 'code-output',
    question: 'Что выведет этот код? Укажите значения двух строк по порядку.',
    code: `type ApiResponse =
  | { status: 'ok'; data: string }
  | { status: 'error'; message: string };

type DataOf<T> = T extends { data: infer D } ? D : never;

function extract(response: ApiResponse): DataOf<ApiResponse> {
  return response.status === 'ok' ? response.data : 'нет данных';
}

console.log(extract({ status: 'ok', data: 'готово' }));
console.log(extract({ status: 'error', message: 'сбой' }));`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Первая строка: готово, вторая строка: нет данных',
        explanation:
          'Верно: ветвь `ok` возвращает поле `data`, ветвь `error` — строку-заглушку, обе совместимы с вычисленным `string`.',
      },
      {
        id: 'b',
        text: 'Первая строка: готово, вторая строка: undefined',
        explanation:
          'Ошибочная модель: считается, что `infer D` для второго члена union даёт `undefined`, но дистрибуция даёт `never`, который исчезает из union.',
      },
      {
        id: 'c',
        text: 'Первая строка: готово, вторая строка: никогда не выполнится из-за ошибки',
        explanation:
          'Ошибочная модель: тип вычисляется на этапе компиляции и не бросает исключений; обе строки выполнятся.',
      },
      {
        id: 'd',
        text: 'Код не скомпилируется: у второго члена union нет поля `data`, поэтому `DataOf<ApiResponse>` не выводится.',
        explanation:
          'Ошибочная модель: условный тип дистрибутивен по union и обрабатывает каждый член отдельно, несовпадение даёт `never`.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Ответ: `готово`, затем `нет данных`. Разберём тип: `DataOf<T>` — дистрибутивный условный тип, потому что `T` в проверке голый параметр. Для `ApiResponse` он применяется к каждому члену: `{ status: "ok"; data: string } extends { data: infer D }` истинно и даёт `D = string`; `{ status: "error"; message: string }` не имеет поля `data`, поэтому даёт `never`. Объединение `string | never` схлопывается в `string` — это важное свойство `never` в union. Значит, функция обязана вернуть `string`, и обе ветви это выполняют: в ветви `ok` возвращается `response.data`, в ветви `error` — литерал "нет данных", который расширяется до `string`. В runtime условные типы не существуют: остаётся обычное ветвление по `status`, два вызова и два `console.log`, поэтому в консоли появляются строки `готово` и `нет данных` по порядку. Обратите внимание, что `never` здесь — не «пустой результат» и не `undefined`, а отсутствие варианта, которое не влияет на итоговый union.',
    commonMistakes: [
      'Думают, что несовпадение ветви даёт `undefined`, и ждут `string | undefined`.',
      'Забывают про дистрибутивность и считают, что весь union проверяется целиком и даёт `never`.',
      'Ожидают ошибку компиляции из-за неполного совпадения членов union.',
    ],
    codeExample: `type Element<T> = T extends readonly (infer U)[] ? U : never;

type Mixed = (string[] | number[])[number];
type Result = Element<string[]> | Element<boolean>;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Проговорите порядок: дистрибуция по членам, вывод `infer` в подходящем, `never` в неподходящем, схлопывание union. И отдельно — что рантайм не меняется.',
    hint: 'Примените условный тип к каждому члену объединения отдельно.',
    summary:
      'Дистрибутивный условный тип обрабатывает каждый член union, а несовпавшие дают `never`, который исчезает из объединения. В runtime остаётся обычное ветвление.',
    tags: ['conditional-types', 'infer', 'distributive-types', 'runtime'],
  },
  {
    id: 'ts-039',
    category: 'typescript',
    topic: 'Generics',
    difficulty: 'middle',
    type: 'find-bug',
    question: 'Код не компилируется. В чём причина и как исправить?',
    code: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

const numbers = [1, 2, 3];
const value = first<string>(numbers);

console.log(value?.length);`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Явный аргумент `first<string>` фиксирует `T = string`, поэтому `number[]` больше не подходит под `T[]`. Нужно вызвать `first(numbers)` и дать вывести `T = number`.',
        explanation:
          'Верно: явный аргумент отключает вывод из аргументов функции, и параметр проверяется уже против `string[]`.',
      },
      {
        id: 'b',
        text: 'Ошибка в возвращаемом типе `T | undefined`: нужно объявить `T`, иначе `value?.length` не компилируется.',
        explanation:
          'Ошибочная модель: `T | undefined` корректен при `noUncheckedIndexedAccess`, и `?.` как раз рассчитан на такой тип.',
      },
      {
        id: 'c',
        text: 'Ошибка в `items[0]`: индексный доступ возвращает `T`, поэтому `undefined` в union лишний и ломает вывод.',
        explanation:
          'Ошибочная модель: при включённом `noUncheckedIndexedAccess` индекс даёт `T | undefined`, и это не влияет на вывод `T` из аргумента.',
      },
      {
        id: 'd',
        text: 'Нужно объявить `function first<T extends unknown[]>(items: T)`, иначе TypeScript не выводит `T` из массива.',
        explanation:
          'Ошибочная модель: вывод из `T[]` работает и без ограничения, а такое ограничение изменило бы смысл `T` на тип самого массива.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Причина — явный аргумент типа в вызове `first<string>(numbers)`. Когда вы указываете generic-аргумент вручную, TypeScript не выводит его из аргументов функции, а фиксирует: `T = string`. После этого параметр `items` ожидает `string[]`, а передан `number[]`, и компилятор сообщает, что `number[]` несовместим с `string[]`. Возвращаемый тип при этом равен `string | undefined`, поэтому `.length` компилятор бы разрешил — сломалась именно передача аргумента. Исправление — убрать явный аргумент и позволить выводу сработать: `first(numbers)` даёт `T = number` и тип `number | undefined`. Второй вариант — передать совместимый аргумент, если `string` действительно нужен. Важно понимать, что дженерик здесь не «приводит» массив к другому типу: он лишь параметризует сигнатуру, а совместимость аргументов проверяется после подстановки. `T | undefined` в возвращаемом типе корректен и связан с `noUncheckedIndexedAccess`: индексный доступ может вернуть `undefined`, и `?.` его корректно обрабатывает.',
    commonMistakes: [
      'Думают, что явный generic-аргумент — это приведение типа, и ожидают компиляцию с «подходящим» массивом.',
      'Считают, что `undefined` в возвращаемом типе — ошибка, хотя он отражает реальное поведение индексации.',
      'Добавляют ограничение `T extends unknown[]`, меняя смысл параметра вместо исправления вызова.',
    ],
    codeExample: `function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const numbers = [1, 2, 3];
const value = first(numbers);
const length = value ?? 0;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Объясните правило: явный generic-аргумент отключает вывод и включает проверку. Дальше ошибка читается автоматически.',
    hint: 'Сравните типы аргумента и параметра после подстановки явного generic-аргумента.',
    summary:
      'Явный generic-аргумент фиксирует параметр и отключает вывод из аргументов функции, поэтому несовместимый аргумент сразу даёт ошибку компиляции.',
    tags: ['debug', 'generics', 'type-inference'],
  },
  {
    id: 'ts-040',
    category: 'typescript',
    topic: 'React и типизация',
    difficulty: 'middle',
    type: 'scenario',
    question:
      'Компонент `List` рендерит массив элементов через render-функцию. Как типизировать его так, чтобы тип `item` в `renderItem` автоматически выводился из `items` и проверялся компилятором?',
    code: `<List
  items={[{ id: 1, title: 'Первый' }]}
  renderItem={(item) => item.title}
/>`,
    codeLanguage: 'tsx',
    options: [
      {
        id: 'a',
        text: 'Сделать компонент generic: type ListProps<T> = { items: T[]; renderItem: (item: T) => React.ReactNode } и function List<T>(props: ListProps<T>).',
        explanation:
          'Верно: `T` выводится из литерала массива, поэтому `item` получает конкретный тип элемента и его поля проверяются.',
      },
      {
        id: 'b',
        text: 'type ListProps = { items: unknown[]; renderItem: (item: unknown) => React.ReactNode } и обычный компонент без generic.',
        explanation:
          'Ошибочная модель: `unknown` безопаснее `any`, но внутри `renderItem` работать с `item` нельзя без сужения, а вывод типа теряется.',
      },
      {
        id: 'c',
        text: 'type ListProps = { items: any[]; renderItem: (item: any) => React.ReactNode } и обычный компонент без generic.',
        explanation:
          'Ошибочная модель: `any` отключает проверку, поэтому опечатка вроде `item.titel` пройдёт компиляцию и сломается в runtime.',
      },
      {
        id: 'd',
        text: 'const List: React.FC<{ items: unknown[]; renderItem: (item: unknown) => React.ReactNode }> с фиксированным `unknown`.',
        explanation:
          'Ошибочная модель: `React.FC` фиксирует пропсы один раз, поэтому generic-параметр не выводится из вызова и тип элемента теряется.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Верный подход — сделать компонент generic по типу элемента. В `ListProps<T>` поле `items: T[]` становится точкой вывода, а `renderItem: (item: T) => React.ReactNode` использует тот же `T`, поэтому компилятор выводит `T = { id: number; title: string }` из литерала массива и проверяет `item.title` внутри render-функции; опечатка сразу даёт ошибку. С `unknown[]` тип элемента теряется: внутри функции придётся делать ручное сужение или приведение, и никакой проверки полей не будет. С `any[]` проверка отключается полностью — компилятор промолчит даже при обращении к несуществующему свойству. `React.FC` фиксирует пропсы в момент объявления типа, поэтому generic-параметр не выводится из вызова и превращается в `unknown`. В `.tsx` есть синтаксическая тонкость: если компонент объявлен стрелочной функцией и generic-параметр `<T>` стоит сразу после знака равенства, парсер путает его с JSX-элементом, поэтому нужно писать `<T,>`, либо использовать function declaration — она разбирается однозначно. На интерфейс `ListProps<T>` это ограничение не распространяется.',
    commonMistakes: [
      'Оставляют `items: unknown[]` и ждут вывода типа элемента без generic-параметра.',
      'Используют `any` и считают, что проверка типов просто «менее строгая», хотя она отключается полностью.',
      'Объявляют generic-компонент стрелочной функцией без запятой в `.tsx` и получают ошибку парсинга JSX.',
    ],
    codeExample: `import type { ReactNode } from 'react';

type ListProps<T> = {
  items: readonly T[];
  renderItem: (item: T) => ReactNode;
};

export function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}`,
    codeExampleLanguage: 'tsx',
    interviewTip:
      'Скажите, что generic-параметр в пропсах — это точка вывода типа, и что `unknown` требует сужения, а `any` отключает проверку. Про `<T,>` в tsx упомяните как деталь парсера.',
    hint: 'Тип элемента должен быть параметром, а не `unknown` или `any`.',
    summary:
      'Переиспользуемый компонент со списком типизируют как generic: `T` выводится из `items` и связывает тип элемента с `renderItem`.',
    tags: ['react', 'generics', 'props', 'tsx'],
  },
  {
    id: 'ts-041',
    category: 'typescript',
    topic: 'Mapped types',
    difficulty: 'middle',
    type: 'code-completion',
    question:
      'Введите правую часть определения (после знака `=`): mapped type, который убирает `readonly` со всех свойств `T` и сохраняет типы значений. Используйте параметр `K` и обращение `T[K]`: `type Writable<T> = ___;`.',
    code: `type Config = {
  readonly host: string;
  readonly port: number;
};

type Writable<T> = ___;`,
    codeLanguage: 'typescript',
    correctAnswers: ['{ -readonly [K in keyof T]: T[K] }'],
    completion: {
      acceptedAnswers: ['{ -readonly [K in keyof T]: T[K] }', '{-readonly [K in keyof T]: T[K]}'],
      placeholder: 'Введите mapped type',
      inputHint: 'Формат: { модификатор [K in keyof T]: T[K] }',
      caseSensitive: true,
      ignoreWhitespace: true,
    },
    explanation:
      'Правильный ответ — `{ -readonly [K in keyof T]: T[K] }`. Синтаксис mapped type состоит из трёх частей: модификатор перед `[K in keyof T]`, сама итерация по ключам и тип значения после двоеточия. Префикс `-readonly` снимает модификатор `readonly` с каждого свойства (просто `readonly` или `+readonly` его добавляли бы), а `T[K]` — это indexed access, который сохраняет исходный тип значения конкретного ключа. В результате `Writable<{ readonly id: number; readonly name: string }>` равен `{ id: number; name: string }`, и присваивание `obj.id = 1` компилируется. Необязательность при этом не меняется: если свойство было `?`, оно останется необязательным, потому что `-?` не указан. Важно, что это чисто типовая операция: она не добавляет `Object.freeze` и не влияет на runtime, поэтому изменяемость объекта определяется только его фактическим состоянием. Если исходный тип содержит индексную сигнатуру или перечисление из union ключей, конструкция работает так же — `keyof T` даёт объединение ключей.',
    commonMistakes: [
      'Пишут `readonly` вместо `-readonly` и получают тип, где модификатор добавлен, а не снят.',
      'Забывают `[K in keyof T]` и пытаются использовать `readonly: T[K]`, что даёт обычное свойство с именем readonly.',
      'Ставят `?` или `-?` и неожиданно меняют необязательность, хотя задача была только про `readonly`.',
    ],
    codeExample: `type Writable<T> = { -readonly [K in keyof T]: T[K] };

type Config = { readonly host: string; readonly port: number };
const config: Writable<Config> = { host: 'local', port: 80 };
config.port = 8080;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Проговорите три позиции mapped type: модификатор, итерация `[K in keyof T]`, тип значения `T[K]`. Тогда `Required`, `Readonly` и их инверсии перестают быть магией.',
    hint: 'Снятие модификатора в mapped type записывается со знаком минус перед ключевым словом.',
    summary:
      '`{ -readonly [K in keyof T]: T[K] }` снимает `readonly`, сохраняя типы значений. `-?` и `-readonly` — стандартный способ убрать модификаторы.',
    tags: ['mapped-types', 'readonly', 'indexed-access'],
  },
  {
    id: 'ts-042',
    category: 'typescript',
    topic: 'Mapped types',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Какой тип получится у `Result` в этом коде?',
    code: `type EventName = 'click' | 'focus';

type Handlers = {
  [K in EventName as \`on\${Capitalize<K>}\`]: () => void;
};

type Result = keyof Handlers;`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: '"onClick" | "onFocus"',
        explanation:
          'Верно: `as` переименовывает ключ, `Capitalize` делает первую букву заглавной, а префикс добавляется шаблонным литеральным типом.',
      },
      {
        id: 'b',
        text: '"onclick" | "onfocus"',
        explanation:
          'Ошибочная модель: `Capitalize` меняет первую букву на заглавную; без него получились бы именно такие ключи.',
      },
      {
        id: 'c',
        text: '"click" | "focus"',
        explanation:
          'Ошибочная модель: клауза `as` заменяет исходные ключи вычисленными, поэтому прежние имена в результат не попадают.',
      },
      {
        id: 'd',
        text: 'string',
        explanation:
          'Ошибочная модель: шаблонный литеральный тип с конкретными подстановками даёт замкнутый union литералов, а не `string`.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Ответ — "onClick" | "onFocus". Ключевая часть — клауза `as` в mapped type, которая позволяет переименовать ключ: выражение справа от `as` должно давать `string | number | symbol`, и оно вычисляется для каждого `K` отдельно. Для `K = "click"` получаем шаблонный литеральный тип: подстановка `Capitalize<"click">` даёт `"Click"`, а шаблон `on${Capitalize<K>}` собирает `"onClick"`. Для `"focus"` аналогично выходит `"onFocus"`. Затем `keyof Handlers` возвращает объединение получившихся ключей, то есть `"onClick" | "onFocus"`. Результат — замкнутый набор литералов, а не `string`, потому что шаблон с конкретными подстановками не расширяется. Типы значений при переименовании сохраняются: оба обработчика имеют тип `() => void`. Полезное свойство клаузы `as` — возможность фильтровать ключи: если выражение даёт `never`, ключ удаляется из результата, что часто используют вместе с условными типами. Всё это существует только на этапе компиляции.',
    commonMistakes: [
      'Считают, что `as` в mapped type — это приведение типа значения, а не переименование ключа.',
      'Забывают про `Capitalize` и ждут ключи в нижнем регистре.',
      'Думают, что шаблонный литеральный тип с подстановкой даёт `string`, и теряют точность union.',
    ],
    codeExample: `type Keys = 'a' | 'b';

type Prefixed = { [K in Keys as \`x\${K}\`]: number };
type PrefixedKeys = keyof Prefixed;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Назовите три элемента: клауза `as`, шаблонный литеральный тип, `Capitalize`. И добавьте, что `never` в правой части удаляет ключ.',
    hint: 'Смотрите на правую часть клаузы `as`: там шаблон с префиксом и утилита для регистра.',
    summary:
      'Клауза `as` в mapped type переименовывает ключи через шаблонные литеральные типы. `Capitalize` и префикс дают `"onClick" | "onFocus"`.',
    tags: ['mapped-types', 'key-remapping', 'template-literal-types'],
  },
  {
    id: 'ts-043',
    category: 'typescript',
    topic: 'Перегрузки и assertions',
    difficulty: 'middle',
    type: 'multiple-choice',
    question: 'Выберите все верные утверждения о перегрузках функций в TypeScript 5.4.',
    options: [
      {
        id: 'a',
        text: 'Вызывающему коду виден список перегрузок: проверка вызова идёт по нему, а сигнатура реализации снаружи недоступна.',
        explanation:
          'Верно: реализация не участвует в разрешении вызова, её нельзя вызвать напрямую — только через объявленные перегрузки.',
      },
      {
        id: 'b',
        text: 'Реализация должна быть совместима с каждой перегрузкой, иначе компилятор сообщит о несовместимости перегрузки с реализацией.',
        explanation:
          'Верно: это отдельная проверка, и её сообщение — «This overload signature is not compatible with its implementation signature».',
      },
      {
        id: 'c',
        text: 'Если ни одна перегрузка не подошла, TypeScript попробует сигнатуру реализации, потому что она тоже участвует в разрешении вызова.',
        explanation:
          'Ошибочная модель: реализация исключена из разрешения вызова; при несовпадении со всеми перегрузками будет ошибка.',
      },
      {
        id: 'd',
        text: 'Порядок объявления важен: из нескольких подходящих перегрузок выбирается первая сверху.',
        explanation:
          'Верно: разрешение идёт по списку сверху вниз и останавливается на первой совместимой сигнатуре.',
      },
    ],
    correctAnswers: ['a', 'b', 'd'],
    explanation:
      'Верны первое, второе и четвёртое. Перегрузки в TypeScript — это набор сигнатур вызова плюс одна реализация, и снаружи виден только этот набор: сигнатура реализации не участвует в разрешении вызова, поэтому нельзя передать аргументы, которые подходят только реализации. Разрешение идёт по списку сверху вниз, и выбирается первая совместимая перегрузка, поэтому порядок имеет значение: если сначала объявить широкую сигнатуру вроде `(value: unknown) => string`, она перехватит вызовы, предназначенные более узкой. Отдельная проверка требует, чтобы реализация была совместима с каждой перегрузкой, и при нарушении компилятор выдаёт ошибку о несовместимости перегрузки с реализацией. Важный нюанс: типы параметров реализации не видны вызывающему, поэтому `Parameters<typeof fn>` описывает последнюю перегрузку, а не реализацию. В runtime от перегрузок ничего не остаётся: это одна функция, внутри которой разработчик сам разбирает случаи, обычно через проверки типов аргументов или через дискриминант.',
    commonMistakes: [
      'Ожидают, что вызов сможет подойти под сигнатуру реализации, если не подошёл ни под одну перегрузку.',
      'Ставят широкую перегрузку первой и удивляются, что узкие перегрузки не применяются.',
      'Думают, что перегрузки существуют в runtime и выбирают реализацию по типам аргументов.',
    ],
    codeExample: `function len(value: string): number;
function len(value: unknown[]): number;
function len(value: string | unknown[]): number {
  return value.length;
}

const a = len('text');
const b = len([1, 2, 3]);`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Назовите три правила: список перегрузок виден снаружи, реализация должна быть совместима со всеми, выбирается первая подходящая. Порядок — часть контракта.',
    hint: 'Подумайте, видна ли сигнатура реализации вызывающему коду и что происходит при нескольких подходящих перегрузках.',
    summary:
      'Снаружи видны только перегрузки, реализация должна быть совместима с каждой, а из подходящих выбирается первая по порядку объявления.',
    tags: ['overloads', 'functions', 'type-safety'],
  },
  {
    id: 'ts-044',
    category: 'typescript',
    topic: 'Discriminated unions',
    difficulty: 'middle',
    type: 'single-choice',
    question: 'Зачем в ветви `default` вызывается `assertNever(action)`?',
    code: `type Action =
  | { type: 'increment'; by: number }
  | { type: 'decrement'; by: number }
  | { type: 'reset' };

function assertNever(value: never): never {
  throw new Error('Необработанный вариант: ' + JSON.stringify(value));
}

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment':
      return state + action.by;
    case 'decrement':
      return state - action.by;
    case 'reset':
      return 0;
    default:
      return assertNever(action);
  }
}`,
    codeLanguage: 'typescript',
    options: [
      {
        id: 'a',
        text: 'Это проверка исчерпывающего разбора на этапе типов: если добавить в `Action` новый вариант и не обработать его, `action` в `default` перестанет быть `never`, и вызов перестанет компилироваться.',
        explanation:
          'Верно: после обработки всех вариантов `action` сужается до `never`, поэтому любой новый необработанный член ломает компиляцию.',
      },
      {
        id: 'b',
        text: 'Это единственный способ поймать неизвестный `action` в runtime, к проверке типов вызов отношения не имеет.',
        explanation:
          'Ошибочная модель: исключение и правда бросается, но главная ценность — статическая проверка полноты, а не ловля значения в runtime.',
      },
      {
        id: 'c',
        text: 'Он сужает `Action` до `never` в runtime, поэтому `switch` перестаёт проверять остальные ветви.',
        explanation:
          'Ошибочная модель: сужение существует только на этапе компиляции; в runtime выполняется обычный `switch`.',
      },
      {
        id: 'd',
        text: 'Без него `switch` не скомпилируется, потому что в типе `Action` нет ветви `default`.',
        explanation:
          'Ошибочная модель: `default` не является частью типа, а отсутствие обработки всех случаев ловится через `never`, а не через обязательность `default`.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      'Главная ценность `assertNever(action)` — статическая проверка исчерпывающего разбора. Пока обработаны все три варианта, в `default` переменная `action` имеет тип `never`: компилятор знает, что других вариантов нет. Функция `assertNever` объявлена с параметром `never`, поэтому вызов компилируется только тогда, когда аргумент действительно `never`. Стоит добавить в `Action` четвёртый вариант, например `{ type: "multiply"; by: number }`, и не обработать его в `switch` — сужение в `default` даст этот новый вариант, а не `never`, и вызов `assertNever` перестанет компилироваться. Это превращает забытый случай из runtime-бага в ошибку сборки. Дополнительно функция реально бросает исключение: если данные пришли извне и не соответствуют типу, например из сети или из `JSON.parse`, ветвь сработает и в runtime. Но сама по себе проверка типов в runtime не работает — типы стираются, и защита от «неизвестного» значения обеспечивается только явной проверкой и самим `throw`. Поэтому `assertNever` совмещает две задачи, а основная — именно контроль полноты на этапе компиляции.',
    commonMistakes: [
      'Считают, что `assertNever` нужен только ради `throw` и не замечают проверку полноты.',
      'Думают, что `never` существует в runtime и сужает значение на лету.',
      'Пишут `default: return 0` вместо проверки полноты и теряют ошибку компиляции при добавлении варианта.',
    ],
    codeExample: `function assertNever(value: never): never {
  throw new Error('Необработанный вариант: ' + JSON.stringify(value));
}

type Status = 'idle' | 'loading' | 'done';

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
      'Сформулируйте так: `assertNever` превращает добавление нового варианта union в ошибку компиляции. Затем добавьте, что в runtime он ещё и бросает исключение.',
    hint: 'Обратите внимание, какой тип имеет `action` в `default`, когда все варианты уже обработаны.',
    summary:
      '`assertNever(action)` в `default` проверяет исчерпывающесть: пока все варианты обработаны, аргумент равен `never`. Новый необработанный вариант ломает компиляцию.',
    tags: ['discriminated-unions', 'never', 'exhaustiveness'],
  },
  {
    id: 'ts-045',
    category: 'typescript',
    topic: 'Conditional types и infer',
    difficulty: 'middle',
    type: 'code-completion',
    question:
      'Введите правую часть определения условного типа (после знака `=`): он превращает `Promise<U>` в `U`, а любой другой тип оставляет без изменений. Используйте `infer U`: `type Unwrap<T> = ___;`.',
    correctAnswers: ['T extends Promise<infer U> ? U : T'],
    completion: {
      acceptedAnswers: ['T extends Promise<infer U> ? U : T', 'T extends Promise<infer U>? U : T'],
      placeholder: 'Введите условный тип',
      inputHint: 'Формат: T extends Шаблон<infer U> ? U : T',
      caseSensitive: true,
      ignoreWhitespace: true,
    },
    explanation:
      'Правильный ответ — `T extends Promise<infer U> ? U : T`. Условный тип состоит из проверки, истинной и ложной ветви. Проверка `T extends Promise<infer U>` означает: если `T` совместим с `Promise` некоторого типа, выведи этот тип в `U`. Для `Promise<number>` это даёт `U = number`, и результатом становится `number`. Ложная ветвь `: T` нужна, чтобы не терять типы, которые не являются промисами: для `string` вернётся `string`, а не `never`. Если написать ложную ветвь как `never`, тип `Unwrap<string>` окажется `never`, и любое использование сломается. Ещё одна тонкость — дистрибутивность: `T` здесь голый параметр, поэтому `Unwrap<Promise<number> | string>` распределится по членам и даст `number | string`. Если нужна недистрибутивная версия, параметр оборачивают в кортеж: `[T] extends [Promise<infer U>] ? U : T`. В библиотеке TypeScript для этой задачи есть `Awaited<T>`, который дополнительно разворачивает вложенные промисы рекурсивно; собственная реализация выше разворачивает только один уровень. Всё это типовые вычисления, в runtime от них ничего не остаётся.',
    commonMistakes: [
      'Ставят в ложную ветвь `never`, из-за чего не-Promise типы «исчезают» из результата.',
      'Пишут `Promise<U>` без `infer`, из-за чего `U` становится неизвестной типовой переменной и компилятор выдаёт ошибку.',
      'Забывают про дистрибутивность и удивляются результату на объединении с промисом.',
    ],
    codeExample: `type Unwrap<T> = T extends Promise<infer U> ? U : T;

type First = Unwrap<Promise<number>>;
type Second = Unwrap<string>;
type Nested = Awaited<Promise<Promise<number>>>;`,
    codeExampleLanguage: 'typescript',
    interviewTip:
      'Пройдите по трём частям: проверка, вывод через `infer`, ложная ветвь. Затем добавьте замечание про дистрибутивность и про `Awaited` — это признак уверенного владения темой.',
    hint: 'Типу, который не является промисом, нужно вернуть сам себя, иначе он потеряется.',
    summary:
      '`T extends Promise<infer U> ? U : T` выводит тип результата промиса и сохраняет остальные типы. Ложная ветвь `T` критична, чтобы не получить `never`.',
    tags: ['conditional-types', 'infer', 'promise', 'utility-types'],
  },
];
