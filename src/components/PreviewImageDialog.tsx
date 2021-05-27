import React, { useEffect, useRef, useState } from "react";
import { utils } from "../helpers/utils";
import { showDialog } from "./Dialog";
import CloseIcon from "../assets/icons/close.svg";
import "../less/preview-image-dialog.less";

interface Props extends DialogProps {
  imgUrl: string;
}

const PreviewImageDialog: React.FunctionComponent<Props> = (props: Props) => {
  const { destory, imgUrl } = props;
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgWidth, setImgWidth] = useState<number>(-1);

  useEffect(() => {
    utils.getImageSize(imgUrl).then(([width, height]) => {
      if (width !== 0) {
        setImgWidth(80);
      } else {
        setImgWidth(0);
      }
    });
  }, []);

  const handleCloseBtnClick = () => {
    destory();
  };

  const handleDecreaseImageSize = () => {
    if (imgWidth > 30) {
      setImgWidth(imgWidth - 10);
    }
  };

  const handleIncreaseImageSize = () => {
    if (imgWidth < 100) {
      setImgWidth(imgWidth + 10);
    }
  };

  return (
    <>
      <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
        <img className="icon-img" src={CloseIcon} />
      </button>

      <div className="img-container">
        <img className={imgWidth <= 0 ? "hidden" : ""} ref={imgRef} width={imgWidth + "%"} src={imgUrl} />
        <span className={"loading-text " + (imgWidth === -1 ? "" : "hidden")}>图片加载中...</span>
        <span className={"loading-text " + (imgWidth === 0 ? "" : "hidden")}>😟 图片加载失败，可能是无效的链接</span>
      </div>

      <div className="action-btns-container">
        <button className="text-btn" onClick={handleDecreaseImageSize}>
          ➖
        </button>
        <button className="text-btn" onClick={handleIncreaseImageSize}>
          ➕
        </button>
        <button className="text-btn" onClick={() => setImgWidth(80)}>
          ⭕
        </button>
      </div>
    </>
  );
};

export function showPreviewImageDialog(imgUrl: string) {
  showDialog(
    {
      className: "preview-image-dialog",
    },
    PreviewImageDialog,
    { imgUrl }
  );
}
