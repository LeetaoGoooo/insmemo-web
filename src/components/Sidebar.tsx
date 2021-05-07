import React from "react";
import { userService } from "../helpers/userService";
import { UserBanner } from "./UserBanner";
import { showSigninDialog } from "./SigninDialog";
import { toast } from "./Toast";
import "../less/siderbar.less";

interface State {
  userinfo: Model.User | null;
}

export class Sidebar extends React.Component {
  public state: State;

  constructor(props: any) {
    super(props);

    this.state = {
      userinfo: null,
    };

    const user = userService.getUserInfo();
    this.state.userinfo = user;
  }

  public componentDidMount() {
    userService.bindStateChange(this, (user) => {
      this.setState({
        userinfo: user,
      });
    });
  }

  public componentWillUnmount() {
    userService.unbindStateListener(this);
  }

  public render() {
    const { userinfo } = this.state;

    return (
      <div className="sidebar-wrapper">
        {userinfo ? (
          <>
            <UserBanner userinfo={userinfo} />
            <div className="menu-container">
              <p className="text-btn action-btn" onClick={this.handleAboutBtnClick}>
                😀 关于
              </p>
              <button className="text-btn action-btn" onClick={this.handleSignoutBtnClick}>
                👋 退出
              </button>
            </div>
          </>
        ) : (
          <div className="slogan-container">
            <p className="logo-text">Insmemo</p>
            <p className="slogan-text">📑 随时随手记一记</p>
            <p className="slogan-text">😋 更好的交互逻辑</p>
            <p className="slogan-text">
              💬 来吧~
              <button className="text-btn action-btn" onClick={this.handleShowSigninDialog}>
                注册/登录
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  protected handleSignoutBtnClick = async () => {
    await userService.doSignOut();
  };

  protected handleAboutBtnClick = async () => {
    toast.info("Hello world~");
  };

  protected handleShowSigninDialog = () => {
    showSigninDialog();
  };
}
