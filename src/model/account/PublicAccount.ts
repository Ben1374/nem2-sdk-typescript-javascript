/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { convert, KeyPair } from 'nem2-library';
import { NetworkType } from '../blockchain/NetworkType';
import { Address } from './Address';

const Hash512 = 64;

/**
 * The public account structure contains account's address and public key.
 */
export class PublicAccount {

    /**
     * @internal
     * @param publicKey
     * @param address
     */
    constructor(
                /**
                 * The account public private.
                 */
                public readonly publicKey: string,
                /**
                 * The account address.
                 */
                public readonly address: Address) {

    }

    /**
     * Create a PublicAccount from a public key and network type.
     * @param publicKey Public key
     * @param networkType Network type
     * @returns {PublicAccount}
     */
    static createFromPublicKey(publicKey: string, networkType: NetworkType): PublicAccount {
        if (publicKey == null || (publicKey.length !== 64 && publicKey.length !== 66)) {
            throw new Error('Not a valid public key');
        }
        const address = Address.createFromPublicKey(publicKey, networkType);
        return new PublicAccount(publicKey, address);
    }

    /**
     * Verify a signature.
     *
     * @param {string} data - The data to verify.
     * @param {string} signature - The signature to verify.
     *
     * @return {boolean}  - True if the signature is valid, false otherwise.
     */
    public verifySignature(data: string, signature: string): boolean {
        if (!signature) {
            throw new Error('Missing argument');
        }

        if (signature.length / 2 !== Hash512) {
            throw new Error('Signature length is incorrect');
        }

        if (!convert.isHexString(signature)) {
            throw new Error('Signature must be hexadecimal only');
        }

        // Convert signature key to Uint8Array
        const convertedSignature = convert.hexToUint8(signature);

        // Convert to Uint8Array
        const convertedData = convert.hexToUint8(convert.utf8ToHex(data));

        return KeyPair.verify(convert.hexToUint8(this.publicKey), convertedData, convertedSignature);
    }

    /**
     * Compares public accounts for equality.
     * @param publicAccount
     * @returns {boolean}
     */
    equals(publicAccount: PublicAccount) {
        return this.publicKey === publicAccount.publicKey && this.address.plain() === publicAccount.address.plain();
    }

    /**
     * Create DTO object
     */
    toDTO() {
        return {
            publicKey: this.publicKey,
            address: this.address.toDTO(),
        };
    }
}
