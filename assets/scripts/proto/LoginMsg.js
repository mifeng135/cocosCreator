/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.loginS = (function() {

    /**
     * Properties of a loginS.
     * @exports IloginS
     * @interface IloginS
     * @property {string|null} [account] loginS account
     * @property {string|null} [password] loginS password
     */

    /**
     * Constructs a new loginS.
     * @exports loginS
     * @classdesc Represents a loginS.
     * @implements IloginS
     * @constructor
     * @param {IloginS=} [properties] Properties to set
     */
    function loginS(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * loginS account.
     * @member {string} account
     * @memberof loginS
     * @instance
     */
    loginS.prototype.account = "";

    /**
     * loginS password.
     * @member {string} password
     * @memberof loginS
     * @instance
     */
    loginS.prototype.password = "";

    /**
     * Creates a new loginS instance using the specified properties.
     * @function create
     * @memberof loginS
     * @static
     * @param {IloginS=} [properties] Properties to set
     * @returns {loginS} loginS instance
     */
    loginS.create = function create(properties) {
        return new loginS(properties);
    };

    /**
     * Encodes the specified loginS message. Does not implicitly {@link loginS.verify|verify} messages.
     * @function encode
     * @memberof loginS
     * @static
     * @param {IloginS} message loginS message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    loginS.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.account != null && Object.hasOwnProperty.call(message, "account"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
        if (message.password != null && Object.hasOwnProperty.call(message, "password"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
        return writer;
    };

    /**
     * Encodes the specified loginS message, length delimited. Does not implicitly {@link loginS.verify|verify} messages.
     * @function encodeDelimited
     * @memberof loginS
     * @static
     * @param {IloginS} message loginS message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    loginS.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a loginS message from the specified reader or buffer.
     * @function decode
     * @memberof loginS
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {loginS} loginS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    loginS.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.loginS();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.account = reader.string();
                break;
            case 2:
                message.password = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a loginS message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof loginS
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {loginS} loginS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    loginS.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a loginS message.
     * @function verify
     * @memberof loginS
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    loginS.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.account != null && message.hasOwnProperty("account"))
            if (!$util.isString(message.account))
                return "account: string expected";
        if (message.password != null && message.hasOwnProperty("password"))
            if (!$util.isString(message.password))
                return "password: string expected";
        return null;
    };

    /**
     * Creates a loginS message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof loginS
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {loginS} loginS
     */
    loginS.fromObject = function fromObject(object) {
        if (object instanceof $root.loginS)
            return object;
        var message = new $root.loginS();
        if (object.account != null)
            message.account = String(object.account);
        if (object.password != null)
            message.password = String(object.password);
        return message;
    };

    /**
     * Creates a plain object from a loginS message. Also converts values to other types if specified.
     * @function toObject
     * @memberof loginS
     * @static
     * @param {loginS} message loginS
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    loginS.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.account = "";
            object.password = "";
        }
        if (message.account != null && message.hasOwnProperty("account"))
            object.account = message.account;
        if (message.password != null && message.hasOwnProperty("password"))
            object.password = message.password;
        return object;
    };

    /**
     * Converts this loginS to JSON.
     * @function toJSON
     * @memberof loginS
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    loginS.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return loginS;
})();

$root.loginR = (function() {

    /**
     * Properties of a loginR.
     * @exports IloginR
     * @interface IloginR
     * @property {number|null} [ret] loginR ret
     * @property {number|null} [playerIndex] loginR playerIndex
     * @property {string|null} [ip] loginR ip
     */

    /**
     * Constructs a new loginR.
     * @exports loginR
     * @classdesc Represents a loginR.
     * @implements IloginR
     * @constructor
     * @param {IloginR=} [properties] Properties to set
     */
    function loginR(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * loginR ret.
     * @member {number} ret
     * @memberof loginR
     * @instance
     */
    loginR.prototype.ret = 0;

    /**
     * loginR playerIndex.
     * @member {number} playerIndex
     * @memberof loginR
     * @instance
     */
    loginR.prototype.playerIndex = 0;

    /**
     * loginR ip.
     * @member {string} ip
     * @memberof loginR
     * @instance
     */
    loginR.prototype.ip = "";

    /**
     * Creates a new loginR instance using the specified properties.
     * @function create
     * @memberof loginR
     * @static
     * @param {IloginR=} [properties] Properties to set
     * @returns {loginR} loginR instance
     */
    loginR.create = function create(properties) {
        return new loginR(properties);
    };

    /**
     * Encodes the specified loginR message. Does not implicitly {@link loginR.verify|verify} messages.
     * @function encode
     * @memberof loginR
     * @static
     * @param {IloginR} message loginR message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    loginR.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.ret != null && Object.hasOwnProperty.call(message, "ret"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.ret);
        if (message.playerIndex != null && Object.hasOwnProperty.call(message, "playerIndex"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.playerIndex);
        if (message.ip != null && Object.hasOwnProperty.call(message, "ip"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.ip);
        return writer;
    };

    /**
     * Encodes the specified loginR message, length delimited. Does not implicitly {@link loginR.verify|verify} messages.
     * @function encodeDelimited
     * @memberof loginR
     * @static
     * @param {IloginR} message loginR message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    loginR.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a loginR message from the specified reader or buffer.
     * @function decode
     * @memberof loginR
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {loginR} loginR
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    loginR.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.loginR();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.ret = reader.int32();
                break;
            case 2:
                message.playerIndex = reader.int32();
                break;
            case 3:
                message.ip = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a loginR message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof loginR
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {loginR} loginR
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    loginR.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a loginR message.
     * @function verify
     * @memberof loginR
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    loginR.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.ret != null && message.hasOwnProperty("ret"))
            if (!$util.isInteger(message.ret))
                return "ret: integer expected";
        if (message.playerIndex != null && message.hasOwnProperty("playerIndex"))
            if (!$util.isInteger(message.playerIndex))
                return "playerIndex: integer expected";
        if (message.ip != null && message.hasOwnProperty("ip"))
            if (!$util.isString(message.ip))
                return "ip: string expected";
        return null;
    };

    /**
     * Creates a loginR message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof loginR
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {loginR} loginR
     */
    loginR.fromObject = function fromObject(object) {
        if (object instanceof $root.loginR)
            return object;
        var message = new $root.loginR();
        if (object.ret != null)
            message.ret = object.ret | 0;
        if (object.playerIndex != null)
            message.playerIndex = object.playerIndex | 0;
        if (object.ip != null)
            message.ip = String(object.ip);
        return message;
    };

    /**
     * Creates a plain object from a loginR message. Also converts values to other types if specified.
     * @function toObject
     * @memberof loginR
     * @static
     * @param {loginR} message loginR
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    loginR.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.ret = 0;
            object.playerIndex = 0;
            object.ip = "";
        }
        if (message.ret != null && message.hasOwnProperty("ret"))
            object.ret = message.ret;
        if (message.playerIndex != null && message.hasOwnProperty("playerIndex"))
            object.playerIndex = message.playerIndex;
        if (message.ip != null && message.hasOwnProperty("ip"))
            object.ip = message.ip;
        return object;
    };

    /**
     * Converts this loginR to JSON.
     * @function toJSON
     * @memberof loginR
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    loginR.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return loginR;
})();

$root.loginToGateS = (function() {

    /**
     * Properties of a loginToGateS.
     * @exports IloginToGateS
     * @interface IloginToGateS
     * @property {number|null} [playerIndex] loginToGateS playerIndex
     */

    /**
     * Constructs a new loginToGateS.
     * @exports loginToGateS
     * @classdesc Represents a loginToGateS.
     * @implements IloginToGateS
     * @constructor
     * @param {IloginToGateS=} [properties] Properties to set
     */
    function loginToGateS(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * loginToGateS playerIndex.
     * @member {number} playerIndex
     * @memberof loginToGateS
     * @instance
     */
    loginToGateS.prototype.playerIndex = 0;

    /**
     * Creates a new loginToGateS instance using the specified properties.
     * @function create
     * @memberof loginToGateS
     * @static
     * @param {IloginToGateS=} [properties] Properties to set
     * @returns {loginToGateS} loginToGateS instance
     */
    loginToGateS.create = function create(properties) {
        return new loginToGateS(properties);
    };

    /**
     * Encodes the specified loginToGateS message. Does not implicitly {@link loginToGateS.verify|verify} messages.
     * @function encode
     * @memberof loginToGateS
     * @static
     * @param {IloginToGateS} message loginToGateS message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    loginToGateS.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.playerIndex != null && Object.hasOwnProperty.call(message, "playerIndex"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.playerIndex);
        return writer;
    };

    /**
     * Encodes the specified loginToGateS message, length delimited. Does not implicitly {@link loginToGateS.verify|verify} messages.
     * @function encodeDelimited
     * @memberof loginToGateS
     * @static
     * @param {IloginToGateS} message loginToGateS message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    loginToGateS.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a loginToGateS message from the specified reader or buffer.
     * @function decode
     * @memberof loginToGateS
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {loginToGateS} loginToGateS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    loginToGateS.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.loginToGateS();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.playerIndex = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a loginToGateS message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof loginToGateS
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {loginToGateS} loginToGateS
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    loginToGateS.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a loginToGateS message.
     * @function verify
     * @memberof loginToGateS
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    loginToGateS.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.playerIndex != null && message.hasOwnProperty("playerIndex"))
            if (!$util.isInteger(message.playerIndex))
                return "playerIndex: integer expected";
        return null;
    };

    /**
     * Creates a loginToGateS message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof loginToGateS
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {loginToGateS} loginToGateS
     */
    loginToGateS.fromObject = function fromObject(object) {
        if (object instanceof $root.loginToGateS)
            return object;
        var message = new $root.loginToGateS();
        if (object.playerIndex != null)
            message.playerIndex = object.playerIndex | 0;
        return message;
    };

    /**
     * Creates a plain object from a loginToGateS message. Also converts values to other types if specified.
     * @function toObject
     * @memberof loginToGateS
     * @static
     * @param {loginToGateS} message loginToGateS
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    loginToGateS.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.playerIndex = 0;
        if (message.playerIndex != null && message.hasOwnProperty("playerIndex"))
            object.playerIndex = message.playerIndex;
        return object;
    };

    /**
     * Converts this loginToGateS to JSON.
     * @function toJSON
     * @memberof loginToGateS
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    loginToGateS.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return loginToGateS;
})();

module.exports = $root;
