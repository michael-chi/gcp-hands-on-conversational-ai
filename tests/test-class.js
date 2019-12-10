class Test{
    test(a){
        console.log(a);
    }
    call(a){
        this.test(a);
    }
}

const test = new Test();
test.call('test');