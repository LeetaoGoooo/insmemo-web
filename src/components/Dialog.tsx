import React from "react";
import ReactDOM from "react-dom";
import "../less/dialog.less";

interface DialogConfig {
  className: string;
  clickSpaceDestroy?: boolean;
}

interface Props extends DialogConfig, DialogProps {}

const BaseDialog: React.FunctionComponent<Props> = (props) => {
  const { className, clickSpaceDestroy, destroy } = props;

  const handleSpaceClicked = () => {
    if (clickSpaceDestroy) {
      destroy();
    }
  };

  return (
    <div className={"dialog-wrapper " + className} onClick={handleSpaceClicked}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
};

export function showDialog<T = any>(config: DialogConfig, Fc: React.FunctionComponent<T>, props: any) {
  const tempDiv = document.createElement("div");
  document.body.append(tempDiv);

  const destroy = () => {
    ReactDOM.unmountComponentAtNode(tempDiv);
    tempDiv.remove();
  };

  ReactDOM.render(
    <BaseDialog destroy={destroy} clickSpaceDestroy={true} {...config}>
      <Fc destroy={destroy} {...props}></Fc>
    </BaseDialog>,
    tempDiv
  );
}
