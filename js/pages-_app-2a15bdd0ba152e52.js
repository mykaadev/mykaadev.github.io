(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
            [888], {
                7228: function(e) {
                    e.exports = function(e, t) {
                        (null == t || t > e.length) && (t = e.length);
                        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
                        return n
                    }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                2858: function(e) { e.exports = function(e) { if (Array.isArray(e)) return e }, e.exports.__esModule = !0, e.exports.default = e.exports },
                1506: function(e) { e.exports = function(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e }, e.exports.__esModule = !0, e.exports.default = e.exports },
                8926: function(e) {
                    function t(e, t, r, n, o, a, i) {
                        try {
                            var s = e[a](i),
                                u = s.value
                        } catch (c) { return void r(c) }
                        s.done ? t(u) : Promise.resolve(u).then(n, o)
                    }
                    e.exports = function(e) {
                        return function() {
                            var r = this,
                                n = arguments;
                            return new Promise((function(o, a) {
                                var i = e.apply(r, n);

                                function s(e) { t(i, o, a, s, u, "next", e) }

                                function u(e) { t(i, o, a, s, u, "throw", e) }
                                s(void 0)
                            }))
                        }
                    }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                4575: function(e) { e.exports = function(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }, e.exports.__esModule = !0, e.exports.default = e.exports },
                9100: function(e, t, r) {
                    var n = r(9489),
                        o = r(7067);

                    function a(t, r, i) {
                        return o() ? (e.exports = a = Reflect.construct, e.exports.__esModule = !0, e.exports.default = e.exports) : (e.exports = a = function(e, t, r) {
                            var o = [null];
                            o.push.apply(o, t);
                            var a = new(Function.bind.apply(e, o));
                            return r && n(a, r.prototype), a
                        }, e.exports.__esModule = !0, e.exports.default = e.exports), a.apply(null, arguments)
                    }
                    e.exports = a, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                3913: function(e) {
                    function t(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var n = t[r];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    e.exports = function(e, r, n) { return r && t(e.prototype, r), n && t(e, n), Object.defineProperty(e, "prototype", { writable: !1 }), e }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                9713: function(e) { e.exports = function(e, t, r) { return t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e }, e.exports.__esModule = !0, e.exports.default = e.exports },
                9754: function(e) {
                    function t(r) { return e.exports = t = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) { return e.__proto__ || Object.getPrototypeOf(e) }, e.exports.__esModule = !0, e.exports.default = e.exports, t(r) }
                    e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                2205: function(e, t, r) {
                    var n = r(9489);
                    e.exports = function(e, t) {
                        if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                        e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && n(e, t)
                    }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                5318: function(e) { e.exports = function(e) { return e && e.__esModule ? e : { default: e } }, e.exports.__esModule = !0, e.exports.default = e.exports },
                430: function(e) { e.exports = function(e) { return -1 !== Function.toString.call(e).indexOf("[native code]") }, e.exports.__esModule = !0, e.exports.default = e.exports },
                7067: function(e) { e.exports = function() { if ("undefined" === typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" === typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0 } catch (e) { return !1 } }, e.exports.__esModule = !0, e.exports.default = e.exports },
                3884: function(e) {
                    e.exports = function(e, t) {
                        var r = null == e ? null : "undefined" !== typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                        if (null != r) {
                            var n, o, a = [],
                                i = !0,
                                s = !1;
                            try { for (r = r.call(e); !(i = (n = r.next()).done) && (a.push(n.value), !t || a.length !== t); i = !0); } catch (u) { s = !0, o = u } finally { try { i || null == r.return || r.return() } finally { if (s) throw o } }
                            return a
                        }
                    }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                521: function(e) { e.exports = function() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }, e.exports.__esModule = !0, e.exports.default = e.exports },
                8585: function(e, t, r) {
                    var n = r(8).default,
                        o = r(1506);
                    e.exports = function(e, t) { if (t && ("object" === n(t) || "function" === typeof t)) return t; if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined"); return o(e) }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                9489: function(e) {
                    function t(r, n) { return e.exports = t = Object.setPrototypeOf || function(e, t) { return e.__proto__ = t, e }, e.exports.__esModule = !0, e.exports.default = e.exports, t(r, n) }
                    e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                3038: function(e, t, r) {
                    var n = r(2858),
                        o = r(3884),
                        a = r(379),
                        i = r(521);
                    e.exports = function(e, t) { return n(e) || o(e, t) || a(e, t) || i() }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                8: function(e) {
                    function t(r) { return e.exports = t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) { return typeof e } : function(e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e }, e.exports.__esModule = !0, e.exports.default = e.exports, t(r) }
                    e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                379: function(e, t, r) {
                    var n = r(7228);
                    e.exports = function(e, t) { if (e) { if ("string" === typeof e) return n(e, t); var r = Object.prototype.toString.call(e).slice(8, -1); return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? n(e, t) : void 0 } }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                5957: function(e, t, r) {
                    var n = r(9754),
                        o = r(9489),
                        a = r(430),
                        i = r(9100);

                    function s(t) {
                        var r = "function" === typeof Map ? new Map : void 0;
                        return e.exports = s = function(e) {
                            if (null === e || !a(e)) return e;
                            if ("function" !== typeof e) throw new TypeError("Super expression must either be null or a function");
                            if ("undefined" !== typeof r) {
                                if (r.has(e)) return r.get(e);
                                r.set(e, t)
                            }

                            function t() { return i(e, arguments, n(this).constructor) }
                            return t.prototype = Object.create(e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), o(t, e)
                        }, e.exports.__esModule = !0, e.exports.default = e.exports, s(t)
                    }
                    e.exports = s, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                7757: function(e, t, r) { e.exports = r(5666) },
                9548: function(e, t, r) {
                    "use strict";
                    var n = r(5318);
                    Object.defineProperty(t, "__esModule", { value: !0 }), t.BroadcastChannel = function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "nextauth.message";
                        return {
                            receive: function(t) {
                                var r = function(r) { var n; if (r.key === e) { var o = JSON.parse(null !== (n = r.newValue) && void 0 !== n ? n : "{}"); "session" === (null === o || void 0 === o ? void 0 : o.event) && null !== o && void 0 !== o && o.data && t(o) } };
                                return window.addEventListener("storage", r),
                                    function() { return window.removeEventListener("storage", r) }
                            },
                            post: function(t) { "undefined" !== typeof window && localStorage.setItem(e, JSON.stringify(u(u({}, t), {}, { timestamp: f() }))) }
                        }
                    }, t.apiBaseUrl = l, t.fetchData = function(e, t, r) { return c.apply(this, arguments) }, t.now = f;
                    var o = n(r(7757)),
                        a = n(r(9713)),
                        i = n(r(8926));

                    function s(e, t) {
                        var r = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var n = Object.getOwnPropertySymbols(e);
                            t && (n = n.filter((function(t) { return Object.getOwnPropertyDescriptor(e, t).enumerable }))), r.push.apply(r, n)
                        }
                        return r
                    }

                    function u(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var r = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? s(Object(r), !0).forEach((function(t) {
                                (0, a.default)(e, t, r[t])
                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : s(Object(r)).forEach((function(t) { Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t)) }))
                        }
                        return e
                    }

                    function c() {
                        return c = (0, i.default)(o.default.mark((function e(t, r, n) {
                            var a, i, s, c, f, d, p, h = arguments;
                            return o.default.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return a = h.length > 3 && void 0 !== h[3] ? h[3] : {}, i = a.ctx, s = a.req, c = void 0 === s ? null === i || void 0 === i ? void 0 : i.req : s, e.prev = 1, f = null !== c && void 0 !== c && c.headers.cookie ? { headers: { cookie: c.headers.cookie } } : {}, e.next = 5, fetch("".concat(l(r), "/").concat(t), f);
                                    case 5:
                                        return d = e.sent, e.next = 8, d.json();
                                    case 8:
                                        if (p = e.sent, d.ok) { e.next = 11; break }
                                        throw p;
                                    case 11:
                                        return e.abrupt("return", Object.keys(p).length > 0 ? p : null);
                                    case 14:
                                        return e.prev = 14, e.t0 = e.catch(1), n.error("CLIENT_FETCH_ERROR", u({ error: e.t0, path: t }, c ? { header: c.headers } : {})), e.abrupt("return", null);
                                    case 18:
                                    case "end":
                                        return e.stop()
                                }
                            }), e, null, [
                                [1, 14]
                            ])
                        }))), c.apply(this, arguments)
                    }

                    function l(e) { return "undefined" === typeof window ? "".concat(e.baseUrlServer).concat(e.basePathServer) : e.basePath }

                    function f() { return Math.floor(Date.now() / 1e3) }
                },
                6925: function(e, t, r) {
                    "use strict";
                    var n = r(5318);
                    Object.defineProperty(t, "__esModule", { value: !0 }), t.UnsupportedStrategy = t.UnknownError = t.OAuthCallbackError = t.MissingSecret = t.MissingAuthorize = t.MissingAdapter = t.MissingAPIRoute = t.AccountNotLinkedError = void 0, t.adapterErrorHandler = function(e, t) {
                        if (!e) return;
                        return Object.keys(e).reduce((function(r, n) {
                            return r[n] = (0, a.default)(o.default.mark((function r() {
                                var a, i, s, u, c, l = arguments;
                                return o.default.wrap((function(r) {
                                    for (;;) switch (r.prev = r.next) {
                                        case 0:
                                            for (r.prev = 0, a = l.length, i = new Array(a), s = 0; s < a; s++) i[s] = l[s];
                                            return t.debug("adapter_".concat(n), { args: i }), u = e[n], r.next = 6, u.apply(void 0, i);
                                        case 6:
                                            return r.abrupt("return", r.sent);
                                        case 9:
                                            throw r.prev = 9, r.t0 = r.catch(0), t.error("adapter_error_".concat(n), r.t0), (c = new h(r.t0)).name = "".concat(O(n), "Error"), c;
                                        case 15:
                                        case "end":
                                            return r.stop()
                                    }
                                }), r, null, [
                                    [0, 9]
                                ])
                            }))), r
                        }), {})
                    }, t.capitalize = O, t.eventsErrorHandler = function(e, t) {
                        return Object.keys(e).reduce((function(r, n) {
                            return r[n] = (0, a.default)(o.default.mark((function r() {
                                var a, i = arguments;
                                return o.default.wrap((function(r) {
                                    for (;;) switch (r.prev = r.next) {
                                        case 0:
                                            return r.prev = 0, a = e[n], r.next = 4, a.apply(void 0, i);
                                        case 4:
                                            return r.abrupt("return", r.sent);
                                        case 7:
                                            r.prev = 7, r.t0 = r.catch(0), t.error("".concat(k(n), "_EVENT_ERROR"), r.t0);
                                        case 10:
                                        case "end":
                                            return r.stop()
                                    }
                                }), r, null, [
                                    [0, 7]
                                ])
                            }))), r
                        }), {})
                    }, t.upperSnake = k;
                    var o = n(r(7757)),
                        a = n(r(8926)),
                        i = n(r(1506)),
                        s = n(r(9713)),
                        u = n(r(4575)),
                        c = n(r(3913)),
                        l = n(r(2205)),
                        f = n(r(8585)),
                        d = n(r(9754));

                    function p(e) {
                        var t = function() { if ("undefined" === typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" === typeof Proxy) return !0; try { return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0 } catch (e) { return !1 } }();
                        return function() {
                            var r, n = (0, d.default)(e);
                            if (t) {
                                var o = (0, d.default)(this).constructor;
                                r = Reflect.construct(n, arguments, o)
                            } else r = n.apply(this, arguments);
                            return (0, f.default)(this, r)
                        }
                    }
                    var h = function(e) {
                        (0, l.default)(r, e);
                        var t = p(r);

                        function r(e) { var n, o; return (0, u.default)(this, r), (o = t.call(this, null !== (n = null === e || void 0 === e ? void 0 : e.message) && void 0 !== n ? n : e)).name = "UnknownError", o.code = e.code, e instanceof Error && (o.stack = e.stack), o }
                        return (0, c.default)(r, [{ key: "toJSON", value: function() { return { name: this.name, message: this.message, stack: this.stack } } }]), r
                    }((0, n(r(5957)).default)(Error));
                    t.UnknownError = h;
                    var v = function(e) {
                        (0, l.default)(r, e);
                        var t = p(r);

                        function r() {
                            var e;
                            (0, u.default)(this, r);
                            for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) o[a] = arguments[a];
                            return e = t.call.apply(t, [this].concat(o)), (0, s.default)((0, i.default)(e), "name", "OAuthCallbackError"), e
                        }
                        return (0, c.default)(r)
                    }(h);
                    t.OAuthCallbackError = v;
                    var m = function(e) {
                        (0, l.default)(r, e);
                        var t = p(r);

                        function r() {
                            var e;
                            (0, u.default)(this, r);
                            for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) o[a] = arguments[a];
                            return e = t.call.apply(t, [this].concat(o)), (0, s.default)((0, i.default)(e), "name", "AccountNotLinkedError"), e
                        }
                        return (0, c.default)(r)
                    }(h);
                    t.AccountNotLinkedError = m;
                    var y = function(e) {
                        (0, l.default)(r, e);
                        var t = p(r);

                        function r() {
                            var e;
                            (0, u.default)(this, r);
                            for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) o[a] = arguments[a];
                            return e = t.call.apply(t, [this].concat(o)), (0, s.default)((0, i.default)(e), "name", "MissingAPIRouteError"), (0, s.default)((0, i.default)(e), "code", "MISSING_NEXTAUTH_API_ROUTE_ERROR"), e
                        }
                        return (0, c.default)(r)
                    }(h);
                    t.MissingAPIRoute = y;
                    var g = function(e) {
                        (0, l.default)(r, e);
                        var t = p(r);

                        function r() {
                            var e;
                            (0, u.default)(this, r);
                            for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) o[a] = arguments[a];
                            return e = t.call.apply(t, [this].concat(o)), (0, s.default)((0, i.default)(e), "name", "MissingSecretError"), (0, s.default)((0, i.default)(e), "code", "NO_SECRET"), e
                        }
                        return (0, c.default)(r)
                    }(h);
                    t.MissingSecret = g;
                    var b = function(e) {
                        (0, l.default)(r, e);
                        var t = p(r);

                        function r() {
                            var e;
                            (0, u.default)(this, r);
                            for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) o[a] = arguments[a];
                            return e = t.call.apply(t, [this].concat(o)), (0, s.default)((0, i.default)(e), "name", "MissingAuthorizeError"), (0, s.default)((0, i.default)(e), "code", "CALLBACK_CREDENTIALS_HANDLER_ERROR"), e
                        }
                        return (0, c.default)(r)
                    }(h);
                    t.MissingAuthorize = b;
                    var w = function(e) {
                        (0, l.default)(r, e);
                        var t = p(r);

                        function r() {
                            var e;
                            (0, u.default)(this, r);
                            for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) o[a] = arguments[a];
                            return e = t.call.apply(t, [this].concat(o)), (0, s.default)((0, i.default)(e), "name", "MissingAdapterError"), (0, s.default)((0, i.default)(e), "code", "EMAIL_REQUIRES_ADAPTER_ERROR"), e
                        }
                        return (0, c.default)(r)
                    }(h);
                    t.MissingAdapter = w;
                    var x = function(e) {
                        (0, l.default)(r, e);
                        var t = p(r);

                        function r() {
                            var e;
                            (0, u.default)(this, r);
                            for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++) o[a] = arguments[a];
                            return e = t.call.apply(t, [this].concat(o)), (0, s.default)((0, i.default)(e), "name", "UnsupportedStrategyError"), (0, s.default)((0, i.default)(e), "code", "CALLBACK_CREDENTIALS_JWT_ERROR"), e
                        }
                        return (0, c.default)(r)
                    }(h);

                    function k(e) { return e.replace(/([A-Z])/g, "_$1").toUpperCase() }

                    function O(e) { return "".concat(e[0].toUpperCase()).concat(e.slice(1)) }
                    t.UnsupportedStrategy = x
                },
                9498: function(e, t, r) {
                    "use strict";
                    var n = r(5318);
                    Object.defineProperty(t, "__esModule", { value: !0 }), t.default = void 0, t.proxyLogger = function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : c,
                            t = arguments.length > 1 ? arguments[1] : void 0;
                        try {
                            if ("undefined" === typeof window) return e;
                            var r = {},
                                n = function(e) {
                                    r[e] = function(r, n) {
                                        c[e](r, n), "error" === e && (n = u(n)), n.client = !0;
                                        var o = "".concat(t, "/_log"),
                                            a = new URLSearchParams(s({ level: e, code: r }, n));
                                        return navigator.sendBeacon ? navigator.sendBeacon(o, a) : fetch(o, { method: "POST", body: a, keepalive: !0 })
                                    }
                                };
                            for (var o in e) n(o);
                            return r
                        } catch (a) { return c }
                    }, t.setLogger = function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            t = arguments.length > 1 ? arguments[1] : void 0;
                        t || (c.debug = function() {});
                        e.error && (c.error = e.error);
                        e.warn && (c.warn = e.warn);
                        e.debug && (c.debug = e.debug)
                    };
                    var o = n(r(9713)),
                        a = r(6925);

                    function i(e, t) {
                        var r = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var n = Object.getOwnPropertySymbols(e);
                            t && (n = n.filter((function(t) { return Object.getOwnPropertyDescriptor(e, t).enumerable }))), r.push.apply(r, n)
                        }
                        return r
                    }

                    function s(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var r = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? i(Object(r), !0).forEach((function(t) {
                                (0, o.default)(e, t, r[t])
                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : i(Object(r)).forEach((function(t) { Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t)) }))
                        }
                        return e
                    }

                    function u(e) {
                        if (e instanceof Error && !(e instanceof a.UnknownError)) return { message: e.message, stack: e.stack, name: e.name };
                        var t, r;
                        null !== (r = e) && void 0 !== r && r.error && (e.error = u(e.error), e.message = null !== (t = e.message) && void 0 !== t ? t : e.error.message);
                        return e
                    }
                    var c = { error: function(e, t) { t = u(t), console.error("[next-auth][error][".concat(e, "]"), "\nhttps://next-auth.js.org/errors#".concat(e.toLowerCase()), t.message, t) }, warn: function(e) { console.warn("[next-auth][warn][".concat(e, "]"), "\nhttps://next-auth.js.org/warnings#".concat(e.toLowerCase())) }, debug: function(e, t) { console.log("[next-auth][debug][".concat(e, "]"), t) } };
                    var l = c;
                    t.default = l
                },
                8341: function(e, t) {
                    "use strict";
                    Object.defineProperty(t, "__esModule", { value: !0 }), t.default = function(e) {
                        var t;
                        const r = new URL("http://localhost:3000/api/auth");
                        e && !e.startsWith("http") && (e = `https://${e}`);
                        const n = new URL(null !== (t = e) && void 0 !== t ? t : r),
                            o = ("/" === n.pathname ? r.pathname : n.pathname).replace(/\/$/, ""),
                            a = `${n.origin}${o}`;
                        return { origin: n.origin, host: n.host, path: o, base: a, toString: () => a }
                    }
                },
                3299: function(e, t, r) {
                    "use strict";
                    var n = r(3454),
                        o = r(5318),
                        a = r(8);
                    Object.defineProperty(t, "__esModule", { value: !0 });
                    var i = { useSession: !0, getSession: !0, getCsrfToken: !0, getProviders: !0, signIn: !0, signOut: !0, SessionProvider: !0 };
                    t.SessionProvider = function(e) {
                        var t = e.children,
                            r = e.basePath;
                        r && (E.basePath = r);
                        var n = void 0 !== e.session;
                        E._lastSync = n ? (0, g.now)() : 0;
                        var o = v.useState((function() { return n && (E._session = e.session), e.session })),
                            a = (0, p.default)(o, 2),
                            i = a[0],
                            s = a[1],
                            u = v.useState(!n),
                            c = (0, p.default)(u, 2),
                            l = c[0],
                            d = c[1];
                        v.useEffect((function() {
                            E._getSession = (0, h.default)(f.default.mark((function e() {
                                var t, r, n, o = arguments;
                                return f.default.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            if (t = o.length > 0 && void 0 !== o[0] ? o[0] : {}, r = t.event, e.prev = 1, !(n = "storage" === r) && void 0 !== E._session) { e.next = 10; break }
                                            return E._lastSync = (0, g.now)(), e.next = 7, P({ broadcast: !n });
                                        case 7:
                                            return E._session = e.sent, s(E._session), e.abrupt("return");
                                        case 10:
                                            if (r && null !== E._session && !((0, g.now)() < E._lastSync)) { e.next = 12; break }
                                            return e.abrupt("return");
                                        case 12:
                                            return E._lastSync = (0, g.now)(), e.next = 15, P();
                                        case 15:
                                            E._session = e.sent, s(E._session), e.next = 22;
                                            break;
                                        case 19:
                                            e.prev = 19, e.t0 = e.catch(1), S.error("CLIENT_SESSION_ERROR", e.t0);
                                        case 22:
                                            return e.prev = 22, d(!1), e.finish(22);
                                        case 25:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e, null, [
                                    [1, 19, 22, 25]
                                ])
                            }))), E._getSession()
                        }), []), v.useEffect((function() { var e = _.receive((function() { return E._getSession({ event: "storage" }) })); return function() { return e() } }), []), v.useEffect((function() {
                            var t = e.refetchOnWindowFocus,
                                r = void 0 === t || t,
                                n = function() { r && "visible" === document.visibilityState && E._getSession({ event: "visibilitychange" }) };
                            return document.addEventListener("visibilitychange", n, !1),
                                function() { return document.removeEventListener("visibilitychange", n, !1) }
                        }), [e.refetchOnWindowFocus]), v.useEffect((function() { var t = e.refetchInterval; if (t) { var r = setInterval((function() { E._session && E._getSession({ event: "poll" }) }), 1e3 * t); return function() { return clearInterval(r) } } }), [e.refetchInterval]);
                        var m = v.useMemo((function() { return { data: i, status: l ? "loading" : i ? "authenticated" : "unauthenticated" } }), [i, l]);
                        return (0, b.jsx)(T.Provider, { value: m, children: t })
                    }, t.getCsrfToken = M, t.getProviders = A, t.getSession = P, t.signIn = function(e, t, r) { return C.apply(this, arguments) }, t.signOut = function(e) { return I.apply(this, arguments) }, t.useSession = function(e) {
                        var t = v.useContext(T);
                        0;
                        var r = null !== e && void 0 !== e ? e : {},
                            n = r.required,
                            o = r.onUnauthenticated,
                            a = n && "unauthenticated" === t.status;
                        if (v.useEffect((function() {
                                if (a) {
                                    var e = "/api/auth/signin?".concat(new URLSearchParams({ error: "SessionRequired", callbackUrl: window.location.href }));
                                    o ? o() : window.location.href = e
                                }
                            }), [a, o]), a) return { data: t.data, status: "loading" };
                        return t
                    };
                    var s, u, c, l, f = o(r(7757)),
                        d = o(r(9713)),
                        p = o(r(3038)),
                        h = o(r(8926)),
                        v = k(r(7294)),
                        m = k(r(9498)),
                        y = o(r(8341)),
                        g = r(9548),
                        b = r(5893),
                        w = r(527);

                    function x(e) {
                        if ("function" !== typeof WeakMap) return null;
                        var t = new WeakMap,
                            r = new WeakMap;
                        return (x = function(e) { return e ? r : t })(e)
                    }

                    function k(e, t) {
                        if (!t && e && e.__esModule) return e;
                        if (null === e || "object" !== a(e) && "function" !== typeof e) return { default: e };
                        var r = x(t);
                        if (r && r.has(e)) return r.get(e);
                        var n = {},
                            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
                        for (var i in e)
                            if ("default" !== i && Object.prototype.hasOwnProperty.call(e, i)) {
                                var s = o ? Object.getOwnPropertyDescriptor(e, i) : null;
                                s && (s.get || s.set) ? Object.defineProperty(n, i, s) : n[i] = e[i]
                            }
                        return n.default = e, r && r.set(e, n), n
                    }

                    function O(e, t) {
                        var r = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var n = Object.getOwnPropertySymbols(e);
                            t && (n = n.filter((function(t) { return Object.getOwnPropertyDescriptor(e, t).enumerable }))), r.push.apply(r, n)
                        }
                        return r
                    }

                    function j(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var r = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? O(Object(r), !0).forEach((function(t) {
                                (0, d.default)(e, t, r[t])
                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : O(Object(r)).forEach((function(t) { Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t)) }))
                        }
                        return e
                    }
                    Object.keys(w).forEach((function(e) { "default" !== e && "__esModule" !== e && (Object.prototype.hasOwnProperty.call(i, e) || e in t && t[e] === w[e] || Object.defineProperty(t, e, { enumerable: !0, get: function() { return w[e] } })) }));
                    var E = { baseUrl: (0, y.default)(null !== (s = n.env.NEXTAUTH_URL) && void 0 !== s ? s : n.env.VERCEL_URL).origin, basePath: (0, y.default)(n.env.NEXTAUTH_URL).path, baseUrlServer: (0, y.default)(null !== (u = null !== (c = n.env.NEXTAUTH_URL_INTERNAL) && void 0 !== c ? c : n.env.NEXTAUTH_URL) && void 0 !== u ? u : n.env.VERCEL_URL).origin, basePathServer: (0, y.default)(null !== (l = n.env.NEXTAUTH_URL_INTERNAL) && void 0 !== l ? l : n.env.NEXTAUTH_URL).path, _lastSync: 0, _session: void 0, _getSession: function() {} },
                        _ = (0, g.BroadcastChannel)(),
                        S = (0, m.proxyLogger)(m.default, E.basePath),
                        T = v.createContext(void 0);

                    function P(e) { return R.apply(this, arguments) }

                    function R() {
                        return (R = (0, h.default)(f.default.mark((function e(t) {
                            var r, n;
                            return f.default.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, (0, g.fetchData)("session", E, S, t);
                                    case 2:
                                        return n = e.sent, (null === (r = null === t || void 0 === t ? void 0 : t.broadcast) || void 0 === r || r) && _.post({ event: "session", data: { trigger: "getSession" } }), e.abrupt("return", n);
                                    case 5:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))).apply(this, arguments)
                    }

                    function M(e) { return L.apply(this, arguments) }

                    function L() {
                        return (L = (0, h.default)(f.default.mark((function e(t) {
                            var r;
                            return f.default.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, (0, g.fetchData)("csrf", E, S, t);
                                    case 2:
                                        return r = e.sent, e.abrupt("return", null === r || void 0 === r ? void 0 : r.csrfToken);
                                    case 4:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))).apply(this, arguments)
                    }

                    function A() { return N.apply(this, arguments) }

                    function N() {
                        return (N = (0, h.default)(f.default.mark((function e() {
                            return f.default.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, (0, g.fetchData)("providers", E, S);
                                    case 2:
                                        return e.abrupt("return", e.sent);
                                    case 3:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))).apply(this, arguments)
                    }

                    function C() {
                        return (C = (0, h.default)(f.default.mark((function e(t, r, n) {
                            var o, a, i, s, u, c, l, d, p, h, v, m, y, b, w, x, k;
                            return f.default.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return a = (o = null !== r && void 0 !== r ? r : {}).callbackUrl, i = void 0 === a ? window.location.href : a, s = o.redirect, u = void 0 === s || s, c = (0, g.apiBaseUrl)(E), e.next = 4, A();
                                    case 4:
                                        if (l = e.sent) { e.next = 8; break }
                                        return window.location.href = "".concat(c, "/error"), e.abrupt("return");
                                    case 8:
                                        if (t && t in l) { e.next = 11; break }
                                        return window.location.href = "".concat(c, "/signin?").concat(new URLSearchParams({ callbackUrl: i })), e.abrupt("return");
                                    case 11:
                                        return d = "credentials" === l[t].type, p = "email" === l[t].type, h = d || p, v = "".concat(c, "/").concat(d ? "callback" : "signin", "/").concat(t), m = "".concat(v, "?").concat(new URLSearchParams(n)), e.t0 = fetch, e.t1 = m, e.t2 = { "Content-Type": "application/x-www-form-urlencoded" }, e.t3 = URLSearchParams, e.t4 = j, e.t5 = j({}, r), e.t6 = {}, e.next = 25, M();
                                    case 25:
                                        return e.t7 = e.sent, e.t8 = i, e.t9 = { csrfToken: e.t7, callbackUrl: e.t8, json: !0 }, e.t10 = (0, e.t4)(e.t5, e.t6, e.t9), e.t11 = new e.t3(e.t10), e.t12 = { method: "post", headers: e.t2, body: e.t11 }, e.next = 33, (0, e.t0)(e.t1, e.t12);
                                    case 33:
                                        return y = e.sent, e.next = 36, y.json();
                                    case 36:
                                        if (b = e.sent, !u && h) { e.next = 42; break }
                                        return x = null !== (w = b.url) && void 0 !== w ? w : i, window.location.href = x, x.includes("#") && window.location.reload(), e.abrupt("return");
                                    case 42:
                                        if (k = new URL(b.url).searchParams.get("error"), !y.ok) { e.next = 46; break }
                                        return e.next = 46, E._getSession({ event: "storage" });
                                    case 46:
                                        return e.abrupt("return", { error: k, status: y.status, ok: y.ok, url: k ? null : b.url });
                                    case 47:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))).apply(this, arguments)
                    }

                    function I() {
                        return (I = (0, h.default)(f.default.mark((function e(t) {
                            var r, n, o, a, i, s, u, c, l;
                            return f.default.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return n = (null !== t && void 0 !== t ? t : {}).callbackUrl, o = void 0 === n ? window.location.href : n, a = (0, g.apiBaseUrl)(E), e.t0 = { "Content-Type": "application/x-www-form-urlencoded" }, e.t1 = URLSearchParams, e.next = 6, M();
                                    case 6:
                                        return e.t2 = e.sent, e.t3 = o, e.t4 = { csrfToken: e.t2, callbackUrl: e.t3, json: !0 }, e.t5 = new e.t1(e.t4), i = { method: "post", headers: e.t0, body: e.t5 }, e.next = 13, fetch("".concat(a, "/signout"), i);
                                    case 13:
                                        return s = e.sent, e.next = 16, s.json();
                                    case 16:
                                        if (u = e.sent, _.post({ event: "session", data: { trigger: "signout" } }), null !== (r = null === t || void 0 === t ? void 0 : t.redirect) && void 0 !== r && !r) { e.next = 23; break }
                                        return l = null !== (c = u.url) && void 0 !== c ? c : o, window.location.href = l, l.includes("#") && window.location.reload(), e.abrupt("return");
                                    case 23:
                                        return e.next = 25, E._getSession({ event: "storage" });
                                    case 25:
                                        return e.abrupt("return", u);
                                    case 26:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))).apply(this, arguments)
                    }
                },
                527: function(e, t) {
                    "use strict";
                    Object.defineProperty(t, "__esModule", { value: !0 })
                },
                3454: function(e, t, r) {
                    "use strict";
                    var n, o;
                    e.exports = (null === (n = r.g.process) || void 0 === n ? void 0 : n.env) && "object" === typeof(null === (o = r.g.process) || void 0 === o ? void 0 : o.env) ? r.g.process : r(7663)
                },
                6363: function(e, t, r) {
                    (window.__NEXT_P = window.__NEXT_P || []).push(["/_app", function() { return r(6249) }])
                },
                3595: function(e, t, r) {
                    "use strict";
                    r.d(t, { Z: function() { return o } });
                    var n = r(5893);

                    function o(e) { var t = e.className; return (0, n.jsxs)("svg", { className: t, viewBox: "0 0 24 24", fill: "none", children: [(0, n.jsx)("circle", { className: "stroke-current stroke-[4px] opacity-25", cx: "12", cy: "12", r: "10" }), (0, n.jsx)("path", { className: "fill-current", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) }
                    o.defaultProps = { className: "" }
                },
                7381: function(e, t, r) {
                    "use strict";
                    r.d(t, { Z: function() { return o } });
                    var n = r(5893);

                    function o(e) { var t = e.className; return (0, n.jsx)("svg", { className: t, viewBox: "0 0 256 249", children: (0, n.jsxs)("g", { children: [(0, n.jsx)("path", { d: "M127.505 0C57.095 0 0 57.085 0 127.505c0 56.336 36.534 104.13 87.196 120.99 6.372 1.18 8.712-2.766 8.712-6.134 0-3.04-.119-13.085-.173-23.739-35.473 7.713-42.958-15.044-42.958-15.044-5.8-14.738-14.157-18.656-14.157-18.656-11.568-7.914.872-7.752.872-7.752 12.804.9 19.546 13.14 19.546 13.14 11.372 19.493 29.828 13.857 37.104 10.6 1.144-8.242 4.449-13.866 8.095-17.05-28.32-3.225-58.092-14.158-58.092-63.014 0-13.92 4.981-25.295 13.138-34.224-1.324-3.212-5.688-16.18 1.235-33.743 0 0 10.707-3.427 35.073 13.07 10.17-2.826 21.078-4.242 31.914-4.29 10.836.048 21.752 1.464 31.942 4.29 24.337-16.497 35.029-13.07 35.029-13.07 6.94 17.563 2.574 30.531 1.25 33.743 8.175 8.929 13.122 20.303 13.122 34.224 0 48.972-29.828 59.756-58.22 62.912 4.573 3.957 8.648 11.717 8.648 23.612 0 17.06-.148 30.791-.148 34.991 0 3.393 2.295 7.369 8.759 6.117 50.634-16.879 87.122-64.656 87.122-120.973C255.009 57.085 197.922 0 127.505 0" }), (0, n.jsx)("path", { d: "M47.755 181.634c-.28.633-1.278.823-2.185.389-.925-.416-1.445-1.28-1.145-1.916.275-.652 1.273-.834 2.196-.396.927.415 1.455 1.287 1.134 1.923m6.272 5.596c-.608.564-1.797.302-2.604-.589-.834-.889-.99-2.077-.373-2.65.627-.563 1.78-.3 2.616.59.834.899.996 2.08.36 2.65m4.304 7.159c-.782.543-2.06.034-2.849-1.1-.781-1.133-.781-2.493.017-3.038.792-.545 2.05-.055 2.85 1.07.78 1.153.78 2.513-.019 3.069m7.277 8.292c-.699.77-2.187.564-3.277-.488-1.114-1.028-1.425-2.487-.724-3.258.707-.772 2.204-.555 3.302.488 1.107 1.026 1.445 2.496.7 3.258m9.403 2.8c-.307.998-1.741 1.452-3.185 1.028-1.442-.437-2.386-1.607-2.095-2.616.3-1.005 1.74-1.478 3.195-1.024 1.44.435 2.386 1.596 2.086 2.612m10.703 1.187c.036 1.052-1.189 1.924-2.705 1.943-1.525.033-2.758-.818-2.774-1.852 0-1.062 1.197-1.926 2.721-1.951 1.516-.03 2.758.815 2.758 1.86m10.514-.403c.182 1.026-.872 2.08-2.377 2.36-1.48.27-2.85-.363-3.039-1.38-.184-1.052.89-2.105 2.367-2.378 1.508-.262 2.857.355 3.049 1.398" })] }) }) }
                },
                6965: function(e, t, r) {
                    "use strict";
                    r.d(t, { Z: function() { return s } });
                    var n = r(4051),
                        o = r.n(n);

                    function a(e, t, r, n, o, a, i) {
                        try {
                            var s = e[a](i),
                                u = s.value
                        } catch (c) { return void r(c) }
                        s.done ? t(u) : Promise.resolve(u).then(n, o)
                    }

                    function i(e) {
                        return function() {
                            var t = this,
                                r = arguments;
                            return new Promise((function(n, o) {
                                var i = e.apply(t, r);

                                function s(e) { a(i, n, o, s, u, "next", e) }

                                function u(e) { a(i, n, o, s, u, "throw", e) }
                                s(void 0)
                            }))
                        }
                    }

                    function s(e, t) { return u.apply(this, arguments) }

                    function u() {
                        return (u = i(o().mark((function e(t, r) {
                            var n;
                            return o().wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, fetch(t, r);
                                    case 2:
                                        return n = e.sent, e.abrupt("return", n.json());
                                    case 4:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))).apply(this, arguments)
                    }
                },
                1551: function(e, t, r) {
                    "use strict";

                    function n(e, t) {
                        (null == t || t > e.length) && (t = e.length);
                        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
                        return n
                    }

                    function o(e, t) {
                        return function(e) { if (Array.isArray(e)) return e }(e) || function(e, t) {
                            var r = null == e ? null : "undefined" !== typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                            if (null != r) {
                                var n, o, a = [],
                                    i = !0,
                                    s = !1;
                                try { for (r = r.call(e); !(i = (n = r.next()).done) && (a.push(n.value), !t || a.length !== t); i = !0); } catch (u) { s = !0, o = u } finally { try { i || null == r.return || r.return() } finally { if (s) throw o } }
                                return a
                            }
                        }(e, t) || function(e, t) { if (!e) return; if ("string" === typeof e) return n(e, t); var r = Object.prototype.toString.call(e).slice(8, -1); "Object" === r && e.constructor && (r = e.constructor.name); if ("Map" === r || "Set" === r) return Array.from(r); if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return n(e, t) }(e, t) || function() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }()
                    }
                    t.default = void 0;
                    var a, i = (a = r(7294)) && a.__esModule ? a : { default: a },
                        s = r(1003),
                        u = r(880),
                        c = r(9246);
                    var l = {};

                    function f(e, t, r, n) {
                        if (e && s.isLocalURL(t)) {
                            e.prefetch(t, r, n).catch((function(e) { 0 }));
                            var o = n && "undefined" !== typeof n.locale ? n.locale : e && e.locale;
                            l[t + "%" + r + (o ? "%" + o : "")] = !0
                        }
                    }
                    var d = function(e) {
                        var t, r = !1 !== e.prefetch,
                            n = u.useRouter(),
                            a = i.default.useMemo((function() {
                                var t = o(s.resolveHref(n, e.href, !0), 2),
                                    r = t[0],
                                    a = t[1];
                                return { href: r, as: e.as ? s.resolveHref(n, e.as) : a || r }
                            }), [n, e.href, e.as]),
                            d = a.href,
                            p = a.as,
                            h = e.children,
                            v = e.replace,
                            m = e.shallow,
                            y = e.scroll,
                            g = e.locale;
                        "string" === typeof h && (h = i.default.createElement("a", null, h));
                        var b = (t = i.default.Children.only(h)) && "object" === typeof t && t.ref,
                            w = o(c.useIntersection({ rootMargin: "200px" }), 2),
                            x = w[0],
                            k = w[1],
                            O = i.default.useCallback((function(e) { x(e), b && ("function" === typeof b ? b(e) : "object" === typeof b && (b.current = e)) }), [b, x]);
                        i.default.useEffect((function() {
                            var e = k && r && s.isLocalURL(d),
                                t = "undefined" !== typeof g ? g : n && n.locale,
                                o = l[d + "%" + p + (t ? "%" + t : "")];
                            e && !o && f(n, d, p, { locale: t })
                        }), [p, d, k, g, r, n]);
                        var j = {
                            ref: O,
                            onClick: function(e) {
                                t.props && "function" === typeof t.props.onClick && t.props.onClick(e), e.defaultPrevented || function(e, t, r, n, o, a, i, u) {
                                    ("A" !== e.currentTarget.nodeName.toUpperCase() || ! function(e) { var t = e.currentTarget.target; return t && "_self" !== t || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.nativeEvent && 2 === e.nativeEvent.which }(e) && s.isLocalURL(r)) && (e.preventDefault(), t[o ? "replace" : "push"](r, n, { shallow: a, locale: u, scroll: i }))
                                }(e, n, d, p, v, m, y, g)
                            },
                            onMouseEnter: function(e) { t.props && "function" === typeof t.props.onMouseEnter && t.props.onMouseEnter(e), s.isLocalURL(d) && f(n, d, p, { priority: !0 }) }
                        };
                        if (e.passHref || "a" === t.type && !("href" in t.props)) {
                            var E = "undefined" !== typeof g ? g : n && n.locale,
                                _ = n && n.isLocaleDomain && s.getDomainLocale(p, E, n && n.locales, n && n.domainLocales);
                            j.href = _ || s.addBasePath(s.addLocale(p, E, n && n.defaultLocale))
                        }
                        return i.default.cloneElement(t, j)
                    };
                    t.default = d
                },
                9246: function(e, t, r) {
                    "use strict";

                    function n(e, t) {
                        (null == t || t > e.length) && (t = e.length);
                        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
                        return n
                    }

                    function o(e, t) {
                        return function(e) { if (Array.isArray(e)) return e }(e) || function(e, t) {
                            var r = null == e ? null : "undefined" !== typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                            if (null != r) {
                                var n, o, a = [],
                                    i = !0,
                                    s = !1;
                                try { for (r = r.call(e); !(i = (n = r.next()).done) && (a.push(n.value), !t || a.length !== t); i = !0); } catch (u) { s = !0, o = u } finally { try { i || null == r.return || r.return() } finally { if (s) throw o } }
                                return a
                            }
                        }(e, t) || function(e, t) { if (!e) return; if ("string" === typeof e) return n(e, t); var r = Object.prototype.toString.call(e).slice(8, -1); "Object" === r && e.constructor && (r = e.constructor.name); if ("Map" === r || "Set" === r) return Array.from(r); if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return n(e, t) }(e, t) || function() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }()
                    }
                    Object.defineProperty(t, "__esModule", { value: !0 }), t.useIntersection = function(e) {
                        var t = e.rootRef,
                            r = e.rootMargin,
                            n = e.disabled || !s,
                            l = a.useRef(),
                            f = o(a.useState(!1), 2),
                            d = f[0],
                            p = f[1],
                            h = o(a.useState(t ? t.current : null), 2),
                            v = h[0],
                            m = h[1],
                            y = a.useCallback((function(e) {
                                l.current && (l.current(), l.current = void 0), n || d || e && e.tagName && (l.current = function(e, t, r) {
                                    var n = function(e) {
                                            var t, r = { root: e.root || null, margin: e.rootMargin || "" },
                                                n = c.find((function(e) { return e.root === r.root && e.margin === r.margin }));
                                            n ? t = u.get(n) : (t = u.get(r), c.push(r));
                                            if (t) return t;
                                            var o = new Map,
                                                a = new IntersectionObserver((function(e) {
                                                    e.forEach((function(e) {
                                                        var t = o.get(e.target),
                                                            r = e.isIntersecting || e.intersectionRatio > 0;
                                                        t && r && t(r)
                                                    }))
                                                }), e);
                                            return u.set(r, t = { id: r, observer: a, elements: o }), t
                                        }(r),
                                        o = n.id,
                                        a = n.observer,
                                        i = n.elements;
                                    return i.set(e, t), a.observe(e),
                                        function() {
                                            if (i.delete(e), a.unobserve(e), 0 === i.size) {
                                                a.disconnect(), u.delete(o);
                                                var t = c.findIndex((function(e) { return e.root === o.root && e.margin === o.margin }));
                                                t > -1 && c.splice(t, 1)
                                            }
                                        }
                                }(e, (function(e) { return e && p(e) }), { root: v, rootMargin: r }))
                            }), [n, v, r, d]);
                        return a.useEffect((function() { if (!s && !d) { var e = i.requestIdleCallback((function() { return p(!0) })); return function() { return i.cancelIdleCallback(e) } } }), [d]), a.useEffect((function() { t && m(t.current) }), [t]), [y, d]
                    };
                    var a = r(7294),
                        i = r(4686),
                        s = "undefined" !== typeof IntersectionObserver;
                    var u = new Map,
                        c = []
                },
                6249: function(e, t, r) {
                        "use strict";
                        r.r(t), r.d(t, { default: function() { return Fe } });
                        var n = r(5893),
                            o = r(7294),
                            a = r(9008);
                        const i = (0, o.createContext)({ setTheme: e => {}, themes: [] }),
                            s = ["light", "dark"],
                            u = "(prefers-color-scheme: dark)",
                            c = ({ forcedTheme: e, disableTransitionOnChange: t = !1, enableSystem: r = !0, enableColorScheme: n = !0, storageKey: a = "theme", themes: c = ["light", "dark"], defaultTheme: h = (r ? "system" : "light"), attribute: v = "data-theme", value: m, children: y }) => {
                                const [g, b] = (0, o.useState)((() => f(a, h))), [w, x] = (0, o.useState)((() => f(a))), k = m ? Object.values(m) : c, O = (0, o.useCallback)((t => {
                                    const r = p(t);
                                    x(r), "system" !== g || e || E(r, !1)
                                }), [g, e]), j = (0, o.useRef)(O);
                                j.current = O;
                                const E = (0, o.useCallback)(((e, n = !0, o = !0) => {
                                    let i = (null == m ? void 0 : m[e]) || e;
                                    const s = t && o ? d() : null;
                                    if (n) try { localStorage.setItem(a, e) } catch (e) {}
                                    if ("system" === e && r) {
                                        const e = p();
                                        i = (null == m ? void 0 : m[e]) || e
                                    }
                                    if (o) { const e = document.documentElement; "class" === v ? (e.classList.remove(...k), e.classList.add(i)) : e.setAttribute(v, i), null == s || s() }
                                }), []);
                                (0, o.useEffect)((() => {
                                    const e = function() { return j.current(...[].slice.call(arguments)) },
                                        t = window.matchMedia(u);
                                    return t.addListener(e), e(t), () => t.removeListener(e)
                                }), []);
                                const _ = (0, o.useCallback)((t => { e ? E(t, !0, !1) : E(t), b(t) }), [e]);
                                return (0, o.useEffect)((() => { const e = e => { e.key === a && _(e.newValue || h) }; return window.addEventListener("storage", e), () => window.removeEventListener("storage", e) }), [_]), (0, o.useEffect)((() => {
                                    if (!n) return;
                                    let t = e && s.includes(e) ? e : g && s.includes(g) ? g : "system" === g && w || null;
                                    document.documentElement.style.setProperty("color-scheme", t)
                                }), [n, g, w, e]), o.createElement(i.Provider, { value: { theme: g, setTheme: _, forcedTheme: e, resolvedTheme: "system" === g ? w : g, themes: r ? [...c, "system"] : c, systemTheme: r ? w : void 0 } }, o.createElement(l, { forcedTheme: e, storageKey: a, attribute: v, value: m, enableSystem: r, defaultTheme: h, attrs: k }), y)
                            },
                            l = (0, o.memo)((({ forcedTheme: e, storageKey: t, attribute: r, enableSystem: n, defaultTheme: i, value: s, attrs: c }) => { const l = "class" === r ? `var d=document.documentElement.classList;d.remove(${c.map((e=>`'${e}'`)).join(",")});`:"var d=document.documentElement;",f=(e,t)=>{e=(null==s?void 0:s[e])||e;const n=t?e:`'${e}'`;return"class"===r?`d.add(${n})`:`d.setAttribute('${r}', ${n})`},d="system"===i;return o.createElement(a.default,null,o.createElement("script",e?{key:"next-themes-script",dangerouslySetInnerHTML:{__html:`!function(){${l}${f(e)}}()`}}:n?{key:"next-themes-script",dangerouslySetInnerHTML:{__html:`!function(){try {${l}var e=localStorage.getItem('${t}');${d?"":f(i)+";"}if("system"===e||(!e&&${d})){var t="${u}",m=window.matchMedia(t);m.media!==t||m.matches?${f("dark")}:${f("light")}}else if(e) ${s?`var x=${JSON.stringify(s)};`:""}${f(s?"x[e]":"e",!0)}}catch(e){}}()`}}:{key:"next-themes-script",dangerouslySetInnerHTML:{__html:`!function(){try{${l}var e=localStorage.getItem("${t}");if(e){${s?`var x=${JSON.stringify(s)};`:""}${f(s?"x[e]":"e",!0)}}else{${f(i)};}}catch(t){}}();`}}))}),((e,t)=>e.forcedTheme===t.forcedTheme)),f=(e,t)=>{if("undefined"==typeof window)return;let r;try{r=localStorage.getItem(e)||void 0}catch(e){}return r||t},d=()=>{const e=document.createElement("style");return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout((()=>{document.head.removeChild(e)}),1)}},p=e=>(e||(e=window.matchMedia(u)),e.matches?"dark":"light");var h=r(3299),v=r(8100),m=r(6965);function y(e){var t=e.className;return(0,n.jsx)("svg",{viewBox:"0 0 2931 2931",width:2931,height:2931,className:t,children:(0,n.jsx)("path",{d:"M1465.5 0C656.1 0 0 656.1 0 1465.5S656.1 2931 1465.5 2931 2931 2274.9 2931 1465.5C2931 656.2 2274.9.1 1465.5 0zm672.1 2113.6c-26.3 43.2-82.6 56.7-125.6 30.4-344.1-210.3-777.3-257.8-1287.4-141.3-49.2 11.3-98.2-19.5-109.4-68.7-11.3-49.2 19.4-98.2 68.7-109.4C1242.1 1697.1 1721 1752 2107.3 1988c43 26.5 56.7 82.6 30.3 125.6zm179.3-398.9c-33.1 53.8-103.5 70.6-157.2 37.6-393.8-242.1-994.4-312.2-1460.3-170.8-60.4 18.3-124.2-15.8-142.6-76.1-18.2-60.4 15.9-124.1 76.2-142.5 532.2-161.5 1193.9-83.3 1646.2 194.7 53.8 33.1 70.8 103.4 37.7 157.1zm15.4-415.6c-472.4-280.5-1251.6-306.3-1702.6-169.5-72.4 22-149-18.9-170.9-91.3-21.9-72.4 18.9-149 91.4-171 517.7-157.1 1378.2-126.8 1922 196 65.1 38.7 86.5 122.8 47.9 187.8-38.5 65.2-122.8 86.7-187.8 48z",fill:"#1ed660"})})}y.defaultProps={className:""};var g=r(3595);const b={duration:.3,delay:0,endDelay:0,repeat:0,easing:"ease"},w=()=>{},x=e=>e,k=e=>1e3*e;function O(e,t=!0){if(e&&"finished"!==e.playState)try{e.stop?e.stop():(t&&e.commitStyles(),e.cancel())}catch(r){}}const j=e=>e(),E=(e,t=b.duration)=>new Proxy({animations:e.map(j).filter(Boolean),duration:t},S),_=e=>e.animations[0],S={get:(e,t)=>{var r,n;switch(t){case"duration":return e.duration;case"currentTime":let o=(null===(r=_(e))||void 0===r?void 0:r[t])||0;return o?o/1e3:0;case"playbackRate":return null===(n=_(e))||void 0===n?void 0:n[t];case"finished":return e.finished||(e.finished=Promise.all(e.animations.map(T)).catch(w)),e.finished;case"stop":return()=>e.animations.forEach((e=>O(e)));default:return()=>e.animations.forEach((e=>e[t]()))}},set:(e,t,r)=>{switch(t){case"currentTime":r=k(r);case"currentTime":case"playbackRate":for(let n=0;n<e.animations.length;n++)e.animations[n][t]=r;return!0}return!1}},T=e=>e.finished;class P{setAnimation(e){this.animation=e,null===e||void 0===e||e.finished.then((()=>this.clearAnimation())).catch((()=>{}))}clearAnimation(){this.animation=this.generator=void 0}}const R=new WeakMap;function M(e){return R.has(e)||R.set(e,{transforms:[],values:new Map}),R.get(e)}const L=["","X","Y","Z"],A={x:"translateX",y:"translateY",z:"translateZ"},N={syntax:"<angle>",initialValue:"0deg",toDefaultUnit:e=>e+"deg"},C={translate:{syntax:"<length-percentage>",initialValue:"0px",toDefaultUnit:e=>e+"px"},rotate:N,scale:{syntax:"<number>",initialValue:1,toDefaultUnit:x},skew:N},I=new Map,U=e=>`--motion-${e}`,D=["x","y","z"];["translate","scale","rotate","skew"].forEach((e=>{L.forEach((t=>{D.push(e+t),I.set(U(e+t),C[e])}))}));const $=(e,t)=>D.indexOf(e)-D.indexOf(t),V=new Set(D),z=e=>V.has(e),H=e=>e.sort($).reduce(B,"").trim(),B=(e,t)=>`${e} ${t}(var(${U(t)}))`,F=e=>e.startsWith("--"),Y=new Set;const W=e=>"number"===typeof e,q=e=>"object"===typeof e&&Boolean(e.createAnimation),G=e=>Array.isArray(e)&&!W(e[0]),K=(e,t,r)=>(((1-3*r+3*t)*e+(3*r-6*t))*e+3*t)*e;function X(e,t,r,n){if(e===t&&r===n)return x;const o=t=>function(e,t,r,n,o){let a,i,s=0;do{i=t+(r-t)/2,a=K(i,n,o)-e,a>0?r=i:t=i}while(Math.abs(a)>1e-7&&++s<12);return i}(t,0,1,e,r);return e=>0===e||1===e?e:K(o(e),t,n)}const Z=(e,t="end")=>r=>{const n=(r="end"===t?Math.min(r,.999):Math.max(r,.001))*e;return((e,t,r)=>Math.min(Math.max(r,e),t))(0,1,("end"===t?Math.floor(n):Math.ceil(n))/e)},J={ease:X(.25,.1,.25,1),"ease-in":X(.42,0,1,1),"ease-in-out":X(.42,0,.58,1),"ease-out":X(0,0,.58,1)},Q=/\((.*?)\)/;function ee(e){if("function"===typeof e)return e;if(Array.isArray(e))return X(...e);if(J[e])return J[e];if(e.startsWith("steps")){const t=Q.exec(e);if(t){const e=t[1].split(",");return Z(parseFloat(e[0]),e[1].trim())}}return x}const te=(e,t,r)=>-r*e+r*t+e,re=(e,t,r)=>t-e===0?1:(r-e)/(t-e);function ne(e,t){const r=e[e.length-1];for(let n=1;n<=t;n++){const o=re(0,t,n);e.push(te(r,1,o))}}function oe(e,t=function(e){const t=[0];return ne(t,e-1),t}(e.length),r=x){const n=e.length,o=n-t.length;return o>0&&ne(t,o),o=>{let a=0;for(;a<n-2&&!(o<t[a+1]);a++);let i=(s=re(t[a],t[a+1],o),Math.min(1,Math.max(s,0)));var s;const u=function(e,t){return G(e)?e[((e,t,r)=>{const n=t-e;return((r-e)%n+n)%n+e})(0,e.length,t)]:e}(r,a);return i=u(i),te(e[a],e[a+1],i)}}class ae{constructor(e,t=[0,1],{easing:r=b.easing,duration:n=b.duration,delay:o=b.delay,endDelay:a=b.endDelay,repeat:i=b.repeat,offset:s,direction:u="normal"}={}){if(this.startTime=null,this.rate=1,this.t=0,this.cancelTimestamp=null,this.playState="idle",this.finished=new Promise(((e,t)=>{this.resolve=e,this.reject=t})),q(r)){const e=r.createAnimation(t,(()=>"0"),!0);r=e.easing,void 0!==e.keyframes&&(t=e.keyframes),void 0!==e.duration&&(n=e.duration)}const c=n*(i+1),l=oe(t,s,G(r)?r.map(ee):ee(r));this.tick=t=>{var r;this.pauseTime&&(t=this.pauseTime);let i=(t-this.startTime)*this.rate;this.t=i,i/=1e3,i=Math.max(i-o,0),"finished"===this.playState&&(i=c);const s=i/n;let f=Math.floor(s),d=s%1;!d&&s>=1&&(d=1),1===d&&f--;const p=f%2;("reverse"===u||"alternate"===u&&p||"alternate-reverse"===u&&!p)&&(d=1-d);const h=l(i>=c?1:Math.min(d,1));e(h);"finished"===this.playState||i>=c+a?(this.playState="finished",null===(r=this.resolve)||void 0===r||r.call(this,h)):"idle"!==this.playState&&(this.frameRequestId=requestAnimationFrame(this.tick))},this.play()}play(){var e;const t=performance.now();this.playState="running",this.pauseTime?this.startTime=t-(this.pauseTime-(null!==(e=this.startTime)&&void 0!==e?e:0)):this.startTime||(this.startTime=t),this.cancelTimestamp=this.startTime,this.pauseTime=void 0,requestAnimationFrame(this.tick)}pause(){this.playState="paused",this.pauseTime=performance.now()}finish(){this.playState="finished",this.tick(0)}stop(){var e;this.playState="idle",void 0!==this.frameRequestId&&cancelAnimationFrame(this.frameRequestId),null===(e=this.reject)||void 0===e||e.call(this,!1)}cancel(){this.stop(),this.tick(this.cancelTimestamp)}reverse(){this.rate*=-1}commitStyles(){}get currentTime(){return this.t}set currentTime(e){this.pauseTime||0===this.rate?this.pauseTime=e:this.startTime=performance.now()-e/this.rate}get playbackRate(){return this.rate}set playbackRate(e){this.rate=e}}const ie=e=>(e=>Array.isArray(e)&&W(e[0]))(e)?se(e):e,se=([e,t,r,n])=>`cubic-bezier(${e}, ${t}, ${r}, ${n})`,ue=e=>document.createElement("div").animate(e,{duration:.001}),ce={cssRegisterProperty:()=>"undefined"!==typeof CSS&&Object.hasOwnProperty.call(CSS,"registerProperty"),waapi:()=>Object.hasOwnProperty.call(Element.prototype,"animate"),partialKeyframes:()=>{try{ue({opacity:[1]})}catch(e){return!1}return!0},finished:()=>Boolean(ue({opacity:[0,1]}).finished)},le={},fe={};for(const Ye in ce)fe[Ye]=()=>(void 0===le[Ye]&&(le[Ye]=ce[Ye]()),le[Ye]);function de(e){return A[e]&&(e=A[e]),z(e)?U(e):e}const pe=(e,t)=>{t=de(t);let r=F(t)?e.style.getPropertyValue(t):getComputedStyle(e)[t];if(!r&&0!==r){const e=I.get(t);e&&(r=e.initialValue)}return r},he=(e,t,r)=>{t=de(t),F(t)?e.style.setProperty(t,r):e.style[t]=r};function ve(e,t,r,n={}){const o=window.__MOTION_DEV_TOOLS_RECORD,a=!1!==n.record&&o;let i,{duration:s=b.duration,delay:u=b.delay,endDelay:c=b.endDelay,repeat:l=b.repeat,easing:f=b.easing,direction:d,offset:p,allowWebkitAcceleration:h=!1}=n;const v=M(e);let m=fe.waapi();const y=z(t);y&&((e,t)=>{A[t]&&(t=A[t]);const{transforms:r}=M(e);var n,o;o=t,-1===(n=r).indexOf(o)&&n.push(o),e.style.transform=H(r)})(e,t);const g=de(t),x=function(e,t){return e.has(t)||e.set(t,new P),e.get(t)}(v.values,g),j=I.get(g);return O(x.animation,!(q(f)&&x.generator)&&!1!==n.record),()=>{const v=()=>{var t,r;return null!==(r=null!==(t=pe(e,g))&&void 0!==t?t:null===j||void 0===j?void 0:j.initialValue)&&void 0!==r?r:0};let b=function(e,t){for(let r=0;r<e.length;r++)null===e[r]&&(e[r]=r?e[r-1]:t());return e}((e=>Array.isArray(e)?e:[e])(r),v);if(q(f)){const e=f.createAnimation(b,v,y,g,x);f=e.easing,void 0!==e.keyframes&&(b=e.keyframes),void 0!==e.duration&&(s=e.duration)}if(F(g)&&(fe.cssRegisterProperty()?function(e){if(!Y.has(e)){Y.add(e);try{const{syntax:t,initialValue:r}=I.has(e)?I.get(e):{};CSS.registerProperty({name:e,inherits:!1,syntax:t,initialValue:r})}catch(t){}}}(g):m=!1),m){j&&(b=b.map((e=>W(e)?j.toDefaultUnit(e):e)));const t=!fe.partialKeyframes()&&1===b.length;(a||t)&&b.unshift(v());const r={delay:k(u),duration:k(s),endDelay:k(c),easing:G(f)?void 0:ie(f),direction:d,iterations:l+1,fill:"both"};i=e.animate({[g]:b,offset:p,easing:G(f)?f.map(ie):void 0},r),i.finished||(i.finished=new Promise(((e,t)=>{i.onfinish=e,i.oncancel=t})));const n=b[b.length-1];i.finished.then((()=>{he(e,g,n),i.cancel()})).catch(w),h||(i.playbackRate=1.000001)}else if(y&&b.every(W)){1===b.length&&b.unshift(parseFloat(v()));i=new ae((t=>{j&&(t=j.toDefaultUnit(t)),he(e,g,t)}),b,Object.assign(Object.assign({},n),{duration:s,easing:f}))}else{const t=b[b.length-1];he(e,g,j&&W(t)?j.toDefaultUnit(t):t)}return a&&o(e,t,b,{duration:s,delay:u,easing:f,repeat:l,offset:p},"motion-one"),x.setAnimation(i),i}}const me=(e,t)=>e[t]?Object.assign(Object.assign({},e),e[t]):Object.assign({},e);function ye(e,t,r){return"function"===typeof e?e(t,r):e}function ge(e,t,r={}){const n=(e=function(e,t){var r;return"string"===typeof e?t?(null!==(r=t[e])&&void 0!==r||(t[e]=document.querySelectorAll(e)),e=t[e]):e=document.querySelectorAll(e):e instanceof Element&&(e=[e]),Array.from(e)}(e)).length,o=[];for(let a=0;a<n;a++){const i=e[a];for(const e in t){const s=me(r,e);s.delay=ye(s.delay,a,n);const u=ve(i,e,t[e],s);o.push(u)}}return E(o,r.duration)}function be(e,t){return E([()=>{const r=new ae(e,[0,1],t);return r.finished.catch((()=>{})),r}],null===t||void 0===t?void 0:t.duration)}function we(e,t,r){return("function"===typeof e?be:ge)(e,t,r)}function xe(e){var t=e.title,r=e.artist,a=e.songUrl;return(0,o.useEffect)((function(){we("#bar1",{transform:["scaleY(1.0)","scaleY(0.6)","scaleY(1.0)"]},{duration:1.2,repeat:1/0,easing:["ease-in-out"]}),we("#bar2",{transform:["scaleY(0.5)","scaleY(1.0)","scaleY(0.5)"]},{delay:.2,duration:1.2,repeat:1/0,easing:["ease-in-out"]}),we("#bar3",{transform:["scaleY(1.0)","scaleY(0.5)","scaleY(1.0)"]},{delay:.3,duration:1.2,repeat:1/0,easing:["ease-in-out"]}),we("#bar4",{transform:["scaleY(0.6)","scaleY(1.0)","scaleY(0.6)"]},{delay:.4,duration:1.2,repeat:1/0,easing:["ease-in-out"]})}),[]),(0,n.jsxs)("a",{className:"group flex items-center space-x-2 max-w-min",href:a,target:"_blank",rel:"noopener noreferrer",children:[(0,n.jsxs)("div",{className:"flex items-center space-x-0.5 rounded-md p-1 bg-white dark:bg-gray-800 shadow dark:border-gray-600",children:[(0,n.jsx)("span",{id:"bar1",className:"block h-5 w-1 rounded bg-blue-500 dark:bg-indigo-500"}),(0,n.jsx)("span",{id:"bar2",className:"block h-5 w-1 rounded bg-blue-500 dark:bg-indigo-500"}),(0,n.jsx)("span",{id:"bar3",className:"block h-5 w-1 rounded bg-blue-500 dark:bg-indigo-500"}),(0,n.jsx)("span",{id:"bar4",className:"block h-5 w-1 rounded bg-blue-500 dark:bg-indigo-500"})]}),(0,n.jsxs)("div",{className:"flex flex-col text-sm text-gray-600 dark:text-gray-400 w-full overflow-hidden max-w-min",children:[(0,n.jsx)("span",{className:"font-semibold truncate text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-indigo-500",children:t}),(0,n.jsx)("span",{className:"text-xs truncate",children:r})]})]})}function ke(){return(0,n.jsxs)("p",{className:"flex max-w-xs items-center text-sm text-gray-600 dark:text-gray-400 sm:w-auto",children:[(0,n.jsx)(y,{className:"mr-2 inline-block h-4 w-auto"}),(0,n.jsx)("span",{className:"font-semibold text-gray-900 dark:text-white",children:"Not Playing "}),(0,n.jsx)("span",{className:"mx-2",children:"\u2014"}),"Spotify"]})}function Oe(){var e=(0,v.ZP)("/api/currently-playing",m.Z).data;return e?e.isPlaying?(0,n.jsx)(xe,{title:e.title,artist:e.artist,songUrl:e.songUrl}):(0,n.jsx)(ke,{}):(0,n.jsx)(g.Z,{className:"ml-2 block h-4 w-auto animate-spin self-end"})}var je=r(1664),Ee=r(7381);var _e=function(e){var t=e.text;return(0,n.jsx)("span",{className:"absolute bottom-20 w-auto min-w-max translate-y-10 scale-0 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-500 opacity-0 shadow transition-all duration-200 group-hover:translate-y-2 group-hover:scale-100 group-hover:opacity-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:shadow-black/60 group-hover:sm:translate-y-1",children:t})};var Se=o.forwardRef((function(e,t){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:t},e),o.createElement("path",{d:"M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"}))}));var Te=o.forwardRef((function(e,t){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:t},e),o.createElement("path",{d:"M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"}))}));var Pe=o.forwardRef((function(e,t){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:t},e),o.createElement("path",{fillRule:"evenodd",d:"M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z",clipRule:"evenodd"}))}));var Re=o.forwardRef((function(e,t){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:t},e),o.createElement("path",{d:"M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z"}))}));var Me=o.forwardRef((function(e,t){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:t},e),o.createElement("path",{fillRule:"evenodd",d:"M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z",clipRule:"evenodd"}))}));var Le=o.forwardRef((function(e,t){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:t},e),o.createElement("path",{d:"M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"}))}));function Ae(e){var t=e.className;return(0,n.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 23",className:t,children:(0,n.jsx)("path",{d:"M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0V24H24V13.869c0-7.88-8.922-7.593-11.018-3.714V8z"})})}function Ne(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Ce(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var Ie=[{id:1,href:"/",text:"Home",icon:(0,n.jsx)(Se,{})},{id:2,href:"/blog",text:"Blog",icon:(0,n.jsx)(Te,{})},{id:3,href:"/guestbook",text:"Guestbook",icon:(0,n.jsx)(Pe,{})},{id:4,href:"/bookshelf",text:"Bookshelf",icon:(0,n.jsx)(Re,{})}];function Ue(e){var t=e.href,r=e.text,o=e.icon;return(0,n.jsx)(je.default,{href:t,children:(0,n.jsxs)("a",{className:"group relative ml-1 flex h-14 w-14 flex-shrink-0 snap-end items-center justify-center rounded-2xl border-2 border-blue-600 border-opacity-0 bg-gray-200 transition-all hover:scale-110 hover:border-opacity-100 active:scale-95 dark:border-indigo-600 dark:border-opacity-0 dark:bg-gray-800 dark:hover:border-opacity-100 dark:hover:shadow-indigo-500/30 sm:m-0 sm:h-16 sm:w-16 sm:hover:shadow-md sm:hover:shadow-indigo-200",children:[(0,n.jsx)("span",{className:"h-8 w-8 text-gray-400 duration-300 group-hover:scale-125 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400",children:o}),(0,n.jsx)(_e,{text:r})]})})}function De(){var e=(0,o.useState)(!1),t=e[0],r=e[1],a=(0,o.useContext)(i),s=a.resolvedTheme,u=a.setTheme;return(0,o.useEffect)((function(){return r(!0)}),[]),(0,n.jsxs)("button",{onClick:function(){return u("dark"===s?"light":"dark")},type:"button",className:"group relative ml-1 flex h-14 w-14 flex-shrink-0 snap-end items-center justify-center rounded-2xl border-2 border-blue-600 border-opacity-0 bg-gray-200 transition-all hover:scale-110 hover:border-opacity-100 active:scale-95 dark:border-indigo-600 dark:border-opacity-0 dark:bg-gray-800 dark:hover:border-opacity-100 dark:hover:shadow-indigo-500/30 sm:m-0 sm:h-16 sm:w-16 sm:hover:shadow-md sm:hover:shadow-indigo-200",children:[(0,n.jsx)("span",{className:"h-8 w-8 text-gray-400 duration-300 group-hover:scale-125 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400",children:t&&"dark"===s?(0,n.jsx)(Me,{}):(0,n.jsx)(Le,{})}),t&&(0,n.jsx)(_e,{text:"dark"===s?"Light mode":"Dark mode"})]})}var $e=function(){return(0,n.jsx)("header",{className:"fixed bottom-6 left-1/2 z-10 w-5/6 max-w-min sm:max-w-none -translate-x-1/2 rounded-3xl border border-gray-300 bg-white/60 px-2.5 py-1.5 shadow backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/60 dark:shadow-black/60 sm:w-auto sm:p-2.5",children:(0,n.jsxs)("nav",{className:"flex snap-x items-center justify-start sm:gap-2.5 gap-1.5 overflow-x-auto sm:overflow-x-visible",children:[Ie.map((function(e){var t=e.id,r=Ce(e,["id"]);return(0,n.jsx)(Ue,function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){Ne(e,t,r[t])}))}return e}({},r),t)})),(0,n.jsx)("hr",{className:"h-16 rounded-lg border border-r ml-1 sm:ml-0 dark:border-gray-700"}),(0,n.jsx)(De,{}),(0,n.jsxs)("a",{href:"https://github.com/kevinzunigacuellar",target:"_blank",rel:"noopener noreferrer",className:"group relative ml-1 flex h-14 w-14 flex-shrink-0 snap-end items-center justify-center rounded-2xl border-2 border-blue-600 border-opacity-0 bg-gray-200 shadow-none transition-all hover:scale-110 hover:border-opacity-100 active:scale-95 dark:border-indigo-600 dark:border-opacity-0 dark:bg-gray-800 dark:hover:border-opacity-100 dark:hover:shadow-indigo-500/30 sm:m-0 sm:h-16 sm:w-16 sm:hover:shadow-md sm:hover:shadow-indigo-200",children:[(0,n.jsx)(Ee.Z,{className:"h-8 w-8 mb-0.5 fill-gray-400 duration-300 group-hover:scale-125 group-hover:fill-gray-500 dark:fill-gray-500 dark:group-hover:fill-gray-400"}),(0,n.jsx)(_e,{text:"GitHub"})]}),(0,n.jsxs)("a",{href:"https://www.linkedin.com/in/kevinzunigacuellar/",target:"_blank",rel:"noopener noreferrer",className:"group relative mr-1.5 ml-1 flex h-14 w-14 flex-shrink-0 snap-end items-center justify-center rounded-2xl border-2 border-blue-600 border-opacity-0 bg-gray-200 shadow-none transition-all hover:scale-110 hover:border-opacity-100 active:scale-95 dark:border-indigo-600 dark:border-opacity-0 dark:bg-gray-800 dark:hover:border-opacity-100 dark:hover:shadow-indigo-500/30 sm:m-0 sm:h-16 sm:w-16 sm:hover:shadow-md sm:hover:shadow-indigo-200",children:[(0,n.jsx)(Ae,{className:"ml-0.5 mb-0.5 h-8 w-8 fill-gray-400 duration-300 group-hover:scale-125 group-hover:fill-gray-500 dark:fill-gray-500 dark:group-hover:fill-gray-400"}),(0,n.jsx)(_e,{text:"LinkedIn"})]})]})})};function Ve(e){var t=e.children;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)($e,{}),(0,n.jsxs)("main",{className:"mx-auto max-w-3xl px-6 sm:px-8 mt-20 mb-36",children:[t,(0,n.jsx)("footer",{className:"mt-10 border-t pt-6 dark:border-gray-800",children:(0,n.jsx)(Oe,{})})]})]})}r(6774),r(4045);function ze(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function He(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){ze(e,t,r[t])}))}return e}function Be(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var Fe=function(e){var t=e.Component,r=e.pageProps.session,o=Be(e.pageProps,["session"]);return(0,n.jsx)(c,{attribute:"class",defaultTheme:"system",disableTransitionOnChange:!0,children:(0,n.jsx)(h.SessionProvider,{session:r,children:(0,n.jsx)(Ve,{children:(0,n.jsx)(t,He({},o))})})})}},6774:function(){},4045:function(){},7663:function(e){!function(){var t={162:function(e){var t,r,n=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===o||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"===typeof setTimeout?setTimeout:o}catch(e){t=o}try{r="function"===typeof clearTimeout?clearTimeout:a}catch(e){r=a}}();var s,u=[],c=!1,l=-1;function f(){c&&s&&(c=!1,s.length?u=s.concat(u):l=-1,u.length&&d())}function d(){if(!c){var e=i(f);c=!0;for(var t=u.length;t;){for(s=u,u=[];++l<t;)s&&s[l].run();l=-1,t=u.length}s=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function h(){}n.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];u.push(new p(e,t)),1!==u.length||c||i(d)},p.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=h,n.addListener=h,n.once=h,n.off=h,n.removeListener=h,n.removeAllListeners=h,n.emit=h,n.prependListener=h,n.prependOnceListener=h,n.listeners=function(e){return[]},n.binding=function(e){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(e){throw new Error("process.chdir is not supported")},n.umask=function(){return 0}}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var a=r[e]={exports:{}},i=!0;try{t[e](a,a.exports,n),i=!1}finally{i&&delete r[e]}return a.exports}n.ab="//";var o=n(162);e.exports=o}()},9008:function(e,t,r){e.exports=r(3121)},1664:function(e,t,r){e.exports=r(1551)},5666:function(e){var t=function(e){"use strict";var t,r=Object.prototype,n=r.hasOwnProperty,o="function"===typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag";function u(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{u({},"")}catch(M){u=function(e,t,r){return e[t]=r}}function c(e,t,r,n){var o=t&&t.prototype instanceof m?t:m,a=Object.create(o.prototype),i=new T(n||[]);return a._invoke=function(e,t,r){var n=f;return function(o,a){if(n===p)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw a;return R()}for(r.method=o,r.arg=a;;){var i=r.delegate;if(i){var s=E(i,r);if(s){if(s===v)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=h,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=p;var u=l(e,t,r);if("normal"===u.type){if(n=r.done?h:d,u.arg===v)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=h,r.method="throw",r.arg=u.arg)}}}(e,r,i),a}function l(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(M){return{type:"throw",arg:M}}}e.wrap=c;var f="suspendedStart",d="suspendedYield",p="executing",h="completed",v={};function m(){}function y(){}function g(){}var b={};u(b,a,(function(){return this}));var w=Object.getPrototypeOf,x=w&&w(w(P([])));x&&x!==r&&n.call(x,a)&&(b=x);var k=g.prototype=m.prototype=Object.create(b);function O(e){["next","throw","return"].forEach((function(t){u(e,t,(function(e){return this._invoke(t,e)}))}))}function j(e,t){function r(o,a,i,s){var u=l(e[o],e,a);if("throw"!==u.type){var c=u.arg,f=c.value;return f&&"object"===typeof f&&n.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,i,s)}),(function(e){r("throw",e,i,s)})):t.resolve(f).then((function(e){c.value=e,i(c)}),(function(e){return r("throw",e,i,s)}))}s(u.arg)}var o;this._invoke=function(e,n){function a(){return new t((function(t,o){r(e,n,t,o)}))}return o=o?o.then(a,a):a()}}function E(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,E(e,r),"throw"===r.method))return v;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var o=l(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,v;var a=o.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,v):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,v)}function _(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function T(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(_,this),this.reset(!0)}function P(e){if(e){var r=e[a];if(r)return r.call(e);if("function"===typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}return{next:R}}function R(){return{value:t,done:!0}}return y.prototype=g,u(k,"constructor",g),u(g,"constructor",y),y.displayName=u(g,s,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"===typeof e&&e.constructor;return!!t&&(t===y||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,g):(e.__proto__=g,u(e,s,"GeneratorFunction")),e.prototype=Object.create(k),e},e.awrap=function(e){return{__await:e}},O(j.prototype),u(j.prototype,i,(function(){return this})),e.AsyncIterator=j,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new j(c(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},O(k),u(k,s,"Generator"),u(k,a,(function(){return this})),u(k,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=P,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(S),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return s.type="throw",s.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(u&&c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,v):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),v},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),S(r),v}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:P(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),v}},e}(e.exports);try{regeneratorRuntime=t}catch(r){"object"===typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}},8100:function(e,t,r){"use strict";r.d(t,{J$:function(){return X},ZP:function(){return Z},kY:function(){return q}});var n=r(7294);function o(e,t,r,n){return new(r||(r=Promise))((function(o,a){function i(e){try{u(n.next(e))}catch(t){a(t)}}function s(e){try{u(n.throw(e))}catch(t){a(t)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(i,s)}u((n=n.apply(e,t||[])).next())}))}function a(e,t){var r,n,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"===typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(a){return function(s){return function(a){if(r)throw new TypeError("Generator is already executing.");for(;i;)try{if(r=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,n=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(e,i)}catch(s){a=[6,s],n=0}finally{r=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,s])}}}var i,s=function(){},u=s(),c=Object,l=function(e){return e===u},f=function(e){return"function"==typeof e},d=function(e,t){return c.assign({},e,t)},p="undefined",h=function(){return typeof window!=p},v=new WeakMap,m=0,y=function(e){var t,r,n=typeof e,o=e&&e.constructor,a=o==Date;if(c(e)!==e||a||o==RegExp)t=a?e.toJSON():"symbol"==n?e.toString():"string"==n?JSON.stringify(e):""+e;else{if(t=v.get(e))return t;if(t=++m+"~",v.set(e,t),o==Array){for(t="@",r=0;r<e.length;r++)t+=y(e[r])+",";v.set(e,t)}if(o==c){t="#";for(var i=c.keys(e).sort();!l(r=i.pop());)l(e[r])||(t+=r+":"+y(e[r])+",");v.set(e,t)}}return t},g=!0,b=h(),w=typeof document!=p,x=b&&window.addEventListener?window.addEventListener.bind(window):s,k=w?document.addEventListener.bind(document):s,O=b&&window.removeEventListener?window.removeEventListener.bind(window):s,j=w?document.removeEventListener.bind(document):s,E={isOnline:function(){return g},isVisible:function(){var e=w&&document.visibilityState;return l(e)||"hidden"!==e}},_={initFocus:function(e){return k("visibilitychange",e),x("focus",e),function(){j("visibilitychange",e),O("focus",e)}},initReconnect:function(e){var t=function(){g=!0,e()},r=function(){g=!1};return x("online",t),x("offline",r),function(){O("online",t),O("offline",r)}}},S=!h()||"Deno"in window,T=function(e){return h()&&typeof window.requestAnimationFrame!=p?window.requestAnimationFrame(e):setTimeout(e,1)},P=S?n.useEffect:n.useLayoutEffect,R="undefined"!==typeof navigator&&navigator.connection,M=!S&&R&&(["slow-2g","2g"].includes(R.effectiveType)||R.saveData),L=function(e){if(f(e))try{e=e()}catch(r){e=""}var t=[].concat(e);return[e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?y(e):"",t,e?"$swr$"+e:""]},A=new WeakMap,N=function(e,t,r,n,o,a,i){void 0===i&&(i=!0);var s=A.get(e),u=s[0],c=s[1],l=s[3],f=u[t],d=c[t];if(i&&d)for(var p=0;p<d.length;++p)d[p](r,n,o);return a&&(delete l[t],f&&f[0])?f[0](2).then((function(){return e.get(t)})):e.get(t)},C=0,I=function(){return++C},U=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return o(void 0,void 0,void 0,(function(){var t,r,n,o,i,s,c,p,h,v,m,y,g,b,w,x,k,O,j,E,_;return a(this,(function(a){switch(a.label){case 0:if(t=e[0],r=e[1],n=e[2],o=e[3],s=!!l((i="boolean"===typeof o?{revalidate:o}:o||{}).populateCache)||i.populateCache,c=!1!==i.revalidate,p=!1!==i.rollbackOnError,h=i.optimisticData,v=L(r),m=v[0],y=v[2],!m)return[2];if(g=A.get(t),b=g[2],e.length<3)return[2,N(t,m,t.get(m),u,u,c,!0)];if(w=n,k=I(),b[m]=[k,0],O=!l(h),j=t.get(m),O&&(E=f(h)?h(j):h,t.set(m,E),N(t,m,E)),f(w))try{w=w(t.get(m))}catch(S){x=S}return w&&f(w.then)?[4,w.catch((function(e){x=e}))]:[3,2];case 1:if(w=a.sent(),k!==b[m][0]){if(x)throw x;return[2,w]}x&&O&&p&&(s=!0,w=j,t.set(m,j)),a.label=2;case 2:return s&&(x||(f(s)&&(w=s(w,j)),t.set(m,w)),t.set(y,d(t.get(y),{error:x}))),b[m][1]=I(),[4,N(t,m,w,x,u,c,!!s)];case 3:if(_=a.sent(),x)throw x;return[2,s?_:w]}}))}))},D=function(e,t){for(var r in e)e[r][0]&&e[r][0](t)},$=function(e,t){if(!A.has(e)){var r=d(_,t),n={},o=U.bind(u,e),a=s;if(A.set(e,[n,{},{},{},o]),!S){var i=r.initFocus(setTimeout.bind(u,D.bind(u,n,0))),c=r.initReconnect(setTimeout.bind(u,D.bind(u,n,1)));a=function(){i&&i(),c&&c(),A.delete(e)}}return[e,o,a]}return[e,A.get(e)[4]]},V=$(new Map),z=V[0],H=V[1],B=d({onLoadingSlow:s,onSuccess:s,onError:s,onErrorRetry:function(e,t,r,n,o){var a=r.errorRetryCount,i=o.retryCount,s=~~((Math.random()+.5)*(1<<(i<8?i:8)))*r.errorRetryInterval;!l(a)&&i>a||setTimeout(n,s,o)},onDiscarded:s,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:M?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:M?5e3:3e3,compare:function(e,t){return y(e)==y(t)},isPaused:function(){return!1},cache:z,mutate:H,fallback:{}},E),F=function(e,t){var r=d(e,t);if(t){var n=e.use,o=e.fallback,a=t.use,i=t.fallback;n&&a&&(r.use=n.concat(a)),o&&i&&(r.fallback=d(o,i))}return r},Y=(0,n.createContext)({}),W=function(e){return f(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}]},q=function(){return d(B,(0,n.useContext)(Y))},G=function(e,t,r){var n=t[e]||(t[e]=[]);return n.push(r),function(){var e=n.indexOf(r);e>=0&&(n[e]=n[n.length-1],n.pop())}},K={dedupe:!0},X=c.defineProperty((function(e){var t=e.value,r=F((0,n.useContext)(Y),t),o=t&&t.provider,a=(0,n.useState)((function(){return o?$(o(r.cache||z),t):u}))[0];return a&&(r.cache=a[0],r.mutate=a[1]),P((function(){return a?a[2]:u}),[]),(0,n.createElement)(Y.Provider,d(e,{value:r}))}),"default",{value:B}),Z=(i=function(e,t,r){var i=r.cache,s=r.compare,c=r.fallbackData,p=r.suspense,h=r.revalidateOnMount,v=r.refreshInterval,m=r.refreshWhenHidden,y=r.refreshWhenOffline,g=A.get(i),b=g[0],w=g[1],x=g[2],k=g[3],O=L(e),j=O[0],E=O[1],_=O[2],R=(0,n.useRef)(!1),M=(0,n.useRef)(!1),C=(0,n.useRef)(j),D=(0,n.useRef)(t),$=(0,n.useRef)(r),V=function(){return $.current},z=function(){return V().isVisible()&&V().isOnline()},H=function(e){return i.set(_,d(i.get(_),e))},B=i.get(j),F=l(c)?r.fallback[j]:c,Y=l(B)?F:B,W=i.get(_)||{},q=W.error,X=!R.current,Z=function(){return X&&!l(h)?h:!V().isPaused()&&(p?!l(Y)&&r.revalidateIfStale:l(Y)||r.revalidateIfStale)},J=!(!j||!t)&&(!!W.isValidating||X&&Z()),Q=function(e,t){var r=(0,n.useState)({})[1],o=(0,n.useRef)(e),a=(0,n.useRef)({data:!1,error:!1,isValidating:!1}),i=(0,n.useCallback)((function(e){var n=!1,i=o.current;for(var s in e){var u=s;i[u]!==e[u]&&(i[u]=e[u],a.current[u]&&(n=!0))}n&&!t.current&&r({})}),[]);return P((function(){o.current=e})),[o,a.current,i]}({data:Y,error:q,isValidating:J},M),ee=Q[0],te=Q[1],re=Q[2],ne=(0,n.useCallback)((function(e){return o(void 0,void 0,void 0,(function(){var t,n,o,c,d,p,h,v,m,y,g,b,w;return a(this,(function(a){switch(a.label){case 0:if(t=D.current,!j||!t||M.current||V().isPaused())return[2,!1];c=!0,d=e||{},p=!k[j]||!d.dedupe,h=function(){return!M.current&&j===C.current&&R.current},v=function(){var e=k[j];e&&e[1]===o&&delete k[j]},m={isValidating:!1},y=function(){H({isValidating:!1}),h()&&re(m)},H({isValidating:!0}),re({isValidating:!0}),a.label=1;case 1:return a.trys.push([1,3,,4]),p&&(N(i,j,ee.current.data,ee.current.error,!0),r.loadingTimeout&&!i.get(j)&&setTimeout((function(){c&&h()&&V().onLoadingSlow(j,r)}),r.loadingTimeout),k[j]=[t.apply(void 0,E),I()]),w=k[j],n=w[0],o=w[1],[4,n];case 2:return n=a.sent(),p&&setTimeout(v,r.dedupingInterval),k[j]&&k[j][1]===o?(H({error:u}),m.error=u,g=x[j],!l(g)&&(o<=g[0]||o<=g[1]||0===g[1])?(y(),p&&h()&&V().onDiscarded(j),[2,!1]):(s(ee.current.data,n)?m.data=ee.current.data:m.data=n,s(i.get(j),n)||i.set(j,n),p&&h()&&V().onSuccess(n,j,r),[3,4])):(p&&h()&&V().onDiscarded(j),[2,!1]);case 3:return b=a.sent(),v(),V().isPaused()||(H({error:b}),m.error=b,p&&h()&&(V().onError(b,j,r),("boolean"===typeof r.shouldRetryOnError&&r.shouldRetryOnError||f(r.shouldRetryOnError)&&r.shouldRetryOnError(b))&&z()&&V().onErrorRetry(b,j,r,ne,{retryCount:(d.retryCount||0)+1,dedupe:!0}))),[3,4];case 4:return c=!1,y(),h()&&p&&N(i,j,m.data,m.error,!1),[2,!0]}}))}))}),[j]),oe=(0,n.useCallback)(U.bind(u,i,(function(){return C.current})),[]);if(P((function(){D.current=t,$.current=r})),P((function(){if(j){var e=j!==C.current,t=ne.bind(u,K),r=0,n=G(j,w,(function(e,t,r){re(d({error:t,isValidating:r},s(ee.current.data,e)?u:{data:e}))})),o=G(j,b,(function(e){if(0==e){var n=Date.now();V().revalidateOnFocus&&n>r&&z()&&(r=n+V().focusThrottleInterval,t())}else if(1==e)V().revalidateOnReconnect&&z()&&t();else if(2==e)return ne()}));return M.current=!1,C.current=j,R.current=!0,e&&re({data:Y,error:q,isValidating:J}),Z()&&(l(Y)||S?t():T(t)),function(){M.current=!0,n(),o()}}}),[j,ne]),P((function(){var e;function t(){var t=f(v)?v(Y):v;t&&-1!==e&&(e=setTimeout(r,t))}function r(){ee.current.error||!m&&!V().isVisible()||!y&&!V().isOnline()?t():ne(K).then(t)}return t(),function(){e&&(clearTimeout(e),e=-1)}}),[v,m,y,ne]),(0,n.useDebugValue)(Y),p&&l(Y)&&j)throw D.current=t,$.current=r,M.current=!1,l(q)?ne(K):q;return{mutate:oe,get data(){return te.data=!0,Y},get error(){return te.error=!0,q},get isValidating(){return te.isValidating=!0,J}}},function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=q(),n=W(e),o=n[0],a=n[1],s=n[2],u=F(r,s),c=i,l=u.use;if(l)for(var f=l.length;f-- >0;)c=l[f](c);return c(o,a||u.fetcher,u)})}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],(function(){return t(6363),t(880)}));var r=e.O();_N_E=r}]);