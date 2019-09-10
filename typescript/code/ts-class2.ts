class Animal{
    public name;
    private age;
    protected gender;
    public constructor(name,age,gender){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
}
let a = new Animal('jack',18,'male');
console.log(a.name);
a.name = 'Tom';
console.log(a.name);
console.log(a.age);// 会报错
a.age = 54;// 会报错
console.log(a.age);// 会报错

class Cat extends Animal{
    constructor(name,age,gender){
        super(name,age,gender);
        console.log(this.age);// 会报错
        console.log(this.gender);// 不会报错
    }
}

abstract class Animal2{
    public name;
    private age;
    protected gender;
    public constructor(name,age,gender){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    public abstract sayHi();
}
let a2 = new Animal2('jack',18,'male'); // 会报错 不允许实例化的

class Cat21 extends Animal2{
    constructor(name,age,gender){
        super(name,age,gender);
        console.log(this.age);// 会报错
        console.log(this.gender);// 不会报错
    }
    // 会报错 没有实现父类的抽象方法
}
class Cat2 extends Animal2{
    public sayHi(){
        console.log(`meow,my name is ${this.name}`);
    }
}