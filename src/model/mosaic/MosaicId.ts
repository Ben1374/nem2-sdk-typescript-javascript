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
import {
    convert,
    mosaicId as MosaicIdentifierGenerator,
    nacl_catapult,
    uint64 as uint64_t,
} from 'nem2-library';

import {PublicAccount} from '../account/PublicAccount';
import {Id} from '../Id';
import {MosaicNonce} from '../mosaic/MosaicNonce';

/**
 * The mosaic id structure describes mosaic id
 *
 * @since 1.0
 */
export class MosaicId {

    /**
     * Mosaic id
     */
    public readonly id: Id;

    /**
     * Create a MosaicId for given `nonce` MosaicNonce and `owner` PublicAccount.
     *
     * @param   nonce   {MosaicNonce}
     * @param   owner   {Account}
     * @return  {MosaicId}
     */
    public static createFromNonce(nonce: MosaicNonce, owner: PublicAccount): MosaicId {
        const mosaicId = MosaicIdentifierGenerator(nonce.nonce, convert.hexToUint8(owner.publicKey));
        return new MosaicId(mosaicId);
    }

    /**
     * Create MosaicId from mosaic id in form of array of number (ex: [3646934825, 3576016193])
     * or the hexadecimal notation thereof in form of a string.
     *
     * @param id
     */
    constructor(id: string | number[]) {
        if (id instanceof Array) {
            this.id = new Id(id);
        } else if (typeof id === 'string') {
            if (! /^[0-9A-Fa-f]{16}$/i.test(id)) {
                throw new Error('Invalid size for MosaicId hexadecimal notation');
            }

            // hexadecimal formatted MosaicId
            this.id = new Id(uint64_t.fromHex(id));
        }
    }

    /**
     * Get string value of id
     * @returns {string}
     */
    public toHex(): string {
        return this.id.toHex();
    }

    /**
     * Compares mosaicIds for equality.
     *
     * @return boolean
     */
    public equals(other: any): boolean {
        if (other instanceof MosaicId) {
            return this.id.equals(other.id);
        }
        return false;
    }

    /**
     * Create DTO object.
     */
    toDTO() {
        return {
            id: this.id.toDTO(),
        };
    }
}
