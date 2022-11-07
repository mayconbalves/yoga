import React, { forwardRef } from 'react';
import { Item as MenuItemRoot } from '@radix-ui/react-dropdown-menu';
import { oneOfType, func, node, string, bool } from 'prop-types';
import styled, { withTheme } from 'styled-components';
import get from 'lodash.get';

const StyledMenuItem = styled.li`
  display: flex;
  align-items: center;
  ${({
    active,
    disabled,
    iconColor,
    theme: {
      yoga: {
        components: { menu },
      },
    },
  }) => `
    margin-right: auto;
    padding: ${menu.padding.vertical}px ${menu.padding.horizontal}px;

    width: 100%;
    cursor: pointer;
    text-decoration: none;
    color: ${menu.text.default.color};

    ${
      active
        ? `
      font-weight: ${menu.font.weight};
      color: ${menu.text.active.color}
      `
        : ''
    }

    ${
      disabled
        ? `
        color: ${menu.text.disabled.color};
        pointer-events: none;

        svg {
          fill: ${menu.text.disabled.color};
          opacity: 0.5;
        }

        cursor: not-allowed;
    `
        : ''
    }

    svg {
      margin-right: ${menu.margin.default}px;
      fill: ${iconColor};
    }

    &:focus {
      outline: none;
      background: ${menu.backgroundColor.disabled};
    }

    &:hover {
      background: ${menu.backgroundColor.disabled};
    }

    &:first-child {
      margin-top: ${menu.margin.xxsmall}px;
    }

    &:last-child {
      margin-bottom: ${menu.margin.xxsmall}px;
    }
  `}
`;

const MenuItem = forwardRef(
  (
    {
      icon: Icon,
      href,
      active,
      disabled,
      iconColor,
      iconSize,
      children,
      theme,
      ...rest
    },
    ref,
  ) => {
    const finalProps = {
      ...rest,
    };

    if (href) {
      finalProps.as = 'a';
      finalProps.href = href;
    }

    const size = get(theme.yoga.spacing, iconSize, iconSize);

    return (
      <MenuItemRoot disabled={disabled} asChild>
        <StyledMenuItem
          active={active}
          disabled={disabled}
          iconColor={iconColor}
          ref={ref}
          {...finalProps}
        >
          {Icon && <Icon width={size} height={size} />}
          {children}
        </StyledMenuItem>
      </MenuItemRoot>
    );
  },
);

MenuItem.propTypes = {
  /** The icon of menu item */
  icon: oneOfType([node, func]),
  children: node.isRequired,
  href: string,
  disabled: bool,
  active: bool,
  iconColor: string,
  iconSize: string,
};

MenuItem.defaultProps = {
  icon: undefined,
  href: undefined,
  disabled: false,
  active: false,
  iconColor: '',
  iconSize: '',
};

MenuItem.displayName = 'Menu.Item';

export default withTheme(MenuItem);
