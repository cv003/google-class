var Module = typeof Module != "undefined" ? Module : {};
FTEH = {
    h: [],
    f: {}
};
FTE_SW = null;
if (!Module["canvas"]) {
    Module["canvas"] = document.getElementById("canvas");
    if (!Module["canvas"]) {
        console.log("No canvas element defined yet.");
        Module.canvas = document.createElement("canvas");
        Module.canvas.style.width = "100%";
        Module.canvas.style.height = "100%";
        document.body.appendChild(Module["canvas"])
    }
}
Module["loadcachedfiles"] = function() {
    addRunDependency("loadcachedfiles");
    try {
        caches.open("user").then(c => {
            Module["cache"] = c;
            return c.keys()
        }
        ).then(keys => {
            const cache = Module["cache"];
            for (var r of keys) {
                const idx = r.url.indexOf("/_/");
                if (idx < 0)
                    continue;
                const fn = r.url.substr(idx + 3);
                addRunDependency(fn);
                const response = cache.match(r).then(response => {
                    return response.arrayBuffer()
                }
                ).then(buffer => {
                    let b = FTEH.h[_emscriptenfte_buf_createfromarraybuf(buffer)];
                    b.n = fn;
                    FTEH.f[b.n] = b
                }
                ).finally( () => {
                    removeRunDependency(fn)
                }
                )
            }
        }
        ).finally( () => {
            removeRunDependency("loadcachedfiles")
        }
        )
    } catch (e) {
        removeRunDependency("loadcachedfiles")
    }
}
;
Module["preRun"] = Module["loadcachedfiles"];
if (typeof Module["files"] !== "undefined" && Object.keys(Module["files"]).length > 0) {
    Module["preRun"] = function() {
        Module["loadcachedfiles"]();
        Module["curfile"] = undefined;
        let files = Module["files"];
        let names = Object.keys(files);
        for (let i = 0; i < names.length; i++) {
            let ab = files[names[i]];
            let n = names[i];
            if (typeof ab == "string") {
                addRunDependency(n);
                let xhr = new XMLHttpRequest;
                xhr.responseType = "arraybuffer";
                xhr.open("GET", ab);
                xhr.onload = function() {
                    if (Module["curfile"] == n)
                        Module["curfile"] = undefined;
                    if (this.status >= 200 && this.status < 300) {
                        let b = FTEH.h[_emscriptenfte_buf_createfromarraybuf(this.response)];
                        b.n = n;
                        FTEH.f[b.n] = b;
                        removeRunDependency(n)
                    } else
                        removeRunDependency(n)
                }
                ;
                xhr.onprogress = function(e) {
                    if (typeof Module["curfile"] == "undefined")
                        Module["curfile"] = n;
                    if (Module["setStatus"] && Module["curfile"] == n)
                        Module["setStatus"](n + " (" + e.loaded + "/" + e.total + ")")
                }
                ;
                xhr.onerror = function() {
                    if (Module["curfile"] == n)
                        Module["curfile"] = undefined;
                    removeRunDependency(n)
                }
                ;
                xhr.send()
            } else if (typeof ab.then == "function") {
                addRunDependency(n);
                ab.then(value => {
                    let b = FTEH.h[_emscriptenfte_buf_createfromarraybuf(value)];
                    b.n = n;
                    FTEH.f[b.n] = b;
                    removeRunDependency(n)
                }
                , reason => {
                    console.log(reason);
                    removeRunDependency(n)
                }
                )
            } else {
                let b = FTEH.h[_emscriptenfte_buf_createfromarraybuf(ab)];
                b.n = n;
                FTEH.f[b.n] = b
            }
        }
    }
} else if (!Module["manifest"]) {
    let man = "https://cdn.jsdelivr.net/gh/genizy/google-class@70cf6146126d7f0551eb16899a5d4081a0544177/nazi-zombies-portable/";
    if (man.substr(-1) != "/")
        man += ".fmf";
    else
        man += "index.fmf";
    Module["manifest"] = man;
    if (window.location.hash != "")
        Module["manifest"] = window.location.hash.substring(1)
}
if (!Module["arguments"]) {
    Module["arguments"] = [];
    const qstrings = decodeURIComponent(window.location.search.substring(1));
    if (qstrings != "") {
        const qstring = qstrings.split(" ");
        for (let i = 0; i < qstring.length; i++) {
            if (qstring[i] == "-manifest")
                man = undefined;
            if ((qstring[i] == "+sv_port_rtc" || qstring[i] == "+connect" || qstring[i] == "+join" || qstring[i] == "+observe" || qstring[i] == "+qtvplay") && i + 1 < qstring.length) {
                Module["arguments"] = Module["arguments"].concat(qstring[i + 0], qstring[i + 1]);
                i++
            } else if (!document.referrer)
                Module["arguments"] = Module["arguments"].concat(qstring[i])
        }
    }
    if (Module["manifest"] != undefined)
        Module["arguments"] = Module["arguments"].concat(["-manifest", Module["manifest"]]);
    Module["mayregisterscemes"] = true
}
var moduleOverrides = Object.assign({}, Module);
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = (status, toThrow) => {
    throw toThrow
}
;
var ENVIRONMENT_IS_WEB = typeof window == "object";
var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
var scriptDirectory = "";
function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    }
    return scriptDirectory + path
}
var read_, readAsync, readBinary, setWindowTitle;
function logExceptionOnExit(e) {
    if (e instanceof ExitStatus)
        return;
    let toLog = e;
    err("exiting due to exception: " + toLog)
}
var fs;
var nodePath;
var requireNodeFS;
if (ENVIRONMENT_IS_NODE) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = require("path").dirname(scriptDirectory) + "/"
    } else {
        scriptDirectory = __dirname + "/"
    }
    requireNodeFS = ( () => {
        if (!nodePath) {
            fs = require("fs");
            nodePath = require("path")
        }
    }
    );
    read_ = function shell_read(filename, binary) {
        requireNodeFS();
        filename = nodePath["normalize"](filename);
        return fs.readFileSync(filename, binary ? undefined : "utf8")
    }
    ;
    readBinary = (filename => {
        var ret = read_(filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret)
        }
        return ret
    }
    );
    readAsync = ( (filename, onload, onerror) => {
        requireNodeFS();
        filename = nodePath["normalize"](filename);
        fs.readFile(filename, function(err, data) {
            if (err)
                onerror(err);
            else
                onload(data.buffer)
        })
    }
    );
    if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/")
    }
    arguments_ = process["argv"].slice(2);
    if (typeof module != "undefined") {
        module["exports"] = Module
    }
    process["on"]("uncaughtException", function(ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex
        }
    });
    process["on"]("unhandledRejection", function(reason) {
        throw reason
    });
    quit_ = ( (status, toThrow) => {
        if (keepRuntimeAlive()) {
            process["exitCode"] = status;
            throw toThrow
        }
        logExceptionOnExit(toThrow);
        process["exit"](status)
    }
    );
    Module["inspect"] = function() {
        return "[Emscripten Module object]"
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
    } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1)
    } else {
        scriptDirectory = ""
    }
    {
        read_ = (url => {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText
        }
        );
        if (ENVIRONMENT_IS_WORKER) {
            readBinary = (url => {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response)
            }
            )
        }
        readAsync = ( (url, onload, onerror) => {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = ( () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                    onload(xhr.response);
                    return
                }
                onerror()
            }
            );
            xhr.onerror = onerror;
            xhr.send(null)
        }
        )
    }
    setWindowTitle = (title => document.title = title)
} else {}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
Object.assign(Module, moduleOverrides);
moduleOverrides = null;
if (Module["arguments"])
    arguments_ = Module["arguments"];
if (Module["thisProgram"])
    thisProgram = Module["thisProgram"];
if (Module["quit"])
    quit_ = Module["quit"];
function warnOnce(text) {
    if (!warnOnce.shown)
        warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text)
    }
}
var wasmBinary;
if (Module["wasmBinary"])
    wasmBinary = Module["wasmBinary"];
var noExitRuntime = Module["noExitRuntime"] || true;
if (typeof WebAssembly != "object") {
    abort("no native wasm support detected")
}
var wasmMemory;
var ABORT = false;
var EXITSTATUS;
function assert(condition, text) {
    if (!condition) {
        abort(text)
    }
}
var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heap[endPtr] && !(endPtr >= endIdx))
        ++endPtr;
    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr))
    } else {
        var str = "";
        while (idx < endPtr) {
            var u0 = heap[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue
            }
            var u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue
            }
            var u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2
            } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0)
            } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
            }
        }
    }
    return str
}
function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
}
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0))
        return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx)
                break;
            heap[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx)
                break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx)
                break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx)
                break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}
function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
            u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127)
            ++len;
        else if (u <= 2047)
            len += 2;
        else if (u <= 65535)
            len += 3;
        else
            len += 4
    }
    return len
}
function allocateUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret)
        stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}
function allocateUTF8OnStack(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}
function writeArrayToMemory(array, buffer) {
    HEAP8.set(array, buffer)
}
function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++ >> 0] = str.charCodeAt(i)
    }
    if (!dontAddNull)
        HEAP8[buffer >> 0] = 0
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
}
var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 268435456;
var wasmTable;
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
var runtimeKeepaliveCounter = 0;
function keepRuntimeAlive() {
    return noExitRuntime || runtimeKeepaliveCounter > 0
}
function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
            Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}
function initRuntime() {
    runtimeInitialized = true;
    callRuntimeCallbacks(__ATINIT__)
}
function preMain() {
    callRuntimeCallbacks(__ATMAIN__)
}
function exitRuntime() {
    runtimeExited = true
}
function postRun() {
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
            Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}
function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}
function addOnInit(cb) {
    __ATINIT__.unshift(cb)
}
function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
}
function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
    {
        if (Module["onAbort"]) {
            Module["onAbort"](what)
        }
    }
    what = "Aborted(" + what + ")";
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    what += ". Build with -s ASSERTIONS=1 for more info.";
    var e = new WebAssembly.RuntimeError(what);
    throw e
}
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
    return filename.startsWith(dataURIPrefix)
}
function isFileURI(filename) {
    return filename.startsWith("file://")
}
var wasmBinaryFile;
wasmBinaryFile = "ftewebgl.wasm";
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile)
}
function getBinary(file) {
    try {
        if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary)
        }
        if (readBinary) {
            return readBinary(file)
        } else {
            throw "both async and sync fetching of the wasm failed"
        }
    } catch (err) {
        abort(err)
    }
}
function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function" && !isFileURI(wasmBinaryFile)) {
            return fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then(function(response) {
                if (!response["ok"]) {
                    throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                }
                return response["arrayBuffer"]()
            }).catch(function() {
                return getBinary(wasmBinaryFile)
            })
        } else {
            if (readAsync) {
                return new Promise(function(resolve, reject) {
                    readAsync(wasmBinaryFile, function(response) {
                        resolve(new Uint8Array(response))
                    }, reject)
                }
                )
            }
        }
    }
    return Promise.resolve().then(function() {
        return getBinary(wasmBinaryFile)
    })
}
function createWasm() {
    var info = {
        "a": asmLibraryArg
    };
    function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        wasmMemory = Module["asm"]["wc"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["yc"];
        addOnInit(Module["asm"]["xc"]);
        removeRunDependency("wasm-instantiate")
    }
    addRunDependency("wasm-instantiate");
    function receiveInstantiationResult(result) {
        receiveInstance(result["instance"])
    }
    function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function(binary) {
            return WebAssembly.instantiate(binary, info)
        }).then(function(instance) {
            return instance
        }).then(receiver, function(reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason)
        })
    }
    function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch == "function") {
            return fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then(function(response) {
                var result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiationResult, function(reason) {
                    err("wasm streaming compile failed: " + reason);
                    err("falling back to ArrayBuffer instantiation");
                    return instantiateArrayBuffer(receiveInstantiationResult)
                })
            })
        } else {
            return instantiateArrayBuffer(receiveInstantiationResult)
        }
    }
    if (Module["instantiateWasm"]) {
        try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
        }
    }
    instantiateAsync();
    return {}
}
var ASM_CONSTS = {
    1141392: function() {
        return window.showOpenFilePicker != undefined
    },
    1141437: function() {
        return Module["mayregisterscemes"] != false
    },
    1141482: function() {
        return navigator.userAgent.indexOf("FireFox") != -1
    },
    1141533: function($0, $1) {
        try {
            if (navigator.registerProtocolHandler)
                navigator.registerProtocolHandler(UTF8ToString($0), document.location.origin + document.location.pathname + "?%s" + document.location.hash, UTF8ToString($1))
        } catch (e) {}
    },
    1141748: function($0) {
        if (!$0) {
            AL.alcErr = 40964;
            return 1
        }
    },
    1141796: function($0) {
        if (!AL.currentCtx) {
            err("alGetProcAddress() called without a valid context");
            return 1
        }
        if (!$0) {
            AL.currentCtx.err = 40963;
            return 1
        }
    }
};
function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
            callback(Module);
            continue
        }
        var func = callback.func;
        if (typeof func == "number") {
            if (callback.arg === undefined) {
                getWasmTableEntry(func)()
            } else {
                getWasmTableEntry(func)(callback.arg)
            }
        } else {
            func(callback.arg === undefined ? null : callback.arg)
        }
    }
}
var wasmTableMirror = [];
function getWasmTableEntry(funcPtr) {
    var func = wasmTableMirror[funcPtr];
    if (!func) {
        if (funcPtr >= wasmTableMirror.length)
            wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr)
    }
    return func
}
function handleException(e) {
    if (e instanceof ExitStatus || e == "unwind") {
        return EXITSTATUS
    }
    quit_(1, e)
}
function _Sys_Clipboard_PasteText(cbt, callback, ctx) {
    if (cbt != 0)
        return;
    let docallback = function(text) {
        FTEC.clipboard = text;
        try {
            let stringlen = text.length * 3 + 1;
            let dataptr = _malloc(stringlen);
            stringToUTF8(text, dataptr, stringlen);
            getWasmTableEntry(callback)(ctx, dataptr);
            _free(dataptr)
        } catch (e) {}
    };
    try {
        navigator.clipboard.readText().then(docallback).catch(e => {
            docallback(FTEC.clipboard)
        }
        )
    } catch (e) {
        console.log(e);
        docallback(FTEC.clipboard)
    }
}
function _Sys_SaveClipboard(cbt, text) {
    if (cbt != 0)
        return;
    FTEC.clipboard = UTF8ToString(text);
    try {
        navigator.clipboard.writeText(FTEC.clipboard)
    } catch {}
}
var SYSCALLS = {
    buffers: [null, [], []],
    printChar: function(stream, curr) {
        var buffer = SYSCALLS.buffers[stream];
        if (curr === 0 || curr === 10) {
            (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
            buffer.length = 0
        } else {
            buffer.push(curr)
        }
    },
    varargs: undefined,
    get: function() {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret
    },
    getStr: function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret
    },
    get64: function(low, high) {
        return low
    }
};
function ___syscall_getegid32() {
    return 0
}
function ___syscall_getuid32() {
    return ___syscall_getegid32()
}
function __gmtime_js(time, tmPtr) {
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getUTCSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
    HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
    HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
    var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
    var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday
}
function __localtime_js(time, tmPtr) {
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getHours();
    HEAP32[tmPtr + 12 >> 2] = date.getDate();
    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var start = new Date(date.getFullYear(),0,1);
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
    var summerOffset = new Date(date.getFullYear(),6,1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
    HEAP32[tmPtr + 32 >> 2] = dst
}
function __mktime_js(tmPtr) {
    var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900,HEAP32[tmPtr + 16 >> 2],HEAP32[tmPtr + 12 >> 2],HEAP32[tmPtr + 8 >> 2],HEAP32[tmPtr + 4 >> 2],HEAP32[tmPtr >> 2],0);
    var dst = HEAP32[tmPtr + 32 >> 2];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(),0,1);
    var summerOffset = new Date(date.getFullYear(),6,1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset);
    if (dst < 0) {
        HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset)
    } else if (dst > 0 != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4)
    }
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getHours();
    HEAP32[tmPtr + 12 >> 2] = date.getDate();
    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    return date.getTime() / 1e3 | 0
}
function _tzset_impl(timezone, daylight, tzname) {
    var currentYear = (new Date).getFullYear();
    var winter = new Date(currentYear,0,1);
    var summer = new Date(currentYear,6,1);
    var winterOffset = winter.getTimezoneOffset();
    var summerOffset = summer.getTimezoneOffset();
    var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
    HEAP32[timezone >> 2] = stdTimezoneOffset * 60;
    HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
    function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT"
    }
    var winterName = extractZone(winter);
    var summerName = extractZone(summer);
    var winterNamePtr = allocateUTF8(winterName);
    var summerNamePtr = allocateUTF8(summerName);
    if (summerOffset < winterOffset) {
        HEAP32[tzname >> 2] = winterNamePtr;
        HEAP32[tzname + 4 >> 2] = summerNamePtr
    } else {
        HEAP32[tzname >> 2] = summerNamePtr;
        HEAP32[tzname + 4 >> 2] = winterNamePtr
    }
}
function __tzset_js(timezone, daylight, tzname) {
    if (__tzset_js.called)
        return;
    __tzset_js.called = true;
    _tzset_impl(timezone, daylight, tzname)
}
function _emscripten_set_main_loop_timing(mode, value) {
    Browser.mainLoop.timingMode = mode;
    Browser.mainLoop.timingValue = value;
    if (!Browser.mainLoop.func) {
        return 1
    }
    if (!Browser.mainLoop.running) {
        Browser.mainLoop.running = true
    }
    if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
        }
        ;
        Browser.mainLoop.method = "timeout"
    } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner)
        }
        ;
        Browser.mainLoop.method = "rAF"
    } else if (mode == 2) {
        if (typeof setImmediate == "undefined") {
            var setImmediates = [];
            var emscriptenMainLoopMessageId = "setimmediate";
            var Browser_setImmediate_messageHandler = function(event) {
                if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                    event.stopPropagation();
                    setImmediates.shift()()
                }
            };
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            setImmediate = function Browser_emulated_setImmediate(func) {
                setImmediates.push(func);
                if (ENVIRONMENT_IS_WORKER) {
                    if (Module["setImmediates"] === undefined)
                        Module["setImmediates"] = [];
                    Module["setImmediates"].push(func);
                    postMessage({
                        target: emscriptenMainLoopMessageId
                    })
                } else
                    postMessage(emscriptenMainLoopMessageId, "*")
            }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            setImmediate(Browser.mainLoop.runner)
        }
        ;
        Browser.mainLoop.method = "immediate"
    }
    return 0
}
var _emscripten_get_now;
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = ( () => {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6
    }
    )
} else
    _emscripten_get_now = ( () => performance.now());
