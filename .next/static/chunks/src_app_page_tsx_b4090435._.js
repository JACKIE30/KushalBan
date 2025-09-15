(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$LandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/LandingPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$LoginSignup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/LoginSignup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/Dashboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$ClaimSubmission$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/ClaimSubmission.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$ClaimsManagement$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/ClaimsManagement.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Allotments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/Allotments.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$DocumentCenter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/DocumentCenter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$OCRProcessor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/OCRProcessor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/Layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/LanguageContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$fra$2d$atlas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/pages/fra-atlas.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
// Map URL → Page
const pathToPage = {
    '/': 'landing',
    '/auth': 'auth',
    '/dashboard': 'dashboard',
    '/dashboard/submit-claim': 'submit-claim',
    '/dashboard/claims': 'claims',
    '/dashboard/allotments': 'allotments',
    '/dashboard/documents': 'documents',
    '/dashboard/ocr-processing': 'ocr-processing',
    '/dashboard/fra-atlas': 'atlas'
};
// Map Page → URL
const pageToPath = {
    landing: '/',
    auth: '/auth',
    dashboard: '/dashboard',
    'submit-claim': '/dashboard/submit-claim',
    claims: '/dashboard/claims',
    allotments: '/dashboard/allotments',
    documents: '/dashboard/documents',
    'ocr-processing': '/dashboard/ocr-processing',
    'atlas': '/dashboard/atlas'
};
function getPageFromPath(path) {
    // Try to match exact path first
    if (pathToPage[path]) return pathToPage[path];
    // Fallback for `/dashboard/...`
    if (path.startsWith('/dashboard')) return 'dashboard';
    return 'landing';
}
function AppContent() {
    _s();
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('landing');
    const { isAuthenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Initialize from URL
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppContent.useEffect": ()=>{
            setCurrentPage(getPageFromPath(window.location.pathname));
        }
    }["AppContent.useEffect"], []);
    // Handle browser back/forward
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppContent.useEffect": ()=>{
            const handlePopState = {
                "AppContent.useEffect.handlePopState": ()=>{
                    setCurrentPage(getPageFromPath(window.location.pathname));
                }
            }["AppContent.useEffect.handlePopState"];
            window.addEventListener('popstate', handlePopState);
            return ({
                "AppContent.useEffect": ()=>window.removeEventListener('popstate', handlePopState)
            })["AppContent.useEffect"];
        }
    }["AppContent.useEffect"], []);
    const handlePageChange = (page)=>{
        setCurrentPage(page);
        window.history.pushState({}, '', pageToPath[page]);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-green-50/30 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 88,
            columnNumber: 7
        }, this);
    }
    // Landing & Auth
    if (currentPage === 'landing') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$LandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LandingPage"], {
            onGetStarted: ()=>handlePageChange('auth')
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 99,
            columnNumber: 12
        }, this);
    }
    if (currentPage === 'auth') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$LoginSignup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginSignup"], {
            onSuccess: ()=>handlePageChange('dashboard')
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 103,
            columnNumber: 12
        }, this);
    }
    // Redirect unauthenticated users
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$LoginSignup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginSignup"], {
            onSuccess: ()=>handlePageChange('dashboard')
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 108,
            columnNumber: 12
        }, this);
    }
    // Dashboard pages mapping
    const dashboardContent = {
        dashboard: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 113,
            columnNumber: 16
        }, this),
        'submit-claim': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$ClaimSubmission$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClaimSubmission"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 114,
            columnNumber: 21
        }, this),
        claims: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$ClaimsManagement$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClaimsManagement"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 115,
            columnNumber: 13
        }, this),
        allotments: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Allotments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Allotments"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 116,
            columnNumber: 17
        }, this),
        documents: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$DocumentCenter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DocumentCenter"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 117,
            columnNumber: 16
        }, this),
        'ocr-processing': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$OCRProcessor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OCRProcessor"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 118,
            columnNumber: 23
        }, this),
        landing: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 119,
            columnNumber: 14
        }, this),
        auth: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 120,
            columnNumber: 11
        }, this),
        atlas: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$fra$2d$atlas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 121,
            columnNumber: 12
        }, this)
    };
    var _dashboardContent_currentPage;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layout"], {
        activeTab: currentPage === 'dashboard' ? 'dashboard' : currentPage,
        onNavigate: handlePageChange,
        children: (_dashboardContent_currentPage = dashboardContent[currentPage]) !== null && _dashboardContent_currentPage !== void 0 ? _dashboardContent_currentPage : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 129,
            columnNumber: 41
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_s(AppContent, "fQ7kE7B6+co+WLNaiZjMmzIf/l0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = AppContent;
function App() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LanguageProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$pages$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContent, {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 137,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_c1 = App;
var _c, _c1;
__turbopack_context__.k.register(_c, "AppContent");
__turbopack_context__.k.register(_c1, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_page_tsx_b4090435._.js.map