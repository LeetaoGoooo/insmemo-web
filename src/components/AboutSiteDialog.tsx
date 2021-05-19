import React from "react";
import ReactDOM from "react-dom";
import "../less/dialog.less";
import "../less/about-site-dialog.less";

interface Props {
  destory: FunctionType;
}

function AboutSizeDialog(props: Props) {
  const { destory } = props;

  const handleCloseBtnClick = () => {
    destory();
  };

  return (
    <div className="dialog-wrapper about-site-dialog">
      <div className="dialog-container">
        <div className="dialog-header-container">
          <p className="title-text">👋 关于</p>
          <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
            ✖️
          </button>
        </div>
        <div className="dialog-content-container">
          <p>
            (无名)：
            <a target="_blank" href="https://www.zsxq.com/">
              知识星球
            </a>{" "}
            +{" "}
            <a target="_blank" href="https://flomoapp.com/">
              flomo
            </a>
          </p>
          <ul>
            <li>
              👀 开源，
              <a target="_blank" href="https://github.com/boojack/insmemo/">
                项目地址
              </a>
              ；
            </li>
            <li>📑 随时随手记一记；</li>
            <li>😋 更好的交互逻辑；</li>
          </ul>
          <p>小小产品，欢迎使用~</p>
        </div>
        <div className="dialog-footer-container"></div>
      </div>
    </div>
  );
}

export function showAboutSiteDialog() {
  const tempDiv = document.createElement("div");
  document.body.append(tempDiv);

  const destory = () => {
    ReactDOM.unmountComponentAtNode(tempDiv);
    tempDiv.remove();
  };

  ReactDOM.render(<AboutSizeDialog destory={destory} />, tempDiv);
}
