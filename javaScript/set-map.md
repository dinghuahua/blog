## Set

<br>Set 结构没有键名，只有键值（或者说键名和键值是同一个值）
<br>如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法,但是可以新生成一个 set 再赋值给原来的 set
<br>没有单独 get 某一个元素值的方法

### prototype

Set.prototype={
constructor: ƒ Set(),
add: ƒ add(),
delete: ƒ delete(),
clear: ƒ clear(),
has: ƒ has(),
keys: ƒ values(),
values: ƒ values(),
entries: ƒ entries(),
forEach: ƒ forEach(),
size: (...)
Symbol(Symbol.iterator): ƒ values()
Symbol(Symbol.toStringTag): "Set"
get size: ƒ size(),
**proto**: Object
}
**proto**: Object

### 实例化

<br>Set([]) Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
<br>比如：类数组
<br>const set = new Set(document.querySelectorAll('div'));

### 属性

#### size

返回 Set 实例的成员总数

#### constructor

返回构造器 Set

### 方法

#### add() 添加某个值，返回 Set 结构本身

<br>成员不可以重复,联想数组去重
<br>不会进行类型转换 5 和 '5'是两个不同的值
<br>进行 Same-value-zero equality 类似全等判断，在这里只会添加一个 NAN，添加的时候会认为 NAN 和 NAN 相等，即添加了两次 NaN，但是最终的结果只会加入一个
<br>任何的两个空对象都是不相等的，即会认为是两个对象

#### delete(value)删除某个值，返回一个布尔值，表示删除是否成功。

#### has(value)：返回一个布尔值，表示该值是否为 Set 的成员。

#### clear()：清除所有成员，没有返回值

#### keys()：返回键名的遍历器对象

#### values()：返回键值的遍历器对象

Set.prototype.values === Set.prototype.keys
Set.prototype[Symbol.iterator] === Set.prototype.values

#### entries()：返回键值对的遍历器对象。 每个成员是一个数组[key,value]

```javascript
let set = new Set(['red', 'green', 'blue'])

for (let item of set.keys()) {
  console.log(item)
}
// red
// green
// blue
for (let item of set.values()) {
  console.log(item)
}
// red
// green
// blue
for (let item of set.entries()) {
  console.log(item)
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
for (let [key, value] of set) {
  console.log(key, value)
}
// "red", "red"
// "green", "green"
// "blue", "blue"
```

#### forEach()：使用回调函数遍历每个成员，用法类似数组的 forEach,第一个参数是回调函数，第二个参数表示绑定处理函数内部的 this 对象

#### 遍历 Set 实例

<br>for...of 是用来遍历 遍历器的
<br>因为 Set.prototype[Symbol.iterator] === Set.prototype.values,所以遍历 Set 的实例，可以省去调用 values 方法,for(var i of set){}
<br>Set 的原型上有 forEach 方法，用法类似数组的 forEach,第一个参数是回调函数，第二个参数表示绑定处理函数内部的 this 对象
<br>set.forEach((index,item,set)=>{console.log(index,item,set)}, this)
<br> 扩展运算符（...）内部使用 for...of 循环

### Set 结构 和 数组结构 互相转换的方法

Set=>Array
第一种方法：[...set]
第二种方法：Array.from(set)
Array=>Set
new Set(arr)

```javascript
// Set=>Array
var set = new Set([1, 2, 2, 3, 4, 3, 5])
set.size // 5
// 第一种方法
var arr1 = [...set]
// 第二种方法
var arr2 = Array.from(set)
// 扩展：将set的每一项*2改为数组
var arr3 = Array.from(set, (v) => v * 2)
// Array=>Set
var arr = [1, 2, 3]
var set2 = new Set(arr)
```

### 扩展

#### 并集、交集

```javascript
var a = new Set([1, 2, 3, 4, 5])
var b = new Set([1, 2, 3, 4])
//并集
var c = new Set([...a, ...b])
// 交集
var d = new Set([...a].filter((v) => b.has(v)))
```

#### Array.from

Array.from() 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例

##### 语法

<br>Array.from(arrayLike[, mapFn[, thisArg]])
<br>arrayLike:想要转换成数组的伪数组对象或可迭代对象。
<br>mapFn:如果指定了该参数，新数组中的每个元素会执行该回调函数。
<br>thisArg:可选参数，执行回调函数 mapFn 时 this 对象。
<br>伪数组对象（拥有一个 length 属性和若干索引属性的任意对象），比如 Array.from({length: 5}, (v, i) => i);// [0, 1, 2, 3, 4]; var a = Array.from({length: 5});// [undefined, undefined]
<br>可迭代对象（可以获取对象中的元素,如 Map 和 Set 等）

#### 扩展运算符(...)内部的原理使用的也是使用 for...of todo

