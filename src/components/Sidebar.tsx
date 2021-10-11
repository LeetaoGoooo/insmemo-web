import { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import UserBanner from "./UserBanner";
import TagList from "./TagList";
import UsageHeatMap from "./UsageHeatMap";
import "../less/siderbar.less";

interface Props {}

const Sidebar: React.FC<Props> = () => {
  const handleWrapperClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    const el = event.target as HTMLElement;

    if (el.className === "sidebar-wrapper") {
      // 删除移动端样式
      const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
      pageContainerEl?.classList.remove(MOBILE_ADDITION_CLASSNAME);
    }
  }, []);

  return (
    <div className="sidebar-wrapper" onClick={handleWrapperClick}>
      <UserBanner />
      <UsageHeatMap />
      <div className="nav-btn-container hidden">
        <NavLink className="nav-btn" exact to="/">
          <span className="icon-text">😊</span>
          <span className="btn-text">MEMO</span>
        </NavLink>
      </div>
      <TagList />
      <div className="nav-btn-container recycle-btn hidden">
        <NavLink className="nav-btn" exact to="/recycle">
          <span className="icon-text">♻️</span>
          <span className="btn-text">回收站</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
