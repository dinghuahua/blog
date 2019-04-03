type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name{
    if(typeof n === 'string'){
        return n;
    } else {
        return n();
    }
}

type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames){
    // do something
}
handleEvent(document.getElementById('hello'), 'scroll');
handleEvent(document.getElementById('world'), 'dbclick'); // 报错 event 不能为dbclick
