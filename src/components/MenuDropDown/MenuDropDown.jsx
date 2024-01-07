/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import "./MenuDropDown.scss";
import { createPortal } from "react-dom";
import { IoChevronBack } from "react-icons/io5";
import useDropdownBounding from "../../hooks/useDropdownBounding";
import toLangDigits from "../../utils/toLangDigits";
import { useLayoutEffect } from "react";
import useWindowSize from './../../hooks/useWindowResize';

const MenuDropDown = ({
  divContainerRef,
  setDropDown,
  onClick,
  setSelected,
  divStyle,
  itemStyle,
  items,
  children,
  selected = null,
  offset = null,
  checkBounding = true,
  position = "bottom",
  submenuConfig = {},
  beforeItems,
  responsive = false,
  fromBottom = false
}) => {
  const [style, setStyle] = useState({});
  const [showSubmenu, setShowSubmenu] = useState(null);
  const [mounted, setMounted] = useState(false);

  const divRef = useRef();

  useOnClickOutside(divContainerRef, divRef, () => {
    setDropDown(false);
  });
  const { screenWidth, screenHeight } = useWindowSize();

  const handleClick = (value, id, extra) => {
    onClick && onClick(showSubmenu || id, showSubmenu ? id : null);
    setSelected && setSelected(value, id, extra);
    // setDropDown(false); //state of dropdown activate
  };

  const { bounding } = useDropdownBounding(divContainerRef)

  useLayoutEffect(() => {
    if (!offset || !bounding || Object.keys(bounding).length === 0) return;
    let updatedStyle = {
      top: position === "bottom"
        ? offset.top + offset.height
        : position === "top"
          ? "auto"
          : offset.top,
      bottom: position === "bottom"
        ? "auto"
        : position === "top"
          ? offset.top
          : "auto",
      left: position === "left"
        ? offset.left - divRef?.current?.getBoundingClientRect().width - 10
        : position === "right"
          ? offset.left + offset.width
          : offset.left,
      maxHeight: screenHeight - offset.bottom - 10,
      minWidth: offset.width,
      maxWidth: bounding.left ? offset.left : screenWidth - offset.right,
      marginTop: position === "top" ? 5 : 0,
    }
    if (checkBounding) {
      updatedStyle = {
        top: bounding.top
          ? "auto"
          : offset.top + offset.height,
        bottom: bounding.top
          ? screenHeight - offset.top
          : "auto",
        left: bounding.left ? offset.right - divRef?.current?.getBoundingClientRect().width : offset.left,
        maxHeight: bounding.top
          ? (offset.top - 10)
          : screenHeight - offset.bottom - 10,
        minWidth: offset.width,
        maxWidth: bounding.left ? offset.left + divRef?.current?.getBoundingClientRect().width : screenWidth - offset.right,
        marginTop: bounding.top ? 0 : 5,
        marginBottom: bounding.top ? 5 : 0
      }
    }
    if (responsive) {
      updatedStyle = {
        ...updatedStyle,
        left: offset.left + offset.width < divRef?.current?.getBoundingClientRect().width ? 5 : updatedStyle.left,
        maxWidth: offset.left + offset.width < divRef?.current?.getBoundingClientRect().width ? screenWidth : updatedStyle.maxWidth,
      }
    }
    if (fromBottom && screenWidth <= 600) {
      updatedStyle = {
        ...updatedStyle,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        maxWidth: "100%",
        height: "calc(100% - 20px)",
        maxHeight: "100%",
        marginTop: 20,
      }
    }
    setStyle(updatedStyle)
  }, [offset, bounding, divRef?.current?.getBoundingClientRect().width, screenWidth]);

  useEffect(() => {
    if (!style || Object.keys(style).length === 0) return
    setMounted(true)
  }, [style]);

  return createPortal(
    (<div
      ref={divRef}
      className={`menu-dropdown ${fromBottom ? 'menu-dropdown-small-screen' : ''}`}
      style={{ ...style, ...divStyle }}
    >
      {mounted &&
        <>
          {beforeItems instanceof Array ?
            <>
              {beforeItems?.map((item) =>
                <div
                  key={item.id}
                  className={`menu-dropdown-item`}
                  onClick={() => handleClick(item.name, item.id)}
                  style={{ ...itemStyle }}
                >
                  {item.icon && <div className="menu-dropdown-icon">{item.icon}</div>}
                  {toLangDigits(item.name)}
                </div>
              )}
              {items?.length > 0 && <div className="menu-dropdown-divider" />}
            </>
            :
            beforeItems}
          {items?.map((item) => (
            <DropdownItem
              key={item._id ? item._id : item.id ? item.id : item.name}
              item={item}
              handleClick={handleClick}
              selected={selected}
              dropdownOffset={divRef?.current?.getBoundingClientRect()}
              itemStyle={itemStyle}
              showSubmenu={showSubmenu}
              setShowSubmenu={setShowSubmenu}
              submenuConfig={submenuConfig}
            />
          ))}
          {children}
        </>
      }
    </div>), document.getElementById("portal")
  );
};


