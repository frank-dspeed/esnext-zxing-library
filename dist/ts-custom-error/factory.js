import { fixStack } from './utils';
export function customErrorFactory(fn, parent = Error) {
    function CustomError(...args) {
        if (!(this instanceof CustomError))
            return new CustomError(...args);
        parent.apply(this, args);
        Object.defineProperty(this, 'name', {
            value: fn.name || parent.name,
            enumerable: false,
            configurable: true,
        });
        fn.apply(this, args);
        fixStack(this, CustomError);
    }
    return Object.defineProperties(CustomError, {
        prototype: {
            value: Object.create(parent.prototype, {
                constructor: {
                    value: CustomError,
                    writable: true,
                    configurable: true,
                },
            }),
        },
    });
}
//# sourceMappingURL=factory.js.map