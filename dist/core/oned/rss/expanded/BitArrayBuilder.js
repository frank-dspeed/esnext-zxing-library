import BitArray from '../../../common/BitArray';
export default class BitArrayBuilder {
    static buildBitArray(pairs) {
        let charNumber = (pairs.length * 2) - 1;
        if (pairs[pairs.length - 1].getRightChar() == null) {
            charNumber -= 1;
        }
        const size = 12 * charNumber;
        const binary = new BitArray(size);
        let accPos = 0;
        const firstPair = pairs[0];
        const firstValue = firstPair.getRightChar().getValue();
        for (let i = 11; i >= 0; --i) {
            if ((firstValue & (1 << i)) != 0) {
                binary.set(accPos);
            }
            accPos++;
        }
        for (let i = 1; i < pairs.length; ++i) {
            const currentPair = pairs[i];
            const leftValue = currentPair.getLeftChar().getValue();
            for (let j = 11; j >= 0; --j) {
                if ((leftValue & (1 << j)) != 0) {
                    binary.set(accPos);
                }
                accPos++;
            }
            if (currentPair.getRightChar() != null) {
                const rightValue = currentPair.getRightChar().getValue();
                for (let j = 11; j >= 0; --j) {
                    if ((rightValue & (1 << j)) != 0) {
                        binary.set(accPos);
                    }
                    accPos++;
                }
            }
        }
        return binary;
    }
}
//# sourceMappingURL=BitArrayBuilder.js.map