import { fixProto, fixStack } from './utils';
export class CustomError extends Error {
    constructor(message) {
        super(message);
        Object.defineProperty(this, 'name', {
            value: new.target.name,
            enumerable: false,
            configurable: true,
        });
        fixProto(this, new.target.prototype);
        fixStack(this);
    }
}
//# sourceMappingURL=custom-error.js.map