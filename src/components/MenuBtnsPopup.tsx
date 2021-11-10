import { useEffect } from "react";
import { locationService, userService } from "../services";
import showAboutSiteDialog from "./AboutSiteDialog";
import "../less/menu-btns-popup.less";

interface Props {
  shownStatus: boolean;
  toggleShownStatus: (status?: boolean) => void;
}

const MenuBtnsPopup: React.FC<Props> = (props: Props) => {
  const { shownStatus, toggleShownStatus } = props;

  useEffect(() => {
    if (shownStatus) {
      const handleClickOutside = () => {
        toggleShownStatus(false);
      };
      window.addEventListener("click", handleClickOutside, {
        capture: true,
        once: true,
      });
    }
  }, [shownStatus]);

  const handleMyAccountBtnClick = () => {
    locationService.pushHistory("/setting");
  };

  const handleMemosTrashBtnClick = () => {
    locationService.pushHistory("/recycle");
  };

  const handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };

  const handleSignOutBtnClick = async () => {
    await userService.doSignOut();
    locationService.replaceHistory("/signin");
  };

  return (
    <div className={`menu-btns-popup ${shownStatus ? "" : "hidden"}`}>
      <button className="btn action-btn" onClick={handleMyAccountBtnClick}>
        <span className="icon">👤</span> 账号与设置
      </button>
      <button className="btn action-btn" onClick={handleMemosTrashBtnClick}>
        <span className="icon">🗑️</span> 回收站
      </button>
      <button className="btn action-btn" onClick={handleAboutBtnClick}>
        <span className="icon">🤠</span> 关于
      </button>
      <button className="btn action-btn" onClick={handleSignOutBtnClick}>
        <span className="icon">👋</span> 退出
      </button>
    </div>
  );
};

export default MenuBtnsPopup;