#### 联想 for...in 和 for...of 遍历的区别 todo

#### 遍历器以及可迭代的对象

## Map

<br>JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。带来了很大的限制
<br>Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现

### prototype

Map.prototype = {
clear: ƒ clear(),
constructor: ƒ Map(),
delete: ƒ delete(),
entries: ƒ entries(),
forEach: ƒ forEach(),
get: ƒ (),
has: ƒ has(),
keys: ƒ keys(),
set: ƒ (),
size: (...),
values: ƒ values(),
Symbol(Symbol.iterator): ƒ entries(),
Symbol(Symbol.toStringTag): "Map",
get size: ƒ size(),
**proto**: Object
}

### 实例化

<br>Map([[key,val],[key,val]]) Map 函数可以接受一个数组,该数组的成员是一个个表示键值对的数组，任何具或者具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作 Map 构造函数的参数。也就是说，Set 和 Map 都可以用来生成新的 Map。
<br>例子：

```javascript
// 参数是数组
var map = new Map([
  ['name', '张三'],
  ['title', 'Author'],
])
// 等同于下面的写法
const items = [
  ['name', '张三'],
  ['title', 'Author'],
]
const map = new Map()
items.forEach(([key, value]) => map.set(key, value))
// 参数是具有Iterator 接口
var set = new Set([
  ['name', '张三'],
  ['title', 'Author'],
])
var map1 = new Map(set)

var map2 = new Map([['baz', 3]])
var map3 = new Map(map2)

var map4 = new Map([[1], [2]]) // Map(2){1 => undefined, 2 => undefined}
// var map5 = new Map([1,2]) // 会报错，Uncaught TypeError: Iterator value 1 is not an entry object
```

### 属性

#### size 返回 Map 结构的成员总数

### 方法

#### set(key,value) 设置键名 key 对应的键值为 value，然后返回整个 Map 结构，因此可以采用链式写法。如果 key 已经有值，则键值会被更新，否则就新生成该键。

Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如 0 和-0 就是一个键，布尔值 true 和字符串 true 则是两个不同的键。另外，undefined 和 null 也是两个不同的键。虽然 NaN 不严格相等于自身，但 Map 将其视为同一个键

#### get(key) 读取 key 对应的键值，如果找不到 key，返回 undefined

#### has(key) 返回一个布尔值，表示某个键是否在当前 Map 对象之中

#### delete(key) 删除某个键，删除成功返回 true。如果删除失败，返回 false

#### clear() 清除所有成员，没有返回值

#### keys()：返回键名的遍历器。

#### values()：返回键值的遍历器。

#### entries()：返回所有成员的遍历器。 每个成员一个数组[key,value]

Map 结构的默认遍历器接口（Symbol.iterator 属性），就是 entries 方法
Map.prototype[Symbol.iterator] === Map.prototype.entries
// for...of 本身使用的是 Map.prototype[Symbol.iterator]，等同于使用 map.entries()
for (let [key, value] of map) {
console.log(key, value);
}

#### forEach()：遍历 Map 的所有成员，用法类似数组的 forEach,第一个参数是回调函数，第二个参数表示绑定处理函数内部的 this 对象

### Map 结构 和 数组结构 互相转换的方法

#### Map=>Array(二维数组)

<br>第一种方法：扩展运算符(...)
<br>第一种方法：Array.from()

#### Array=>Map

#### Map=>Object

如果所有 Map 的键都是字符串，它可以无损地转为对象

```javascript
var map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
])
var arr = [...map]
var arr1 = Array.from(map)
```

#### Map 和 对象 互转

<br>Map=>Object:通过遍历 map，获取 key/val,然后对 obj.key = val
<br>注意：如果所有 Map 的键都是字符串，它可以无损地转为对象，如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名，

- object 转为字符串[object Object]
- 数组转为字符串的结果等同于 [].join(',')
- function a(b){console.log("123")} 转为字符串结果就是本身字符串的形式 function a(b){console.log("123")}

<br>Object=>Map:
<br>第一种：通过获取 obj 的 key/val 组成的二维数组，然后用二维数组实例化 Map，
<br>第二种：遍历对象，然后 map.set(key,val)

```javascript
// Map=>Object
function strMapToObj(strMap) {
  let obj = Object.create(null)
  for (let [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}
const myMap = new Map().set('yes', true).set('no', false)
strMapToObj(myMap)
// { yes: true, no: false }
var map = [
  [[1, 2, 3], 0],
  [[1, 2, 3, function () {}, { a: 1, b: 2 }], 1],
  [
    function a(b) {
      console.log(b)
    },
    2,
  ],
  [{ a: 1, b: 2 }, 3],
]
strMapToObj(myMap)
// {
//   1,2,3: 0,
//   1,2,3,function(){},[object Object]: 1,
//   [object Object]: 3,
//   function a(b){console.log(b)}: 2
// }

// Object=>Map
// 第一种
var obj = { a: 1, b: 2 }
var map = new Map(Object.entries(obj))
//第二种
function objToStrMap(obj) {
  let strMap = new Map()
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k])
  }
  return strMap
}

objToStrMap({ yes: true, no: false })
```

