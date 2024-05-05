"use strict";
(self.webpackChunkemailwish_widgets = self.webpackChunkemailwish_widgets || []).push([
    [322],
    {
        7657: function (t, e, n) {
            var r = n(7294);
            e.Z = () => {
                const t = (0, r.useRef)(!1);
                return (0, r.useEffect)(() => ((t.current = !0), () => (t.current = !1)), []), t;
            };
        },
        9322: function (t, e, u) {
            u.r(e);
            var c = u(5893),
                f = u(7294),
                h = u(101),
                l = u(7657),
                d = function () {
                    return (d =
                        Object.assign ||
                        function (t) {
                            for (var e, n = 1, r = arguments.length; n < r; n++) for (var s in (e = arguments[n])) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
                            return t;
                        }).apply(this, arguments);
                };
            e.default = function (t) {
                var e = t.client_id,
                    n = (0, f.lazy)(function () {
                        return Promise.all([u.e(987), u.e(727), u.e(909), u.e(452), u.e(325), u.e(224), u.e(329)]).then(u.bind(u, 3329));
                    }),
                    r = (0, l.Z)(),
                    s = (a = (0, f.useState)())[0],
                    o = a[1],
                    a = (t = (0, f.useState)(!1))[0],
                    i = t[1];
                return (
                    (0, f.useEffect)(
                        function () {
                            new h.Z().get_session(e).then(function (t) {
                                r.current && (h.Z.hasError(t) || o(t));
                            });
                        },
                        [r, e]
                    ),
                    s
                        ? (0, c.jsx)(
                              f.Suspense,
                              d(
                                  { fallback: null },
                                  {
                                      children:
                                          s.chat_session &&
                                          s.chat_settings &&
                                          (0, c.jsx)(
                                              n,
                                              {
                                                  restart_session: function () {
                                                      new h.Z().get_session(e).then(function (t) {
                                                          r.current && (h.Z.hasError(t) || (o(t), i(!0)));
                                                      });
                                                  },
                                                  guest_session: s.chat_session,
                                                  ui_testing: !1,
                                                  preview: a,
                                                  chat_settings: s.chat_settings,
                                                  logo_image: s.chat_settings.bot_image,
                                              },
                                              s.chat_session && s.chat_session.id
                                          ),
                                  }
                              ),
                              void 0
                          )
                        : null
                );
            };
        },
        9168: function (t, e, n) {
            n.d(e, {
                J: function () {
                    return u;
                },
            });
            var r = n(9669),
                s = n.n(r),
                o = function () {
                    return (o =
                        Object.assign ||
                        function (t) {
                            for (var e, n = 1, r = arguments.length; n < r; n++) for (var s in (e = arguments[n])) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
                            return t;
                        }).apply(this, arguments);
                },
                a = function (t, a, i, u) {
                    return new (i = i || Promise)(function (n, e) {
                        function r(t) {
                            try {
                                o(u.next(t));
                            } catch (t) {
                                e(t);
                            }
                        }
                        function s(t) {
                            try {
                                o(u.throw(t));
                            } catch (t) {
                                e(t);
                            }
                        }
                        function o(t) {
                            var e;
                            t.done
                                ? n(t.value)
                                : ((e = t.value) instanceof i
                                      ? e
                                      : new i(function (t) {
                                            t(e);
                                        })
                                  ).then(r, s);
                        }
                        o((u = u.apply(t, a || [])).next());
                    });
                },
                i = function (n, r) {
                    var s,
                        o,
                        a,
                        i = {
                            label: 0,
                            sent: function () {
                                if (1 & a[0]) throw a[1];
                                return a[1];
                            },
                            trys: [],
                            ops: [],
                        },
                        t = { next: e(0), throw: e(1), return: e(2) };
                    return (
                        "function" == typeof Symbol &&
                            (t[Symbol.iterator] = function () {
                                return this;
                            }),
                        t
                    );
                    function e(e) {
                        return function (t) {
                            return (function (e) {
                                if (s) throw new TypeError("Generator is already executing.");
                                for (; i; )
                                    try {
                                        if (((s = 1), o && (a = 2 & e[0] ? o.return : e[0] ? o.throw || ((a = o.return) && a.call(o), 0) : o.next) && !(a = a.call(o, e[1])).done)) return a;
                                        switch (((o = 0), (e = a ? [2 & e[0], a.value] : e)[0])) {
                                            case 0:
                                            case 1:
                                                a = e;
                                                break;
                                            case 4:
                                                return i.label++, { value: e[1], done: !1 };
                                            case 5:
                                                i.label++, (o = e[1]), (e = [0]);
                                                continue;
                                            case 7:
                                                (e = i.ops.pop()), i.trys.pop();
                                                continue;
                                            default:
                                                if (!(a = 0 < (a = i.trys).length && a[a.length - 1]) && (6 === e[0] || 2 === e[0])) {
                                                    i = 0;
                                                    continue;
                                                }
                                                if (3 === e[0] && (!a || (e[1] > a[0] && e[1] < a[3]))) {
                                                    i.label = e[1];
                                                    break;
                                                }
                                                if (6 === e[0] && i.label < a[1]) {
                                                    (i.label = a[1]), (a = e);
                                                    break;
                                                }
                                                if (a && i.label < a[2]) {
                                                    (i.label = a[2]), i.ops.push(e);
                                                    break;
                                                }
                                                a[2] && i.ops.pop(), i.trys.pop();
                                                continue;
                                        }
                                        e = r.call(n, i);
                                    } catch (t) {
                                        (e = [6, t]), (o = 0);
                                    } finally {
                                        s = a = 0;
                                    }
                                if (5 & e[0]) throw e[1];
                                return { value: e[0] ? e[1] : void 0, done: !0 };
                            })([e, t]);
                        };
                    }
                },
                u = function (t) {
                    var o = this;
                    (this.process_params = function (r, s) {
                        for (var t in r)
                            !(function (t) {
                                var e, n;
                                r.hasOwnProperty(t) &&
                                    ((e = s ? s + "[" + t + "]" : t),
                                    "string" == typeof (t = r[t])
                                        ? o.flattened_data.push({ key: e, value: t })
                                        : "number" == typeof t
                                        ? o.flattened_data.push({ key: e, value: t + "" })
                                        : "boolean" == typeof t
                                        ? o.flattened_data.push({ key: e, value: t ? "true" : "false" })
                                        : void 0 === t ||
                                          (Array.isArray(t)
                                              ? ((n = {}),
                                                t.forEach(function (t, e) {
                                                    return (n[e + ""] = t);
                                                }))
                                              : (n = t),
                                          o.process_params(n, e)));
                            })(t);
                    }),
                        (this.get_form_data = function () {
                            return o.flattened_data;
                        }),
                        (this.flattened_data = []),
                        this.process_params(t, "");
                },
                r =
                    ((c.getErrorString = function (t) {
                        return "string" == typeof t ? t : t.join(" ");
                    }),
                    (c.csrfToken = { token: "dummy_expired_token", expiry: new Date(0) }),
                    (c.hasError = function (t) {
                        return !t || 400 <= t.statusCode || !(t && !t.validation_errors) || void 0;
                    }),
                    (c.getError = function (t) {
                        return t.message && "string" == typeof t.message
                            ? t.message
                            : t.validation_errors
                            ? t.validation_errors.csrf
                                ? c.getErrorString(t.validation_errors.csrf)
                                : t.validation_errors.network
                                ? c.getErrorString(t.validation_errors.network)
                                : t.validation_errors.email
                                ? c.getErrorString(t.validation_errors.email)
                                : t.validation_errors.password
                                ? c.getErrorString(t.validation_errors.password)
                                : t.validation_errors.name
                                ? c.getErrorString(t.validation_errors.name)
                                : "Unknown error!"
                            : c.getErrorFromStatusCode(t);
                    }),
                    (c.getErrorFromStatusCode = function (t) {
                        switch (t.statusCode) {
                            case 400:
                                return "Request error: Bad Request";
                            case 401:
                                return "Request error: Unauthorized";
                            case 402:
                                return "Request error: Payment Required";
                            case 403:
                                return "Request error: Forbidden";
                            case 404:
                                return "Request error: Not Found";
                            case 405:
                                return "Request error: Method Not Allowed";
                            case 500:
                                return "Server error: Internal error";
                            case 501:
                                return "Server error: Not Implemented";
                            case 502:
                                return "Server error: Bad Gateway";
                            case 503:
                                return "Server error: Service Unavailable";
                            case 504:
                                return "Server error: Gateway Timeout";
                            default:
                                return "Unknown error";
                        }
                    }),
                    c);
            function c() {
                var e = this;
                (this.getApiBaseURL = function () {
                    return "http://builder.emailwish.com";
                }),
                    (this.getCsrfToken = function (t) {
                        return (
                            void 0 === t && (t = !1),
                            a(e, void 0, void 0, function () {
                                return i(this, function (t) {
                                    return [
                                        2,
                                        this.fetchCsrfToken().then(function (t) {
                                            return c.hasError(t) || !t.token ? "" : t.token;
                                        }),
                                    ];
                                });
                            })
                        );
                    }),
                    (this.fetchCsrfToken = function () {
                        return s()
                            .get(e.getApiBaseURL() + "/_api/v1/csrf-token", { withCredentials: !0 })
                            .then(function (t) {
                                return o({ statusCode: t.status }, t.data);
                            })
                            .catch(function (t) {});
                    }),
                    (this.ipLocation = function () {
                        return s()
                            .get(e.getApiBaseURL() + "/_api/v1/ip-location", { withCredentials: !0 })
                            .then(function (t) {
                                return o({ statusCode: t.status }, t.data);
                            })
                            .catch(function (t) {});
                    }),
                    (this.handleCatch = function (t) {
                        return (
                            console.log("error"),
                            console.log(t),
                            t && t.response && t.response.status && t.response.data
                                ? o(o({}, t.response.data), { statusCode: t.response.status })
                                : t instanceof s().Cancel
                                ? { statusCode: 999, message: void 0 }
                                : { statusCode: 999, message: "Network Error" }
                        );
                    });
            }
            e.Z = r;
        },
        101: function (t, e, n) {
            var secret_key
            var session_id
            
            var r,
                s,
                o = n(9168),
                a = n(9669),
                u = n.n(a),
                a =
                    ((r = function (t, e) {
                        return (r =
                            Object.setPrototypeOf ||
                            ({ __proto__: [] } instanceof Array &&
                                function (t, e) {
                                    t.__proto__ = e;
                                }) ||
                            function (t, e) {
                                for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                            })(t, e);
                    }),
                    function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    }),
                c = function () {
                    return (c =
                        Object.assign ||
                        function (t) {
                            for (var e, n = 1, r = arguments.length; n < r; n++) for (var s in (e = arguments[n])) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
                            return t;
                        }).apply(this, arguments);
                },
                f = function (t, a, i, u) {
                    return new (i = i || Promise)(function (n, e) {
                        function r(t) {
                            try {
                                o(u.next(t));
                            } catch (t) {
                                e(t);
                            }
                        }
                        function s(t) {
                            try {
                                o(u.throw(t));
                            } catch (t) {
                                e(t);
                            }
                        }
                        function o(t) {
                            var e;
                            t.done
                                ? n(t.value)
                                : ((e = t.value) instanceof i
                                      ? e
                                      : new i(function (t) {
                                            t(e);
                                        })
                                  ).then(r, s);
                        }
                        o((u = u.apply(t, a || [])).next());
                    });
                },
                h = function (n, r) {
                    var s,
                        o,
                        a,
                        i = {
                            label: 0,
                            sent: function () {
                                if (1 & a[0]) throw a[1];
                                return a[1];
                            },
                            trys: [],
                            ops: [],
                        },
                        t = { next: e(0), throw: e(1), return: e(2) };
                    return (
                        "function" == typeof Symbol &&
                            (t[Symbol.iterator] = function () {
                                return this;
                            }),
                        t
                    );
                    function e(e) {
                        return function (t) {
                            return (function (e) {
                                if (s) throw new TypeError("Generator is already executing.");
                                for (; i; )
                                    try {
                                        if (((s = 1), o && (a = 2 & e[0] ? o.return : e[0] ? o.throw || ((a = o.return) && a.call(o), 0) : o.next) && !(a = a.call(o, e[1])).done)) return a;
                                        switch (((o = 0), (e = a ? [2 & e[0], a.value] : e)[0])) {
                                            case 0:
                                            case 1:
                                                a = e;
                                                break;
                                            case 4:
                                                return i.label++, { value: e[1], done: !1 };
                                            case 5:
                                                i.label++, (o = e[1]), (e = [0]);
                                                continue;
                                            case 7:
                                                (e = i.ops.pop()), i.trys.pop();
                                                continue;
                                            default:
                                                if (!(a = 0 < (a = i.trys).length && a[a.length - 1]) && (6 === e[0] || 2 === e[0])) {
                                                    i = 0;
                                                    continue;
                                                }
                                                if (3 === e[0] && (!a || (e[1] > a[0] && e[1] < a[3]))) {
                                                    i.label = e[1];
                                                    break;
                                                }
                                                if (6 === e[0] && i.label < a[1]) {
                                                    (i.label = a[1]), (a = e);
                                                    break;
                                                }
                                                if (a && i.label < a[2]) {
                                                    (i.label = a[2]), i.ops.push(e);
                                                    break;
                                                }
                                                a[2] && i.ops.pop(), i.trys.pop();
                                                continue;
                                        }
                                        e = r.call(n, i);
                                    } catch (t) {
                                        (e = [6, t]), (o = 0);
                                    } finally {
                                        s = a = 0;
                                    }
                                if (5 & e[0]) throw e[1];
                                return { value: e[0] ? e[1] : void 0, done: !0 };
                            })([e, t]);
                        };
                    }
                },
                a = ((s = o.Z), a(i, s), i);
            function i() {
                const { fetch: originalFetch } = window;
                window.fetch = async (...args) => {
                    let [resource, config ] = args;
                    const response = await originalFetch(resource, config);
                    console.log(resource)
                    if (['/cart/add',
                            '/cart/update',
                            '/cart/change',
                            '/cart/clear',
                        ].includes(resource)) {
                        i.update_cart()
                    }
                    return response;
                };
                var i = (null !== s && s.apply(this, arguments)) || this;
                
                return (
                    (i.getCustomerAvatarURL = function (t, e) {
                        console.log(t)
                        return i.getApiBaseURL() + "/assets/images/avatar/customer-" + t + ".jpg?t=" + e;
                    }),
                    (i.update_cart = function () {
                        var cart = {}
                         fetch("/cart.js")
                        .then(function(response){
                            return response.json();
                        }).then(function (jsonResponse) {
                            cart=jsonResponse
                        }).finally(() => {
                            return f(i, void 0, void 0, function () {
                                var e,
                                    n = this;
                                return h(this, function (t) {
                                    return (
                                        (e = new FormData()).set("cart", JSON.stringify(cart)),
                                        e.set("session_id", (session_id) || ""),
                                        e.set("secret_key", (secret_key.toString()) || ""),
                                        [
                                            2,
                                            u()
                                                .post(this.getApiBaseURL() + "/_shopify/chat/sessions/update_cart", e, { headers: { "Content-Type": "application/x-www-form-urlencoded" }, withCredentials: !0 })
                                                .then(function (t) {
                                                    return c({ statusCode: t.status }, t.data);
                                                })
                                                .catch(function (t) {
                                                    return n.handleCatch(t);
                                                }),
                                        ]
                                    );
                                });
                            });
                        })
                        
                    }),
                    (i.update_form = function (r, s) {
                            return f(i, void 0, void 0, function () {
                                var e,
                                    n = this;
                                return h(this, function (t) {
                                    return (
                                        (e = new FormData()).set("name", r.name),
                                        e.set("email", r.email),
                                        e.set("session_id", (s && s.id.toString()) || ""),
                                        e.set("secret_key", (s && s.secret_key.toString()) || ""),
                                        [
                                            2,
                                            u()
                                                .post(this.getApiBaseURL() + "/_shopify/chat/sessions/update", e, { headers: { "Content-Type": "application/x-www-form-urlencoded" }, withCredentials: !0 })
                                                .then(function (t) {
                                                    return c({ statusCode: t.status }, t.data);
                                                })
                                                .catch(function (t) {
                                                    return n.handleCatch(t);
                                                }),
                                        ]
                                    );
                                });
                            });
                        
                    }),
                    (i.end_chat = function (r) {
                        return f(i, void 0, void 0, function () {
                            var e,
                                n = this;
                            return h(this, function (t) {
                                return (
                                    (e = new FormData()).set("session_id", (r && r.id.toString()) || ""),
                                    e.set("secret_key", (r && r.secret_key.toString()) || ""),
                                    [
                                        2,
                                        u()
                                            .post(this.getApiBaseURL() + "/_shopify/chat/sessions/end_chat", e, { headers: { "Content-Type": "application/x-www-form-urlencoded" }, withCredentials: !0 })
                                            .then(function (t) {
                                                return c({ statusCode: t.status }, t.data);
                                            })
                                            .catch(function (t) {
                                                return n.handleCatch(t);
                                            }),
                                    ]
                                );
                            });
                        });
                    }),
                    (i.no_end_chat = function (r) {
                        return f(i, void 0, void 0, function () {
                            var e,
                                n = this;
                            return h(this, function (t) {
                                return (
                                    (e = new FormData()).set("session_id", (r && r.id.toString()) || ""),
                                    e.set("secret_key", (r && r.secret_key.toString()) || ""),
                                    [
                                        2,
                                        u()
                                            .post(this.getApiBaseURL() + "/_shopify/chat/sessions/no_end_chat", e, { headers: { "Content-Type": "application/x-www-form-urlencoded" }, withCredentials: !0 })
                                            .then(function (t) {
                                                return c({ statusCode: t.status }, t.data);
                                            })
                                            .catch(function (t) {
                                                return n.handleCatch(t);
                                            }),
                                    ]
                                );
                            });
                        });
                    }),
                    (i.get_session = function (n) {
                        return f(i, void 0, void 0, function () {
                            var e = this;
                            var customer_id = __st.cid ?? ""
                            return h(this, function (t) {
                                return [
                                    2,
                                    u()
                                        .get(this.getApiBaseURL() + "/_shopify/chat/sessions/get_or_create", { headers: { "Content-Type": "application/json" }, withCredentials: !0, params: { client_uid: n, shopify_customer_id: customer_id } })
                                        .then(function (t) {
                                            secret_key = t.data.chat_session.secret_key
                                            session_id = t.data.chat_session.id
                                            i.update_cart()
                                            return c({ statusCode: t.status }, t.data);
                                        })
                                        .catch(function (t) {
                                            return e.handleCatch(t);
                                        }),
                                ];
                            });
                        });
                    }),
                    (i.end_session = function (r, s, o) {
                        return f(i, void 0, void 0, function () {
                            var e,
                                n = this;
                            return h(this, function (t) {
                                return (
                                    (e = new FormData()).set("session_id", (r && r.id.toString()) || ""),
                                    e.set("secret_key", (r && r.secret_key.toString()) || ""),
                                    e.set("feedback_rating", s.toString() || ""),
                                    e.set("feedback_message", o.toString() || ""),
                                    [
                                        2,
                                        u()
                                            .post(this.getApiBaseURL() + "/_shopify/chat/sessions/end", e, { withCredentials: !0 })
                                            .then(function (t) {
                                                return c({ statusCode: t.status }, t.data);
                                            })
                                            .catch(function (t) {
                                                return n.handleCatch(t);
                                            }),
                                    ]
                                );
                            });
                        });
                    }),
                    (i.read_messages = function (n, r) {
                        return f(i, void 0, void 0, function () {
                            var e = this;
                            return h(this, function (t) {
                                return [
                                    2,
                                    u()
                                        .post(
                                            this.getApiBaseURL() + "/_shopify/chat/messages/read",
                                            { session_id: n && n.id, secret_key: n && n.secret_key, last_id: r },
                                            { headers: { "Content-Type": "application/json" }, withCredentials: !0 }
                                        )
                                        .then(function (t) {
                                            return c({ statusCode: t.status }, t.data);
                                        })
                                        .catch(function (t) {
                                            return e.handleCatch(t);
                                        }),
                                ];
                            });
                        });
                    }),
                    (i.send_messages = function (r, s, o, a) {
                        return f(i, void 0, void 0, function () {
                            var e,
                                n = this;
                            return h(this, function (t) {
                                return (
                                    (e = new FormData()).set("message", r),
                                    s && e.set("attachment", s),
                                    e.set("session_id", (o && o.id.toString()) || ""),
                                    e.set("secret_key", (o && o.secret_key) || ""),
                                    [
                                        2,
                                        u()
                                            .post(this.getApiBaseURL() + "/_shopify/chat/messages/send", e, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: !0, onUploadProgress: s && a })
                                            .then(function (t) {
                                                return c({ statusCode: t.status }, t.data);
                                            })
                                            .catch(function (t) {
                                                return n.handleCatch(t);
                                            }),
                                    ]
                                );
                            });
                        });
                    }),
                    (i.send_messages_end_chat = function (r) {
                        return f(i, void 0, void 0, function () {
                            var e,
                                n = this;
                            return h(this, function (t) {
                                return (
                                    (e = new FormData()).set("session_id", (r && r.id.toString()) || ""),
                                    e.set("secret_key", (r && r.secret_key) || ""),
                                    e.set("message_type", "end_chat"),
                                    e.set("message", ""),
                                    [
                                        2,
                                        u()
                                            .post(this.getApiBaseURL() + "/_shopify/chat/messages/send", e, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: !0 })
                                            .then(function (t) {
                                                return c({ statusCode: t.status }, t.data);
                                            })
                                            .catch(function (t) {
                                                return n.handleCatch(t);
                                            }),
                                    ]
                                );
                            });
                        });
                    }),
                    i
                );
            }
            e.Z = a;
            
        },
    },
]);
