import React, { PureComponent } from 'react';

export default class Button extends PureComponent {
    render() {
        const {
            bsClass,
            children,
            disabled,
            onClick,
            href,
            type,
            id,
            form,
            dataToggle,
            dataDismiss,
            ariaHidden,
            style,
            ariaHaspopup,
            ariaExpanded,
            name,
            ariaLabel,
            dataTest,
            key,
            dataSize,
            onMouseEnter,
            onMouseLeave,
            variant,
            isLoading,
            autofocus,
            innerRefBtn,
            noTabIndex,
            tabIdx,
        } = this.props;

        if (href) {
            let redirectLink = href;
            if (this.isExtension()) {
                const { pathname, search } = window.location;
                redirectLink = `${pathname}${search}`;
            }
            return (
                <div
                    to={redirectLink}
                    className={bsClass}
                    onClick={onClick}
                    disabled={disabled}
                    style={style}
                >
                    {children}
                </div>
            );
        }

        return (
            // eslint-disable-next-line react/button-has-type
            <button
                type={type}
                className={bsClass}
                disabled={disabled || isLoading}
                onClick={onClick}
                id={id || null}
                form={form || null}
                data-toggle={dataToggle}
                data-dismiss={dataDismiss}
                aria-hidden={ariaHidden}
                style={style}
                name={name}
                aria-label={ariaLabel}
                aria-haspopup={ariaHaspopup}
                aria-expanded={ariaExpanded}
                data-test={dataTest}
                key={key}
                data-size={dataSize}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                variant={variant}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={autofocus}
                ref={innerRefBtn}
                {...(noTabIndex ? { tabIndex: '-1' } : {})}
                {...(tabIdx ? { tabIndex: tabIdx } : {})}
            >
                {children}
            </button>
        );
    }
}
