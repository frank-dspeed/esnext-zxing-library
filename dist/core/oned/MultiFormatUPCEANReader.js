/*
 * Copyright 2008 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import BarcodeFormat from '../BarcodeFormat';
import DecodeHintType from '../DecodeHintType';
import Result from '../Result';
import OneDReader from './OneDReader';
import EAN13Reader from './EAN13Reader';
import EAN8Reader from './EAN8Reader';
import UPCAReader from './UPCAReader';
import NotFoundException from '../NotFoundException';
import UPCEReader from './UPCEReader';
/**
 * <p>A reader that can read all available UPC/EAN formats. If a caller wants to try to
 * read all such formats, it is most efficient to use this implementation rather than invoke
 * individual readers.</p>
 *
 * @author Sean Owen
 */
export default class MultiFormatUPCEANReader extends OneDReader {
    constructor(hints) {
        super();
        const possibleFormats = hints == null ? null : hints.get(DecodeHintType.POSSIBLE_FORMATS);
        const readers = [];
        if (possibleFormats != null) {
            if (possibleFormats.indexOf(BarcodeFormat.EAN_13) > -1) {
                readers.push(new EAN13Reader());
            }
            else if (possibleFormats.indexOf(BarcodeFormat.UPC_A) > -1) {
                readers.push(new UPCAReader());
            }
            if (possibleFormats.indexOf(BarcodeFormat.EAN_8) > -1) {
                readers.push(new EAN8Reader());
            }
            if (possibleFormats.indexOf(BarcodeFormat.UPC_E) > -1) {
                readers.push(new UPCEReader());
            }
        }
        if (readers.length === 0) {
            readers.push(new EAN13Reader());
            // UPC-A is covered by EAN-13
            readers.push(new EAN8Reader());
            readers.push(new UPCEReader());
        }
        this.readers = readers;
    }
    decodeRow(rowNumber, row, hints) {
        for (const reader of this.readers) {
            try {
                // const result: Result = reader.decodeRow(rowNumber, row, startGuardPattern, hints);
                const result = reader.decodeRow(rowNumber, row, hints);
                // Special case: a 12-digit code encoded in UPC-A is identical to a "0"
                // followed by those 12 digits encoded as EAN-13. Each will recognize such a code,
                // UPC-A as a 12-digit string and EAN-13 as a 13-digit string starting with "0".
                // Individually these are correct and their readers will both read such a code
                // and correctly call it EAN-13, or UPC-A, respectively.
                //
                // In this case, if we've been looking for both types, we'd like to call it
                // a UPC-A code. But for efficiency we only run the EAN-13 decoder to also read
                // UPC-A. So we special case it here, and convert an EAN-13 result to a UPC-A
                // result if appropriate.
                //
                // But, don't return UPC-A if UPC-A was not a requested format!
                const ean13MayBeUPCA = result.getBarcodeFormat() === BarcodeFormat.EAN_13 &&
                    result.getText().charAt(0) === '0';
                // @SuppressWarnings("unchecked")
                const possibleFormats = hints == null ? null : hints.get(DecodeHintType.POSSIBLE_FORMATS);
                const canReturnUPCA = possibleFormats == null || possibleFormats.includes(BarcodeFormat.UPC_A);
                if (ean13MayBeUPCA && canReturnUPCA) {
                    const rawBytes = result.getRawBytes();
                    // Transfer the metadata across
                    const resultUPCA = new Result(result.getText().substring(1), rawBytes, rawBytes.length, result.getResultPoints(), BarcodeFormat.UPC_A);
                    resultUPCA.putAllMetadata(result.getResultMetadata());
                    return resultUPCA;
                }
                return result;
            }
            catch (err) {
                // continue;
            }
        }
        throw new NotFoundException();
    }
    reset() {
        for (const reader of this.readers) {
            reader.reset();
        }
    }
}
//# sourceMappingURL=MultiFormatUPCEANReader.js.map