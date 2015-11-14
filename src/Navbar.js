import React, { PropTypes } from 'react';
import uncontrollable from 'uncontrollable';
import classNames from 'classnames';
import elementType from 'react-prop-types/lib/elementType';

import Grid from './Grid';
import NavbarBrand from './NavbarBrand';
import NavbarHeader from './NavbarHeader';
import NavbarToggle from './NavbarToggle';
import NavbarCollapse from './NavbarCollapse';

import tbsUtils, { bsClass as bsClasses, bsStyles } from './utils/bootstrapUtils';
import { DEFAULT, INVERSE } from './styleMaps';

let Navbar = React.createClass({

  propTypes: {
    /**
     * Create a fixed navbar along the top of the screen, that scrolls with the page
     */
    fixedTop: React.PropTypes.bool,
    /**
     * Create a fixed navbar along the bottom of the screen, that scrolls with the page
     */
    fixedBottom: React.PropTypes.bool,
    /**
     * Create a full-width navbar that scrolls away with the page
     */
    staticTop: React.PropTypes.bool,
    /**
     * An alternative dark visual style for the Navbar
     */
    inverse: React.PropTypes.bool,
    /**
     * Allow the Navbar to fluidly adjust to the page or container width, instead of at the
     * predefined screen breakpoints
     */
    fluid: React.PropTypes.bool,

    /**
     * Set a custom element for this component.
     */
    componentClass: elementType,
    /**
     * A callback fired when the `<Navbar>` body collapses or expands.
     * Fired when a `<Navbar.Toggle>` is clicked and called with the new `navExpanded` boolean value.
     *
     * @controllable navExpanded
     */
    onToggle: React.PropTypes.func,

    /**
     * Explicitly set the visiblity of the navbar body
     *
     * @controllable onToggle
     */
    navExpanded: React.PropTypes.bool
  },

  childContextTypes: {
    $bs_navbar: PropTypes.bool,
    $bs_navbar_bsClass: PropTypes.string,
    $bs_navbar_onToggle: PropTypes.func,
    $bs_navbar_navExpanded: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      role: 'navigation',
      componentClass: 'nav',
      fixedTop: false,
      fixedBottom: false,
      staticTop: false,
      inverse: false,
      fluid: false
    };
  },

  getChildContext() {
    return {
      $bs_navbar: true,
      $bs_navbar_bsClass: this.props.bsClass,
      $bs_navbar_onToggle: this.handleToggle,
      $bs_navbar_navExpanded: this.props.navExpanded
    };
  },

  handleToggle() {
    this.props.onToggle(!this.props.navExpanded);
  },

  isNavExpanded() {
    return !!this.props.navExpanded;
  },

  render() {
    const {
      fixedTop,
      fixedBottom,
      staticTop,
      inverse,
      componentClass: ComponentClass,
      fluid,
      className,
      children,
      ...props
    } = this.props;

    const classes = tbsUtils.getClassSet(this.props);

    classes[tbsUtils.prefix(this.props, 'fixed-top')] = this.props.fixedTop;
    classes[tbsUtils.prefix(this.props, 'fixed-bottom')] = this.props.fixedBottom;
    classes[tbsUtils.prefix(this.props, 'static-top')] = this.props.staticTop;

    // handle built-in styles manually to provide the convenience `inverse` prop
    classes[tbsUtils.prefix(this.props, INVERSE)] = this.props.inverse;
    classes[tbsUtils.prefix(this.props, DEFAULT)] = !this.props.inverse;

    return (
      <ComponentClass {...props} className={classNames(className, classes)}>
        <Grid fluid={fluid}>
          { children }
        </Grid>
      </ComponentClass>
    );
  }
});

const NAVBAR_STATES = [DEFAULT, INVERSE];

Navbar = bsStyles(NAVBAR_STATES, DEFAULT,
  bsClasses('navbar',
    uncontrollable(Navbar, { navExpanded: 'onToggle' })
  )
);

function createSimpleWrapper(tag, suffix, displayName) {
  let wrapper = (
    { componentClass: Tag, className, ...props },
    { $bs_navbar_bsClass: bsClass = 'navbar' }
  ) =>
    <Tag {...props}
      className={classNames(className, tbsUtils.prefix({ bsClass }, suffix), {
        [tbsUtils.prefix({ bsClass }, 'right')]: props.pullRight,
        [tbsUtils.prefix({ bsClass }, 'left')]: props.pullLeft
      })}
    />;

  wrapper.displayName = displayName;

  wrapper.propTypes = { componentClass: elementType};
  wrapper.defaultProps = { componentClass: tag };

  wrapper.contextTypes = {
    $bs_navbar_bsClass: PropTypes.string
  };

  return wrapper;
}

Navbar.Brand = NavbarBrand;
Navbar.Header = NavbarHeader;
Navbar.Toggle = NavbarToggle;
Navbar.Collapse = NavbarCollapse;

Navbar.Form = createSimpleWrapper('div', 'form', 'NavbarForm');
Navbar.Text = createSimpleWrapper('p', 'text', 'NavbarText');
Navbar.Link = createSimpleWrapper('a', 'link', 'NavbarLink');

export default Navbar;
