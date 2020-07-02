import * as $protobuf from "protobufjs";
/** Properties of a playerInfoS. */
export interface IplayerInfoS {

    /** playerInfoS id */
    id?: (number|null);
}

/** Represents a playerInfoS. */
export class playerInfoS implements IplayerInfoS {

    /**
     * Constructs a new playerInfoS.
     * @param [properties] Properties to set
     */
    constructor(properties?: IplayerInfoS);

    /** playerInfoS id. */
    public id: number;

    /**
     * Creates a new playerInfoS instance using the specified properties.
     * @param [properties] Properties to set
     * @returns playerInfoS instance
     */
    public static create(properties?: IplayerInfoS): playerInfoS;

    /**
     * Encodes the specified playerInfoS message. Does not implicitly {@link playerInfoS.verify|verify} messages.
     * @param message playerInfoS message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IplayerInfoS, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified playerInfoS message, length delimited. Does not implicitly {@link playerInfoS.verify|verify} messages.
     * @param message playerInfoS message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IplayerInfoS, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a playerInfoS message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns playerInfoS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): playerInfoS;

    /**
     * Decodes a playerInfoS message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns playerInfoS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): playerInfoS;

    /**
     * Verifies a playerInfoS message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a playerInfoS message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns playerInfoS
     */
    public static fromObject(object: { [k: string]: any }): playerInfoS;

    /**
     * Creates a plain object from a playerInfoS message. Also converts values to other types if specified.
     * @param message playerInfoS
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: playerInfoS, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this playerInfoS to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a playerInfoR. */
export interface IplayerInfoR {

    /** playerInfoR id */
    id?: (number|null);

    /** playerInfoR name */
    name?: (string|null);
}

/** Represents a playerInfoR. */
export class playerInfoR implements IplayerInfoR {

    /**
     * Constructs a new playerInfoR.
     * @param [properties] Properties to set
     */
    constructor(properties?: IplayerInfoR);

    /** playerInfoR id. */
    public id: number;

    /** playerInfoR name. */
    public name: string;

    /**
     * Creates a new playerInfoR instance using the specified properties.
     * @param [properties] Properties to set
     * @returns playerInfoR instance
     */
    public static create(properties?: IplayerInfoR): playerInfoR;

    /**
     * Encodes the specified playerInfoR message. Does not implicitly {@link playerInfoR.verify|verify} messages.
     * @param message playerInfoR message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IplayerInfoR, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified playerInfoR message, length delimited. Does not implicitly {@link playerInfoR.verify|verify} messages.
     * @param message playerInfoR message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IplayerInfoR, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a playerInfoR message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns playerInfoR
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): playerInfoR;

    /**
     * Decodes a playerInfoR message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns playerInfoR
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): playerInfoR;

    /**
     * Verifies a playerInfoR message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a playerInfoR message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns playerInfoR
     */
    public static fromObject(object: { [k: string]: any }): playerInfoR;

    /**
     * Creates a plain object from a playerInfoR message. Also converts values to other types if specified.
     * @param message playerInfoR
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: playerInfoR, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this playerInfoR to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