#### Map 和 JSON 字符串 互转

<br>Map=>JSON 字符串
<br>map 先转为对象，再转为 对象/数组 JSON 字符串
<br><br>
<br>一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON 字符串
<br>另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON 字符串。
<br> 注意：key 是对象{a:1}转为 JSON 字符串还是对象本身的字符串，但是 function a(b){console.log(b)}转为 JSON 字符串时会转为 null
<br>JSON 字符串=>Map
<br>JSON 字符串先转为 对象/数组，然后再转为 Map
<br>正常情况下，所有键名都是字符串,先转为 obj,在转为 Map
<br>有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map。这往往是 Map 转为数组 JSON 的逆操作。

```javascript
//Map=>JSON字符串
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap))
}
var myMap = new Map().set('yes', true).set('no', false)
strMapToJson(myMap)

function mapToArrayJson(map) {
  return JSON.stringify([...map])
}
// 特殊情况
var map = [
  [[1, 2, 3], 0],
  [[1, 2, 3, function () {}, { a: 1, b: 2 }], 1],
  [
    function a(b) {
      console.log(b)
    },
    2,
  ],
  [{ a: 1, b: 2 }, 3],
]
mapToArrayJson([...myMap])
//"[[[1,2,3],0],[[1,2,3,null,{"a":1,"b":2}],1],[null,2],[{"a":1,"b":2},3]]"

// JSON字符串=>Map
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr))
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}

// 特殊情况
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr))
}
var json = `[[[1,2,3],0],[[1,2,3,null,{"a":1,"b":2}],1],[null,2],[{"a":1,"b":2},3]]`
jsonToMap(json)
// map={
//   [1, 2, 3]: 0,
//   [1,2,3,null,{"a":1,"b":2}]:1,
//   null:2,
//   {"a":1,"b":2}:3
// }
```

#### 总结

<br> 1. 对于非字符串的 map 在转为 obj 时，key 是 obj 的会失真,被转为"[object object]"
<br> 2. 对于非字符串的 map 在转为 JSON 字符串时，key 是 function(){}的会失真,被转为"null"
<br> 3. obj 转为 map，强制在 obj 将 key 设置为非字符串，强行操作 obj={{a:3}:4} 会报错
<br> 4. JSON 字符串转为 map，强制在二维数组 JSON 字符串中塞进 function(){}，强行操作 json="[[function a(b){console.log(b)},1]]"; 在 arr=JSON.parse(obj)会报错

### 扩展

## WeakSet 和 WeakMap(key)共同点
1. 弱饮用，注意WeakMap的弱引用的只是键名，而不是键值。键值依然是正常引用
2. 不可遍历, 是不可枚举的
3. 成员只能是对象
4. 没有手动清空的方法，即没有clear()方法
5. WeakSet/Weakmap 保存的对象被gc回收后，WeakSet/Weakmap中也会自动消失
6. 使用场景：
  <br> 适合临时存放一组对象，以及存放跟对象绑定的信息
  <br> WeakSet递归调用自身的函数需要一种通过跟踪哪些对象已被处理，来应对循环数据结构的方法,避免无限递归
  <br> WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏
  <br> WeakMap 的另一个用处是部署私有属性  
  <br> WeakMap 存放绑定关系，联想webpack中的使用

<br>WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中,即WeakSet 中存储的对象不会增加对该对象的引用数
<br>
这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失
<br>
由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历

## WeakSet
<br>WeakSet 的成员只能是对象，而不能是其他类型的值,否则会报错
<br>注意：

1. Symbol() 也是非对象值，添加也会报错
2. 不可以添加null，会报错

### WeakSet.prototype
WeakSet.prototype={
  add: ƒ add(),
  constructor: ƒ WeakSet(),
  delete: ƒ delete(),
  has: ƒ has(),
  Symbol(Symbol.toStringTag): "WeakSet",
  __proto__: Object
}
### 方法
#### add()
#### delete()
#### has()


## WeakMap
<br> WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名
<br>注意：

1. Symbol() 也是非对象值，添加也会报错
2. 不可以添加null，会报错
<br> 

### WeakMap.prototype
WeakMap.prototype={
  constructor: ƒ WeakMap(),
  delete: ƒ delete(),
  get: ƒ (),
  has: ƒ has(),
  set: ƒ (),
  Symbol(Symbol.toStringTag): "WeakMap",
  __proto__: Object
}

