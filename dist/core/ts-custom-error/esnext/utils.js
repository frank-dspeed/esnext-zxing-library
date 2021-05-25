export function fixProto(target, prototype) {
    const setPrototypeOf = Object.setPrototypeOf;
    setPrototypeOf
        ? setPrototypeOf(target, prototype)
        : (target.__proto__ = prototype);
}
export function fixStack(target, fn = target.constructor) {
    const captureStackTrace = Error.captureStackTrace;
    captureStackTrace && captureStackTrace(target, fn);
}
//# sourceMappingURL=utils.js.map