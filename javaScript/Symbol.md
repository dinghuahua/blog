####  重要知识点
1. Symbol 函数前不能使用new命令，否则会报错
2. 由于Symbol值不是对象，所以不能添加属性，它是一种类似字符串的数据类型
3. Symbol函数可以接受一个字符串作为参数， 表示对Symbol实例的描述，主要是为了控制台显示，或者转为字符串时，比较容易区分
4. 如果 Symbol 的参数是一个对象，就会调用该对象的toString方法，将其转为字符串，然后才生成一个 Symbol 值。
5. let sym = Symbol('My symbol');

"your symbol is " + sym
// TypeError: can't convert symbol to string
6. 但是，Symbol 值可以显式转为字符串。

let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
7. Symbol 值也可以转为布尔值，但是不能转为数值
8. Symbol 值作为属性名时，该属性还是公开属性，不是私有属性。
9. Symbol 作为属性名，遍历对象的时候，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回
10. 有一个Object.getOwnPropertySymbols()方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
11. Reflect.ownKeys()方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。
12. 由于以 Symbol 值作为键名，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。
13. Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会
14. 注意，Symbol.for()为 Symbol 值登记的名字，是全局环境的（不同的文件下写的代码也会全等），不管有没有在全局环境运行。
15. Symbol.keyFor()方法返回一个已登记的 Symbol 类型值的key,未登记的 Symbol 值，所以返回undefined
16. Symbol.species的作用在于，实例对象在运行过程中，需要再次调用自身的构造函数时，会调用该属性指定的构造函数。它主要的用途是，有些类库是在基类的基础上修改的，那么子类使用继承的方法时，作者可能希望返回基类的实例，而不是子类的实例。
17. Symbol.hasInstance
18. Symbol.isConcatSpreadable
19. Symbol.species
20. Symbol.match
21. Symbol.replace
22. Symbol.search
23. Symbol.split
24. Symbol.iterator
25. Symbol.toPrimitive
26. Symbol.toStringTag
27. Symbol.unscopables