import * as $protobuf from "protobufjs";
/** Properties of a loginS. */
export interface IloginS {

    /** loginS account */
    account?: (string|null);

    /** loginS password */
    password?: (string|null);
}

/** Represents a loginS. */
export class loginS implements IloginS {

    /**
     * Constructs a new loginS.
     * @param [properties] Properties to set
     */
    constructor(properties?: IloginS);

    /** loginS account. */
    public account: string;

    /** loginS password. */
    public password: string;

    /**
     * Creates a new loginS instance using the specified properties.
     * @param [properties] Properties to set
     * @returns loginS instance
     */
    public static create(properties?: IloginS): loginS;

    /**
     * Encodes the specified loginS message. Does not implicitly {@link loginS.verify|verify} messages.
     * @param message loginS message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IloginS, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified loginS message, length delimited. Does not implicitly {@link loginS.verify|verify} messages.
     * @param message loginS message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IloginS, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a loginS message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns loginS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): loginS;

    /**
     * Decodes a loginS message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns loginS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): loginS;

    /**
     * Verifies a loginS message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a loginS message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns loginS
     */
    public static fromObject(object: { [k: string]: any }): loginS;

    /**
     * Creates a plain object from a loginS message. Also converts values to other types if specified.
     * @param message loginS
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: loginS, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this loginS to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a loginR. */
export interface IloginR {

    /** loginR ret */
    ret?: (number|null);

    /** loginR playerIndex */
    playerIndex?: (number|null);

    /** loginR ip */
    ip?: (string|null);
}

/** Represents a loginR. */
export class loginR implements IloginR {

    /**
     * Constructs a new loginR.
     * @param [properties] Properties to set
     */
    constructor(properties?: IloginR);

    /** loginR ret. */
    public ret: number;

    /** loginR playerIndex. */
    public playerIndex: number;

    /** loginR ip. */
    public ip: string;

    /**
     * Creates a new loginR instance using the specified properties.
     * @param [properties] Properties to set
     * @returns loginR instance
     */
    public static create(properties?: IloginR): loginR;

    /**
     * Encodes the specified loginR message. Does not implicitly {@link loginR.verify|verify} messages.
     * @param message loginR message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IloginR, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified loginR message, length delimited. Does not implicitly {@link loginR.verify|verify} messages.
     * @param message loginR message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IloginR, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a loginR message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns loginR
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): loginR;

    /**
     * Decodes a loginR message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns loginR
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): loginR;

    /**
     * Verifies a loginR message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a loginR message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns loginR
     */
    public static fromObject(object: { [k: string]: any }): loginR;

    /**
     * Creates a plain object from a loginR message. Also converts values to other types if specified.
     * @param message loginR
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: loginR, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this loginR to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a loginToGateS. */
export interface IloginToGateS {

    /** loginToGateS playerIndex */
    playerIndex?: (number|null);
}

/** Represents a loginToGateS. */
export class loginToGateS implements IloginToGateS {

    /**
     * Constructs a new loginToGateS.
     * @param [properties] Properties to set
     */
    constructor(properties?: IloginToGateS);

    /** loginToGateS playerIndex. */
    public playerIndex: number;

    /**
     * Creates a new loginToGateS instance using the specified properties.
     * @param [properties] Properties to set
     * @returns loginToGateS instance
     */
    public static create(properties?: IloginToGateS): loginToGateS;

    /**
     * Encodes the specified loginToGateS message. Does not implicitly {@link loginToGateS.verify|verify} messages.
     * @param message loginToGateS message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IloginToGateS, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified loginToGateS message, length delimited. Does not implicitly {@link loginToGateS.verify|verify} messages.
     * @param message loginToGateS message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IloginToGateS, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a loginToGateS message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns loginToGateS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): loginToGateS;

    /**
     * Decodes a loginToGateS message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns loginToGateS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): loginToGateS;

    /**
     * Verifies a loginToGateS message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a loginToGateS message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns loginToGateS
     */
    public static fromObject(object: { [k: string]: any }): loginToGateS;

    /**
     * Creates a plain object from a loginToGateS message. Also converts values to other types if specified.
     * @param message loginToGateS
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: loginToGateS, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this loginToGateS to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