function _exit(status) {
    exit(status)
}
function maybeExit() {
    if (!keepRuntimeAlive()) {
        try {
            _exit(EXITSTATUS)
        } catch (e) {
            handleException(e)
        }
    }
}
function setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) {
    assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
    Browser.mainLoop.func = browserIterationFunc;
    Browser.mainLoop.arg = arg;
    var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
    function checkIsRunning() {
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
            maybeExit();
            return false
        }
        return true
    }
    Browser.mainLoop.running = false;
    Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT)
            return;
        if (Browser.mainLoop.queue.length > 0) {
            var start = Date.now();
            var blocker = Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if (Browser.mainLoop.remainingBlockers) {
                var remaining = Browser.mainLoop.remainingBlockers;
                var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                if (blocker.counted) {
                    Browser.mainLoop.remainingBlockers = next
                } else {
                    next = next + .5;
                    Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
                }
            }
            out('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
            Browser.mainLoop.updateStatus();
            if (!checkIsRunning())
                return;
            setTimeout(Browser.mainLoop.runner, 0);
            return
        }
        if (!checkIsRunning())
            return;
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
            Browser.mainLoop.scheduler();
            return
        } else if (Browser.mainLoop.timingMode == 0) {
            Browser.mainLoop.tickStartTime = _emscripten_get_now()
        }
        Browser.mainLoop.runIter(browserIterationFunc);
        if (!checkIsRunning())
            return;
        if (typeof SDL == "object" && SDL.audio && SDL.audio.queueNewAudioData)
            SDL.audio.queueNewAudioData();
        Browser.mainLoop.scheduler()
    }
    ;
    if (!noSetTiming) {
        if (fps && fps > 0)
            _emscripten_set_main_loop_timing(0, 1e3 / fps);
        else
            _emscripten_set_main_loop_timing(1, 1);
        Browser.mainLoop.scheduler()
    }
    if (simulateInfiniteLoop) {
        throw "unwind"
    }
}
function callUserCallback(func, synchronous) {
    if (runtimeExited || ABORT) {
        return
    }
    if (synchronous) {
        func();
        return
    }
    try {
        func()
    } catch (e) {
        handleException(e)
    }
}
function safeSetTimeout(func, timeout) {
    return setTimeout(function() {
        callUserCallback(func)
    }, timeout)
}
var Browser = {
    mainLoop: {
        running: false,
        scheduler: null,
        method: "",
        currentlyRunningMainloop: 0,
        func: null,
        arg: 0,
        timingMode: 0,
        timingValue: 0,
        currentFrameNumber: 0,
        queue: [],
        pause: function() {
            Browser.mainLoop.scheduler = null;
            Browser.mainLoop.currentlyRunningMainloop++
        },
        resume: function() {
            Browser.mainLoop.currentlyRunningMainloop++;
            var timingMode = Browser.mainLoop.timingMode;
            var timingValue = Browser.mainLoop.timingValue;
            var func = Browser.mainLoop.func;
            Browser.mainLoop.func = null;
            setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
            _emscripten_set_main_loop_timing(timingMode, timingValue);
            Browser.mainLoop.scheduler()
        },
        updateStatus: function() {
            if (Module["setStatus"]) {
                var message = Module["statusMessage"] || "Please wait...";
                var remaining = Browser.mainLoop.remainingBlockers;
                var expected = Browser.mainLoop.expectedBlockers;
                if (remaining) {
                    if (remaining < expected) {
                        Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                    } else {
                        Module["setStatus"](message)
                    }
                } else {
                    Module["setStatus"]("")
                }
            }
        },
        runIter: function(func) {
            if (ABORT)
                return;
            if (Module["preMainLoop"]) {
                var preRet = Module["preMainLoop"]();
                if (preRet === false) {
                    return
                }
            }
            callUserCallback(func);
            if (Module["postMainLoop"])
                Module["postMainLoop"]()
        }
    },
    isFullscreen: false,
    pointerLock: false,
    moduleContextCreatedCallbacks: [],
    workers: [],
    init: function() {
        if (!Module["preloadPlugins"])
            Module["preloadPlugins"] = [];
        if (Browser.initted)
            return;
        Browser.initted = true;
        try {
            new Blob;
            Browser.hasBlobConstructor = true
        } catch (e) {
            Browser.hasBlobConstructor = false;
            out("warning: no blob constructor, cannot create blobs with mimetypes")
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? out("warning: no BlobBuilder") : null;
        Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject == "undefined") {
            out("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
            Module.noImageDecoding = true
        }
        var imagePlugin = {};
        imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
        }
        ;
        imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
            var b = null;
            if (Browser.hasBlobConstructor) {
                try {
                    b = new Blob([byteArray],{
                        type: Browser.getMimetype(name)
                    });
                    if (b.size !== byteArray.length) {
                        b = new Blob([new Uint8Array(byteArray).buffer],{
                            type: Browser.getMimetype(name)
                        })
                    }
                } catch (e) {
                    warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                }
            }
            if (!b) {
                var bb = new Browser.BlobBuilder;
                bb.append(new Uint8Array(byteArray).buffer);
                b = bb.getBlob()
            }
            var url = Browser.URLObject.createObjectURL(b);
            var img = new Image;
            img.onload = ( () => {
                assert(img.complete, "Image " + name + " could not be decoded");
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                Module["preloadedImages"][name] = canvas;
                Browser.URLObject.revokeObjectURL(url);
                if (onload)
                    onload(byteArray)
            }
            );
            img.onerror = (event => {
                out("Image " + url + " could not be decoded");
                if (onerror)
                    onerror()
            }
            );
            img.src = url
        }
        ;
        Module["preloadPlugins"].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
            return !Module.noAudioDecoding && name.substr(-4)in {
                ".ogg": 1,
                ".wav": 1,
                ".mp3": 1
            }
        }
        ;
        audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
            var done = false;
            function finish(audio) {
                if (done)
                    return;
                done = true;
                Module["preloadedAudios"][name] = audio;
                if (onload)
                    onload(byteArray)
            }
            function fail() {
                if (done)
                    return;
                done = true;
                Module["preloadedAudios"][name] = new Audio;
                if (onerror)
                    onerror()
            }
            if (Browser.hasBlobConstructor) {
                try {
                    var b = new Blob([byteArray],{
                        type: Browser.getMimetype(name)
                    })
                } catch (e) {
                    return fail()
                }
                var url = Browser.URLObject.createObjectURL(b);
                var audio = new Audio;
                audio.addEventListener("canplaythrough", function() {
                    finish(audio)
                }, false);
                audio.onerror = function audio_onerror(event) {
                    if (done)
                        return;
                    out("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");
                    function encode64(data) {
                        var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                        var PAD = "=";
                        var ret = "";
                        var leftchar = 0;
                        var leftbits = 0;
                        for (var i = 0; i < data.length; i++) {
                            leftchar = leftchar << 8 | data[i];
                            leftbits += 8;
                            while (leftbits >= 6) {
                                var curr = leftchar >> leftbits - 6 & 63;
                                leftbits -= 6;
                                ret += BASE[curr]
                            }
                        }
                        if (leftbits == 2) {
                            ret += BASE[(leftchar & 3) << 4];
                            ret += PAD + PAD
                        } else if (leftbits == 4) {
                            ret += BASE[(leftchar & 15) << 2];
                            ret += PAD
                        }
                        return ret
                    }
                    audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                    finish(audio)
                }
                ;
                audio.src = url;
                safeSetTimeout(function() {
                    finish(audio)
                }, 1e4)
            } else {
                return fail()
            }
        }
        ;
        Module["preloadPlugins"].push(audioPlugin);
        function pointerLockChange() {
            Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
        }
        var canvas = Module["canvas"];
        if (canvas) {
            canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || function() {}
            ;
            canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || function() {}
            ;
            canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
            document.addEventListener("pointerlockchange", pointerLockChange, false);
            document.addEventListener("mozpointerlockchange", pointerLockChange, false);
            document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
            document.addEventListener("mspointerlockchange", pointerLockChange, false);
            if (Module["elementPointerLock"]) {
                canvas.addEventListener("click", function(ev) {
                    if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                        Module["canvas"].requestPointerLock();
                        ev.preventDefault()
                    }
                }, false)
            }
        }
    },
    handledByPreloadPlugin: function(byteArray, fullname, finish, onerror) {
        Browser.init();
        var handled = false;
        Module["preloadPlugins"].forEach(function(plugin) {
            if (handled)
                return;
            if (plugin["canHandle"](fullname)) {
                plugin["handle"](byteArray, fullname, finish, onerror);
                handled = true
            }
        });
        return handled
    },
    createContext: function(canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas)
            return Module.ctx;
        var ctx;
        var contextHandle;
        if (useWebGL) {
            var contextAttributes = {
                antialias: false,
                alpha: false,
                majorVersion: typeof WebGL2RenderingContext != "undefined" ? 2 : 1
            };
            if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                    contextAttributes[attribute] = webGLContextAttributes[attribute]
                }
            }
            if (typeof GL != "undefined") {
                contextHandle = GL.createContext(canvas, contextAttributes);
                if (contextHandle) {
                    ctx = GL.getContext(contextHandle).GLctx
                }
            }
        } else {
            ctx = canvas.getContext("2d")
        }
        if (!ctx)
            return null;
        if (setInModule) {
            if (!useWebGL)
                assert(typeof GLctx == "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
            Module.ctx = ctx;
            if (useWebGL)
                GL.makeContextCurrent(contextHandle);
            Module.useWebGL = useWebGL;
            Browser.moduleContextCreatedCallbacks.forEach(function(callback) {
                callback()
            });
            Browser.init()
        }
        return ctx
    },
    destroyContext: function(canvas, useWebGL, setInModule) {},
    fullscreenHandlersInstalled: false,
    lockPointer: undefined,
    resizeCanvas: undefined,
    requestFullscreen: function(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer == "undefined")
            Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas == "undefined")
            Browser.resizeCanvas = false;
        var canvas = Module["canvas"];
        function fullscreenChange() {
            Browser.isFullscreen = false;
            var canvasContainer = canvas.parentNode;
            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                canvas.exitFullscreen = Browser.exitFullscreen;
                if (Browser.lockPointer)
                    canvas.requestPointerLock();
                Browser.isFullscreen = true;
                if (Browser.resizeCanvas) {
                    Browser.setFullscreenCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            } else {
                canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                canvasContainer.parentNode.removeChild(canvasContainer);
                if (Browser.resizeCanvas) {
                    Browser.setWindowedCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            }
            if (Module["onFullScreen"])
                Module["onFullScreen"](Browser.isFullscreen);
            if (Module["onFullscreen"])
                Module["onFullscreen"](Browser.isFullscreen)
        }
        if (!Browser.fullscreenHandlersInstalled) {
            Browser.fullscreenHandlersInstalled = true;
            document.addEventListener("fullscreenchange", fullscreenChange, false);
            document.addEventListener("mozfullscreenchange", fullscreenChange, false);
            document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
            document.addEventListener("MSFullscreenChange", fullscreenChange, false)
        }
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? function() {
            canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])
        }
        : null) || (canvasContainer["webkitRequestFullScreen"] ? function() {
            canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
        }
        : null);
        canvasContainer.requestFullscreen()
    },
    exitFullscreen: function() {
        if (!Browser.isFullscreen) {
            return false
        }
        var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || function() {}
        ;
        CFS.apply(document, []);
        return true
    },
    nextRAF: 0,
    fakeRequestAnimationFrame: function(func) {
        var now = Date.now();
        if (Browser.nextRAF === 0) {
            Browser.nextRAF = now + 1e3 / 60
        } else {
            while (now + 2 >= Browser.nextRAF) {
                Browser.nextRAF += 1e3 / 60
            }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay)
    },
    requestAnimationFrame: function(func) {
        if (typeof requestAnimationFrame == "function") {
            requestAnimationFrame(func);
            return
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func)
    },
    safeSetTimeout: function(func) {
        return safeSetTimeout(func)
    },
    safeRequestAnimationFrame: function(func) {
        return Browser.requestAnimationFrame(function() {
            callUserCallback(func)
        })
    },
    getMimetype: function(name) {
        return {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "bmp": "image/bmp",
            "ogg": "audio/ogg",
            "wav": "audio/wav",
            "mp3": "audio/mpeg"
        }[name.substr(name.lastIndexOf(".") + 1)]
    },
    getUserMedia: function(func) {
        if (!window.getUserMedia) {
            window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
        }
        window.getUserMedia(func)
    },
    getMovementX: function(event) {
        return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
    },
    getMovementY: function(event) {
        return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
    },
    getMouseWheelDelta: function(event) {
        var delta = 0;
        switch (event.type) {
        case "DOMMouseScroll":
            delta = event.detail / 3;
            break;
        case "mousewheel":
            delta = event.wheelDelta / 120;
            break;
        case "wheel":
            delta = event.deltaY;
            switch (event.deltaMode) {
            case 0:
                delta /= 100;
                break;
            case 1:
                delta /= 3;
                break;
            case 2:
                delta *= 80;
                break;
            default:
                throw "unrecognized mouse wheel delta mode: " + event.deltaMode
            }
            break;
        default:
            throw "unrecognized mouse wheel event: " + event.type
        }
        return delta
    },
    mouseX: 0,
    mouseY: 0,
    mouseMovementX: 0,
    mouseMovementY: 0,
    touches: {},
    lastTouches: {},
    calculateMouseEvent: function(event) {
        if (Browser.pointerLock) {
            if (event.type != "mousemove" && "mozMovementX"in event) {
                Browser.mouseMovementX = Browser.mouseMovementY = 0
            } else {
                Browser.mouseMovementX = Browser.getMovementX(event);
                Browser.mouseMovementY = Browser.getMovementY(event)
            }
            if (typeof SDL != "undefined") {
                Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
            } else {
                Browser.mouseX += Browser.mouseMovementX;
                Browser.mouseY += Browser.mouseMovementY
            }
        } else {
            var rect = Module["canvas"].getBoundingClientRect();
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
            var scrollX = typeof window.scrollX != "undefined" ? window.scrollX : window.pageXOffset;
            var scrollY = typeof window.scrollY != "undefined" ? window.scrollY : window.pageYOffset;
            if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                var touch = event.touch;
                if (touch === undefined) {
                    return
                }
                var adjustedX = touch.pageX - (scrollX + rect.left);
                var adjustedY = touch.pageY - (scrollY + rect.top);
                adjustedX = adjustedX * (cw / rect.width);
                adjustedY = adjustedY * (ch / rect.height);
                var coords = {
                    x: adjustedX,
                    y: adjustedY
                };
                if (event.type === "touchstart") {
                    Browser.lastTouches[touch.identifier] = coords;
                    Browser.touches[touch.identifier] = coords
                } else if (event.type === "touchend" || event.type === "touchmove") {
                    var last = Browser.touches[touch.identifier];
                    if (!last)
                        last = coords;
                    Browser.lastTouches[touch.identifier] = last;
                    Browser.touches[touch.identifier] = coords
                }
                return
            }
            var x = event.pageX - (scrollX + rect.left);
            var y = event.pageY - (scrollY + rect.top);
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y
        }
    },
    resizeListeners: [],
    updateResizeListeners: function() {
        var canvas = Module["canvas"];
        Browser.resizeListeners.forEach(function(listener) {
            listener(canvas.width, canvas.height)
        })
    },
    setCanvasSize: function(width, height, noUpdates) {
        var canvas = Module["canvas"];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates)
            Browser.updateResizeListeners()
    },
    windowedWidth: 0,
    windowedHeight: 0,
    setFullscreenCanvasSize: function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >> 2];
            flags = flags | 8388608;
            HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    },
    setWindowedCanvasSize: function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >> 2];
            flags = flags & ~8388608;
            HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    },
    updateCanvasDimensions: function(canvas, wNative, hNative) {
        if (wNative && hNative) {
            canvas.widthNative = wNative;
            canvas.heightNative = hNative
        } else {
            wNative = canvas.widthNative;
            hNative = canvas.heightNative
        }
        var w = wNative;
        var h = hNative;
        if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
            if (w / h < Module["forcedAspectRatio"]) {
                w = Math.round(h * Module["forcedAspectRatio"])
            } else {
                h = Math.round(w / Module["forcedAspectRatio"])
            }
        }
        if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
            var factor = Math.min(screen.width / w, screen.height / h);
            w = Math.round(w * factor);
            h = Math.round(h * factor)
        }
        if (Browser.resizeCanvas) {
            if (canvas.width != w)
                canvas.width = w;
            if (canvas.height != h)
                canvas.height = h;
            if (typeof canvas.style != "undefined") {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height")
            }
        } else {
            if (canvas.width != wNative)
                canvas.width = wNative;
            if (canvas.height != hNative)
                canvas.height = hNative;
            if (typeof canvas.style != "undefined") {
                if (w != wNative || h != hNative) {
                    canvas.style.setProperty("width", w + "px", "important");
                    canvas.style.setProperty("height", h + "px", "important")
                } else {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height")
                }
            }
        }
    }
};
var AL = {
    QUEUE_INTERVAL: 25,
    QUEUE_LOOKAHEAD: .1,
    DEVICE_NAME: "Emscripten OpenAL",
    CAPTURE_DEVICE_NAME: "Emscripten OpenAL capture",
    ALC_EXTENSIONS: {
        ALC_SOFT_pause_device: true,
        ALC_SOFT_HRTF: true
    },
    AL_EXTENSIONS: {
        AL_EXT_float32: true,
        AL_SOFT_loop_points: true,
        AL_SOFT_source_length: true,
        AL_EXT_source_distance_model: true,
        AL_SOFT_source_spatialize: true
    },
    _alcErr: 0,
    alcErr: 0,
    deviceRefCounts: {},
    alcStringCache: {},
    paused: false,
    stringCache: {},
    contexts: {},
    currentCtx: null,
    buffers: {
        0: {
            id: 0,
            refCount: 0,
            audioBuf: null,
            frequency: 0,
            bytesPerSample: 2,
            channels: 1,
            length: 0
        }
    },
    paramArray: [],
    _nextId: 1,
    newId: function() {
        return AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++
    },
    freeIds: [],
    scheduleContextAudio: function(ctx) {
        if (Browser.mainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
            return
        }
        for (var i in ctx.sources) {
            AL.scheduleSourceAudio(ctx.sources[i])
        }
    },
    scheduleSourceAudio: function(src, lookahead) {
        if (Browser.mainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
            return
        }
        if (src.state !== 4114) {
            return
        }
        var currentTime = AL.updateSourceTime(src);
        var startTime = src.bufStartTime;
        var startOffset = src.bufOffset;
        var bufCursor = src.bufsProcessed;
        for (var i = 0; i < src.audioQueue.length; i++) {
            var audioSrc = src.audioQueue[i];
            startTime = audioSrc._startTime + audioSrc._duration;
            startOffset = 0;
            bufCursor += audioSrc._skipCount + 1
        }
        if (!lookahead) {
            lookahead = AL.QUEUE_LOOKAHEAD
        }
        var lookaheadTime = currentTime + lookahead;
        var skipCount = 0;
        while (startTime < lookaheadTime) {
            if (bufCursor >= src.bufQueue.length) {
                if (src.looping) {
                    bufCursor %= src.bufQueue.length
                } else {
                    break
                }
            }
            var buf = src.bufQueue[bufCursor % src.bufQueue.length];
            if (buf.length === 0) {
                skipCount++;
                if (skipCount === src.bufQueue.length) {
                    break
                }
            } else {
                var audioSrc = src.context.audioCtx.createBufferSource();
                audioSrc.buffer = buf.audioBuf;
                audioSrc.playbackRate.value = src.playbackRate;
                if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
                    audioSrc.loopStart = buf.audioBuf._loopStart;
                    audioSrc.loopEnd = buf.audioBuf._loopEnd
                }
                var duration = 0;
                if (src.type === 4136 && src.looping) {
                    duration = Number.POSITIVE_INFINITY;
                    audioSrc.loop = true;
                    if (buf.audioBuf._loopStart) {
                        audioSrc.loopStart = buf.audioBuf._loopStart
                    }
                    if (buf.audioBuf._loopEnd) {
                        audioSrc.loopEnd = buf.audioBuf._loopEnd
                    }
                } else {
                    duration = (buf.audioBuf.duration - startOffset) / src.playbackRate
                }
                audioSrc._startOffset = startOffset;
                audioSrc._duration = duration;
                audioSrc._skipCount = skipCount;
                skipCount = 0;
                audioSrc.connect(src.gain);
                if (typeof audioSrc.start != "undefined") {
                    startTime = Math.max(startTime, src.context.audioCtx.currentTime);
                    audioSrc.start(startTime, startOffset)
                } else if (typeof audioSrc.noteOn != "undefined") {
                    startTime = Math.max(startTime, src.context.audioCtx.currentTime);
                    audioSrc.noteOn(startTime)
                }
                audioSrc._startTime = startTime;
                src.audioQueue.push(audioSrc);
                startTime += duration
            }
            startOffset = 0;
            bufCursor++
        }
    },
    updateSourceTime: function(src) {
        var currentTime = src.context.audioCtx.currentTime;
        if (src.state !== 4114) {
            return currentTime
        }
        if (!isFinite(src.bufStartTime)) {
            src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
            src.bufOffset = 0
        }
        var nextStartTime = 0;
        while (src.audioQueue.length) {
            var audioSrc = src.audioQueue[0];
            src.bufsProcessed += audioSrc._skipCount;
            nextStartTime = audioSrc._startTime + audioSrc._duration;
            if (currentTime < nextStartTime) {
                break
            }
            src.audioQueue.shift();
            src.bufStartTime = nextStartTime;
            src.bufOffset = 0;
            src.bufsProcessed++
        }
        if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
            AL.setSourceState(src, 4116)
        } else if (src.type === 4136 && src.looping) {
            var buf = src.bufQueue[0];
            if (buf.length === 0) {
                src.bufOffset = 0
            } else {
                var delta = (currentTime - src.bufStartTime) * src.playbackRate;
                var loopStart = buf.audioBuf._loopStart || 0;
                var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
                if (loopEnd <= loopStart) {
                    loopEnd = buf.audioBuf.duration
                }
                if (delta < loopEnd) {
                    src.bufOffset = delta
                } else {
                    src.bufOffset = loopStart + (delta - loopStart) % (loopEnd - loopStart)
                }
            }
        } else if (src.audioQueue[0]) {
            src.bufOffset = (currentTime - src.audioQueue[0]._startTime) * src.playbackRate
        } else {
            if (src.type !== 4136 && src.looping) {
                var srcDuration = AL.sourceDuration(src) / src.playbackRate;
                if (srcDuration > 0) {
                    src.bufStartTime += Math.floor((currentTime - src.bufStartTime) / srcDuration) * srcDuration
                }
            }
            for (var i = 0; i < src.bufQueue.length; i++) {
                if (src.bufsProcessed >= src.bufQueue.length) {
                    if (src.looping) {
                        src.bufsProcessed %= src.bufQueue.length
                    } else {
                        AL.setSourceState(src, 4116);
                        break
                    }
                }
                var buf = src.bufQueue[src.bufsProcessed];
                if (buf.length > 0) {
                    nextStartTime = src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
                    if (currentTime < nextStartTime) {
                        src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
                        break
                    }
                    src.bufStartTime = nextStartTime
                }
                src.bufOffset = 0;
                src.bufsProcessed++
            }
        }
        return currentTime
    },
    cancelPendingSourceAudio: function(src) {
        AL.updateSourceTime(src);
        for (var i = 1; i < src.audioQueue.length; i++) {
            var audioSrc = src.audioQueue[i];
            audioSrc.stop()
        }
        if (src.audioQueue.length > 1) {
            src.audioQueue.length = 1
        }
    },
    stopSourceAudio: function(src) {
        for (var i = 0; i < src.audioQueue.length; i++) {
            src.audioQueue[i].stop()
        }
        src.audioQueue.length = 0
    },
    setSourceState: function(src, state) {
        if (state === 4114) {
            if (src.state === 4114 || src.state == 4116) {
                src.bufsProcessed = 0;
                src.bufOffset = 0
            } else {}
            AL.stopSourceAudio(src);
            src.state = 4114;
            src.bufStartTime = Number.NEGATIVE_INFINITY;
            AL.scheduleSourceAudio(src)
        } else if (state === 4115) {
            if (src.state === 4114) {
                AL.updateSourceTime(src);
                AL.stopSourceAudio(src);
                src.state = 4115
            }
        } else if (state === 4116) {
            if (src.state !== 4113) {
                src.state = 4116;
                src.bufsProcessed = src.bufQueue.length;
                src.bufStartTime = Number.NEGATIVE_INFINITY;
                src.bufOffset = 0;
                AL.stopSourceAudio(src)
            }
        } else if (state === 4113) {
            if (src.state !== 4113) {
                src.state = 4113;
                src.bufsProcessed = 0;
                src.bufStartTime = Number.NEGATIVE_INFINITY;
                src.bufOffset = 0;
                AL.stopSourceAudio(src)
            }
        }
    },
    initSourcePanner: function(src) {
        if (src.type === 4144) {
            return
        }
        var templateBuf = AL.buffers[0];
        for (var i = 0; i < src.bufQueue.length; i++) {
            if (src.bufQueue[i].id !== 0) {
                templateBuf = src.bufQueue[i];
                break
            }
        }
        if (src.spatialize === 1 || src.spatialize === 2 && templateBuf.channels === 1) {
            if (src.panner) {
                return
            }
            src.panner = src.context.audioCtx.createPanner();
            AL.updateSourceGlobal(src);
            AL.updateSourceSpace(src);
            src.panner.connect(src.context.gain);
            src.gain.disconnect();
            src.gain.connect(src.panner)
        } else {
            if (!src.panner) {
                return
            }
            src.panner.disconnect();
            src.gain.disconnect();
            src.gain.connect(src.context.gain);
            src.panner = null
        }
    },
    updateContextGlobal: function(ctx) {
        for (var i in ctx.sources) {
            AL.updateSourceGlobal(ctx.sources[i])
        }
    },
    updateSourceGlobal: function(src) {
        var panner = src.panner;
        if (!panner) {
            return
        }
        panner.refDistance = src.refDistance;
        panner.maxDistance = src.maxDistance;
        panner.rolloffFactor = src.rolloffFactor;
        panner.panningModel = src.context.hrtf ? "HRTF" : "equalpower";
        var distanceModel = src.context.sourceDistanceModel ? src.distanceModel : src.context.distanceModel;
        switch (distanceModel) {
        case 0:
            panner.distanceModel = "inverse";
            panner.refDistance = 3.40282e38;
            break;
        case 53249:
        case 53250:
            panner.distanceModel = "inverse";
            break;
        case 53251:
        case 53252:
            panner.distanceModel = "linear";
            break;
        case 53253:
        case 53254:
            panner.distanceModel = "exponential";
            break
        }
    },
    updateListenerSpace: function(ctx) {
        var listener = ctx.audioCtx.listener;
        if (listener.positionX) {
            listener.positionX.value = ctx.listener.position[0];
            listener.positionY.value = ctx.listener.position[1];
            listener.positionZ.value = ctx.listener.position[2]
        } else {
            listener.setPosition(ctx.listener.position[0], ctx.listener.position[1], ctx.listener.position[2])
        }
        if (listener.forwardX) {
            listener.forwardX.value = ctx.listener.direction[0];
            listener.forwardY.value = ctx.listener.direction[1];
            listener.forwardZ.value = ctx.listener.direction[2];
            listener.upX.value = ctx.listener.up[0];
            listener.upY.value = ctx.listener.up[1];
            listener.upZ.value = ctx.listener.up[2]
        } else {
            listener.setOrientation(ctx.listener.direction[0], ctx.listener.direction[1], ctx.listener.direction[2], ctx.listener.up[0], ctx.listener.up[1], ctx.listener.up[2])
        }
        for (var i in ctx.sources) {
            AL.updateSourceSpace(ctx.sources[i])
        }
    },
    updateSourceSpace: function(src) {
        if (!src.panner) {
            return
        }
        var panner = src.panner;
        var posX = src.position[0];
        var posY = src.position[1];
        var posZ = src.position[2];
        var dirX = src.direction[0];
        var dirY = src.direction[1];
        var dirZ = src.direction[2];
        var listener = src.context.listener;
        var lPosX = listener.position[0];
        var lPosY = listener.position[1];
        var lPosZ = listener.position[2];
        if (src.relative) {
            var lBackX = -listener.direction[0];
            var lBackY = -listener.direction[1];
            var lBackZ = -listener.direction[2];
            var lUpX = listener.up[0];
            var lUpY = listener.up[1];
            var lUpZ = listener.up[2];
            var inverseMagnitude = function(x, y, z) {
                var length = Math.sqrt(x * x + y * y + z * z);
                if (length < Number.EPSILON) {
                    return 0
                }
                return 1 / length
            };
            var invMag = inverseMagnitude(lBackX, lBackY, lBackZ);
            lBackX *= invMag;
            lBackY *= invMag;
            lBackZ *= invMag;
            invMag = inverseMagnitude(lUpX, lUpY, lUpZ);
            lUpX *= invMag;
            lUpY *= invMag;
            lUpZ *= invMag;
            var lRightX = lUpY * lBackZ - lUpZ * lBackY;
            var lRightY = lUpZ * lBackX - lUpX * lBackZ;
            var lRightZ = lUpX * lBackY - lUpY * lBackX;
            invMag = inverseMagnitude(lRightX, lRightY, lRightZ);
            lRightX *= invMag;
            lRightY *= invMag;
            lRightZ *= invMag;
            lUpX = lBackY * lRightZ - lBackZ * lRightY;
            lUpY = lBackZ * lRightX - lBackX * lRightZ;
            lUpZ = lBackX * lRightY - lBackY * lRightX;
            var oldX = dirX;
            var oldY = dirY;
            var oldZ = dirZ;
            dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
            dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
            dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
            oldX = posX;
            oldY = posY;
            oldZ = posZ;
            posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
            posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
            posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
            posX += lPosX;
            posY += lPosY;
            posZ += lPosZ
        }
        if (panner.positionX) {
            if (posX != panner.positionX.value)
                panner.positionX.value = posX;
            if (posY != panner.positionY.value)
                panner.positionY.value = posY;
            if (posZ != panner.positionZ.value)
                panner.positionZ.value = posZ
        } else {
            panner.setPosition(posX, posY, posZ)
        }
        if (panner.orientationX) {
            if (dirX != panner.orientationX.value)
                panner.orientationX.value = dirX;
            if (dirY != panner.orientationY.value)
                panner.orientationY.value = dirY;
            if (dirZ != panner.orientationZ.value)
                panner.orientationZ.value = dirZ
        } else {
            panner.setOrientation(dirX, dirY, dirZ)
        }
        var oldShift = src.dopplerShift;
        var velX = src.velocity[0];
        var velY = src.velocity[1];
        var velZ = src.velocity[2];
        var lVelX = listener.velocity[0];
        var lVelY = listener.velocity[1];
        var lVelZ = listener.velocity[2];
        if (posX === lPosX && posY === lPosY && posZ === lPosZ || velX === lVelX && velY === lVelY && velZ === lVelZ) {
            src.dopplerShift = 1
        } else {
            var speedOfSound = src.context.speedOfSound;
            var dopplerFactor = src.context.dopplerFactor;
            var slX = lPosX - posX;
            var slY = lPosY - posY;
            var slZ = lPosZ - posZ;
            var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
            var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
            var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
            vls = Math.min(vls, speedOfSound / dopplerFactor);
            vss = Math.min(vss, speedOfSound / dopplerFactor);
            src.dopplerShift = (speedOfSound - dopplerFactor * vls) / (speedOfSound - dopplerFactor * vss)
        }
        if (src.dopplerShift !== oldShift) {
            AL.updateSourceRate(src)
        }
    },
    updateSourceRate: function(src) {
        if (src.state === 4114) {
            AL.cancelPendingSourceAudio(src);
            var audioSrc = src.audioQueue[0];
            if (!audioSrc) {
                return
            }
            var duration;
            if (src.type === 4136 && src.looping) {
                duration = Number.POSITIVE_INFINITY
            } else {
                duration = (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate
            }
            audioSrc._duration = duration;
            audioSrc.playbackRate.value = src.playbackRate;
            AL.scheduleSourceAudio(src)
        }
    },
    sourceDuration: function(src) {
        var length = 0;
        for (var i = 0; i < src.bufQueue.length; i++) {
            var audioBuf = src.bufQueue[i].audioBuf;
            length += audioBuf ? audioBuf.duration : 0
        }
        return length
    },
    sourceTell: function(src) {
        AL.updateSourceTime(src);
        var offset = 0;
        for (var i = 0; i < src.bufsProcessed; i++) {
            if (src.bufQueue[i].audioBuf) {
                offset += src.bufQueue[i].audioBuf.duration
            }
        }
        offset += src.bufOffset;
        return offset
    },
    sourceSeek: function(src, offset) {
        var playing = src.state == 4114;
        if (playing) {
            AL.setSourceState(src, 4113)
        }
        if (src.bufQueue[src.bufsProcessed].audioBuf !== null) {
            src.bufsProcessed = 0;
            while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
                offset -= src.bufQueue[src.bufsProcessed].audiobuf.duration;
                src.bufsProcessed++
            }
            src.bufOffset = offset
        }
        if (playing) {
            AL.setSourceState(src, 4114)
        }
    },
    getGlobalParam: function(funcname, param) {
        if (!AL.currentCtx) {
            return null
        }
        switch (param) {
        case 49152:
            return AL.currentCtx.dopplerFactor;
        case 49155:
            return AL.currentCtx.speedOfSound;
        case 53248:
            return AL.currentCtx.distanceModel;
        default:
            AL.currentCtx.err = 40962;
            return null
        }
    },
    setGlobalParam: function(funcname, param, value) {
        if (!AL.currentCtx) {
            return
        }
        switch (param) {
        case 49152:
            if (!Number.isFinite(value) || value < 0) {
                AL.currentCtx.err = 40963;
                return
            }
            AL.currentCtx.dopplerFactor = value;
            AL.updateListenerSpace(AL.currentCtx);
            break;
        case 49155:
            if (!Number.isFinite(value) || value <= 0) {
                AL.currentCtx.err = 40963;
                return
            }
            AL.currentCtx.speedOfSound = value;
            AL.updateListenerSpace(AL.currentCtx);
            break;
        case 53248:
            switch (value) {
            case 0:
            case 53249:
            case 53250:
            case 53251:
            case 53252:
            case 53253:
            case 53254:
                AL.currentCtx.distanceModel = value;
                AL.updateContextGlobal(AL.currentCtx);
                break;
            default:
                AL.currentCtx.err = 40963;
                return
            }
            break;
        default:
            AL.currentCtx.err = 40962;
            return
        }
    },
    getListenerParam: function(funcname, param) {
        if (!AL.currentCtx) {
            return null
        }
        switch (param) {
        case 4100:
            return AL.currentCtx.listener.position;
        case 4102:
            return AL.currentCtx.listener.velocity;
        case 4111:
            return AL.currentCtx.listener.direction.concat(AL.currentCtx.listener.up);
        case 4106:
            return AL.currentCtx.gain.gain.value;
        default:
            AL.currentCtx.err = 40962;
            return null
        }
    },
    setListenerParam: function(funcname, param, value) {
        if (!AL.currentCtx) {
            return
        }
        if (value === null) {
            AL.currentCtx.err = 40962;
            return
        }
        var listener = AL.currentCtx.listener;
        switch (param) {
        case 4100:
            if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                AL.currentCtx.err = 40963;
                return
            }
            listener.position[0] = value[0];
            listener.position[1] = value[1];
            listener.position[2] = value[2];
            AL.updateListenerSpace(AL.currentCtx);
            break;
        case 4102:
            if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                AL.currentCtx.err = 40963;
                return
            }
            listener.velocity[0] = value[0];
            listener.velocity[1] = value[1];
            listener.velocity[2] = value[2];
            AL.updateListenerSpace(AL.currentCtx);
            break;
        case 4106:
            if (!Number.isFinite(value) || value < 0) {
                AL.currentCtx.err = 40963;
                return
            }
            AL.currentCtx.gain.gain.value = value;
            break;
        case 4111:
            if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2]) || !Number.isFinite(value[3]) || !Number.isFinite(value[4]) || !Number.isFinite(value[5])) {
                AL.currentCtx.err = 40963;
                return
            }
            listener.direction[0] = value[0];
            listener.direction[1] = value[1];
            listener.direction[2] = value[2];
            listener.up[0] = value[3];
            listener.up[1] = value[4];
            listener.up[2] = value[5];
            AL.updateListenerSpace(AL.currentCtx);
            break;
        default:
            AL.currentCtx.err = 40962;
            return
        }
    },
    getBufferParam: function(funcname, bufferId, param) {
        if (!AL.currentCtx) {
            return
        }
        var buf = AL.buffers[bufferId];
        if (!buf || bufferId === 0) {
            AL.currentCtx.err = 40961;
            return
        }
        switch (param) {
        case 8193:
            return buf.frequency;
        case 8194:
            return buf.bytesPerSample * 8;
        case 8195:
            return buf.channels;
        case 8196:
            return buf.length * buf.bytesPerSample * buf.channels;
        case 8213:
            if (buf.length === 0) {
                return [0, 0]
            } else {
                return [(buf.audioBuf._loopStart || 0) * buf.frequency, (buf.audioBuf._loopEnd || buf.length) * buf.frequency]
            }
        default:
            AL.currentCtx.err = 40962;
            return null
        }
    },
    setBufferParam: function(funcname, bufferId, param, value) {
        if (!AL.currentCtx) {
            return
        }
        var buf = AL.buffers[bufferId];
        if (!buf || bufferId === 0) {
            AL.currentCtx.err = 40961;
            return
        }
        if (value === null) {
            AL.currentCtx.err = 40962;
            return
        }
        switch (param) {
        case 8196:
            if (value !== 0) {
                AL.currentCtx.err = 40963;
                return
            }
            break;
        case 8213:
            if (value[0] < 0 || value[0] > buf.length || value[1] < 0 || value[1] > buf.Length || value[0] >= value[1]) {
                AL.currentCtx.err = 40963;
                return
            }
            if (buf.refCount > 0) {
                AL.currentCtx.err = 40964;
                return
            }
            if (buf.audioBuf) {
                buf.audioBuf._loopStart = value[0] / buf.frequency;
                buf.audioBuf._loopEnd = value[1] / buf.frequency
            }
            break;
        default:
            AL.currentCtx.err = 40962;
            return
        }
    },
    getSourceParam: function(funcname, sourceId, param) {
        if (!AL.currentCtx) {
            return null
        }
        var src = AL.currentCtx.sources[sourceId];
        if (!src) {
            AL.currentCtx.err = 40961;
            return null
        }
        switch (param) {
        case 514:
            return src.relative;
        case 4097:
            return src.coneInnerAngle;
        case 4098:
            return src.coneOuterAngle;
        case 4099:
            return src.pitch;
        case 4100:
            return src.position;
        case 4101:
            return src.direction;
        case 4102:
            return src.velocity;
        case 4103:
            return src.looping;
        case 4105:
            if (src.type === 4136) {
                return src.bufQueue[0].id
            } else {
                return 0
            }
        case 4106:
            return src.gain.gain.value;
        case 4109:
            return src.minGain;
        case 4110:
            return src.maxGain;
        case 4112:
            return src.state;
        case 4117:
            if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
                return 0
            } else {
                return src.bufQueue.length
            }
        case 4118:
            if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 || src.looping) {
                return 0
            } else {
                return src.bufsProcessed
            }
        case 4128:
            return src.refDistance;
        case 4129:
            return src.rolloffFactor;
        case 4130:
            return src.coneOuterGain;
        case 4131:
            return src.maxDistance;
        case 4132:
            return AL.sourceTell(src);
        case 4133:
            var offset = AL.sourceTell(src);
            if (offset > 0) {
                offset *= src.bufQueue[0].frequency
            }
            return offset;
        case 4134:
            var offset = AL.sourceTell(src);
            if (offset > 0) {
                offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample
            }
            return offset;
        case 4135:
            return src.type;
        case 4628:
            return src.spatialize;
        case 8201:
            var length = 0;
            var bytesPerFrame = 0;
            for (var i = 0; i < src.bufQueue.length; i++) {
                length += src.bufQueue[i].length;
                if (src.bufQueue[i].id !== 0) {
                    bytesPerFrame = src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels
                }
            }
            return length * bytesPerFrame;
        case 8202:
            var length = 0;
            for (var i = 0; i < src.bufQueue.length; i++) {
                length += src.bufQueue[i].length
            }
            return length;
        case 8203:
            return AL.sourceDuration(src);
        case 53248:
            return src.distanceModel;
        default:
            AL.currentCtx.err = 40962;
            return null
        }
    },
    setSourceParam: function(funcname, sourceId, param, value) {
        if (!AL.currentCtx) {
            return
        }
        var src = AL.currentCtx.sources[sourceId];
        if (!src) {
            AL.currentCtx.err = 40961;
            return
        }
        if (value === null) {
            AL.currentCtx.err = 40962;
            return
        }
        switch (param) {
        case 514:
            if (value === 1) {
                src.relative = true;
                AL.updateSourceSpace(src)
            } else if (value === 0) {
                src.relative = false;
                AL.updateSourceSpace(src)
            } else {
                AL.currentCtx.err = 40963;
                return
            }
            break;
        case 4097:
            if (!Number.isFinite(value)) {
                AL.currentCtx.err = 40963;
                return
            }
            src.coneInnerAngle = value;
            if (src.panner) {
                src.panner.coneInnerAngle = value % 360
            }
            break;
        case 4098:
            if (!Number.isFinite(value)) {
                AL.currentCtx.err = 40963;
                return
            }
            src.coneOuterAngle = value;
            if (src.panner) {
                src.panner.coneOuterAngle = value % 360
            }
            break;
        case 4099:
            if (!Number.isFinite(value) || value <= 0) {
                AL.currentCtx.err = 40963;
                return
            }
            if (src.pitch === value) {
                break
            }
            src.pitch = value;
            AL.updateSourceRate(src);
            break;
        case 4100:
            if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                AL.currentCtx.err = 40963;
                return
            }
            src.position[0] = value[0];
            src.position[1] = value[1];
            src.position[2] = value[2];
            AL.updateSourceSpace(src);
            break;
        case 4101:
            if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                AL.currentCtx.err = 40963;
                return
            }
            src.direction[0] = value[0];
            src.direction[1] = value[1];
            src.direction[2] = value[2];
            AL.updateSourceSpace(src);
            break;
        case 4102:
            if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                AL.currentCtx.err = 40963;
                return
            }
            src.velocity[0] = value[0];
            src.velocity[1] = value[1];
            src.velocity[2] = value[2];
            AL.updateSourceSpace(src);
            break;
        case 4103:
            if (value === 1) {
                src.looping = true;
                AL.updateSourceTime(src);
                if (src.type === 4136 && src.audioQueue.length > 0) {
                    var audioSrc = src.audioQueue[0];
                    audioSrc.loop = true;
                    audioSrc._duration = Number.POSITIVE_INFINITY
                }
            } else if (value === 0) {
                src.looping = false;
                var currentTime = AL.updateSourceTime(src);
                if (src.type === 4136 && src.audioQueue.length > 0) {
                    var audioSrc = src.audioQueue[0];
                    audioSrc.loop = false;
                    audioSrc._duration = src.bufQueue[0].audioBuf.duration / src.playbackRate;
                    audioSrc._startTime = currentTime - src.bufOffset / src.playbackRate
                }
            } else {
                AL.currentCtx.err = 40963;
                return
            }
            break;
        case 4105:
            if (src.state === 4114 || src.state === 4115) {
                AL.currentCtx.err = 40964;
                return
            }
            if (value === 0) {
                for (var i in src.bufQueue) {
                    src.bufQueue[i].refCount--
                }
                src.bufQueue.length = 1;
                src.bufQueue[0] = AL.buffers[0];
                src.bufsProcessed = 0;
                src.type = 4144
            } else {
                var buf = AL.buffers[value];
                if (!buf) {
                    AL.currentCtx.err = 40963;
                    return
                }
                for (var i in src.bufQueue) {
                    src.bufQueue[i].refCount--
                }
                src.bufQueue.length = 0;
                buf.refCount++;
                src.bufQueue = [buf];
                src.bufsProcessed = 0;
                src.type = 4136
            }
            AL.initSourcePanner(src);
            AL.scheduleSourceAudio(src);
            break;
        case 4106:
            if (!Number.isFinite(value) || value < 0) {
                AL.currentCtx.err = 40963;
                return
            }
            src.gain.gain.value = value;
            break;
        case 4109:
            if (!Number.isFinite(value) || value < 0 || value > Math.min(src.maxGain, 1)) {
                AL.currentCtx.err = 40963;
                return
            }
            src.minGain = value;
            break;
        case 4110:
            if (!Number.isFinite(value) || value < Math.max(0, src.minGain) || value > 1) {
                AL.currentCtx.err = 40963;
                return
            }
            src.maxGain = value;
            break;
        case 4128:
            if (!Number.isFinite(value) || value < 0) {
                AL.currentCtx.err = 40963;
                return
            }
            src.refDistance = value;
            if (src.panner) {
                src.panner.refDistance = value
            }
            break;
        case 4129:
            if (!Number.isFinite(value) || value < 0) {
                AL.currentCtx.err = 40963;
                return
            }
            src.rolloffFactor = value;
            if (src.panner) {
                src.panner.rolloffFactor = value
            }
            break;
        case 4130:
            if (!Number.isFinite(value) || value < 0 || value > 1) {
                AL.currentCtx.err = 40963;
                return
            }
            src.coneOuterGain = value;
            if (src.panner) {
                src.panner.coneOuterGain = value
            }
            break;
        case 4131:
            if (!Number.isFinite(value) || value < 0) {
                AL.currentCtx.err = 40963;
                return
            }
            src.maxDistance = value;
            if (src.panner) {
                src.panner.maxDistance = value
            }
            break;
        case 4132:
            if (value < 0 || value > AL.sourceDuration(src)) {
                AL.currentCtx.err = 40963;
                return
            }
            AL.sourceSeek(src, value);
            break;
        case 4133:
            var srcLen = AL.sourceDuration(src);
            if (srcLen > 0) {
                var frequency;
                for (var bufId in src.bufQueue) {
                    if (bufId) {
                        frequency = src.bufQueue[bufId].frequency;
                        break
                    }
                }
                value /= frequency
            }
            if (value < 0 || value > srcLen) {
                AL.currentCtx.err = 40963;
                return
            }
            AL.sourceSeek(src, value);
            break;
        case 4134:
            var srcLen = AL.sourceDuration(src);
            if (srcLen > 0) {
                var bytesPerSec;
                for (var bufId in src.bufQueue) {
                    if (bufId) {
                        var buf = src.bufQueue[bufId];
                        bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
                        break
                    }
                }
                value /= bytesPerSec
            }
            if (value < 0 || value > srcLen) {
                AL.currentCtx.err = 40963;
                return
            }
            AL.sourceSeek(src, value);
            break;
        case 4628:
            if (value !== 0 && value !== 1 && value !== 2) {
                AL.currentCtx.err = 40963;
                return
            }
            src.spatialize = value;
            AL.initSourcePanner(src);
            break;
        case 8201:
        case 8202:
        case 8203:
            AL.currentCtx.err = 40964;
            break;
        case 53248:
            switch (value) {
            case 0:
            case 53249:
            case 53250:
            case 53251:
            case 53252:
            case 53253:
            case 53254:
                src.distanceModel = value;
                if (AL.currentCtx.sourceDistanceModel) {
                    AL.updateContextGlobal(AL.currentCtx)
                }
                break;
            default:
                AL.currentCtx.err = 40963;
                return
            }
            break;
        default:
            AL.currentCtx.err = 40962;
            return
        }
    },
    captures: {},
    sharedCaptureAudioCtx: null,
    requireValidCaptureDevice: function(deviceId, funcname) {
        if (deviceId === 0) {
            AL.alcErr = 40961;
            return null
        }
        var c = AL.captures[deviceId];
        if (!c) {
            AL.alcErr = 40961;
            return null
        }
        var err = c.mediaStreamError;
        if (err) {
            AL.alcErr = 40961;
            return null
        }
        return c
    }
};
function _alBufferData(bufferId, format, pData, size, freq) {
    if (!AL.currentCtx) {
        return
    }
    var buf = AL.buffers[bufferId];
    if (!buf) {
        AL.currentCtx.err = 40963;
        return
    }
    if (freq <= 0) {
        AL.currentCtx.err = 40963;
        return
    }
    var audioBuf = null;
    try {
        switch (format) {
        case 4352:
            if (size > 0) {
                audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size, freq);
                var channel0 = audioBuf.getChannelData(0);
                for (var i = 0; i < size; ++i) {
                    channel0[i] = HEAPU8[pData++] * .0078125 - 1
                }
            }
            buf.bytesPerSample = 1;
            buf.channels = 1;
            buf.length = size;
            break;
        case 4353:
            if (size > 0) {
                audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 1, freq);
                var channel0 = audioBuf.getChannelData(0);
                pData >>= 1;
                for (var i = 0; i < size >> 1; ++i) {
                    channel0[i] = HEAP16[pData++] * 30517578125e-15
                }
            }
            buf.bytesPerSample = 2;
            buf.channels = 1;
            buf.length = size >> 1;
            break;
        case 4354:
            if (size > 0) {
                audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 1, freq);
                var channel0 = audioBuf.getChannelData(0);
                var channel1 = audioBuf.getChannelData(1);
                for (var i = 0; i < size >> 1; ++i) {
                    channel0[i] = HEAPU8[pData++] * .0078125 - 1;
                    channel1[i] = HEAPU8[pData++] * .0078125 - 1
                }
            }
            buf.bytesPerSample = 1;
            buf.channels = 2;
            buf.length = size >> 1;
            break;
        case 4355:
            if (size > 0) {
                audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 2, freq);
                var channel0 = audioBuf.getChannelData(0);
                var channel1 = audioBuf.getChannelData(1);
                pData >>= 1;
                for (var i = 0; i < size >> 2; ++i) {
                    channel0[i] = HEAP16[pData++] * 30517578125e-15;
                    channel1[i] = HEAP16[pData++] * 30517578125e-15
                }
            }
            buf.bytesPerSample = 2;
            buf.channels = 2;
            buf.length = size >> 2;
            break;
        case 65552:
            if (size > 0) {
                audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 2, freq);
                var channel0 = audioBuf.getChannelData(0);
                pData >>= 2;
                for (var i = 0; i < size >> 2; ++i) {
                    channel0[i] = HEAPF32[pData++]
                }
            }
            buf.bytesPerSample = 4;
            buf.channels = 1;
            buf.length = size >> 2;
            break;
        case 65553:
            if (size > 0) {
                audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 3, freq);
                var channel0 = audioBuf.getChannelData(0);
                var channel1 = audioBuf.getChannelData(1);
                pData >>= 2;
                for (var i = 0; i < size >> 3; ++i) {
                    channel0[i] = HEAPF32[pData++];
                    channel1[i] = HEAPF32[pData++]
                }
            }
            buf.bytesPerSample = 4;
            buf.channels = 2;
            buf.length = size >> 3;
            break;
        default:
            AL.currentCtx.err = 40963;
            return
        }
        buf.frequency = freq;
        buf.audioBuf = audioBuf
    } catch (e) {
        AL.currentCtx.err = 40963;
        return
    }
}
function _alBufferiv(bufferId, param, pValues) {
    if (!AL.currentCtx) {
        return
    }
    if (!pValues) {
        AL.currentCtx.err = 40963;
        return
    }
    switch (param) {
    case 8213:
        AL.paramArray[0] = HEAP32[pValues >> 2];
        AL.paramArray[1] = HEAP32[pValues + 4 >> 2];
        AL.setBufferParam("alBufferiv", bufferId, param, AL.paramArray);
        break;
    default:
        AL.setBufferParam("alBufferiv", bufferId, param, null);
        break
    }
}
function _alDeleteBuffers(count, pBufferIds) {
    if (!AL.currentCtx) {
        return
    }
    for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[pBufferIds + i * 4 >> 2];
        if (bufId === 0) {
            continue
        }
        if (!AL.buffers[bufId]) {
            AL.currentCtx.err = 40961;
            return
        }
        if (AL.buffers[bufId].refCount) {
            AL.currentCtx.err = 40964;
            return
        }
    }
    for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[pBufferIds + i * 4 >> 2];
        if (bufId === 0) {
            continue
        }
        AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
        delete AL.buffers[bufId];
        AL.freeIds.push(bufId)
    }
}
function _alSourcei(sourceId, param, value) {
    switch (param) {
    case 514:
    case 4097:
    case 4098:
    case 4103:
    case 4105:
    case 4128:
    case 4129:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 4628:
    case 8201:
    case 8202:
    case 53248:
        AL.setSourceParam("alSourcei", sourceId, param, value);
        break;
    default:
        AL.setSourceParam("alSourcei", sourceId, param, null);
        break
    }
}
function _alDeleteSources(count, pSourceIds) {
    if (!AL.currentCtx) {
        return
    }
    for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[pSourceIds + i * 4 >> 2];
        if (!AL.currentCtx.sources[srcId]) {
            AL.currentCtx.err = 40961;
            return
        }
    }
    for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[pSourceIds + i * 4 >> 2];
        AL.setSourceState(AL.currentCtx.sources[srcId], 4116);
        _alSourcei(srcId, 4105, 0);
        delete AL.currentCtx.sources[srcId];
        AL.freeIds.push(srcId)
    }
}
function _alDistanceModel(model) {
    AL.setGlobalParam("alDistanceModel", 53248, model)
}
function _alDopplerFactor(value) {
    AL.setGlobalParam("alDopplerFactor", 49152, value)
}
function _alGenBuffers(count, pBufferIds) {
    if (!AL.currentCtx) {
        return
    }
    for (var i = 0; i < count; ++i) {
        var buf = {
            deviceId: AL.currentCtx.deviceId,
            id: AL.newId(),
            refCount: 0,
            audioBuf: null,
            frequency: 0,
            bytesPerSample: 2,
            channels: 1,
            length: 0
        };
        AL.deviceRefCounts[buf.deviceId]++;
        AL.buffers[buf.id] = buf;
        HEAP32[pBufferIds + i * 4 >> 2] = buf.id
    }
}
function _alGenSources(count, pSourceIds) {
    if (!AL.currentCtx) {
        return
    }
    for (var i = 0; i < count; ++i) {
        var gain = AL.currentCtx.audioCtx.createGain();
        gain.connect(AL.currentCtx.gain);
        var src = {
            context: AL.currentCtx,
            id: AL.newId(),
            type: 4144,
            state: 4113,
            bufQueue: [AL.buffers[0]],
            audioQueue: [],
            looping: false,
            pitch: 1,
            dopplerShift: 1,
            gain: gain,
            minGain: 0,
            maxGain: 1,
            panner: null,
            bufsProcessed: 0,
            bufStartTime: Number.NEGATIVE_INFINITY,
            bufOffset: 0,
            relative: false,
            refDistance: 1,
            maxDistance: 3.40282e38,
            rolloffFactor: 1,
            position: [0, 0, 0],
            velocity: [0, 0, 0],
            direction: [0, 0, 0],
            coneOuterGain: 0,
            coneInnerAngle: 360,
            coneOuterAngle: 360,
            distanceModel: 53250,
            spatialize: 2,
            get playbackRate() {
                return this.pitch * this.dopplerShift
            }
        };
        AL.currentCtx.sources[src.id] = src;
        HEAP32[pSourceIds + i * 4 >> 2] = src.id
    }
}
function _alGetError() {
    if (!AL.currentCtx) {
        return 40964
    } else {
        var err = AL.currentCtx.err;
        AL.currentCtx.err = 0;
        return err
    }
}
function _alGetSourcei(sourceId, param, pValue) {
    var val = AL.getSourceParam("alGetSourcei", sourceId, param);
    if (val === null) {
        return
    }
    if (!pValue) {
        AL.currentCtx.err = 40963;
        return
    }
    switch (param) {
    case 514:
    case 4097:
    case 4098:
    case 4103:
    case 4105:
    case 4112:
    case 4117:
    case 4118:
    case 4128:
    case 4129:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 4135:
    case 4628:
    case 8201:
    case 8202:
    case 53248:
        HEAP32[pValue >> 2] = val;
        break;
    default:
        AL.currentCtx.err = 40962;
        return
    }
}
function _alGetString(param) {
    if (!AL.currentCtx) {
        return 0
    }
    if (AL.stringCache[param]) {
        return AL.stringCache[param]
    }
    var ret;
    switch (param) {
    case 0:
        ret = "No Error";
        break;
    case 40961:
        ret = "Invalid Name";
        break;
    case 40962:
        ret = "Invalid Enum";
        break;
    case 40963:
        ret = "Invalid Value";
        break;
    case 40964:
        ret = "Invalid Operation";
        break;
    case 40965:
        ret = "Out of Memory";
        break;
    case 45057:
        ret = "Emscripten";
        break;
    case 45058:
        ret = "1.1";
        break;
    case 45059:
        ret = "WebAudio";
        break;
    case 45060:
        ret = "";
        for (var ext in AL.AL_EXTENSIONS) {
            ret = ret.concat(ext);
            ret = ret.concat(" ")
        }
        ret = ret.trim();
        break;
    default:
        AL.currentCtx.err = 40962;
        return 0
    }
    ret = allocateUTF8(ret);
    AL.stringCache[param] = ret;
    return ret
}
function _alIsBuffer(bufferId) {
    if (!AL.currentCtx) {
        return false
    }
    if (bufferId > AL.buffers.length) {
        return false
    }
    if (!AL.buffers[bufferId]) {
        return false
    } else {
        return true
    }
}
function _alIsExtensionPresent(pExtName) {
    var name = UTF8ToString(pExtName);
    return AL.AL_EXTENSIONS[name] ? 1 : 0
}
function _alIsSource(sourceId) {
    if (!AL.currentCtx) {
        return false
    }
    if (!AL.currentCtx.sources[sourceId]) {
        return false
    } else {
        return true
    }
}
function _alListenerf(param, value) {
    switch (param) {
    case 4106:
        AL.setListenerParam("alListenerf", param, value);
        break;
    default:
        AL.setListenerParam("alListenerf", param, null);
        break
    }
}
function _alListenerfv(param, pValues) {
    if (!AL.currentCtx) {
        return
    }
    if (!pValues) {
        AL.currentCtx.err = 40963;
        return
    }
    switch (param) {
    case 4100:
    case 4102:
        AL.paramArray[0] = HEAPF32[pValues >> 2];
        AL.paramArray[1] = HEAPF32[pValues + 4 >> 2];
        AL.paramArray[2] = HEAPF32[pValues + 8 >> 2];
        AL.setListenerParam("alListenerfv", param, AL.paramArray);
        break;
    case 4111:
        AL.paramArray[0] = HEAPF32[pValues >> 2];
        AL.paramArray[1] = HEAPF32[pValues + 4 >> 2];
        AL.paramArray[2] = HEAPF32[pValues + 8 >> 2];
        AL.paramArray[3] = HEAPF32[pValues + 12 >> 2];
        AL.paramArray[4] = HEAPF32[pValues + 16 >> 2];
        AL.paramArray[5] = HEAPF32[pValues + 20 >> 2];
        AL.setListenerParam("alListenerfv", param, AL.paramArray);
        break;
    default:
        AL.setListenerParam("alListenerfv", param, null);
        break
    }
}
function _alSourcePlay(sourceId) {
    if (!AL.currentCtx) {
        return
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
        AL.currentCtx.err = 40961;
        return
    }
    AL.setSourceState(src, 4114)
}
function _alSourceQueueBuffers(sourceId, count, pBufferIds) {
    if (!AL.currentCtx) {
        return
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
        AL.currentCtx.err = 40961;
        return
    }
    if (src.type === 4136) {
        AL.currentCtx.err = 40964;
        return
    }
    if (count === 0) {
        return
    }
    var templateBuf = AL.buffers[0];
    for (var i = 0; i < src.bufQueue.length; i++) {
        if (src.bufQueue[i].id !== 0) {
            templateBuf = src.bufQueue[i];
            break
        }
    }
    for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[pBufferIds + i * 4 >> 2];
        var buf = AL.buffers[bufId];
        if (!buf) {
            AL.currentCtx.err = 40961;
            return
        }
        if (templateBuf.id !== 0 && (buf.frequency !== templateBuf.frequency || buf.bytesPerSample !== templateBuf.bytesPerSample || buf.channels !== templateBuf.channels)) {
            AL.currentCtx.err = 40964
        }
    }
    if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
        src.bufQueue.length = 0
    }
    src.type = 4137;
    for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[pBufferIds + i * 4 >> 2];
        var buf = AL.buffers[bufId];
        buf.refCount++;
        src.bufQueue.push(buf)
    }
    if (src.looping) {
        AL.cancelPendingSourceAudio(src)
    }
    AL.initSourcePanner(src);
    AL.scheduleSourceAudio(src)
}
function _alSourceStop(sourceId) {
    if (!AL.currentCtx) {
        return
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
        AL.currentCtx.err = 40961;
        return
    }
    AL.setSourceState(src, 4116)
}
function _alSourceUnqueueBuffers(sourceId, count, pBufferIds) {
    if (!AL.currentCtx) {
        return
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
        AL.currentCtx.err = 40961;
        return
    }
    if (count > (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 ? 0 : src.bufsProcessed)) {
        AL.currentCtx.err = 40963;
        return
    }
    if (count === 0) {
        return
    }
    for (var i = 0; i < count; i++) {
        var buf = src.bufQueue.shift();
        buf.refCount--;
        HEAP32[pBufferIds + i * 4 >> 2] = buf.id;
        src.bufsProcessed--
    }
    if (src.bufQueue.length === 0) {
        src.bufQueue.push(AL.buffers[0])
    }
    AL.initSourcePanner(src);
    AL.scheduleSourceAudio(src)
}
function _alSourcef(sourceId, param, value) {
    switch (param) {
    case 4097:
    case 4098:
    case 4099:
    case 4106:
    case 4109:
    case 4110:
    case 4128:
    case 4129:
    case 4130:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 8203:
        AL.setSourceParam("alSourcef", sourceId, param, value);
        break;
    default:
        AL.setSourceParam("alSourcef", sourceId, param, null);
        break
    }
}
function _alSourcefv(sourceId, param, pValues) {
    if (!AL.currentCtx) {
        return
    }
    if (!pValues) {
        AL.currentCtx.err = 40963;
        return
    }
    switch (param) {
    case 4097:
    case 4098:
    case 4099:
    case 4106:
    case 4109:
    case 4110:
    case 4128:
    case 4129:
    case 4130:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 8203:
        var val = HEAPF32[pValues >> 2];
        AL.setSourceParam("alSourcefv", sourceId, param, val);
        break;
    case 4100:
    case 4101:
    case 4102:
        AL.paramArray[0] = HEAPF32[pValues >> 2];
        AL.paramArray[1] = HEAPF32[pValues + 4 >> 2];
        AL.paramArray[2] = HEAPF32[pValues + 8 >> 2];
        AL.setSourceParam("alSourcefv", sourceId, param, AL.paramArray);
        break;
    default:
        AL.setSourceParam("alSourcefv", sourceId, param, null);
        break
    }
}
function _alcCaptureCloseDevice(deviceId) {
    var c = AL.requireValidCaptureDevice(deviceId, "alcCaptureCloseDevice");
    if (!c)
        return false;
    delete AL.captures[deviceId];
    AL.freeIds.push(deviceId);
    if (c.mediaStreamSourceNode)
        c.mediaStreamSourceNode.disconnect();
    if (c.mergerNode)
        c.mergerNode.disconnect();
    if (c.splitterNode)
        c.splitterNode.disconnect();
    if (c.scriptProcessorNode)
        c.scriptProcessorNode.disconnect();
    if (c.mediaStream) {
        c.mediaStream.getTracks().forEach(function(track) {
            track.stop()
        })
    }
    delete c.buffers;
    c.capturedFrameCount = 0;
    c.isCapturing = false;
    return true
}
function listenOnce(object, event, func) {
    object.addEventListener(event, func, {
        "once": true
    })
}
function autoResumeAudioContext(ctx, elements) {
    if (!elements) {
        elements = [document, document.getElementById("canvas")]
    }
    ["keydown", "mousedown", "touchstart"].forEach(function(event) {
        elements.forEach(function(element) {
            if (element) {
                listenOnce(element, event, function() {
                    if (ctx.state === "suspended")
                        ctx.resume()
                })
            }
        })
    })
}
function _alcCaptureOpenDevice(pDeviceName, requestedSampleRate, format, bufferFrameCapacity) {
    var resolvedDeviceName = AL.CAPTURE_DEVICE_NAME;
    if (pDeviceName !== 0) {
        resolvedDeviceName = UTF8ToString(pDeviceName);
        if (resolvedDeviceName !== AL.CAPTURE_DEVICE_NAME) {
            AL.alcErr = 40965;
            return 0
        }
    }
    if (bufferFrameCapacity < 0) {
        AL.alcErr = 40964;
        return 0
    }
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    var has_getUserMedia = navigator.getUserMedia || navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    if (!has_getUserMedia) {
        AL.alcErr = 40965;
        return 0
    }
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AL.sharedCaptureAudioCtx) {
        try {
            AL.sharedCaptureAudioCtx = new AudioContext
        } catch (e) {
            AL.alcErr = 40965;
            return 0
        }
    }
    autoResumeAudioContext(AL.sharedCaptureAudioCtx);
    var outputChannelCount;
    switch (format) {
    case 65552:
    case 4353:
    case 4352:
        outputChannelCount = 1;
        break;
    case 65553:
    case 4355:
    case 4354:
        outputChannelCount = 2;
        break;
    default:
        AL.alcErr = 40964;
        return 0
    }
    function newF32Array(cap) {
        return new Float32Array(cap)
    }
    function newI16Array(cap) {
        return new Int16Array(cap)
    }
    function newU8Array(cap) {
        return new Uint8Array(cap)
    }
    var requestedSampleType;
    var newSampleArray;
    switch (format) {
    case 65552:
    case 65553:
        requestedSampleType = "f32";
        newSampleArray = newF32Array;
        break;
    case 4353:
    case 4355:
        requestedSampleType = "i16";
        newSampleArray = newI16Array;
        break;
    case 4352:
    case 4354:
        requestedSampleType = "u8";
        newSampleArray = newU8Array;
        break
    }
    var buffers = [];
    try {
        for (var chan = 0; chan < outputChannelCount; ++chan) {
            buffers[chan] = newSampleArray(bufferFrameCapacity)
        }
    } catch (e) {
        AL.alcErr = 40965;
        return 0
    }
    var newCapture = {
        audioCtx: AL.sharedCaptureAudioCtx,
        deviceName: resolvedDeviceName,
        requestedSampleRate: requestedSampleRate,
        requestedSampleType: requestedSampleType,
        outputChannelCount: outputChannelCount,
        inputChannelCount: null,
        mediaStreamError: null,
        mediaStreamSourceNode: null,
        mediaStream: null,
        mergerNode: null,
        splitterNode: null,
        scriptProcessorNode: null,
        isCapturing: false,
        buffers: buffers,
        get bufferFrameCapacity() {
            return buffers[0].length
        },
        capturePlayhead: 0,
        captureReadhead: 0,
        capturedFrameCount: 0
    };
    var onError = function(mediaStreamError) {
        newCapture.mediaStreamError = mediaStreamError
    };
    var onSuccess = function(mediaStream) {
        newCapture.mediaStreamSourceNode = newCapture.audioCtx.createMediaStreamSource(mediaStream);
        newCapture.mediaStream = mediaStream;
        var inputChannelCount = 1;
        switch (newCapture.mediaStreamSourceNode.channelCountMode) {
        case "max":
            inputChannelCount = outputChannelCount;
            break;
        case "clamped-max":
            inputChannelCount = Math.min(outputChannelCount, newCapture.mediaStreamSourceNode.channelCount);
            break;
        case "explicit":
            inputChannelCount = newCapture.mediaStreamSourceNode.channelCount;
            break
        }
        newCapture.inputChannelCount = inputChannelCount;
        var processorFrameCount = 512;
        newCapture.scriptProcessorNode = newCapture.audioCtx.createScriptProcessor(processorFrameCount, inputChannelCount, outputChannelCount);
        if (inputChannelCount > outputChannelCount) {
            newCapture.mergerNode = newCapture.audioCtx.createChannelMerger(inputChannelCount);
            newCapture.mediaStreamSourceNode.connect(newCapture.mergerNode);
            newCapture.mergerNode.connect(newCapture.scriptProcessorNode)
        } else if (inputChannelCount < outputChannelCount) {
            newCapture.splitterNode = newCapture.audioCtx.createChannelSplitter(outputChannelCount);
            newCapture.mediaStreamSourceNode.connect(newCapture.splitterNode);
            newCapture.splitterNode.connect(newCapture.scriptProcessorNode)
        } else {
            newCapture.mediaStreamSourceNode.connect(newCapture.scriptProcessorNode)
        }
        newCapture.scriptProcessorNode.connect(newCapture.audioCtx.destination);
        newCapture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {
            if (!newCapture.isCapturing) {
                return
            }
            var c = newCapture;
            var srcBuf = audioProcessingEvent.inputBuffer;
            switch (format) {
            case 65552:
                var channel0 = srcBuf.getChannelData(0);
                for (var i = 0; i < srcBuf.length; ++i) {
                    var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
                    c.buffers[0][wi] = channel0[i]
                }
                break;
            case 65553:
                var channel0 = srcBuf.getChannelData(0);
                var channel1 = srcBuf.getChannelData(1);
                for (var i = 0; i < srcBuf.length; ++i) {
                    var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
                    c.buffers[0][wi] = channel0[i];
                    c.buffers[1][wi] = channel1[i]
                }
                break;
            case 4353:
                var channel0 = srcBuf.getChannelData(0);
                for (var i = 0; i < srcBuf.length; ++i) {
                    var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
                    c.buffers[0][wi] = channel0[i] * 32767
                }
                break;
            case 4355:
                var channel0 = srcBuf.getChannelData(0);
                var channel1 = srcBuf.getChannelData(1);
                for (var i = 0; i < srcBuf.length; ++i) {
                    var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
                    c.buffers[0][wi] = channel0[i] * 32767;
                    c.buffers[1][wi] = channel1[i] * 32767
                }
                break;
            case 4352:
                var channel0 = srcBuf.getChannelData(0);
                for (var i = 0; i < srcBuf.length; ++i) {
                    var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
                    c.buffers[0][wi] = (channel0[i] + 1) * 127
                }
                break;
            case 4354:
                var channel0 = srcBuf.getChannelData(0);
                var channel1 = srcBuf.getChannelData(1);
                for (var i = 0; i < srcBuf.length; ++i) {
                    var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
                    c.buffers[0][wi] = (channel0[i] + 1) * 127;
                    c.buffers[1][wi] = (channel1[i] + 1) * 127
                }
                break
            }
            c.capturePlayhead += srcBuf.length;
            c.capturePlayhead %= c.bufferFrameCapacity;
            c.capturedFrameCount += srcBuf.length;
            c.capturedFrameCount = Math.min(c.capturedFrameCount, c.bufferFrameCapacity)
        }
    };
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(onSuccess).catch(onError)
    } else {
        navigator.getUserMedia({
            audio: true
        }, onSuccess, onError)
    }
    var id = AL.newId();
    AL.captures[id] = newCapture;
    return id
}
function _alcCaptureSamples(deviceId, pFrames, requestedFrameCount) {
    var c = AL.requireValidCaptureDevice(deviceId, "alcCaptureSamples");
    if (!c)
        return;
    var dstfreq = c.requestedSampleRate;
    var srcfreq = c.audioCtx.sampleRate;
    var fratio = srcfreq / dstfreq;
    if (requestedFrameCount < 0 || requestedFrameCount > c.capturedFrameCount / fratio) {
        err("alcCaptureSamples() with invalid bufferSize");
        AL.alcErr = 40964;
        return
    }
    function setF32Sample(i, sample) {
        HEAPF32[pFrames + 4 * i >> 2] = sample
    }
    function setI16Sample(i, sample) {
        HEAP16[pFrames + 2 * i >> 1] = sample
    }
    function setU8Sample(i, sample) {
        HEAP8[pFrames + i >> 0] = sample
    }
    var setSample;
    switch (c.requestedSampleType) {
    case "f32":
        setSample = setF32Sample;
        break;
    case "i16":
        setSample = setI16Sample;
        break;
    case "u8":
        setSample = setU8Sample;
        break;
    default:
        return
    }
    if (Math.floor(fratio) == fratio) {
        for (var i = 0, frame_i = 0; frame_i < requestedFrameCount; ++frame_i) {
            for (var chan = 0; chan < c.buffers.length; ++chan,
            ++i) {
                setSample(i, c.buffers[chan][c.captureReadhead])
            }
            c.captureReadhead = (fratio + c.captureReadhead) % c.bufferFrameCapacity
        }
    } else {
        for (var i = 0, frame_i = 0; frame_i < requestedFrameCount; ++frame_i) {
            var lefti = Math.floor(c.captureReadhead);
            var righti = Math.ceil(c.captureReadhead);
            var d = c.captureReadhead - lefti;
            for (var chan = 0; chan < c.buffers.length; ++chan,
            ++i) {
                var lefts = c.buffers[chan][lefti];
                var rights = c.buffers[chan][righti];
                setSample(i, (1 - d) * lefts + d * rights)
            }
            c.captureReadhead = (c.captureReadhead + fratio) % c.bufferFrameCapacity
        }
    }
    c.capturedFrameCount = 0
}
function _alcCaptureStart(deviceId) {
    var c = AL.requireValidCaptureDevice(deviceId, "alcCaptureStart");
    if (!c)
        return;
    if (c.isCapturing) {
        return
    }
    c.isCapturing = true;
    c.capturedFrameCount = 0;
    c.capturePlayhead = 0
}
function _alcCaptureStop(deviceId) {
    var c = AL.requireValidCaptureDevice(deviceId, "alcCaptureStop");
    if (!c)
        return;
    c.isCapturing = false
}
function _alcCloseDevice(deviceId) {
    if (!(deviceId in AL.deviceRefCounts) || AL.deviceRefCounts[deviceId] > 0) {
        return 0
    }
    delete AL.deviceRefCounts[deviceId];
    AL.freeIds.push(deviceId);
    return 1
}
function _alcCreateContext(deviceId, pAttrList) {
    if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return 0
    }
    var options = null;
    var attrs = [];
    var hrtf = null;
    pAttrList >>= 2;
    if (pAttrList) {
        var attr = 0;
        var val = 0;
        while (true) {
            attr = HEAP32[pAttrList++];
            attrs.push(attr);
            if (attr === 0) {
                break
            }
            val = HEAP32[pAttrList++];
            attrs.push(val);
            switch (attr) {
            case 4103:
                if (!options) {
                    options = {}
                }
                options.sampleRate = val;
                break;
            case 4112:
            case 4113:
                break;
            case 6546:
                switch (val) {
                case 0:
                    hrtf = false;
                    break;
                case 1:
                    hrtf = true;
                    break;
                case 2:
                    break;
                default:
                    AL.alcErr = 40964;
                    return 0
                }
                break;
            case 6550:
                if (val !== 0) {
                    AL.alcErr = 40964;
                    return 0
                }
                break;
            default:
                AL.alcErr = 40964;
                return 0
            }
        }
    }
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var ac = null;
    try {
        if (options) {
            ac = new AudioContext(options)
        } else {
            ac = new AudioContext
        }
    } catch (e) {
        if (e.name === "NotSupportedError") {
            AL.alcErr = 40964
        } else {
            AL.alcErr = 40961
        }
        return 0
    }
    autoResumeAudioContext(ac);
    if (typeof ac.createGain == "undefined") {
        ac.createGain = ac.createGainNode
    }
    var gain = ac.createGain();
    gain.connect(ac.destination);
    var ctx = {
        deviceId: deviceId,
        id: AL.newId(),
        attrs: attrs,
        audioCtx: ac,
        listener: {
            position: [0, 0, 0],
            velocity: [0, 0, 0],
            direction: [0, 0, 0],
            up: [0, 0, 0]
        },
        sources: [],
        interval: setInterval(function() {
            AL.scheduleContextAudio(ctx)
        }, AL.QUEUE_INTERVAL),
        gain: gain,
        distanceModel: 53250,
        speedOfSound: 343.3,
        dopplerFactor: 1,
        sourceDistanceModel: false,
        hrtf: hrtf || false,
        _err: 0,
        get err() {
            return this._err
        },
        set err(val) {
            if (this._err === 0 || val === 0) {
                this._err = val
            }
        }
    };
    AL.deviceRefCounts[deviceId]++;
    AL.contexts[ctx.id] = ctx;
    if (hrtf !== null) {
        for (var ctxId in AL.contexts) {
            var c = AL.contexts[ctxId];
            if (c.deviceId === deviceId) {
                c.hrtf = hrtf;
                AL.updateContextGlobal(c)
            }
        }
    }
    return ctx.id
}
function _alcDestroyContext(contextId) {
    var ctx = AL.contexts[contextId];
    if (AL.currentCtx === ctx) {
        AL.alcErr = 40962;
        return
    }
    if (AL.contexts[contextId].interval) {
        clearInterval(AL.contexts[contextId].interval)
    }
    AL.deviceRefCounts[ctx.deviceId]--;
    delete AL.contexts[contextId];
    AL.freeIds.push(contextId)
}
function _alcGetContextsDevice(contextId) {
    if (contextId in AL.contexts) {
        return AL.contexts[contextId].deviceId
    } else {
        return 0
    }
}
function _alcGetCurrentContext() {
    if (AL.currentCtx !== null) {
        return AL.currentCtx.id
    } else {
        return 0
    }
}
function _alcGetEnumValue(deviceId, pEnumName) {
    if (deviceId !== 0 && !(deviceId in AL.deviceRefCounts)) {
        return 0
    } else if (!pEnumName) {
        AL.alcErr = 40964;
        return 0
    }
    var name = UTF8ToString(pEnumName);
    switch (name) {
    case "ALC_NO_ERROR":
        return 0;
    case "ALC_INVALID_DEVICE":
        return 40961;
    case "ALC_INVALID_CONTEXT":
        return 40962;
    case "ALC_INVALID_ENUM":
        return 40963;
    case "ALC_INVALID_VALUE":
        return 40964;
    case "ALC_OUT_OF_MEMORY":
        return 40965;
    case "ALC_MAJOR_VERSION":
        return 4096;
    case "ALC_MINOR_VERSION":
        return 4097;
    case "ALC_ATTRIBUTES_SIZE":
        return 4098;
    case "ALC_ALL_ATTRIBUTES":
        return 4099;
    case "ALC_DEFAULT_DEVICE_SPECIFIER":
        return 4100;
    case "ALC_DEVICE_SPECIFIER":
        return 4101;
    case "ALC_EXTENSIONS":
        return 4102;
    case "ALC_FREQUENCY":
        return 4103;
    case "ALC_REFRESH":
        return 4104;
    case "ALC_SYNC":
        return 4105;
    case "ALC_MONO_SOURCES":
        return 4112;
    case "ALC_STEREO_SOURCES":
        return 4113;
    case "ALC_CAPTURE_DEVICE_SPECIFIER":
        return 784;
    case "ALC_CAPTURE_DEFAULT_DEVICE_SPECIFIER":
        return 785;
    case "ALC_CAPTURE_SAMPLES":
        return 786;
    case "ALC_HRTF_SOFT":
        return 6546;
    case "ALC_HRTF_ID_SOFT":
        return 6550;
    case "ALC_DONT_CARE_SOFT":
        return 2;
    case "ALC_HRTF_STATUS_SOFT":
        return 6547;
    case "ALC_NUM_HRTF_SPECIFIERS_SOFT":
        return 6548;
    case "ALC_HRTF_SPECIFIER_SOFT":
        return 6549;
    case "ALC_HRTF_DISABLED_SOFT":
        return 0;
    case "ALC_HRTF_ENABLED_SOFT":
        return 1;
    case "ALC_HRTF_DENIED_SOFT":
        return 2;
    case "ALC_HRTF_REQUIRED_SOFT":
        return 3;
    case "ALC_HRTF_HEADPHONES_DETECTED_SOFT":
        return 4;
    case "ALC_HRTF_UNSUPPORTED_FORMAT_SOFT":
        return 5;
    default:
        AL.alcErr = 40964;
        return 0
    }
}
function _alcGetError(deviceId) {
    var err = AL.alcErr;
    AL.alcErr = 0;
    return err
}
function _alcGetIntegerv(deviceId, param, size, pValues) {
    if (size === 0 || !pValues) {
        return
    }
    switch (param) {
    case 4096:
        HEAP32[pValues >> 2] = 1;
        break;
    case 4097:
        HEAP32[pValues >> 2] = 1;
        break;
    case 4098:
        if (!(deviceId in AL.deviceRefCounts)) {
            AL.alcErr = 40961;
            return
        }
        if (!AL.currentCtx) {
            AL.alcErr = 40962;
            return
        }
        HEAP32[pValues >> 2] = AL.currentCtx.attrs.length;
        break;
    case 4099:
        if (!(deviceId in AL.deviceRefCounts)) {
            AL.alcErr = 40961;
            return
        }
        if (!AL.currentCtx) {
            AL.alcErr = 40962;
            return
        }
        for (var i = 0; i < AL.currentCtx.attrs.length; i++) {
            HEAP32[pValues + i * 4 >> 2] = AL.currentCtx.attrs[i]
        }
        break;
    case 4103:
        if (!(deviceId in AL.deviceRefCounts)) {
            AL.alcErr = 40961;
            return
        }
        if (!AL.currentCtx) {
            AL.alcErr = 40962;
            return
        }
        HEAP32[pValues >> 2] = AL.currentCtx.audioCtx.sampleRate;
        break;
    case 4112:
    case 4113:
        if (!(deviceId in AL.deviceRefCounts)) {
            AL.alcErr = 40961;
            return
        }
        if (!AL.currentCtx) {
            AL.alcErr = 40962;
            return
        }
        HEAP32[pValues >> 2] = 2147483647;
        break;
    case 6546:
    case 6547:
        if (!(deviceId in AL.deviceRefCounts)) {
            AL.alcErr = 40961;
            return
        }
        var hrtfStatus = 0;
        for (var ctxId in AL.contexts) {
            var ctx = AL.contexts[ctxId];
            if (ctx.deviceId === deviceId) {
                hrtfStatus = ctx.hrtf ? 1 : 0
            }
        }
        HEAP32[pValues >> 2] = hrtfStatus;
        break;
    case 6548:
        if (!(deviceId in AL.deviceRefCounts)) {
            AL.alcErr = 40961;
            return
        }
        HEAP32[pValues >> 2] = 1;
        break;
    case 131075:
        if (!(deviceId in AL.deviceRefCounts)) {
            AL.alcErr = 40961;
            return
        }
        if (!AL.currentCtx) {
            AL.alcErr = 40962;
            return
        }
        HEAP32[pValues >> 2] = 1;
    case 786:
        var c = AL.requireValidCaptureDevice(deviceId, "alcGetIntegerv");
        if (!c) {
            return
        }
        var n = c.capturedFrameCount;
        var dstfreq = c.requestedSampleRate;
        var srcfreq = c.audioCtx.sampleRate;
        var nsamples = Math.floor(n * (dstfreq / srcfreq));
        HEAP32[pValues >> 2] = nsamples;
        break;
    default:
        AL.alcErr = 40963;
        return
    }
}
function _alcGetString(deviceId, param) {
    if (AL.alcStringCache[param]) {
        return AL.alcStringCache[param]
    }
    var ret;
    switch (param) {
    case 0:
        ret = "No Error";
        break;
    case 40961:
        ret = "Invalid Device";
        break;
    case 40962:
        ret = "Invalid Context";
        break;
    case 40963:
        ret = "Invalid Enum";
        break;
    case 40964:
        ret = "Invalid Value";
        break;
    case 40965:
        ret = "Out of Memory";
        break;
    case 4100:
        if (typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
            ret = AL.DEVICE_NAME
        } else {
            return 0
        }
        break;
    case 4101:
        if (typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
            ret = AL.DEVICE_NAME.concat("\0")
        } else {
            ret = "\0"
        }
        break;
    case 785:
        ret = AL.CAPTURE_DEVICE_NAME;
        break;
    case 784:
        if (deviceId === 0)
            ret = AL.CAPTURE_DEVICE_NAME.concat("\0");
        else {
            var c = AL.requireValidCaptureDevice(deviceId, "alcGetString");
            if (!c) {
                return 0
            }
            ret = c.deviceName
        }
        break;
    case 4102:
        if (!deviceId) {
            AL.alcErr = 40961;
            return 0
        }
        ret = "";
        for (var ext in AL.ALC_EXTENSIONS) {
            ret = ret.concat(ext);
            ret = ret.concat(" ")
        }
        ret = ret.trim();
        break;
    default:
        AL.alcErr = 40963;
        return 0
    }
    ret = allocateUTF8(ret);
    AL.alcStringCache[param] = ret;
    return ret
}
function _alcIsExtensionPresent(deviceId, pExtName) {
    var name = UTF8ToString(pExtName);
    return AL.ALC_EXTENSIONS[name] ? 1 : 0
}
function _alcMakeContextCurrent(contextId) {
    if (contextId === 0) {
        AL.currentCtx = null;
        return 0
    } else {
        AL.currentCtx = AL.contexts[contextId];
        return 1
    }
}
function _alcOpenDevice(pDeviceName) {
    if (pDeviceName) {
        var name = UTF8ToString(pDeviceName);
        if (name !== AL.DEVICE_NAME) {
            return 0
        }
    }
    if (typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
        var deviceId = AL.newId();
        AL.deviceRefCounts[deviceId] = 0;
        return deviceId
    } else {
        return 0
    }
}
function _alcProcessContext(contextId) {}
function _alcSuspendContext(contextId) {}
function _clock() {
    if (_clock.start === undefined)
        _clock.start = Date.now();
    return (Date.now() - _clock.start) * (1e6 / 1e3) | 0
}
function _emscripten_alcDevicePauseSOFT(deviceId) {
    if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return
    }
    if (AL.paused) {
        return
    }
    AL.paused = true;
    for (var ctxId in AL.contexts) {
        var ctx = AL.contexts[ctxId];
        if (ctx.deviceId !== deviceId) {
            continue
        }
        ctx.audioCtx.suspend();
        clearInterval(ctx.interval);
        ctx.interval = null
    }
}
function _emscripten_alcDeviceResumeSOFT(deviceId) {
    if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return
    }
    if (!AL.paused) {
        return
    }
    AL.paused = false;
    for (var ctxId in AL.contexts) {
        var ctx = AL.contexts[ctxId];
        if (ctx.deviceId !== deviceId) {
            continue
        }
        ctx.interval = setInterval(function() {
            AL.scheduleContextAudio(ctx)
        }, AL.QUEUE_INTERVAL);
        ctx.audioCtx.resume()
    }
}
function _emscripten_alcGetStringiSOFT(deviceId, param, index) {
    if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return 0
    }
    if (AL.alcStringCache[param]) {
        return AL.alcStringCache[param]
    }
    var ret;
    switch (param) {
    case 6549:
        if (index === 0) {
            ret = "Web Audio HRTF"
        } else {
            AL.alcErr = 40964;
            return 0
        }
        break;
    default:
        if (index === 0) {
            return _alcGetString(deviceId, param)
        } else {
            AL.alcErr = 40963;
            return 0
        }
    }
    ret = allocateUTF8(ret);
    AL.alcStringCache[param] = ret;
    return ret
}
function _emscripten_alcResetDeviceSOFT(deviceId, pAttrList) {
    if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return 0
    }
    var hrtf = null;
    pAttrList >>= 2;
    if (pAttrList) {
        var attr = 0;
        var val = 0;
        while (true) {
            attr = HEAP32[pAttrList++];
            if (attr === 0) {
                break
            }
            val = HEAP32[pAttrList++];
            switch (attr) {
            case 6546:
                if (val === 1) {
                    hrtf = true
                } else if (val === 0) {
                    hrtf = false
                }
                break
            }
        }
    }
    if (hrtf !== null) {
        for (var ctxId in AL.contexts) {
            var ctx = AL.contexts[ctxId];
            if (ctx.deviceId === deviceId) {
                ctx.hrtf = hrtf;
                AL.updateContextGlobal(ctx)
            }
        }
    }
    return 1
}
var readAsmConstArgsArray = [];
function readAsmConstArgs(sigPtr, buf) {
    readAsmConstArgsArray.length = 0;
    var ch;
    buf >>= 2;
    while (ch = HEAPU8[sigPtr++]) {
        var readAsmConstArgsDouble = ch < 105;
        if (readAsmConstArgsDouble && buf & 1)
            buf++;
        readAsmConstArgsArray.push(readAsmConstArgsDouble ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
        ++buf
    }
    return readAsmConstArgsArray
}
function _emscripten_asm_const_int(code, sigPtr, argbuf) {
    var args = readAsmConstArgs(sigPtr, argbuf);
    return ASM_CONSTS[code].apply(null, args)
}
function _emscripten_console_error(str) {
    console.error(UTF8ToString(str))
}
function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num)
}
function _emscripten_get_heap_max() {
    return 2147483648
}
function emscripten_realloc_buffer(size) {
    try {
        wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1
    } catch (e) {}
}
function _emscripten_resize_heap(requestedSize) {
    var oldSize = HEAPU8.length;
    requestedSize = requestedSize >>> 0;
    var maxHeapSize = _emscripten_get_heap_max();
    if (requestedSize > maxHeapSize) {
        return false
    }
    let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
            return true
        }
    }
    return false
}
function _emscripten_run_script_string(ptr) {
    var s = eval(UTF8ToString(ptr));
    if (s == null) {
        return 0
    }
    s += "";
    var me = _emscripten_run_script_string;
    var len = lengthBytesUTF8(s);
    if (!me.bufferSize || me.bufferSize < len + 1) {
        if (me.bufferSize)
            _emscripten_builtin_free(me.buffer);
        me.bufferSize = len + 1;
        me.buffer = _emscripten_builtin_malloc(me.bufferSize)
    }
    stringToUTF8(s, me.buffer, me.bufferSize);
    return me.buffer
}
function _emscriptenfte_abortmainloop(fname, fatal) {
    fname = UTF8ToString(fname);
    if (fatal)
        FTEC.aborted = true;
    if (Module["stackTrace"])
        throw "oh noes! something bad happened in " + fname + "!\n" + Module["stackTrace"]();
    throw "oh noes! something bad happened!\n"
}
function _emscriptenfte_al_loadaudiofile(buf, dataptr, datasize) {
    var ctx = AL;
    if (!buf)
        return;
    var albuf = AL.buffers[buf];
    AL.buffers[buf] = null;
    try {
        var abuf = new ArrayBuffer(datasize);
        var rbuf = new Uint8Array(abuf);
        rbuf.set(HEAPU8.subarray(dataptr, dataptr + datasize));
        AL.currentCtx.audioCtx.decodeAudioData(abuf, function(buffer) {
            albuf.bytesPerSample = 2;
            albuf.channels = 1;
            albuf.length = buffer.length;
            albuf.frequency = buffer.sampleRate;
            albuf.audioBuf = buffer;
            ctx.buffers[buf] = albuf
        }, function() {
            console.log("Audio Callback failed!");
            ctx.buffers[buf] = albuf
        })
    } catch (e) {
        console.log("unable to decode audio data");
        console.log(e);
        ctx.buffers[buf] = albuf
    }
}
function _emscriptenfte_alert(msg) {
    msg = UTF8ToString(msg);
    console.log(msg);
    alert(msg)
}
function _emscriptenfte_async_wget_data2(url, ctx, onload, onerror, onprogress) {
    var _url = UTF8ToString(url);
    var http = new XMLHttpRequest;
    try {
        http.open("GET", _url, true)
    } catch (e) {
        if (onerror)
            getWasmTableEntry(onerror)(ctx, 404);
        return
    }
    http.responseType = "arraybuffer";
    http.onload = function(e) {
        if (http.status == 200) {
            if (onload)
                getWasmTableEntry(onload)(ctx, _emscriptenfte_buf_createfromarraybuf(http.response))
        } else {
            if (onerror)
                getWasmTableEntry(onerror)(ctx, http.status)
        }
    }
    ;
    http.onerror = function(e) {
        if (onerror)
            getWasmTableEntry(onerror)(ctx, 0)
    }
    ;
    http.onprogress = function(e) {
        if (onprogress)
            getWasmTableEntry(onprogress)(ctx, e.loaded, e.total)
    }
    ;
    try {
        http.send(null)
    } catch (e) {
        console.log(e);
        http.onerror(e)
    }
}
function _emscriptenfte_handle_alloc(h) {
    for (var i = 0; FTEH.h.length; i += 1) {
        if (FTEH.h[i] == null) {
            FTEH.h[i] = h;
            return i
        }
    }
    i = FTEH.h.length;
    FTEH.h[i] = h;
    return i
}
function _emscriptenfte_buf_create() {
    var b = {
        h: -1,
        r: 1,
        l: 0,
        m: 4096,
        d: new Uint8Array(4096),
        n: null
    };
    b.h = _emscriptenfte_handle_alloc(b);
    return b.h
}
function _emscriptenfte_buf_delete(name) {
    name = UTF8ToString(name);
    var f = FTEH.f[name];
    if (f) {
        delete FTEH.f[name];
        f.n = null;
        _emscriptenfte_buf_release(f.h);
        if (Module["cache"])
            Module["cache"].delete("/_/" + name);
        return 1
    }
    return 0
}
function _emscriptenfte_buf_getsize(handle) {
    var b = FTEH.h[handle];
    return b.l
}
function _emscriptenfte_buf_open(name, createifneeded) {
    name = UTF8ToString(name);
    var f = FTEH.f[name];
    var r = -1;
    if (f == null) {
        if (!FTEC.localstorefailure) {
            try {
                if (localStorage && createifneeded != 2) {
                    var str = localStorage.getItem(name);
                    if (str != null) {
                        var len = str.length;
                        var buf = new Uint8Array(len);
                        for (var i = 0; i < len; i++)
                            buf[i] = str.charCodeAt(i);
                        var b = {
                            h: -1,
                            r: 2,
                            l: len,
                            m: len,
                            d: buf,
                            n: name
                        };
                        r = b.h = _emscriptenfte_handle_alloc(b);
                        FTEH.f[name] = b;
                        return b.h
                    }
                }
            } catch (e) {
                console.log("exception while trying to read local storage for " + name);
                console.log(e);
                console.log("disabling further attempts to access local storage");
                FTEC.localstorefailure = true
            }
        }
        if (createifneeded)
            r = _emscriptenfte_buf_create();
        if (r != -1) {
            f = FTEH.h[r];
            f.r += 1;
            f.n = name;
            FTEH.f[name] = f;
            if (FTEH.f[name] != f || f.n != name)
                console.log("error creating file " + name)
        }
    } else {
        f.r += 1;
        r = f.h
    }
    if (f != null && createifneeded == 2)
        f.l = 0;
    return r
}
function _emscriptenfte_buf_pushtolocalstore(handle) {
    var b = FTEH.h[handle];
    if (b == null) {
        Module.printError("emscriptenfte_buf_pushtolocalstore with invalid handle");
        return
    }
    if (b.n == null)
        return;
    var data = b.d;
    var len = b.l;
    try {
        if (b.n.endsWith(".pak") || b.n.endsWith(".pk3") || b.n.endsWith(".kpf") || b.n.indexOf("/dlcache/") > 0) {
            if (Module["cache"]) {
                console.log("Saving " + b.n + " to cache (" + len + " bytes).");
                Module["cache"].put("/_/" + b.n, new Response(data,{
                    "headers": {
                        "Content-Type": "application/octet-stream",
                        "Content-Length": len
                    }
                }))
            } else
                console.log("cache not available")
        } else if (localStorage) {
            var foo = "";
            for (var i = 0; i < len; i++)
                foo += String.fromCharCode(data[i]);
            localStorage.setItem(b.n, foo)
        } else
            console.log("local storage not supported")
    } catch (e) {
        console.log("exception while trying to save " + b.n, e)
    }
}
function _emscriptenfte_buf_read(handle, offset, data, len) {
    var b = FTEH.h[handle];
    if (offset + len > b.l)
        len = b.l - offset;
    if (len < 0) {
        len = 0;
        if (offset + len >= b.l)
            return -1
    }
    HEAPU8.set(b.d.subarray(offset, offset + len), data);
    return len
}
function _emscriptenfte_buf_release(handle) {
    var b = FTEH.h[handle];
    if (b == null) {
        Module.printError("emscriptenfte_buf_release with invalid handle");
        return
    }
    b.r -= 1;
    if (b.r == 0) {
        if (b.n != null)
            delete FTEH.f[b.n];
        delete FTEH.h[handle];
        b.d = null
    }
}
function _emscriptenfte_buf_rename(oldname, newname) {
    oldname = UTF8ToString(oldname);
    newname = UTF8ToString(newname);
    var f = FTEH.f[oldname];
    if (f == null)
        return 0;
    if (FTEH.f[newname] != null)
        return 0;
    FTEH.f[newname] = f;
    delete FTEH.f[oldname];
    f.n = newname;
    if (Module["cache"]) {
        Module["cache"].match("/_/" + oldname).then(oldresp => {
            if (oldresp === undefined)
                Module["cache"].delete("/_/" + newname);
            else {
                Module["cache"].put("/_/" + newname, oldresp);
                Module["cache"].delete("/_/" + oldname)
            }
        }
        ).catch( () => {
            Module["cache"].delete("/_/" + oldname);
            Module["cache"].delete("/_/" + newname)
        }
        )
    }
    return 1
}
function _emscriptenfte_buf_write(handle, offset, data, len) {
    var b = FTEH.h[handle];
    if (len < 0)
        len = 0;
    if (offset + len > b.m) {
        b.m = offset + len + 4095;
        b.m = b.m & ~4095;
        var nd = new Uint8Array(b.m);
        nd.set(b.d, 0);
        b.d = nd
    }
    b.d.set(HEAPU8.subarray(data, data + len), offset);
    if (offset + len > b.l)
        b.l = offset + len;
    return len
}
function _emscriptenfte_gl_loadtexturefile(texid, widthptr, heightptr, dataptr, datasize, fname, dopremul, genmips) {
    function encode64(data) {
        var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var PAD = "=";
        var ret = "";
        var leftchar = 0;
        var leftbits = 0;
        for (var i = 0; i < data.length; i++) {
            leftchar = leftchar << 8 | data[i];
            leftbits += 8;
            while (leftbits >= 6) {
                var curr = leftchar >> leftbits - 6 & 63;
                leftbits -= 6;
                ret += BASE[curr]
            }
        }
        if (leftbits == 2) {
            ret += BASE[(leftchar & 3) << 4];
            ret += PAD + PAD
        } else if (leftbits == 4) {
            ret += BASE[(leftchar & 15) << 2];
            ret += PAD
        }
        return ret
    }
    GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGBA, 1, 1, 0, GLctx.RGBA, GLctx.UNSIGNED_BYTE, null);
    var img = new Image;
    var gltex = GL.textures[texid];
    img.name = UTF8ToString(fname);
    img.onload = function() {
        if (img.width < 1 || img.height < 1) {
            console.log("emscriptenfte_gl_loadtexturefile(" + img.name + "): bad image size\n");
            return
        }
        var oldtex = GLctx.getParameter(GLctx.TEXTURE_BINDING_2D);
        GLctx.bindTexture(GLctx.TEXTURE_2D, gltex);
        if (dopremul)
            GLctx.pixelStorei(GLctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGBA, GLctx.RGBA, GLctx.UNSIGNED_BYTE, img);
        if (dopremul)
            GLctx.pixelStorei(GLctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        if (genmips)
            GLctx.generateMipmap(GLctx.TEXTURE_2D);
        GLctx.bindTexture(GLctx.TEXTURE_2D, oldtex)
    }
    ;
    img.crossorigin = true;
    img.src = "data:image/png;base64," + encode64(HEAPU8.subarray(dataptr, dataptr + datasize))
}
function _emscriptenfte_openfile() {
    if (FTEC.evcb.loadfile != 0) {
        window.showOpenFilePicker({
            types: [{
                description: "Packages",
                accept: {
                    "text/*": [".pk3", ".pak", ".pk4", ".zip"]
                }
            }, {
                description: "Maps",
                accept: {
                    "text/*": [".bsp.gz", ".bsp", ".map", ".hmp"]
                }
            }, {
                description: "Demos",
                accept: {
                    "application/*": [".mvd.gz", ".qwd.gz", ".dem.gz", ".mvd", ".qwd", ".dem"]
                }
            }, {
                description: "QuakeTV Info",
                accept: {
                    "application/*": [".qtv"]
                }
            }, {
                description: "FTE Manifest",
                accept: {
                    "text/*": [".fmf"]
                }
            }, {
                description: "Configs",
                accept: {
                    "text/*": [".cfg", ".rc"]
                }
            }],
            excludeAcceptAllOption: false,
            id: "openfile",
            multiple: true
        }).then(r => {
            for (let i of r) {
                i.getFile().then(f => {
                    f.arrayBuffer().then(arraybuf => {
                        if (FTEC.evcb.loadfile != 0) {
                            const handle = _emscriptenfte_buf_createfromarraybuf(arraybuf);
                            let blen = lengthBytesUTF8(i.name) + 1;
                            let urlptr = _malloc(blen);
                            stringToUTF8(f.name, urlptr, blen);
                            blen = lengthBytesUTF8(f.type) + 1;
                            let mimeptr = _malloc(blen);
                            stringToUTF8(f.type, mimeptr, blen);
                            getWasmTableEntry(FTEC.evcb.loadfile)(urlptr, mimeptr, handle);
                            _free(mimeptr);
                            _free(urlptr);
                            window.focus()
                        }
                    }
                    )
                }
                ).catch(e => {
                    console.error("getFile() failed:");
                    console.error(e)
                }
                )
            }
        }
        ).catch(e => {
            console.log("showOpenFilePicker() aborted", e)
        }
        )
    }
}
function _emscriptenfte_pcm_loadaudiofile(ctx, callback, dataptr, datasize, snd_speed) {
    const successcb = function(buffer) {
        const frames = buffer.length;
        const chans = buffer.numberOfChannels;
        const rate = buffer.sampleRate;
        const outptr = _malloc(2 * frames * chans);
        if (!outptr)
            return;
        const dst = HEAP16.subarray(outptr >> 1, outptr + 2 * frames * chans >> 1);
        for (let c = 0; c < buffer.numberOfChannels; c++) {
            const src = buffer.getChannelData(c);
            for (let f = 0; f < frames; f++)
                dst[f * chans + c] = 16384 * src[f]
        }
        getWasmTableEntry(callback)(ctx, outptr, frames, chans, rate);
        _free(outptr)
    };
    const failurecb = function(buffer) {
        getWasmTableEntry(callback)(ctx, 0, 0, 0, 0)
    };
    try {
        const abuf = new ArrayBuffer(datasize);
        const rbuf = new Uint8Array(abuf);
        rbuf.set(HEAPU8.subarray(dataptr, dataptr + datasize));
        const ac = new AudioContext({
            sampleRate: snd_speed
        });
        ac.decodeAudioData(abuf, successcb, failurecb);
        return true
    } catch (e) {
        console.log("emscriptenfte_pcm_loadaudiofile failure :(")
    }
    return false
}
function _emscriptenfte_polljoyevents() {
    let gamepads;
    try {
        gamepads = navigator.getGamepads ? navigator.getGamepads() : []
    } catch (e) {}
    if (gamepads !== undefined) {
        for (let i = 0; i < gamepads.length; i += 1) {
            const gp = gamepads[i];
            if (gp === undefined)
                continue;
            if (gp == null)
                continue;
            for (let j = 0; j < gp.buttons.length; j += 1) {
                const b = gp.buttons[j];
                let p;
                if (typeof b == "object")
                    p = b.pressed || b.value > .5;
                else
                    p = b > .5;
                if (b.lastframe != p) {
                    b.lastframe = p;
                    getWasmTableEntry(FTEC.evcb.jbutton)(gp.index, j, p, gp.mapping == "standard")
                }
            }
            for (let j = 0; j < gp.axes.length; j += 1)
                getWasmTableEntry(FTEC.evcb.jaxis)(gp.index, j, gp.axes[j], gp.mapping == "standard")
        }
    }
    if (FTEC.xrsession != null && FTEC.xrframe != null && FTEC.referenceSpace != null) {
        let count = 0;
        let org = {
            x: 0,
            y: 0,
            z: 0
        }
          , quat = {
            x: 0,
            y: 0,
            z: 0,
            w: 0
        };
        const pose = FTEC.xrframe.getViewerPose(FTEC.referenceSpace);
        if (pose) {
            for (let view of pose.views) {
                org.x += view.transform.position.x;
                org.y += view.transform.position.y;
                org.z += view.transform.position.z;
                quat.x += view.transform.orientation.x;
                quat.y += view.transform.orientation.y;
                quat.z += view.transform.orientation.z;
                quat.w += view.transform.orientation.w;
                count++
            }
            if (count) {
                org.x /= count;
                org.y /= count;
                org.z /= count;
                quat.x /= count;
                quat.y /= count;
                quat.z /= count;
                quat.w /= count;
                getWasmTableEntry(FTEC.evcb.jorientation)(-3, org.x, org.y, org.z, quat.x, quat.y, quat.z, quat.w)
            }
        }
        for (const is of FTEC.xrsession.inputSources) {
            if (is === undefined || is == null)
                continue;
            let idx;
            if (is.handedness == "right")
                idx = -1;
            else if (is.handedness == "left")
                idx = -2;
            else if (is.handedness == "none" && (is.targetRayMode == "gaze" || is.targetRayMode == "screen"))
                idx = -4;
            else
                continue;
            const targetRayPose = FTEC.xrframe.getPose(is.targetRaySpace, FTEC.referenceSpace);
            if (targetRayPose) {
                const org = targetRayPose.transform.position;
                const quat = targetRayPose.transform.orientation;
                getWasmTableEntry(FTEC.evcb.jorientation)(idx, org.x, org.y, org.z, quat.x, quat.y, quat.z, quat.w)
            }
            const gp = is.gamepad;
            if (gp == null)
                continue;
            if (gp.mapping != "xr-standard")
                continue;
            for (let j = 0; j < gp.buttons.length; j += 1) {
                const b = gp.buttons[j];
                let p;
                p = b.pressed;
                if (b.lastframe != p) {
                    b.lastframe = p;
                    getWasmTableEntry(FTEC.evcb.jbutton)(idx, j, p, gp.mapping == "standard")
                }
            }
            for (let j = 0; j < gp.axes.length; j += 1) {
                getWasmTableEntry(FTEC.evcb.jaxis)(idx, j, gp.axes[j], gp.mapping == "standard")
            }
        }
    }
}
function _emscriptenfte_print(msg) {
    FTEC.linebuffer += UTF8ToString(msg);
    for (; ; ) {
        nl = FTEC.linebuffer.indexOf("\n");
        if (nl == -1)
            break;
        console.log(FTEC.linebuffer.substring(0, nl));
        FTEC.linebuffer = FTEC.linebuffer.substring(nl + 1)
    }
}
function _emscriptenfte_rtc_candidate(sockid, offer) {
    var s = FTEH.h[sockid];
    offer = UTF8ToString(offer);
    if (s === undefined)
        return -1;
    try {
        var desc;
        try {
            desc = JSON.parse(offer)
        } catch (e) {
            desc = {
                candidate: offer,
                sdpMid: null,
                sdpMLineIndex: 0
            }
        }
        s.pc.addIceCandidate(desc)
    } catch (err) {
        console.log(err)
    }
    return 0
}
function _emscriptenfte_rtc_create(clientside, ctxp, ctxi, callback, pcconfig) {
    try {
        pcconfig = JSON.parse(UTF8ToString(pcconfig))
    } catch (err) {
        pcconfig = {}
    }
    var dcconfig = {
        ordered: false,
        maxRetransmits: 0,
        reliable: false
    };
    var s = {
        pc: null,
        ws: null,
        inq: [],
        err: 0,
        con: 0,
        isclient: clientside,
        callcb: function(evtype, stringdata) {
            var stringlen = stringdata.length * 3 + 1;
            var dataptr = _malloc(stringlen);
            stringToUTF8(stringdata, dataptr, stringlen);
            getWasmTableEntry(callback)(ctxp, ctxi, evtype, dataptr);
            _free(dataptr)
        }
    };
    if (RTCPeerConnection === undefined) {
        console.log("RTCPeerConnection undefined");
        return -1
    }
    s.pc = new RTCPeerConnection(pcconfig);
    if (s.pc === undefined) {
        console.log("webrtc failed to create RTCPeerConnection");
        return -1
    }
    s.ws = s.pc.createDataChannel("quake", dcconfig);
    s.ws.binaryType = "arraybuffer";
    s.ws.onclose = function(event) {
        s.con = 0;
        s.err = 1
    }
    ;
    s.ws.onopen = function(event) {
        s.con = 1
    }
    ;
    s.ws.onmessage = function(event) {
        assert(typeof event.data !== "string" && event.data.byteLength);
        s.inq.push(new Uint8Array(event.data))
    }
    ;
    s.pc.onicecandidate = function(e) {
        var desc;
        if (1)
            desc = JSON.stringify(e.candidate);
        else
            desc = e.candidate.candidate;
        if (desc == null)
            return;
        s.callcb(4, desc)
    }
    ;
    s.pc.ondatachannel = function(e) {
        s.recvchan = e.channel;
        s.recvchan.binaryType = "arraybuffer";
        s.recvchan.onmessage = s.ws.onmessage
    }
    ;
    s.pc.onconnectionstatechange = function(e) {
        switch (s.pc.connectionState) {
        case "disconnected":
            s.err = 1;
            break;
        case "closed":
            s.con = 0;
            s.err = 1;
            break;
        case "failed":
            s.err = 1;
            break;
        default:
            break
        }
    }
    ;
    if (clientside) {
        s.pc.createOffer().then(function(desc) {
            s.pc.setLocalDescription(desc);
            if (1)
                desc = JSON.stringify(desc);
            else
                desc = desc.sdp;
            s.callcb(3, desc)
        }, function(event) {
            s.err = 1
        })
    }
    return _emscriptenfte_handle_alloc(s)
}
function _emscriptenfte_rtc_offer(sockid, offer, offertype) {
    var desc;
    var s = FTEH.h[sockid];
    offer = UTF8ToString(offer);
    offertype = UTF8ToString(offertype);
    if (s === undefined)
        return -1;
    try {
        try {
            desc = JSON.parse(offer)
        } catch (e) {
            desc = {
                sdp: offer,
                type: offertype
            }
        }
        s.pc.setRemoteDescription(desc).then( () => {
            if (!s.isclient) {
                s.pc.createAnswer().then(function(desc) {
                    s.pc.setLocalDescription(desc);
                    if (1)
                        desc = JSON.stringify(desc);
                    else
                        desc = desc.sdp;
                    s.callcb(3, desc)
                }, function(event) {
                    s.err = 1
                })
            }
        }
        , err => {
            console.log(desc);
            console.log(err)
        }
        )
    } catch (err) {
        console.log(err)
    }
}
function _emscriptenfte_settitle(txt) {
    document.title = UTF8ToString(txt)
}
function _emscriptenfte_buf_createfromarraybuf(buf) {
    buf = new Uint8Array(buf);
    var len = buf.length;
    var b = {
        h: -1,
        r: 1,
        l: len,
        m: len,
        d: buf,
        n: null
    };
    b.h = _emscriptenfte_handle_alloc(b);
    return b.h
}
var FTEC = {
    ctxwarned: 0,
    pointerislocked: 0,
    pointerwantlock: 0,
    clipboard: "",
    linebuffer: "",
    localstorefailure: false,
    dovsync: false,
    wakelock: null,
    xrsupport: -1,
    xrsession: null,
    xrframe: null,
    referenceSpace: null,
    w: -1,
    h: -1,
    donecb: 0,
    evcb: {
        resize: 0,
        mouse: 0,
        button: 0,
        key: 0,
        loadfile: 0,
        cbufaddtext: 0,
        jbutton: 0,
        jaxis: 0,
        jorientation: 0,
        wantfullscreen: 0,
        frame: 0
    },
    loadurl: function(url, mime, arraybuf) {
        if (FTEC.evcb.loadfile != 0) {
            let handle = -1;
            if (arraybuf !== undefined)
                handle = _emscriptenfte_buf_createfromarraybuf(arraybuf);
            let blen = lengthBytesUTF8(url) + 1;
            let urlptr = _malloc(blen);
            stringToUTF8(url, urlptr, blen);
            blen = lengthBytesUTF8(mime) + 1;
            let mimeptr = _malloc(blen);
            stringToUTF8(mime, mimeptr, blen);
            getWasmTableEntry(FTEC.evcb.loadfile)(urlptr, mimeptr, handle);
            _free(mimeptr);
            _free(urlptr);
            window.focus()
        }
    },
    cbufadd: function(command) {
        if (FTEC.evcb.cbufaddtext != 0) {
            let blen = lengthBytesUTF8(command) + 1;
            let ptr = _malloc(blen);
            stringToUTF8(command, ptr, blen);
            getWasmTableEntry(FTEC.evcb.cbufaddtext)(ptr);
            _free(ptr);
            window.focus()
        }
    },
    step: function(timestamp) {
        if (FTEC.aborted)
            return;
        if (FTEC.dovsync)
            Browser.requestAnimationFrame(FTEC.step);
        else
            setTimeout(FTEC.step, 0, performance.now());
        if (FTEC.xrsession)
            return;
        try {
            FTEC.dovsync = getWasmTableEntry(FTEC.evcb.frame)(timestamp)
        } catch (err) {
            console.log(err)
        }
    },
    doxrframe: function(timestamp, frame) {
        if (FTEC.aborted || FTEC.xrsession == null)
            return;
        FTEC.xrsession.requestAnimationFrame(FTEC.doxrframe);
        FTEC.xrframe = frame;
        try {
            FTEC.dovsync = getWasmTableEntry(FTEC.evcb.frame)(timestamp)
        } catch (err) {
            console.log(err)
        }
        FTEC.xrframe = null
    },
    handleevent: function(event) {
        switch (event.type) {
        case "message":
            console.log(event);
            console.log(event.data);
            FTEC.loadurl(event.data.url, event.data.cmd, undefined);
            break;
        case "resize":
            if (FTEC.evcb.resize != 0) {
                getWasmTableEntry(FTEC.evcb.resize)(Module["canvas"].width, Module["canvas"].height)
            }
            break;
        case "mousemove":
            if (FTEC.evcb.mouse != 0) {
                if (Browser.pointerLock) {
                    if (typeof event.movementX === "undefined") {
                        event.movementX = event.mozMovementX;
                        event.movementY = event.mozMovementY
                    }
                    if (typeof event.movementX === "undefined") {
                        event.movementX = event.webkitMovementX;
                        event.movementY = event.webkitMovementY
                    }
                    getWasmTableEntry(FTEC.evcb.mouse)(0, false, event.movementX, event.movementY, 0, 0)
                } else {
                    var rect = Module["canvas"].getBoundingClientRect();
                    getWasmTableEntry(FTEC.evcb.mouse)(0, true, (event.clientX - rect.left) * (Module["canvas"].width / rect.width), (event.clientY - rect.top) * (Module["canvas"].height / rect.height), 0, 0)
                }
            }
            break;
        case "mousedown":
            window.focus();
            if (FTEC.pointerwantlock != 0 && FTEC.pointerislocked == 0) {
                var v;
                try {
                    FTEC.pointerislocked = -1;
                    v = Module["canvas"].requestPointerLock({
                        unadjustedMovement: true
                    });
                    if (v !== undefined) {
                        v.catch(e => {
                            if (e.name == "NotSupportedError") {
                                Module["canvas"].requestPointerLock().then( () => {
                                    console.log("Shitty browser forces mouse accel. Expect a shit experience.")
                                }
                                ).catch( () => {
                                    console.log("Your defective browser forces can't handle mouse look. Expect a truely dire experience. Give up now.")
                                }
                                )
                            } else
                                console.log("Your defective browser forces can't handle mouse look. Expect a truely dire experience. Give up now.")
                        }
                        )
                    }
                } catch (e) {
                    try {
                        Module["canvas"].requestPointerLock();
                        console.log("Your shitty browser doesn't support disabling mouse acceleration.")
                    } catch (e) {
                        console.log("Your shitty browser doesn't support mouse grabs.");
                        FTEC.pointerislocked = -1
                    }
                }
            }
            if (!document.fullscreenElement)
                if (FTEC.evcb.wantfullscreen != 0)
                    if (getWasmTableEntry(FTEC.evcb.wantfullscreen)()) {
                        try {
                            Module["canvas"].requestFullscreen()
                        } catch (e) {
                            console.log("requestFullscreen:");
                            console.log(e)
                        }
                    }
        case "mouseup":
            if (FTEC.evcb.button != 0) {
                getWasmTableEntry(FTEC.evcb.button)(0, event.type == "mousedown", event.button);
                event.preventDefault()
            }
            break;
        case "mousewheel":
        case "wheel":
            if (FTEC.evcb.button != 0) {
                getWasmTableEntry(FTEC.evcb.button)(0, 2, event.deltaY);
                event.preventDefault()
            }
            break;
        case "mouseout":
            if (FTEC.evcb.button != 0) {
                for (let i = 0; i < 8; i++)
                    getWasmTableEntry(FTEC.evcb.button)(0, false, i)
            }
            if (FTEC.pointerislocked == -1)
                FTEC.pointerislocked = 0;
            break;
        case "visibilitychange":
            try {
                if (!FTEC.wakelock && navigator.wakeLock && document.visibilityState === "visible")
                    navigator.wakeLock.request("screen").then(value => {
                        FTEC.wakelock = value;
                        value.addEventListener("release", () => {
                            FTEC.wakelock = null
                        }
                        )
                    }
                    ).catch( () => {}
                    )
            } catch (e) {
                console.log(e)
            }
            break;
        case "focus":
        case "blur":
            getWasmTableEntry(FTEC.evcb.key)(0, false, 16, 0);
            getWasmTableEntry(FTEC.evcb.key)(0, false, 17, 0);
            getWasmTableEntry(FTEC.evcb.key)(0, false, 18, 0);
            if (FTEC.pointerislocked == -1)
                FTEC.pointerislocked = 0;
            break;
        case "keypress":
            if (FTEC.evcb.key != 0) {
                if (event.charCode >= 122 && event.charCode <= 123)
                    break;
                getWasmTableEntry(FTEC.evcb.key)(0, 1, 0, event.charCode);
                getWasmTableEntry(FTEC.evcb.key)(0, 0, 0, event.charCode);
                event.preventDefault();
                event.stopPropagation()
            }
            break;
        case "keydown":
        case "keyup":
            if (FTEC.evcb.key != 0 && event.keyCode != 122) {
                const codepoint = event.key.codePointAt(1) ? 0 : event.key.codePointAt(0);
                if (codepoint < " ")
                    codepoint = 0;
                if (getWasmTableEntry(FTEC.evcb.key)(0, event.type == "keydown", event.keyCode, codepoint))
                    event.preventDefault()
            }
            break;
        case "touchstart":
        case "touchend":
        case "touchcancel":
        case "touchleave":
        case "touchmove":
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                const t = touches[i];
                if (FTEC.evcb.mouse)
                    getWasmTableEntry(FTEC.evcb.mouse)(t.identifier + 1, true, t.pageX, t.pageY, 0, Math.sqrt(t.radiusX * t.radiusX + t.radiusY * t.radiusY));
                if (FTEC.evcb.button) {
                    if (event.type == "touchstart")
                        getWasmTableEntry(FTEC.evcb.button)(t.identifier + 1, 1, -1);
                    else if (event.type != "touchmove")
                        getWasmTableEntry(FTEC.evcb.button)(t.identifier + 1, 0, -1)
                }
            }
            break;
        case "dragenter":
        case "dragover":
            event.stopPropagation();
            event.preventDefault();
            break;
        case "drop":
            event.stopPropagation();
            event.preventDefault();
            let files = event.dataTransfer.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader;
                reader.onload = function(evt) {
                    FTEC.loadurl(files[i].name, "", evt.target.result)
                }
                ;
                reader.readAsArrayBuffer(file)
            }
            break;
        case "gamepadconnected":
            {
                const gp = event.gamepad;
                if (FTEH.gamepads === undefined)
                    FTEH.gamepads = [];
                FTEH.gamepads[gp.index] = gp;
                console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gp.index, gp.id, gp.buttons.length, gp.axes.length)
            }
            break;
        case "gamepaddisconnected":
            {
                const gp = event.gamepad;
                delete FTEH.gamepads[gp.index];
                if (FTEC.evcb.jaxis)
                    for (let j = 0; j < 6; j += 1)
                        getWasmTableEntry(FTEC.evcb.jaxis)(gp.index, j, 0, true);
                if (FTEC.evcb.jbutton)
                    for (let j = 0; j < 32 + 4; j += 1)
                        getWasmTableEntry(FTEC.evcb.jbutton)(gp.index, j, 0, true);
                console.log("Gamepad disconnected from index %d: %s", gp.index, gp.id)
            }
            break;
        case "pointerlockerror":
        case "pointerlockchange":
        case "mozpointerlockchange":
        case "webkitpointerlockchange":
            FTEC.pointerislocked = document.pointerLockElement === Module["canvas"] || document.mozPointerLockElement === Module["canvas"] || document.webkitPointerLockElement === Module["canvas"];
            break;
        case "beforeunload":
            event.preventDefault();
            return "quit this game like everything else?";
        default:
            console.log(event);
            break
        }
    }
};
function _emscriptenfte_setupcanvas(nw, nh, evresize, evmouse, evmbutton, evkey, evfile, evcbufadd, evjbutton, evjaxis, evjorientation, evwantfullscreen) {
    try {
        FTEC.evcb.resize = evresize;
        FTEC.evcb.mouse = evmouse;
        FTEC.evcb.button = evmbutton;
        FTEC.evcb.key = evkey;
        FTEC.evcb.loadfile = evfile;
        FTEC.evcb.cbufaddtext = evcbufadd;
        FTEC.evcb.jbutton = evjbutton;
        FTEC.evcb.jaxis = evjaxis;
        FTEC.evcb.jorientation = evjorientation;
        FTEC.evcb.wantfullscreen = evwantfullscreen;
        if ("GamepadEvent"in window)
            FTEH.gamepads = [];
        if (!FTEC.donecb) {
            FTEC.donecb = 1;
            var events = ["mousedown", "mouseup", "mousemove", "wheel", "mousewheel", "mouseout", "keypress", "keydown", "keyup", "touchstart", "touchend", "touchcancel", "touchleave", "touchmove", "dragenter", "dragover", "drop", "message", "resize", "pointerlockerror", "pointerlockchange", "mozpointerlockchange", "webkitpointerlockchange", "focus", "blur"];
            events.forEach(function(event) {
                Module["canvas"].addEventListener(event, FTEC.handleevent, {
                    capture: true,
                    passive: false
                })
            });
            var docevents = ["keypress", "keydown", "keyup", "pointerlockerror", "pointerlockchange", "mozpointerlockchange", "webkitpointerlockchange", "visibilitychange"];
            docevents.forEach(function(event) {
                document.addEventListener(event, FTEC.handleevent, true)
            });
            var windowevents = ["message", "gamepadconnected", "gamepaddisconnected", "beforeunload", "focus", "blur"];
            windowevents.forEach(function(event) {
                window.addEventListener(event, FTEC.handleevent, true)
            })
        }
        var ctx = Browser.createContext(Module["canvas"], true, true, {});
        if (ctx == null) {
            var msg = "Unable to set up webgl context.\n\nPlease use a browser that supports it and has it enabled\nYour graphics drivers may also be blacklisted, so try updating those too. woo, might as well update your entire operating system while you're at it.\nIt'll be expensive, but hey, its YOUR money, not mine.\nYou can probably just disable the blacklist, but please don't moan at me when your computer blows up, seriously, make sure those drivers are not too buggy.\nI knew a guy once. True story. Boring, but true.\nYou're probably missing out on something right now. Don't you just hate it when that happens?\nMeh, its probably just tinkertoys, right?\n\nYou know, you could always try Internet Explorer, you never know, hell might have frozen over.\nDon't worry, I wasn't serious.\n\nTum te tum. Did you get it working yet?\nDude, fix it already.\n\nThis message was brought to you by Sleep Deprivation, sponsoring quake since I don't know when";
            if (FTEC.ctxwarned == 0) {
                FTEC.ctxwarned = 1;
                console.log(msg);
                alert(msg)
            }
            return 0
        }
        window.onresize = function() {
            let scale = window.devicePixelRatio;
            if (scale <= 0)
                scale = 1;
            {
                let rect = Module["canvas"].getBoundingClientRect();
                Browser.setCanvasSize(rect.width * scale, rect.height * scale, false)
            }
            if (FTEC.evcb.resize != 0)
                getWasmTableEntry(FTEC.evcb.resize)(Module["canvas"].width, Module["canvas"].height, scale)
        }
        ;
        window.onresize();
        if (FTEC.evcb.hashchange) {
            window.onhashchange = function() {
                FTEC.loadurl(location.hash.substring(1), "", undefined)
            }
        }
        try {
            _emscriptenfte_updatepointerlock(false, false)
        } catch (e) {
            console.log(e)
        }
        try {
            if (!FTEC.wakelock && navigator.wakeLock)
                navigator.wakeLock.request("screen").then(value => {
                    FTEC.wakelock = value;
                    value.addEventListener("release", () => {
                        FTEC.wakelock = null
                    }
                    )
                }
                ).catch( () => {}
                )
        } catch (e) {
            console.log(e)
        }
    } catch (e) {
        console.log(e)
    }
    FTEC.xrsupport = 0;
    if (navigator.xr) {
        function rechecksupport() {
            navigator.xr.isSessionSupported("inline", {}).then(works => {
                FTEC.xrsupport = (FTEC.xrsupport & ~1) << 0 | works << 0
            }
            );
            navigator.xr.isSessionSupported("immersive-vr", {}).then(works => {
                FTEC.xrsupport = (FTEC.xrsupport & ~1) << 1 | works << 1
            }
            );
            navigator.xr.isSessionSupported("immersive-ar", {}).then(works => {
                FTEC.xrsupport = (FTEC.xrsupport & ~1) << 2 | works << 2
            }
            )
        }
        rechecksupport();
        navigator.xr.addEventListener("devicechange", e => {
            rechecksupport()
        }
        )
    }
    return 1
}
function _emscriptenfte_setupmainloop(fnc) {
    Module["noExitRuntime"] = true;
    FTEC.aborted = fnc == 0;
    Module["sched"] = FTEC.step;
    FTEC.evcb.frame = fnc;
    if (fnc) {
        setTimeout(FTEC.step, 1, performance.now())
    } else if (Module["close"])
        Module["close"]();
    else if (Module["quiturl"])
        document.location.replace(Module["quiturl"]);
    else {
        try {
            if (history.length == 1)
                window.close();
            else
                history.back()
        } catch (e) {}
    }
}
function _emscriptenfte_updatepointerlock(wantlock, softcursor) {
    FTEC.pointerwantlock = wantlock;
    if (wantlock == 0 && FTEC.pointerislocked != 0) {
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
        FTEC.pointerislocked = 0;
        if (document.exitPointerLock)
            document.exitPointerLock()
    }
    if (softcursor)
        Module.canvas.style.cursor = "none";
    else
        Module.canvas.style.cursor = "default"
}
function _emscriptenfte_uptime_ms() {
    return performance.now()
}
function _emscriptenfte_window_location(msg) {
    msg = UTF8ToString(msg);
    console.log("Redirecting page to " + msg);
    window.location = msg
}
function _emscriptenfte_ws_close(sockid) {
    var s = FTEH.h[sockid];
    if (s === undefined)
        return -1;
    s.callcb = null;
    if (s.ws != null) {
        s.ws.close();
        s.ws = null
    }
    if (s.pc != null) {
        s.pc.close();
        s.pc = null
    }
    if (s.broker != null) {
        s.broker.close();
        s.broker = null
    }
    delete FTEH.h[sockid];
    return 0
}
function _emscriptenfte_ws_connect(brokerurl, protocolname) {
    var _url = UTF8ToString(brokerurl);
    var _protocol = UTF8ToString(protocolname);
    var s = {
        ws: null,
        inq: [],
        err: 0,
        con: 0
    };
    try {
        s.ws = new WebSocket(_url,_protocol)
    } catch (err) {
        console.log(err)
    }
    if (s.ws === undefined)
        return -1;
    if (s.ws == null)
        return -1;
    s.ws.binaryType = "arraybuffer";
    s.ws.onerror = function(event) {
        s.con = 0;
        s.err = 1
    }
    ;
    s.ws.onclose = function(event) {
        s.con = 0;
        s.err = 1
    }
    ;
    s.ws.onopen = function(event) {
        s.con = 1
    }
    ;
    s.ws.onmessage = function(event) {
        assert(typeof event.data !== "string" && event.data.byteLength, "websocket data is not usable");
        s.inq.push(new Uint8Array(event.data))
    }
    ;
    return _emscriptenfte_handle_alloc(s)
}
function _emscriptenfte_ws_recv(sockid, data, len) {
    var s = FTEH.h[sockid];
    if (s === undefined)
        return -1;
    var inp = s.inq.shift();
    if (inp) {
        if (inp.length > len)
            inp.length = len;
        HEAPU8.set(inp, data);
        return inp.length
    }
    if (s.err)
        return -1;
    return 0
}
function _emscriptenfte_ws_send(sockid, data, len) {
    var s = FTEH.h[sockid];
    if (s === undefined)
        return -1;
    if (s.con == 0)
        return 0;
    if (s.err != 0)
        return -1;
    if (len == 0)
        return 0;
    s.ws.send(HEAPU8.subarray(data, data + len));
    return len
}
function _emscriptenfte_xr_geteyeinfo(maxeyes, eyeptr) {
    if (!FTEC.xrframe || !FTEC.xrsession)
        return 0;
    const pose = FTEC.xrframe.getViewerPose(FTEC.referenceSpace);
    if (!pose)
        return 0;
    const layer = FTEC.xrsession.renderState.baseLayer;
    var e = 0;
    if (!FTEC.xrfbo)
        FTEC.xrfbo = GL.framebuffers.length;
    GL.framebuffers[FTEC.xrfbo] = layer.framebuffer;
    eyeptr >>= 2;
    for (const view of pose.views) {
        if (e == maxeyes)
            break;
        const viewport = layer.getViewport(view);
        HEAP32[eyeptr + 0] = FTEC.xrfbo;
        eyeptr += 1;
        HEAP32[eyeptr + 0] = viewport.x;
        HEAP32[eyeptr + 1] = viewport.y;
        HEAP32[eyeptr + 2] = viewport.width;
        HEAP32[eyeptr + 3] = viewport.height;
        eyeptr += 4;
        HEAPF32[eyeptr + 0] = view.projectionMatrix[0];
        HEAPF32[eyeptr + 1] = view.projectionMatrix[1];
        HEAPF32[eyeptr + 2] = view.projectionMatrix[2];
        HEAPF32[eyeptr + 3] = view.projectionMatrix[3];
        HEAPF32[eyeptr + 4] = view.projectionMatrix[4];
        HEAPF32[eyeptr + 5] = view.projectionMatrix[5];
        HEAPF32[eyeptr + 6] = view.projectionMatrix[6];
        HEAPF32[eyeptr + 7] = view.projectionMatrix[7];
        HEAPF32[eyeptr + 8] = view.projectionMatrix[8];
        HEAPF32[eyeptr + 9] = view.projectionMatrix[9];
        HEAPF32[eyeptr + 10] = view.projectionMatrix[10];
        HEAPF32[eyeptr + 11] = view.projectionMatrix[11];
        HEAPF32[eyeptr + 12] = view.projectionMatrix[12];
        HEAPF32[eyeptr + 13] = view.projectionMatrix[13];
        HEAPF32[eyeptr + 14] = view.projectionMatrix[14];
        HEAPF32[eyeptr + 15] = view.projectionMatrix[15];
        eyeptr += 16;
        HEAPF32[eyeptr + 0] = view.transform.matrix[0];
        HEAPF32[eyeptr + 1] = view.transform.matrix[1];
        HEAPF32[eyeptr + 2] = view.transform.matrix[2];
        HEAPF32[eyeptr + 3] = view.transform.matrix[3];
        HEAPF32[eyeptr + 4] = view.transform.matrix[4];
        HEAPF32[eyeptr + 5] = view.transform.matrix[5];
        HEAPF32[eyeptr + 6] = view.transform.matrix[6];
        HEAPF32[eyeptr + 7] = view.transform.matrix[7];
        HEAPF32[eyeptr + 8] = view.transform.matrix[8];
        HEAPF32[eyeptr + 9] = view.transform.matrix[9];
        HEAPF32[eyeptr + 10] = view.transform.matrix[10];
        HEAPF32[eyeptr + 11] = view.transform.matrix[11];
        HEAPF32[eyeptr + 12] = view.transform.matrix[12];
        HEAPF32[eyeptr + 13] = view.transform.matrix[13];
        HEAPF32[eyeptr + 14] = view.transform.matrix[14];
        HEAPF32[eyeptr + 15] = view.transform.matrix[15];
        eyeptr += 16;
        e++
    }
    return e
}
function _emscriptenfte_xr_isactive() {
    var ret = 0;
    if (FTEC.xrsession != null) {
        ret |= 1;
        const pose = FTEC.xrframe.getViewerPose(FTEC.referenceSpace);
        if (pose.views.length)
            ret |= 2
    }
    return ret
}
function _emscriptenfte_xr_issupported() {
    if (navigator.xr)
        return FTEC.xrsupport;
    return 0
}
function _emscriptenfte_xr_setup(mode) {
    if (mode == -3)
        mode = FTEC.xrsession != null ? -1 : -2;
    if (mode == -2) {
        if (FTEC.xrsupport & 1 << 2)
            mode = 2;
        else if (FTEC.xrsupport & 1 << 1)
            mode = 1;
        else if (FTEC.xrsupport & 1 << 0)
            mode = 0
    }
    if (mode == -1)
        _emscriptenfte_xr_shutdown();
    else if (FTEC.xrsession == null && navigator.xr && mode >= 0 && mode < 3) {
        const modes = ["inline", "immersive-vr", "immersive-ar"];
        navigator.xr.requestSession(modes[mode], {
            optionalFeatures: ["local"]
        }).then(session => {
            FTEC.xrsession = session;
            session.addEventListener("end", () => {
                console.log("Session ended");
                _emscriptenfte_xr_shutdown()
            }
            );
            session.addEventListener("inputsourcechange", e => {
                console.log("inputsourcechange", e)
            }
            );
            session.addEventListener("select", e => {
                console.log("select", e)
            }
            );
            session.addEventListener("selectstart", e => {
                console.log("selectstart", e)
            }
            );
            session.addEventListener("selectend", e => {
                console.log("selectend", e)
            }
            );
            session.addEventListener("squeeze", e => {
                console.log("squeeze", e)
            }
            );
            session.addEventListener("squeezestart", e => {
                console.log("squeezestart", e)
            }
            );
            session.addEventListener("squeezeend", e => {
                console.log("squeezeend", e)
            }
            );
            var madecompatible = function() {
                session.updateRenderState({
                    baseLayer: new XRWebGLLayer(session,Module.ctx),
                    depthFar: 8192,
                    depthNear: 1
                });
                session.requestReferenceSpace("local").then(refspace => {
                    FTEC.referenceSpace = refspace;
                    FTEC.xrsession.requestAnimationFrame(FTEC.doxrframe)
                }
                ).catch(e => {
                    session.requestReferenceSpace("viewer").then(refspace => {
                        FTEC.referenceSpace = refspace;
                        FTEC.xrsession.requestAnimationFrame(FTEC.doxrframe)
                    }
                    ).catch(e => {
                        console.error("requestReferenceSpace", e);
                        _emscriptenfte_xr_shutdown()
                    }
                    )
                }
                )
            };
            if (mode == 0)
                madecompatible();
            else
                Module.ctx.makeXRCompatible().then(madecompatible).catch(e => {
                    console.error("makeXRCompatible", e);
                    _emscriptenfte_xr_shutdown()
                }
                )
        }
        ).catch(e => {
            console.error("requestSession", e);
            _emscriptenfte_xr_shutdown()
        }
        );
        return true
    }
    return false
}
function _emscriptenfte_xr_shutdown() {
    if (FTEC.xrfbo) {
        GL.framebuffers[FTEC.xrfbo] = null;
        FTEC.xrfbo = 0
    }
    if (FTEC.xrsession) {
        FTEC.xrsession.end();
        FTEC.xrsession = null
    }
    FTEC.xrframe = null
}
function _emscritenfte_buf_enumerate(cb, ctx, sz) {
    var n = Object.keys(FTEH.f);
    var c = n.length, i;
    for (i = 0; i < c; i++) {
        stringToUTF8(n[i], ctx, sz);
        getWasmTableEntry(cb)(ctx, FTEH.f[n[i]].l)
    }
}
var ENV = {};
function getExecutableName() {
    return thisProgram || "./this.program"
}
function getEnvStrings() {
    if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
        var env = {
            "USER": "web_user",
            "LOGNAME": "web_user",
            "PATH": "/",
            "PWD": "/",
            "HOME": "/home/web_user",
            "LANG": lang,
            "_": getExecutableName()
        };
        for (var x in ENV) {
            if (ENV[x] === undefined)
                delete env[x];
            else
                env[x] = ENV[x]
        }
        var strings = [];
        for (var x in env) {
            strings.push(x + "=" + env[x])
        }
        getEnvStrings.strings = strings
    }
    return getEnvStrings.strings
}
function _environ_get(__environ, environ_buf) {
    var bufSize = 0;
    getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAP32[__environ + i * 4 >> 2] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1
    });
    return 0
}
function _environ_sizes_get(penviron_count, penviron_buf_size) {
    var strings = getEnvStrings();
    HEAP32[penviron_count >> 2] = strings.length;
    var bufSize = 0;
    strings.forEach(function(string) {
        bufSize += string.length + 1
    });
    HEAP32[penviron_buf_size >> 2] = bufSize;
    return 0
}
function _fd_write(fd, iov, iovcnt, pnum) {
    var num = 0;
    for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[iov >> 2];
        var len = HEAP32[iov + 4 >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
            SYSCALLS.printChar(fd, HEAPU8[ptr + j])
        }
        num += len
    }
    HEAP32[pnum >> 2] = num;
    return 0
}
function __webgl_enable_ANGLE_instanced_arrays(ctx) {
    var ext = ctx.getExtension("ANGLE_instanced_arrays");
    if (ext) {
        ctx["vertexAttribDivisor"] = function(index, divisor) {
            ext["vertexAttribDivisorANGLE"](index, divisor)
        }
        ;
        ctx["drawArraysInstanced"] = function(mode, first, count, primcount) {
            ext["drawArraysInstancedANGLE"](mode, first, count, primcount)
        }
        ;
        ctx["drawElementsInstanced"] = function(mode, count, type, indices, primcount) {
            ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount)
        }
        ;
        return 1
    }
}
function __webgl_enable_OES_vertex_array_object(ctx) {
    var ext = ctx.getExtension("OES_vertex_array_object");
    if (ext) {
        ctx["createVertexArray"] = function() {
            return ext["createVertexArrayOES"]()
        }
        ;
        ctx["deleteVertexArray"] = function(vao) {
            ext["deleteVertexArrayOES"](vao)
        }
        ;
        ctx["bindVertexArray"] = function(vao) {
            ext["bindVertexArrayOES"](vao)
        }
        ;
        ctx["isVertexArray"] = function(vao) {
            return ext["isVertexArrayOES"](vao)
        }
        ;
        return 1
    }
}
function __webgl_enable_WEBGL_draw_buffers(ctx) {
    var ext = ctx.getExtension("WEBGL_draw_buffers");
    if (ext) {
        ctx["drawBuffers"] = function(n, bufs) {
            ext["drawBuffersWEBGL"](n, bufs)
        }
        ;
        return 1
    }
}
function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(ctx) {
    return !!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"))
}
function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(ctx) {
    return !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"))
}
function __webgl_enable_WEBGL_multi_draw(ctx) {
    return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"))
}
var GL = {
    counter: 1,
    buffers: [],
    programs: [],
    framebuffers: [],
    renderbuffers: [],
    textures: [],
    shaders: [],
    vaos: [],
    contexts: [],
    offscreenCanvases: {},
    queries: [],
    samplers: [],
    transformFeedbacks: [],
    syncs: [],
    stringCache: {},
    stringiCache: {},
    unpackAlignment: 4,
    recordError: function recordError(errorCode) {
        if (!GL.lastError) {
            GL.lastError = errorCode
        }
    },
    getNewId: function(table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
            table[i] = null
        }
        return ret
    },
    getSource: function(shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
            var len = length ? HEAP32[length + i * 4 >> 2] : -1;
            source += UTF8ToString(HEAP32[string + i * 4 >> 2], len < 0 ? undefined : len)
        }
        return source
    },
    createContext: function(canvas, webGLContextAttributes) {
        if (!canvas.getContextSafariWebGL2Fixed) {
            canvas.getContextSafariWebGL2Fixed = canvas.getContext;
            function fixedGetContext(ver, attrs) {
                var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
                return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null
            }
            canvas.getContext = fixedGetContext
        }
        var ctx = webGLContextAttributes.majorVersion > 1 ? canvas.getContext("webgl2", webGLContextAttributes) : canvas.getContext("webgl", webGLContextAttributes);
        if (!ctx)
            return 0;
        var handle = GL.registerContext(ctx, webGLContextAttributes);
        return handle
    },
    registerContext: function(ctx, webGLContextAttributes) {
        var handle = GL.getNewId(GL.contexts);
        var context = {
            handle: handle,
            attributes: webGLContextAttributes,
            version: webGLContextAttributes.majorVersion,
            GLctx: ctx
        };
        if (ctx.canvas)
            ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
            GL.initExtensions(context)
        }
        return handle
    },
    makeContextCurrent: function(contextHandle) {
        GL.currentContext = GL.contexts[contextHandle];
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
        return !(contextHandle && !GLctx)
    },
    getContext: function(contextHandle) {
        return GL.contexts[contextHandle]
    },
    deleteContext: function(contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle])
            GL.currentContext = null;
        if (typeof JSEvents == "object")
            JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas)
            GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        GL.contexts[contextHandle] = null
    },
    initExtensions: function(context) {
        if (!context)
            context = GL.currentContext;
        if (context.initExtensionsDone)
            return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        __webgl_enable_ANGLE_instanced_arrays(GLctx);
        __webgl_enable_OES_vertex_array_object(GLctx);
        __webgl_enable_WEBGL_draw_buffers(GLctx);
        __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
        __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
        if (context.version >= 2) {
            GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2")
        }
        if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
            GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query")
        }
        __webgl_enable_WEBGL_multi_draw(GLctx);
        var exts = GLctx.getSupportedExtensions() || [];
        exts.forEach(function(ext) {
            if (!ext.includes("lose_context") && !ext.includes("debug")) {
                GLctx.getExtension(ext)
            }
        })
    }
};
function _glActiveTexture(x0) {
    GLctx["activeTexture"](x0)
}
function _glAttachShader(program, shader) {
    GLctx.attachShader(GL.programs[program], GL.shaders[shader])
}
function _glBindAttribLocation(program, index, name) {
    GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name))
}
function _glBindBuffer(target, buffer) {
    if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer
    } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer
    }
    GLctx.bindBuffer(target, GL.buffers[buffer])
}
function _glBindFramebuffer(target, framebuffer) {
    GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer])
}
function _glBindRenderbuffer(target, renderbuffer) {
    GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer])
}
function _glBindTexture(target, texture) {
    GLctx.bindTexture(target, GL.textures[texture])
}
function _glBlendFunc(x0, x1) {
    GLctx["blendFunc"](x0, x1)
}
function _glBufferData(target, size, data, usage) {
    if (GL.currentContext.version >= 2) {
        if (data) {
            GLctx.bufferData(target, HEAPU8, usage, data, size)
        } else {
            GLctx.bufferData(target, size, usage)
        }
    } else {
        GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage)
    }
}
function _glBufferSubData(target, offset, size, data) {
    if (GL.currentContext.version >= 2) {
        GLctx.bufferSubData(target, offset, HEAPU8, data, size);
        return
    }
    GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
}
function _glCheckFramebufferStatus(x0) {
    return GLctx["checkFramebufferStatus"](x0)
}
function _glClear(x0) {
    GLctx["clear"](x0)
}
function _glClearColor(x0, x1, x2, x3) {
    GLctx["clearColor"](x0, x1, x2, x3)
}
function _glClearStencil(x0) {
    GLctx["clearStencil"](x0)
}
function _glColorMask(red, green, blue, alpha) {
    GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
}
function _glCompileShader(shader) {
    GLctx.compileShader(GL.shaders[shader])
}
function _glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, imageSize, data)
        } else {
            GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, HEAPU8, data, imageSize)
        }
        return
    }
    GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null)
}
function _glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, imageSize, data)
        } else {
            GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize)
        }
        return
    }
    GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null)
}
function _glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
}
function _glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
}
function _glCreateProgram() {
    var id = GL.getNewId(GL.programs);
    var program = GLctx.createProgram();
    program.name = id;
    program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
    program.uniformIdCounter = 1;
    GL.programs[id] = program;
    return id
}
function _glCreateShader(shaderType) {
    var id = GL.getNewId(GL.shaders);
    GL.shaders[id] = GLctx.createShader(shaderType);
    return id
}
function _glCullFace(x0) {
    GLctx["cullFace"](x0)
}
function _glDeleteBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[buffers + i * 4 >> 2];
        var buffer = GL.buffers[id];
        if (!buffer)
            continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GLctx.currentPixelPackBufferBinding)
            GLctx.currentPixelPackBufferBinding = 0;
        if (id == GLctx.currentPixelUnpackBufferBinding)
            GLctx.currentPixelUnpackBufferBinding = 0
    }
}
function _glDeleteFramebuffers(n, framebuffers) {
    for (var i = 0; i < n; ++i) {
        var id = HEAP32[framebuffers + i * 4 >> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer)
            continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null
    }
}
function _glDeleteProgram(id) {
    if (!id)
        return;
    var program = GL.programs[id];
    if (!program) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteProgram(program);
    program.name = 0;
    GL.programs[id] = null
}
function _glDeleteRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[renderbuffers + i * 4 >> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer)
            continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null
    }
}
function _glDeleteShader(id) {
    if (!id)
        return;
    var shader = GL.shaders[id];
    if (!shader) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteShader(shader);
    GL.shaders[id] = null
}
function _glDeleteTextures(n, textures) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[textures + i * 4 >> 2];
        var texture = GL.textures[id];
        if (!texture)
            continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null
    }
}
function _glDepthFunc(x0) {
    GLctx["depthFunc"](x0)
}
function _glDepthMask(flag) {
    GLctx.depthMask(!!flag)
}
function _glDisable(x0) {
    GLctx["disable"](x0)
}
function _glDisableVertexAttribArray(index) {
    GLctx.disableVertexAttribArray(index)
}
function _glDrawArrays(mode, first, count) {
    GLctx.drawArrays(mode, first, count)
}
function _glDrawElements(mode, count, type, indices) {
    GLctx.drawElements(mode, count, type, indices)
}
function _glEnable(x0) {
    GLctx["enable"](x0)
}
function _glEnableVertexAttribArray(index) {
    GLctx.enableVertexAttribArray(index)
}
function _glFinish() {
    GLctx["finish"]()
}
function _glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
    GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer])
}
function _glFramebufferTexture2D(target, attachment, textarget, texture, level) {
    GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level)
}
function __glGenObject(n, buffers, createFunction, objectTable) {
    for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]();
        var id = buffer && GL.getNewId(objectTable);
        if (buffer) {
            buffer.name = id;
            objectTable[id] = buffer
        } else {
            GL.recordError(1282)
        }
        HEAP32[buffers + i * 4 >> 2] = id
    }
}
function _glGenBuffers(n, buffers) {
    __glGenObject(n, buffers, "createBuffer", GL.buffers)
}
function _glGenFramebuffers(n, ids) {
    __glGenObject(n, ids, "createFramebuffer", GL.framebuffers)
}
function _glGenRenderbuffers(n, renderbuffers) {
    __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers)
}
function _glGenTextures(n, textures) {
    __glGenObject(n, textures, "createTexture", GL.textures)
}
function _glGenerateMipmap(x0) {
    GLctx["generateMipmap"](x0)
}
function _glGetAttribLocation(program, name) {
    return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name))
}
function _glGetError() {
    var error = GLctx.getError() || GL.lastError;
    GL.lastError = 0;
    return error
}
function writeI53ToI64(ptr, num) {
    HEAPU32[ptr >> 2] = num;
    HEAPU32[ptr + 4 >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296
}
function emscriptenWebGLGet(name_, p, type) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    var ret = undefined;
    switch (name_) {
    case 36346:
        ret = 1;
        break;
    case 36344:
        if (type != 0 && type != 1) {
            GL.recordError(1280)
        }
        return;
    case 34814:
    case 36345:
        ret = 0;
        break;
    case 34466:
        var formats = GLctx.getParameter(34467);
        ret = formats ? formats.length : 0;
        break;
    case 33309:
        if (GL.currentContext.version < 2) {
            GL.recordError(1282);
            return
        }
        var exts = GLctx.getSupportedExtensions() || [];
        ret = 2 * exts.length;
        break;
    case 33307:
    case 33308:
        if (GL.currentContext.version < 2) {
            GL.recordError(1280);
            return
        }
        ret = name_ == 33307 ? 3 : 0;
        break
    }
    if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
        case "number":
            ret = result;
            break;
        case "boolean":
            ret = result ? 1 : 0;
            break;
        case "string":
            GL.recordError(1280);
            return;
        case "object":
            if (result === null) {
                switch (name_) {
                case 34964:
                case 35725:
                case 34965:
                case 36006:
                case 36007:
                case 32873:
                case 34229:
                case 36662:
                case 36663:
                case 35053:
                case 35055:
                case 36010:
                case 35097:
                case 35869:
                case 32874:
                case 36389:
                case 35983:
                case 35368:
                case 34068:
                    {
                        ret = 0;
                        break
                    }
                default:
                    {
                        GL.recordError(1280);
                        return
                    }
                }
            } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                for (var i = 0; i < result.length; ++i) {
                    switch (type) {
                    case 0:
                        HEAP32[p + i * 4 >> 2] = result[i];
                        break;
                    case 2:
                        HEAPF32[p + i * 4 >> 2] = result[i];
                        break;
                    case 4:
                        HEAP8[p + i >> 0] = result[i] ? 1 : 0;
                        break
                    }
                }
                return
            } else {
                try {
                    ret = result.name | 0
                } catch (e) {
                    GL.recordError(1280);
                    err("GL_INVALID_ENUM in glGet" + type + "v: Unknown object returned from WebGL getParameter(" + name_ + ")! (error: " + e + ")");
                    return
                }
            }
            break;
        default:
            GL.recordError(1280);
            err("GL_INVALID_ENUM in glGet" + type + "v: Native code calling glGet" + type + "v(" + name_ + ") and it returns " + result + " of type " + typeof result + "!");
            return
        }
    }
    switch (type) {
    case 1:
        writeI53ToI64(p, ret);
        break;
    case 0:
        HEAP32[p >> 2] = ret;
        break;
    case 2:
        HEAPF32[p >> 2] = ret;
        break;
    case 4:
        HEAP8[p >> 0] = ret ? 1 : 0;
        break
    }
}
function _glGetIntegerv(name_, p) {
    emscriptenWebGLGet(name_, p, 0)
}
function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
    var log = GLctx.getProgramInfoLog(GL.programs[program]);
    if (log === null)
        log = "(unknown error)";
    var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length)
        HEAP32[length >> 2] = numBytesWrittenExclNull
}
function _glGetProgramiv(program, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (program >= GL.counter) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(program);
        if (log === null)
            log = "(unknown error)";
        HEAP32[p >> 2] = log.length + 1
    } else if (pname == 35719) {
        if (!program.maxUniformLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
                program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1)
            }
        }
        HEAP32[p >> 2] = program.maxUniformLength
    } else if (pname == 35722) {
        if (!program.maxAttributeLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35721); ++i) {
                program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1)
            }
        }
        HEAP32[p >> 2] = program.maxAttributeLength
    } else if (pname == 35381) {
        if (!program.maxUniformBlockNameLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35382); ++i) {
                program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1)
            }
        }
        HEAP32[p >> 2] = program.maxUniformBlockNameLength
    } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname)
    }
}
function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null)
        log = "(unknown error)";
    var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length)
        HEAP32[length >> 2] = numBytesWrittenExclNull
}
function _glGetShaderSource(shader, bufSize, length, source) {
    var result = GLctx.getShaderSource(GL.shaders[shader]);
    if (!result)
        return;
    var numBytesWrittenExclNull = bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0;
    if (length)
        HEAP32[length >> 2] = numBytesWrittenExclNull
}
function _glGetShaderiv(shader, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null)
            log = "(unknown error)";
        var logLength = log ? log.length + 1 : 0;
        HEAP32[p >> 2] = logLength
    } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[p >> 2] = sourceLength
    } else {
        HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname)
    }
}
function stringToNewUTF8(jsString) {
    var length = lengthBytesUTF8(jsString) + 1;
    var cString = _malloc(length);
    stringToUTF8(jsString, cString, length);
    return cString
}
function _glGetString(name_) {
    var ret = GL.stringCache[name_];
    if (!ret) {
        switch (name_) {
        case 7939:
            var exts = GLctx.getSupportedExtensions() || [];
            exts = exts.concat(exts.map(function(e) {
                return "GL_" + e
            }));
            ret = stringToNewUTF8(exts.join(" "));
            break;
        case 7936:
        case 7937:
        case 37445:
        case 37446:
            var s = GLctx.getParameter(name_);
            if (!s) {
                GL.recordError(1280)
            }
            ret = s && stringToNewUTF8(s);
            break;
        case 7938:
            var glVersion = GLctx.getParameter(7938);
            if (GL.currentContext.version >= 2)
                glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
            else {
                glVersion = "OpenGL ES 2.0 (" + glVersion + ")"
            }
            ret = stringToNewUTF8(glVersion);
            break;
        case 35724:
            var glslVersion = GLctx.getParameter(35724);
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
                if (ver_num[1].length == 3)
                    ver_num[1] = ver_num[1] + "0";
                glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
            }
            ret = stringToNewUTF8(glslVersion);
            break;
        default:
            GL.recordError(1280)
        }
        GL.stringCache[name_] = ret
    }
    return ret
}
function jstoi_q(str) {
    return parseInt(str)
}
function webglGetLeftBracePos(name) {
    return name.slice(-1) == "]" && name.lastIndexOf("[")
}
function webglPrepareUniformLocationsBeforeFirstUse(program) {
    var uniformLocsById = program.uniformLocsById, uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, i, j;
    if (!uniformLocsById) {
        program.uniformLocsById = uniformLocsById = {};
        program.uniformArrayNamesById = {};
        for (i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
            var u = GLctx.getActiveUniform(program, i);
            var nm = u.name;
            var sz = u.size;
            var lb = webglGetLeftBracePos(nm);
            var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
            var id = program.uniformIdCounter;
            program.uniformIdCounter += sz;
            uniformSizeAndIdsByName[arrayName] = [sz, id];
            for (j = 0; j < sz; ++j) {
                uniformLocsById[id] = j;
                program.uniformArrayNamesById[id++] = arrayName
            }
        }
    }
}
function _glGetUniformLocation(program, name) {
    name = UTF8ToString(name);
    if (program = GL.programs[program]) {
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var uniformLocsById = program.uniformLocsById;
        var arrayIndex = 0;
        var uniformBaseName = name;
        var leftBrace = webglGetLeftBracePos(name);
        if (leftBrace > 0) {
            arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
            uniformBaseName = name.slice(0, leftBrace)
        }
        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
        if (sizeAndId && arrayIndex < sizeAndId[0]) {
            arrayIndex += sizeAndId[1];
            if (uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name)) {
                return arrayIndex
            }
        }
    } else {
        GL.recordError(1281)
    }
    return -1
}
function _glLinkProgram(program) {
    program = GL.programs[program];
    GLctx.linkProgram(program);
    program.uniformLocsById = 0;
    program.uniformSizeAndIdsByName = {}
}
function _glPixelStorei(pname, param) {
    if (pname == 3317) {
        GL.unpackAlignment = param
    }
    GLctx.pixelStorei(pname, param)
}
function _glPolygonOffset(x0, x1) {
    GLctx["polygonOffset"](x0, x1)
}
function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
    function roundedToNextMultipleOf(x, y) {
        return x + y - 1 & -y
    }
    var plainRowSize = width * sizePerPixel;
    var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
    return height * alignedRowSize
}
function __colorChannelsInGlTextureFormat(format) {
    var colorChannels = {
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4,
        26917: 2,
        26918: 2,
        29846: 3,
        29847: 4
    };
    return colorChannels[format - 6402] || 1
}
function heapObjectForWebGLType(type) {
    type -= 5120;
    if (type == 0)
        return HEAP8;
    if (type == 1)
        return HEAPU8;
    if (type == 2)
        return HEAP16;
    if (type == 4)
        return HEAP32;
    if (type == 6)
        return HEAPF32;
    if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782)
        return HEAPU32;
    return HEAPU16
}
function heapAccessShiftForWebGLHeap(heap) {
    return 31 - Math.clz32(heap.BYTES_PER_ELEMENT)
}
function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
    var heap = heapObjectForWebGLType(type);
    var shift = heapAccessShiftForWebGLHeap(heap);
    var byteSize = 1 << shift;
    var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
    var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
    return heap.subarray(pixels >> shift, pixels + bytes >> shift)
}
function _glReadPixels(x, y, width, height, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelPackBufferBinding) {
            GLctx.readPixels(x, y, width, height, format, type, pixels)
        } else {
            var heap = heapObjectForWebGLType(type);
            GLctx.readPixels(x, y, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
        }
        return
    }
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
    if (!pixelData) {
        GL.recordError(1280);
        return
    }
    GLctx.readPixels(x, y, width, height, format, type, pixelData)
}
function _glRenderbufferStorage(x0, x1, x2, x3) {
    GLctx["renderbufferStorage"](x0, x1, x2, x3)
}
function _glScissor(x0, x1, x2, x3) {
    GLctx["scissor"](x0, x1, x2, x3)
}
function _glShaderSource(shader, count, string, length) {
    var source = GL.getSource(shader, count, string, length);
    GLctx.shaderSource(GL.shaders[shader], source)
}
function _glStencilFunc(x0, x1, x2) {
    GLctx["stencilFunc"](x0, x1, x2)
}
function _glStencilOpSeparate(x0, x1, x2, x3) {
    GLctx["stencilOpSeparate"](x0, x1, x2, x3)
}
function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels)
        } else if (pixels) {
            var heap = heapObjectForWebGLType(type);
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
        } else {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null)
        }
        return
    }
    GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null)
}
function _glTexParameterf(x0, x1, x2) {
    GLctx["texParameterf"](x0, x1, x2)
}
function _glTexParameteri(x0, x1, x2) {
    GLctx["texParameteri"](x0, x1, x2)
}
function _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels)
        } else if (pixels) {
            var heap = heapObjectForWebGLType(type);
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
        } else {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null)
        }
        return
    }
    var pixelData = null;
    if (pixels)
        pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
    GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData)
}
function webglGetUniformLocation(location) {
    var p = GLctx.currentProgram;
    if (p) {
        var webglLoc = p.uniformLocsById[location];
        if (typeof webglLoc == "number") {
            p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? "[" + webglLoc + "]" : ""))
        }
        return webglLoc
    } else {
        GL.recordError(1282)
    }
}
function _glUniform1f(location, v0) {
    GLctx.uniform1f(webglGetUniformLocation(location), v0)
}
function _glUniform1i(location, v0) {
    GLctx.uniform1i(webglGetUniformLocation(location), v0)
}
var miniTempWebGLFloatBuffers = [];
function _glUniform2fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        GLctx.uniform2fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 2);
        return
    }
    if (count <= 144) {
        var view = miniTempWebGLFloatBuffers[2 * count - 1];
        for (var i = 0; i < 2 * count; i += 2) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2)
    }
    GLctx.uniform2fv(webglGetUniformLocation(location), view)
}
function _glUniform3f(location, v0, v1, v2) {
    GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2)
}
function _glUniform3fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        GLctx.uniform3fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 3);
        return
    }
    if (count <= 96) {
        var view = miniTempWebGLFloatBuffers[3 * count - 1];
        for (var i = 0; i < 3 * count; i += 3) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2)
    }
    GLctx.uniform3fv(webglGetUniformLocation(location), view)
}
function _glUniform4f(location, v0, v1, v2, v3) {
    GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3)
}
function _glUniform4fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
        GLctx.uniform4fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 4);
        return
    }
    if (count <= 72) {
        var view = miniTempWebGLFloatBuffers[4 * count - 1];
        var heap = HEAPF32;
        value >>= 2;
        for (var i = 0; i < 4 * count; i += 4) {
            var dst = value + i;
            view[i] = heap[dst];
            view[i + 1] = heap[dst + 1];
            view[i + 2] = heap[dst + 2];
            view[i + 3] = heap[dst + 3]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniform4fv(webglGetUniformLocation(location), view)
}
function _glUniformMatrix3fv(location, count, transpose, value) {
    if (GL.currentContext.version >= 2) {
        GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 9);
        return
    }
    if (count <= 32) {
        var view = miniTempWebGLFloatBuffers[9 * count - 1];
        for (var i = 0; i < 9 * count; i += 9) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
            view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
            view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
            view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
            view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
            view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2)
    }
    GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view)
}
function _glUniformMatrix4fv(location, count, transpose, value) {
    if (GL.currentContext.version >= 2) {
        GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 16);
        return
    }
    if (count <= 18) {
        var view = miniTempWebGLFloatBuffers[16 * count - 1];
        var heap = HEAPF32;
        value >>= 2;
        for (var i = 0; i < 16 * count; i += 16) {
            var dst = value + i;
            view[i] = heap[dst];
            view[i + 1] = heap[dst + 1];
            view[i + 2] = heap[dst + 2];
            view[i + 3] = heap[dst + 3];
            view[i + 4] = heap[dst + 4];
            view[i + 5] = heap[dst + 5];
            view[i + 6] = heap[dst + 6];
            view[i + 7] = heap[dst + 7];
            view[i + 8] = heap[dst + 8];
            view[i + 9] = heap[dst + 9];
            view[i + 10] = heap[dst + 10];
            view[i + 11] = heap[dst + 11];
            view[i + 12] = heap[dst + 12];
            view[i + 13] = heap[dst + 13];
            view[i + 14] = heap[dst + 14];
            view[i + 15] = heap[dst + 15]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2)
    }
    GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view)
}
function _glUseProgram(program) {
    program = GL.programs[program];
    GLctx.useProgram(program);
    GLctx.currentProgram = program
}
function _glVertexAttrib4f(x0, x1, x2, x3, x4) {
    GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4)
}
function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
    GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
}
function _glViewport(x0, x1, x2, x3) {
    GLctx["viewport"](x0, x1, x2, x3)
}
function __isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}
function __arraySum(array, index) {
    var sum = 0;
    for (var i = 0; i <= index; sum += array[i++]) {}
    return sum
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function __addDays(date, days) {
    var newDate = new Date(date.getTime());
    while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1)
            } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1)
            }
        } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate
        }
    }
    return newDate
}
function _strftime(s, maxsize, format, tm) {
    var tm_zone = HEAP32[tm + 40 >> 2];
    var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[tm + 4 >> 2],
        tm_hour: HEAP32[tm + 8 >> 2],
        tm_mday: HEAP32[tm + 12 >> 2],
        tm_mon: HEAP32[tm + 16 >> 2],
        tm_year: HEAP32[tm + 20 >> 2],
        tm_wday: HEAP32[tm + 24 >> 2],
        tm_yday: HEAP32[tm + 28 >> 2],
        tm_isdst: HEAP32[tm + 32 >> 2],
        tm_gmtoff: HEAP32[tm + 36 >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
    };
    for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule,"g"), EXPANSION_RULES_1[rule])
    }
    var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function leadingSomething(value, digits, character) {
        var str = typeof value == "number" ? value.toString() : value || "";
        while (str.length < digits) {
            str = character[0] + str
        }
        return str
    }
    function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0")
    }
    function compareByDay(date1, date2) {
        function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate())
            }
        }
        return compare
    }
    function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
        case 0:
            return new Date(janFourth.getFullYear() - 1,11,29);
        case 1:
            return janFourth;
        case 2:
            return new Date(janFourth.getFullYear(),0,3);
        case 3:
            return new Date(janFourth.getFullYear(),0,2);
        case 4:
            return new Date(janFourth.getFullYear(),0,1);
        case 5:
            return new Date(janFourth.getFullYear() - 1,11,31);
        case 6:
            return new Date(janFourth.getFullYear() - 1,11,30)
        }
    }
    function getWeekBasedYear(date) {
        var thisDate = __addDays(new Date(date.tm_year + 1900,0,1), date.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(),0,4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1,0,4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1
            } else {
                return thisDate.getFullYear()
            }
        } else {
            return thisDate.getFullYear() - 1
        }
    }
    var EXPANSION_RULES_2 = {
        "%a": function(date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3)
        },
        "%A": function(date) {
            return WEEKDAYS[date.tm_wday]
        },
        "%b": function(date) {
            return MONTHS[date.tm_mon].substring(0, 3)
        },
        "%B": function(date) {
            return MONTHS[date.tm_mon]
        },
        "%C": function(date) {
            var year = date.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2)
        },
        "%d": function(date) {
            return leadingNulls(date.tm_mday, 2)
        },
        "%e": function(date) {
            return leadingSomething(date.tm_mday, 2, " ")
        },
        "%g": function(date) {
            return getWeekBasedYear(date).toString().substring(2)
        },
        "%G": function(date) {
            return getWeekBasedYear(date)
        },
        "%H": function(date) {
            return leadingNulls(date.tm_hour, 2)
        },
        "%I": function(date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0)
                twelveHour = 12;
            else if (twelveHour > 12)
                twelveHour -= 12;
            return leadingNulls(twelveHour, 2)
        },
        "%j": function(date) {
            return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
        },
        "%m": function(date) {
            return leadingNulls(date.tm_mon + 1, 2)
        },
        "%M": function(date) {
            return leadingNulls(date.tm_min, 2)
        },
        "%n": function() {
            return "\n"
        },
        "%p": function(date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return "AM"
            } else {
                return "PM"
            }
        },
        "%S": function(date) {
            return leadingNulls(date.tm_sec, 2)
        },
        "%t": function() {
            return "\t"
        },
        "%u": function(date) {
            return date.tm_wday || 7
        },
        "%U": function(date) {
            var janFirst = new Date(date.tm_year + 1900,0,1);
            var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
            var endDate = new Date(date.tm_year + 1900,date.tm_mon,date.tm_mday);
            if (compareByDay(firstSunday, endDate) < 0) {
                var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
        },
        "%V": function(date) {
            var janFourthThisYear = new Date(date.tm_year + 1900,0,4);
            var janFourthNextYear = new Date(date.tm_year + 1901,0,4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            var endDate = __addDays(new Date(date.tm_year + 1900,0,1), date.tm_yday);
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                return "53"
            }
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                return "01"
            }
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate()
            } else {
                daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
            }
            return leadingNulls(Math.ceil(daysDifference / 7), 2)
        },
        "%w": function(date) {
            return date.tm_wday
        },
        "%W": function(date) {
            var janFirst = new Date(date.tm_year,0,1);
            var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
            var endDate = new Date(date.tm_year + 1900,date.tm_mon,date.tm_mday);
            if (compareByDay(firstMonday, endDate) < 0) {
                var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
        },
        "%y": function(date) {
            return (date.tm_year + 1900).toString().substring(2)
        },
        "%Y": function(date) {
            return date.tm_year + 1900
        },
        "%z": function(date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
        },
        "%Z": function(date) {
            return date.tm_zone
        },
        "%%": function() {
            return "%"
        }
    };
    pattern = pattern.replace(/%%/g, "\0\0");
    for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
            pattern = pattern.replace(new RegExp(rule,"g"), EXPANSION_RULES_2[rule](date))
        }
    }
    pattern = pattern.replace(/\0\0/g, "%");
    var bytes = intArrayFromString(pattern, false);
    if (bytes.length > maxsize) {
        return 0
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1
}
function _time(ptr) {
    var ret = Date.now() / 1e3 | 0;
    if (ptr) {
        HEAP32[ptr >> 2] = ret
    }
    return ret
}
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas) {
    Browser.requestFullscreen(lockPointer, resizeCanvas)
}
;
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
    Browser.requestAnimationFrame(func)
}
;
Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
    Browser.setCanvasSize(width, height, noUpdates)
}
;
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
    Browser.mainLoop.pause()
}
;
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
    Browser.mainLoop.resume()
}
;
Module["getUserMedia"] = function Module_getUserMedia() {
    Browser.getUserMedia()
}
;
Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
    return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes)
}
;
var GLctx;
var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
for (var i = 0; i < 288; ++i) {
    miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i + 1)
}
function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull)
        u8array.length = numBytesWritten;
    return u8array
}
var asmLibraryArg = {
    "Q": _Sys_Clipboard_PasteText,
    "k": _Sys_SaveClipboard,
    "Gb": ___syscall_getuid32,
    "Kb": __gmtime_js,
    "Lb": __localtime_js,
    "Mb": __mktime_js,
    "Nb": __tzset_js,
    "A": _alBufferData,
    "ac": _alBufferiv,
    "I": _alDeleteBuffers,
    "N": _alDeleteSources,
    "C": _alDistanceModel,
    "cc": _alDopplerFactor,
    "sa": _alGenBuffers,
    "va": _alGenSources,
    "W": _alGetError,
    "B": _alGetSourcei,
    "Z": _alGetString,
    "dc": _alIsBuffer,
    "_a": _alIsExtensionPresent,
    "Xa": _alIsSource,
    "ec": _alListenerf,
    "Y": _alListenerfv,
    "Ya": _alSourcePlay,
    "X": _alSourceQueueBuffers,
    "Wa": _alSourceStop,
    "Za": _alSourceUnqueueBuffers,
    "o": _alSourcef,
    "Va": _alSourcefv,
    "w": _alSourcei,
    "db": _alcCaptureCloseDevice,
    "hb": _alcCaptureOpenDevice,
    "fb": _alcCaptureSamples,
    "gb": _alcCaptureStart,
    "eb": _alcCaptureStop,
    "ta": _alcCloseDevice,
    "$a": _alcCreateContext,
    "cb": _alcDestroyContext,
    "Wb": _alcGetContextsDevice,
    "Xb": _alcGetCurrentContext,
    "Ub": _alcGetEnumValue,
    "Vb": _alcGetError,
    "_": _alcGetIntegerv,
    "x": _alcGetString,
    "ab": _alcIsExtensionPresent,
    "ua": _alcMakeContextCurrent,
    "bb": _alcOpenDevice,
    "Zb": _alcProcessContext,
    "Yb": _alcSuspendContext,
    "Ua": _clock,
    "Tb": _emscripten_alcDevicePauseSOFT,
    "Sb": _emscripten_alcDeviceResumeSOFT,
    "Rb": _emscripten_alcGetStringiSOFT,
    "Qb": _emscripten_alcResetDeviceSOFT,
    "O": _emscripten_asm_const_int,
    "Pb": _emscripten_console_error,
    "Ta": _emscripten_get_now,
    "Ob": _emscripten_memcpy_big,
    "Fb": _emscripten_resize_heap,
    "_b": _emscripten_run_script_string,
    "aa": _emscriptenfte_abortmainloop,
    "bc": _emscriptenfte_al_loadaudiofile,
    "sc": _emscriptenfte_alert,
    "tc": _emscriptenfte_async_wget_data2,
    "$": _emscriptenfte_buf_create,
    "pc": _emscriptenfte_buf_delete,
    "hc": _emscriptenfte_buf_getsize,
    "gc": _emscriptenfte_buf_open,
    "fc": _emscriptenfte_buf_pushtolocalstore,
    "jc": _emscriptenfte_buf_read,
    "kc": _emscriptenfte_buf_release,
    "oc": _emscriptenfte_buf_rename,
    "ic": _emscriptenfte_buf_write,
    "Hb": _emscriptenfte_gl_loadtexturefile,
    "lc": _emscriptenfte_openfile,
    "$b": _emscriptenfte_pcm_loadaudiofile,
    "mb": _emscriptenfte_polljoyevents,
    "rc": _emscriptenfte_print,
    "xa": _emscriptenfte_rtc_candidate,
    "uc": _emscriptenfte_rtc_create,
    "ya": _emscriptenfte_rtc_offer,
    "ob": _emscriptenfte_settitle,
    "Ba": _emscriptenfte_setupcanvas,
    "ib": _emscriptenfte_setupmainloop,
    "nb": _emscriptenfte_updatepointerlock,
    "qc": _emscriptenfte_uptime_ms,
    "mc": _emscriptenfte_window_location,
    "y": _emscriptenfte_ws_close,
    "ba": _emscriptenfte_ws_connect,
    "R": _emscriptenfte_ws_recv,
    "D": _emscriptenfte_ws_send,
    "lb": _emscriptenfte_xr_geteyeinfo,
    "Aa": _emscriptenfte_xr_isactive,
    "kb": _emscriptenfte_xr_issupported,
    "u": _emscriptenfte_xr_setup,
    "za": _emscriptenfte_xr_shutdown,
    "nc": _emscritenfte_buf_enumerate,
    "Ib": _environ_get,
    "Jb": _environ_sizes_get,
    "jb": _exit,
    "Sa": _fd_write,
    "Pa": _glActiveTexture,
    "L": _glAttachShader,
    "Ha": _glBindAttribLocation,
    "p": _glBindBuffer,
    "V": _glBindFramebuffer,
    "yb": _glBindRenderbuffer,
    "ra": _glBindTexture,
    "Bb": _glBlendFunc,
    "j": _glBufferData,
    "ja": _glBufferSubData,
    "Ja": _glCheckFramebufferStatus,
    "f": _glClear,
    "r": _glClearColor,
    "xb": _glClearStencil,
    "Qa": _glColorMask,
    "pb": _glCompileShader,
    "qa": _glCompressedTexImage2D,
    "Ra": _glCompressedTexSubImage2D,
    "fa": _glCopyTexImage2D,
    "vb": _glCopyTexSubImage2D,
    "tb": _glCreateProgram,
    "qb": _glCreateShader,
    "Na": _glCullFace,
    "J": _glDeleteBuffers,
    "La": _glDeleteFramebuffers,
    "Ga": _glDeleteProgram,
    "M": _glDeleteRenderbuffers,
    "E": _glDeleteShader,
    "wa": _glDeleteTextures,
    "G": _glDepthFunc,
    "ma": _glDepthMask,
    "e": _glDisable,
    "z": _glDisableVertexAttribArray,
    "vc": _glDrawArrays,
    "ub": _glDrawElements,
    "c": _glEnable,
    "Cb": _glEnableVertexAttribArray,
    "F": _glFinish,
    "la": _glFramebufferRenderbuffer,
    "U": _glFramebufferTexture2D,
    "v": _glGenBuffers,
    "Ma": _glGenFramebuffers,
    "zb": _glGenRenderbuffers,
    "q": _glGenTextures,
    "pa": _glGenerateMipmap,
    "Ca": _glGetAttribLocation,
    "ka": _glGetError,
    "m": _glGetIntegerv,
    "rb": _glGetProgramInfoLog,
    "da": _glGetProgramiv,
    "Ea": _glGetShaderInfoLog,
    "Da": _glGetShaderSource,
    "Fa": _glGetShaderiv,
    "K": _glGetString,
    "s": _glGetUniformLocation,
    "sb": _glLinkProgram,
    "Eb": _glPixelStorei,
    "na": _glPolygonOffset,
    "P": _glReadPixels,
    "Ka": _glRenderbufferStorage,
    "Ab": _glScissor,
    "ca": _glShaderSource,
    "ga": _glStencilFunc,
    "ea": _glStencilOpSeparate,
    "n": _glTexImage2D,
    "oa": _glTexParameterf,
    "a": _glTexParameteri,
    "H": _glTexSubImage2D,
    "T": _glUniform1f,
    "S": _glUniform1i,
    "ia": _glUniform2fv,
    "Ia": _glUniform3f,
    "g": _glUniform3fv,
    "ha": _glUniform4f,
    "l": _glUniform4fv,
    "wb": _glUniformMatrix3fv,
    "t": _glUniformMatrix4fv,
    "Oa": _glUseProgram,
    "Db": _glVertexAttrib4f,
    "h": _glVertexAttribPointer,
    "i": _glViewport,
    "d": _strftime,
    "b": _time
};
var asm = createWasm();
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
    return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["xc"]).apply(null, arguments)
}
;
var _malloc = Module["_malloc"] = function() {
    return (_malloc = Module["_malloc"] = Module["asm"]["zc"]).apply(null, arguments)
}
;
var _main = Module["_main"] = function() {
    return (_main = Module["_main"] = Module["asm"]["Ac"]).apply(null, arguments)
}
;
var _emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = function() {
    return (_emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = Module["asm"]["Bc"]).apply(null, arguments)
}
;
var _emscripten_builtin_free = Module["_emscripten_builtin_free"] = function() {
    return (_emscripten_builtin_free = Module["_emscripten_builtin_free"] = Module["asm"]["Cc"]).apply(null, arguments)
}
;
var stackAlloc = Module["stackAlloc"] = function() {
    return (stackAlloc = Module["stackAlloc"] = Module["asm"]["Dc"]).apply(null, arguments)
}
;
var calledRun;
function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}
var calledMain = false;
dependenciesFulfilled = function runCaller() {
    if (!calledRun)
        run();
    if (!calledRun)
        dependenciesFulfilled = runCaller
}
;
function callMain(args) {
    var entryFunction = Module["_main"];
    args = args || [];
    var argc = args.length + 1;
    var argv = stackAlloc((argc + 1) * 4);
    HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
    for (var i = 1; i < argc; i++) {
        HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1])
    }
    HEAP32[(argv >> 2) + argc] = 0;
    try {
        var ret = entryFunction(argc, argv);
        exit(ret, true);
        return ret
    } catch (e) {
        return handleException(e)
    } finally {
        calledMain = true
    }
}
function run(args) {
    args = args || arguments_;
    if (runDependencies > 0) {
        return
    }
    preRun();
    if (runDependencies > 0) {
        return
    }
    function doRun() {
        if (calledRun)
            return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT)
            return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"])
            Module["onRuntimeInitialized"]();
        if (shouldRunNow)
            callMain(args);
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
            setTimeout(function() {
                Module["setStatus"]("")
            }, 1);
            doRun()
        }, 1)
    } else {
        doRun()
    }
}
Module["run"] = run;
function exit(status, implicit) {
    EXITSTATUS = status;
    if (keepRuntimeAlive()) {} else {
        exitRuntime()
    }
    procExit(status)
}
function procExit(code) {
    EXITSTATUS = code;
    if (!keepRuntimeAlive()) {
        if (Module["onExit"])
            Module["onExit"](code);
        ABORT = true
    }
    quit_(code, new ExitStatus(code))
}
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
var shouldRunNow = true;
if (Module["noInitialRun"])
    shouldRunNow = false;
run();
