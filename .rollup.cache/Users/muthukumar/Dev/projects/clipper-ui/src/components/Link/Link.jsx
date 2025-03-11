import { __rest } from "tslib";
import React from 'react';
var Link = function (_a) {
    var href = _a.href, children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, target = _a.target, rel = _a.rel, onClick = _a.onClick, props = __rest(_a, ["href", "children", "variant", "className", "target", "rel", "onClick"]);
    var baseStyles = 'inline-block transition-colors duration-200';
    var variantStyles = {
        default: 'text-blue-600 hover:text-blue-800 underline',
        primary: 'text-primary-600 hover:text-primary-800 font-medium underline',
        secondary: 'text-gray-600 hover:text-gray-800 no-underline hover:underline'
    };
    var combinedClassName = "".concat(baseStyles, " ").concat(variantStyles[variant], " ").concat(className).trim();
    var handleClick = function (event) {
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
    };
    return (<a href={href} className={combinedClassName} target={target} rel={target === '_blank' ? 'noopener noreferrer' : rel} onClick={handleClick} {...props}>
      {children}
    </a>);
};
export default Link;
//# sourceMappingURL=Link.jsx.map