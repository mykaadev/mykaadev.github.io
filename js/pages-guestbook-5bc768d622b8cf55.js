(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [252], {
        3714: function(e, t, n) {
            (window.__NEXT_P = window.__NEXT_P || []).push(["/guestbook", function() { return n(5567) }])
        },
        9334: function(e, t, n) {
            "use strict";
            n.d(t, { Z: function() { return s } });
            var r = n(5893),
                a = n(9008),
                i = n(1163);

            function s(e) {
                var t = e.children,
                    n = e.title,
                    s = e.description,
                    o = e.image,
                    c = e.date,
                    u = (0, i.useRouter)();
                return (0, r.jsxs)(r.Fragment, { children: [(0, r.jsxs)(a.default, { children: [(0, r.jsx)("title", { children: n }), (0, r.jsx)("meta", { name: "robots", content: "follow, index" }), (0, r.jsx)("meta", { content: s, name: "description" }), (0, r.jsx)("meta", { property: "og:url", content: "https://kevinzunigacuellar.com".concat(u.asPath) }), (0, r.jsx)("link", { rel: "canonical", href: "https://kevinzunigacuellar.com".concat(u.asPath) }), (0, r.jsx)("meta", { property: "og:type", content: "website" }), (0, r.jsx)("meta", { property: "og:site_name", content: "Kevin Zuniga Cuellar" }), (0, r.jsx)("meta", { property: "og:description", content: s }), (0, r.jsx)("meta", { property: "og:title", content: n }), (0, r.jsx)("meta", { property: "og:image", content: o }), (0, r.jsx)("meta", { name: "twitter:card", content: "summary_large_image" }), (0, r.jsx)("meta", { name: "twitter:site", content: "@kevinzunigacuel" }), (0, r.jsx)("meta", { name: "twitter:title", content: n }), (0, r.jsx)("meta", { name: "twitter:description", content: s }), (0, r.jsx)("meta", { name: "twitter:image", content: o }), c && (0, r.jsx)("meta", { property: "article:published_time", content: c })] }), t] })
            }
            s.defaultProps = { title: "Kevin Zuniga Cuellar", description: "Software engineer, TypeScript enthusiast, and a passionate learner.", image: "https://kevinzunigacuellar.com/banner.png", date: "" }
        },
        3505: function(e, t, n) {
            "use strict";
            n.d(t, { Z: function() { return a } });
            var r = n(5893);

            function a(e) {
                var t = e.title,
                    n = e.icon;
                return (0, r.jsxs)("header", { className: "mb-8 flex items-center space-x-4 text-gray-800 dark:text-white md:mb-10", children: [(0, r.jsx)("span", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm p-2 text-gray-500/80 dark:bg-gray-800 dark:text-gray-500", children: n }), (0, r.jsx)("h1", { className: "text-3xl font-bold tracking-tight sm:text-4xl", children: t })] })
            }
        },
        5567: function(e, t, n) {
            "use strict";
            n.r(t), n.d(t, { __N_SSG: function() { return S }, default: function() { return P } });
            var r = n(4051),
                a = n.n(r),
                i = n(5893),
                s = n(7536),
                o = n(3299),
                c = n(8100),
                u = n(4931),
                l = n(9334),
                d = n(3595),
                m = n(7381),
                g = n(6965),
                b = n(3505),
                x = n(8945),
                f = n(8638);

            function h(e, t, n, r, a, i, s) {
                try {
                    var o = e[i](s),
                        c = o.value
                } catch (u) { return void n(u) }
                o.done ? t(c) : Promise.resolve(c).then(r, a)
            }

            function p(e) {
                return function() {
                    var t = this,
                        n = arguments;
                    return new Promise((function(r, a) {
                        var i = e.apply(t, n);

                        function s(e) { h(i, r, a, s, o, "next", e) }

                        function o(e) { h(i, r, a, s, o, "throw", e) }
                        s(void 0)
                    }))
                }
            }

            function y(e, t, n) { return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e }

            function k(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {},
                        r = Object.keys(n);
                    "function" === typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) { return Object.getOwnPropertyDescriptor(n, e).enumerable })))), r.forEach((function(t) { y(e, t, n[t]) }))
                }
                return e
            }

            function j() {
                var e, t = (0, c.kY)().mutate,
                    n = (0, s.cI)(),
                    r = n.register,
                    o = n.handleSubmit,
                    l = n.reset,
                    m = n.formState,
                    g = m.errors,
                    b = m.isSubmitting,
                    x = function() {
                        var e = p(a().mark((function e(n) {
                            return a().wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, u.ZP.promise(fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(n) }), { loading: "Posting your comment...", success: "Thank you for your comment!", error: "Something went wrong. Please try again later." }, { style: { minWidth: "200px" }, success: { duration: 5e3 } });
                                    case 2:
                                        return e.next = 4, t("/api/guestbook").then((function() { return l() }));
                                    case 4:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })));
                        return function(t) { return e.apply(this, arguments) }
                    }();
                return (0, i.jsxs)(i.Fragment, { children: [(0, i.jsxs)("form", { className: "relative", onSubmit: o(x), children: [(0, i.jsx)("input", k({ type: "text" }, r("body", { required: "Don't forget to write something", maxLength: 200 }), { placeholder: "Your message...", disabled: b, className: "block w-full rounded-lg border-0 bg-gray-50 py-2 pl-3 pr-28 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-300 dark:focus:bg-gray-900 dark:focus:ring-indigo-500 sm:pr-32" })), (0, i.jsxs)("button", { type: "submit", disabled: b, className: "bg-white-500 absolute top-[2px] right-[2px] flex w-24 items-center justify-center rounded-md bg-gray-200 px-4 py-2 font-semibold leading-5 text-gray-900 transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800 dark:disabled:bg-gray-900 dark:disabled:text-gray-400 sm:w-28", children: ["Sign", b && (0, i.jsx)(d.Z, { className: "ml-2 block h-4 w-4 animate-spin" })] })] }), (0, i.jsx)("span", { className: "block text-sm font-semibold text-red-500 dark:text-red-400 mt-2", children: null === (e = g.body) || void 0 === e ? void 0 : e.message })] })
            }

            function v() { return (0, i.jsxs)("button", { className: "focus:ring-3 flex shrink-0 items-center rounded-xl border border-gray-800 bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 dark:hover:border-gray-400", onClick: function() { return (0, o.signIn)("github") }, type: "button", children: [(0, i.jsx)(m.Z, { className: "mr-2 inline-block h-auto w-5 fill-white" }), " Sign in with GitHub"] }) }

            function w() { var e = (0, o.useSession)().status; return "loading" === e ? (0, i.jsx)(d.Z, { className: "my-2 inline-block h-5 w-auto animate-spin" }) : "unauthenticated" === e ? (0, i.jsx)(v, {}) : (0, i.jsx)(j, {}) }

            function N(e) {
                var t, n = e.entry,
                    r = (0, c.kY)().mutate,
                    s = (0, o.useSession)().data,
                    u = function() {
                        var e = p(a().mark((function e() {
                            return a().wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, fetch("/api/guestbook/".concat(n.id), { method: "DELETE" });
                                    case 2:
                                        return e.next = 4, r("/api/guestbook");
                                    case 4:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })));
                        return function() { return e.apply(this, arguments) }
                    }();
                return (0, i.jsxs)("div", { className: "p-6 dark:border-gray-700", children: [(0, i.jsx)("p", { className: "text-gray-900 dark:text-gray-300", children: n.body }), (0, i.jsxs)("div", { className: "sm:flex sm:justify-between sm:items-center", children: [(0, i.jsxs)("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: [(0, i.jsx)("span", { children: n.created_by }), " \xb7", " ", (0, i.jsx)("time", { dateTime: n.updated_at, children: new Date(n.updated_at).toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" }) })] }), (null === s || void 0 === s || null === (t = s.user) || void 0 === t ? void 0 : t.email) === n.email && (0, i.jsx)("button", { type: "button", onClick: u, className: "text-gray-500 text-sm font-semibold inline-block p-1 -ml-1.5 hover:bg-red-200 hover:text-red-800 rounded-full mt-2 sm:m-0 transition-colors", children: (0, i.jsx)(x.Z, { className: "h-5" }) })] })] })
            }

            function _() { var e = (0, c.ZP)("/api/guestbook", g.Z).data; return (0, i.jsx)("div", { className: "grid grid-cols-1 divide-y bg-white rounded-xl shadow dark:bg-gray-800 dark:shadow-black/50", children: null === e || void 0 === e ? void 0 : e.map((function(e) { return (0, i.jsx)(N, { entry: e }, e.id) })) }) }
            var S = !0;

            function P(e) { var t = e.fallback; return (0, i.jsxs)(l.Z, { title: "Guestbook \u2013 Kevin Zuniga Cuellar", children: [(0, i.jsx)(b.Z, { title: "Guestbook", icon: (0, i.jsx)(f.Z, {}) }), (0, i.jsxs)("section", { className: "mb-8 rounded-xl border border-blue-200 bg-blue-100 p-6 dark:border-indigo-500 dark:bg-indigo-800/90", children: [(0, i.jsx)("h2", { className: "mb-2 text-xl font-semibold text-gray-900 dark:text-white", children: "Sign the Guestbook" }), (0, i.jsx)("p", { className: "mb-4 leading-7 text-gray-600 dark:text-blue-200", children: "Feel free to share a message with a future visitor or tell me what you like the most about my website." }), (0, i.jsx)(w, {})] }), (0, i.jsx)(c.J$, { value: { fallback: t }, children: (0, i.jsx)(_, {}) }), (0, i.jsx)(u.x7, {})] }) }
        }
    },
    function(e) {
        e.O(0, [812, 774, 888, 179], (function() { return t = 3714, e(e.s = t); var t }));
        var t = e.O();
        _N_E = t
    }
]);