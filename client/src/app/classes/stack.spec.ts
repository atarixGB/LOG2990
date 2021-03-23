import { stackTest } from './stackTest';

// tslint:disable: no-any
// tslint:disable: no-string-literal
describe('stackTest<T>', () => {
    let stackTest: stackTest<string>;

    beforeEach(() => {
        stackTest = new stackTest<string>();
    });
    it('should create', () => {
        expect(stackTest).toBeTruthy();
    });

    it('isEmpty should return true if the stackTest is empty ', () => {
        expect(stackTest.isEmpty()).toBeTrue();
    });

    it('add() should add element to the stackTest', () => {
        const spy = spyOn<any>(stackTest['array'], 'push');
        stackTest.add('something');
        expect(spy).toHaveBeenCalled();
    });

    it('delete should delete an  element from  the stackTest if the element is in the stackTest', () => {
        const spy = spyOn<any>(stackTest['array'], 'splice');
        const object= 'something';
        stackTest.add(object);
        stackTest.add('Log2990');
        stackTest.delete(object);
        expect(spy).toHaveBeenCalled();
    });

    it('delete should do nothing if the element is not in the stackTest', () => {
        const spy = spyOn<any>(stackTest['array'], 'splice');
        const object= 'something';
        stackTest.delete(object);
        expect(spy).not.toHaveBeenCalled();
    });

    it('pop should pop of the array', () => {
        const spy = spyOn<any>(stackTest['array'], 'pop');
        stackTest.pop();
        expect(spy).toHaveBeenCalled();
    });

    it('#getAll should return all elements in the stackTest', () => {
        const array = ['Log', '29', '90'];
        for (const st of array) {
            stackTest.add(st);
        }
        const result = stackTest.getAll();
        expect(result).toEqual(array);
    });
});