const DropdownItem = ({ item, handleClick, selected, dropdownOffset, itemStyle, showSubmenu, setShowSubmenu, submenuConfig }) => {
  const [hover, setHover] = useState(false);

  const itemRef = useRef(null);
  let timeOut;

  const handleOnEnter = () => {
    setHover(true);
  };

  const handleOnExit = () => {
    setHover(false);
    clearTimeout(timeOut);
  };

  const handleItemClick = () => {
    if (item?.items) {
      if ((item._id && showSubmenu === item._id) || (item.id && showSubmenu === item.id))
        setShowSubmenu(null);
      else
        setShowSubmenu(item.id || item._id);
      return;
    }
    if (item._id && JSON.stringify(item._id) !== JSON.stringify(selected))
      handleClick(item.name, item._id, item.extra || "");
    if (item.id && JSON.stringify(item.id) !== JSON.stringify(selected))
      handleClick(item.name, item.id, item.extra || "");
  };

  useEffect(() => {
    if (!hover) return;
    if (item?.items)
      timeOut = setTimeout(() => {
        setShowSubmenu(item.id || item._id);
      }, 500);
    else
      setShowSubmenu(null);
  }, [hover]);

  return (
    <div
      ref={itemRef}
      disabled={item?.items && item.items.length === 0}
      className={`menu-dropdown-item 
          ${JSON.stringify(item._id) ?
          JSON.stringify(item._id) === JSON.stringify(selected) ?
            'selected-item' : (item?.items && showSubmenu === item._id) ? 'submenu-open' : '' :
          JSON.stringify(item.id) ?
            JSON.stringify(item.id) === JSON.stringify(selected) ?
              'selected-item' : (item?.items && showSubmenu === item.id) ? 'submenu-open' : '' : ''}`}
      onClick={handleItemClick}
      onMouseEnter={handleOnEnter}
      onMouseLeave={handleOnExit}
      style={{
        ...itemStyle,
      }}
    >
      {item.icon && <div className="menu-dropdown-icon">{item.icon}</div>}
      {toLangDigits(item.name)}
      {item?.items && <IoChevronBack className="menu-dropdown-menu-icon" />}
      {item?.items && item.items.length > 0 &&
        ((item._id && showSubmenu === item._id) || (item.id && showSubmenu === item.id)) &&
        <SubmenuDropDown
          divContainerRef={itemRef}
          handleClick={handleClick}
          divStyle={{
            marginTop: 0,
            marginLeft: "2px",
            marginRight: "2px"
          }}
          selected={selected}
          items={item?.items}
          offset={itemRef?.current?.getBoundingClientRect()}
          dropdownOffset={dropdownOffset}
          position="left"
          {...submenuConfig}
        />
      }
    </div>
  );
}

const SubmenuDropDown = ({
  divContainerRef,
  handleClick,
  divStyle,
  itemStyle,
  items,
  selected = null,
  offset = null,
  dropdownOffset,
  checkBounding = true,
  position = "bottom",
}) => {
  const [style, setStyle] = useState({});
  const [showSubmenu, setShowSubmenu] = useState(null);

  const divRef = useRef();

  const { bounding } = useDropdownBounding(divContainerRef)
  const { screenWidth, screenHeight } = useWindowSize();

  useEffect(() => {
    if (!offset || !bounding) return;
    let updatedStyle = {
      top: position === "bottom"
        ? (offset.top - dropdownOffset.top) + offset.height
        : position === "top"
          ? "auto"
          : (offset.top - dropdownOffset.top),
      bottom: position === "bottom"
        ? "auto"
        : position === "top"
          ? (offset.top - dropdownOffset.top)
          : "auto",
      left: position === "left"
        ? (offset.left - dropdownOffset.left) - divRef?.current?.getBoundingClientRect().width - 10
        : position === "right"
          ? (offset.left - dropdownOffset.left) + offset.width
          : (offset.left - dropdownOffset.left),
      maxHeight: screenHeight - offset.bottom,
      minWidth: offset.width,
      maxWidth: bounding.left ? (offset.left - dropdownOffset.left) : screenWidth - offset.right,
      marginTop: position === "top" ? 5 : 0,
    }
    if (checkBounding)
      updatedStyle = {
        top: bounding.top
          ? "auto"
          : (offset.top - dropdownOffset.top) + offset.height,
        bottom: bounding.top
          ? screenHeight - (offset.top - dropdownOffset.top)
          : "auto",
        left: bounding.left ? offset.right - divRef?.current?.getBoundingClientRect().width : (offset.left - dropdownOffset.left),
        maxHeight: bounding.top
          ? (offset.top - dropdownOffset.top)
          : screenHeight - offset.bottom,
        minWidth: offset.width,
        maxWidth: bounding.left ? (offset.left - dropdownOffset.left) : screenWidth - offset.right,
      }
    setStyle(updatedStyle)
  }, [offset, bounding, divRef?.current?.getBoundingClientRect().width, dropdownOffset]);

  return (<div
    ref={divRef}
    className={`menu-dropdown`}
    style={{ ...style, ...divStyle }}
  >
    {items?.map((item) => (
      <DropdownItem
        key={item._id ? item._id : item.id ? item.id : item.name}
        item={item}
        handleClick={handleClick}
        selected={selected}
        itemStyle={itemStyle}
        showSubmenu={showSubmenu}
        setShowSubmenu={setShowSubmenu}
      />
    ))}
  </div>
  );
};


export default MenuDropDown;
