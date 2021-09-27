import React from "react";
import { showDialog } from "./Dialog";
import "../less/about-site-dialog.less";

interface Props extends DialogProps {}

const AboutSiteDialog: React.FC<Props> = ({ destroy }) => {
  const handleCloseBtnClick = () => {
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">😀</span>关于本站
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <p>
          <b>Memos</b>，有感于{" "}
          <a target="_blank" href="https://www.zsxq.com/" rel="noreferrer">
            知识星球
          </a>{" "}
          和{" "}
          <a target="_blank" href="https://flomoapp.com/" rel="noreferrer">
            flomo
          </a>{" "}
        </p>
        <br />

        <i>为何做这个？</i>
        <ul>
          <li>我用于记录：📅 每日/周计划、💡 突发奇想、📕 读后感...</li>
          <li>代替了我在微信上经常使用的“文件传输助手”；</li>
          <li>打造一个属于自己的轻量化“卡片”笔记簿；</li>
        </ul>
        <br />

        <i>有何特点呢？</i>
        <ul>
          <li>
            ✨{" "}
            <a target="_blank" href="https://github.com/boojack/insmemo-web" rel="noreferrer">
              开源项目
            </a>
            ，用于学习；
          </li>
          <li>😋 更可观的视觉样式；</li>
          <li>📑 更好的交互逻辑；</li>
        </ul>
        <br />
        <p>Enjoy it and have fun~ </p>
        <hr />
        <p className="normal-text">
          BTW, my personal site:{" "}
          <a target="_blank" href="https://justsven.top" rel="noreferrer">
            https://justsven.top
          </a>{" "}
          👀
        </p>
        <p className="normal-text">Last update at 2021/9/24 14:25:00, v2.2.0 🎉</p>
      </div>
    </>
  );
};

export default function showAboutSiteDialog(): void {
  showDialog(
    {
      className: "about-site-dialog",
    },
    AboutSiteDialog
  );
}
