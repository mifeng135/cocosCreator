/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.playerInfoS = (function() {

    /**
     * Properties of a playerInfoS.
     * @exports IplayerInfoS
     * @interface IplayerInfoS
     * @property {number|null} [id] playerInfoS id
     */

    /**
     * Constructs a new playerInfoS.
     * @exports playerInfoS
     * @classdesc Represents a playerInfoS.
     * @implements IplayerInfoS
     * @constructor
     * @param {IplayerInfoS=} [properties] Properties to set
     */
    function playerInfoS(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * playerInfoS id.
     * @member {number} id
     * @memberof playerInfoS
     * @instance
     */
    playerInfoS.prototype.id = 0;

    /**
     * Creates a new playerInfoS instance using the specified properties.
     * @function create
     * @memberof playerInfoS
     * @static
     * @param {IplayerInfoS=} [properties] Properties to set
     * @returns {playerInfoS} playerInfoS instance
     */
    playerInfoS.create = function create(properties) {
        return new playerInfoS(properties);
    };

    /**
     * Encodes the specified playerInfoS message. Does not implicitly {@link playerInfoS.verify|verify} messages.
     * @function encode
     * @memberof playerInfoS
     * @static
     * @param {IplayerInfoS} message playerInfoS message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    playerInfoS.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
        return writer;
    };

    /**
     * Encodes the specified playerInfoS message, length delimited. Does not implicitly {@link playerInfoS.verify|verify} messages.
     * @function encodeDelimited
     * @memberof playerInfoS
     * @static
     * @param {IplayerInfoS} message playerInfoS message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    playerInfoS.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a playerInfoS message from the specified reader or buffer.
     * @function decode
     * @memberof playerInfoS
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {playerInfoS} playerInfoS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    playerInfoS.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.playerInfoS();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a playerInfoS message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof playerInfoS
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {playerInfoS} playerInfoS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    playerInfoS.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a playerInfoS message.
     * @function verify
     * @memberof playerInfoS
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    playerInfoS.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isInteger(message.id))
                return "id: integer expected";
        return null;
    };

    /**
     * Creates a playerInfoS message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof playerInfoS
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {playerInfoS} playerInfoS
     */
    playerInfoS.fromObject = function fromObject(object) {
        if (object instanceof $root.playerInfoS)
            return object;
        var message = new $root.playerInfoS();
        if (object.id != null)
            message.id = object.id | 0;
        return message;
    };

    /**
     * Creates a plain object from a playerInfoS message. Also converts values to other types if specified.
     * @function toObject
     * @memberof playerInfoS
     * @static
     * @param {playerInfoS} message playerInfoS
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    playerInfoS.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.id = 0;
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        return object;
    };

    /**
     * Converts this playerInfoS to JSON.
     * @function toJSON
     * @memberof playerInfoS
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    playerInfoS.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return playerInfoS;
})();

$root.playerInfoR = (function() {

    /**
     * Properties of a playerInfoR.
     * @exports IplayerInfoR
     * @interface IplayerInfoR
     * @property {number|null} [id] playerInfoR id
     * @property {string|null} [name] playerInfoR name
     */

    /**
     * Constructs a new playerInfoR.
     * @exports playerInfoR
     * @classdesc Represents a playerInfoR.
     * @implements IplayerInfoR
     * @constructor
     * @param {IplayerInfoR=} [properties] Properties to set
     */
    function playerInfoR(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * playerInfoR id.
     * @member {number} id
     * @memberof playerInfoR
     * @instance
     */
    playerInfoR.prototype.id = 0;

    /**
     * playerInfoR name.
     * @member {string} name
     * @memberof playerInfoR
     * @instance
     */
    playerInfoR.prototype.name = "";

    /**
     * Creates a new playerInfoR instance using the specified properties.
     * @function create
     * @memberof playerInfoR
     * @static
     * @param {IplayerInfoR=} [properties] Properties to set
     * @returns {playerInfoR} playerInfoR instance
     */
    playerInfoR.create = function create(properties) {
        return new playerInfoR(properties);
    };

    /**
     * Encodes the specified playerInfoR message. Does not implicitly {@link playerInfoR.verify|verify} messages.
     * @function encode
     * @memberof playerInfoR
     * @static
     * @param {IplayerInfoR} message playerInfoR message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    playerInfoR.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        return writer;
    };

    /**
     * Encodes the specified playerInfoR message, length delimited. Does not implicitly {@link playerInfoR.verify|verify} messages.
     * @function encodeDelimited
     * @memberof playerInfoR
     * @static
     * @param {IplayerInfoR} message playerInfoR message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    playerInfoR.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a playerInfoR message from the specified reader or buffer.
     * @function decode
     * @memberof playerInfoR
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {playerInfoR} playerInfoR
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    playerInfoR.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.playerInfoR();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.int32();
                break;
            case 2:
                message.name = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a playerInfoR message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof playerInfoR
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {playerInfoR} playerInfoR
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    playerInfoR.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a playerInfoR message.
     * @function verify
     * @memberof playerInfoR
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    playerInfoR.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isInteger(message.id))
                return "id: integer expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        return null;
    };

    /**
     * Creates a playerInfoR message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof playerInfoR
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {playerInfoR} playerInfoR
     */
    playerInfoR.fromObject = function fromObject(object) {
        if (object instanceof $root.playerInfoR)
            return object;
        var message = new $root.playerInfoR();
        if (object.id != null)
            message.id = object.id | 0;
        if (object.name != null)
            message.name = String(object.name);
        return message;
    };

    /**
     * Creates a plain object from a playerInfoR message. Also converts values to other types if specified.
     * @function toObject
     * @memberof playerInfoR
     * @static
     * @param {playerInfoR} message playerInfoR
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    playerInfoR.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.id = 0;
            object.name = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        return object;
    };

    /**
     * Converts this playerInfoR to JSON.
     * @function toJSON
     * @memberof playerInfoR
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    playerInfoR.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return playerInfoR;
})();

module.exports = $root;
