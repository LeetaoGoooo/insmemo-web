import { useContext, useEffect, useRef, useState } from "react";
import { locationService, memoService } from "../services";
import useToggle from "../hooks/useToggle";
import Only from "./common/OnlyWhen";
import { showDialog } from "./Dialog";
import toastHelper from "./Toast";
import appContext from "../labs/appContext";
import useLoading from "../hooks/useLoading";
import { utils } from "../helpers/utils";
import "../less/tag-list.less";

interface Tag extends Api.Tag {
  key: string;
  subTags: Tag[];
}

interface Props {}

const TagList: React.FC<Props> = () => {
  const {
    locationState: { query },
    memoState: { memos },
  } = useContext(appContext);
  const loadingState = useLoading();
  const [tags, setTags] = useState<Tag[]>([]);
  const [pinnedTags, setPinnedTags] = useState<Tag[]>([]);
  const [tagQuery, setTagQuery] = useState<string>(query.tag);

  useEffect(() => {
    memoService
      .getMyTags()
      .then((tags) => {
        const sortedTags = tags
          .sort((a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt))
          .sort((a, b) => b.level - a.level);
        const root: IterObject<any> = {
          subTags: [],
        };
        const pinnedTagsTemp: Tag[] = [];
        for (const tag of sortedTags) {
          if (tag.pinnedAt) {
            pinnedTagsTemp.push({
              ...tag,
              key: tag.text,
              subTags: [],
            });
          }

          const subtags = tag.text.split("/");
          let tempObj = root;
          let tagText = "";
          for (let i = 0; i < subtags.length; i++) {
            const key = subtags[i];
            if (i === 0) {
              tagText += key;
            } else {
              tagText += "/" + key;
            }

            let obj = null;

            for (const t of tempObj.subTags) {
              if (t.text === tagText) {
                obj = t;
                break;
              }
            }

            if (obj) {
              obj.level += tag.level;
            } else {
              obj = {
                id: "",
                key,
                text: tagText,
                level: tag.level,
                subTags: [],
              };
              tempObj.subTags.push(obj);
            }

            tempObj.subTags.sort((a: Tag, b: Tag) => b.level - a.level) as Tag[];
            if (tagText === tag.text) {
              obj.id = tag.id;
            }
            tempObj = obj;
          }
        }

        root.subTags.sort((a: Tag, b: Tag) => b.level - a.level);
        setTags(root.subTags as Tag[]);
        pinnedTagsTemp.sort((a, b) => utils.getTimeStampByDate(b.pinnedAt!) - utils.getTimeStampByDate(a.pinnedAt!));
        setPinnedTags(pinnedTagsTemp);
        loadingState.setFinish();
      })
      .catch((error) => {
        loadingState.setError();
        toastHelper.error(error);
      });
  }, [memos]);

  useEffect(() => {
    setTagQuery(query.tag);
  }, [query]);

  return loadingState.isLoading ? null : (
    <>
      <div className="tags-wrapper">
        {pinnedTags.length === 0 ? null : (
          <>
            <p className="title-text">置顶标签</p>
            <div className="tags-container">
              {pinnedTags.map((t, idx) => (
                <TagItemContainer key={t.id + "-" + idx} tag={t} tagQuery={tagQuery} />
              ))}
            </div>
          </>
        )}
        <p className="title-text">常用标签</p>
        <div className="tags-container">
          {tags.map((t, idx) => (
            <TagItemContainer key={t.id + "-" + idx} tag={t} tagQuery={tagQuery} />
          ))}
          <Only when={tags.length < 5}>
            <p className="tag-tip-container">
              输入<span className="code-text"># Tag </span>来创建标签吧~
            </p>
          </Only>
        </div>
      </div>
    </>
  );
};

interface TagItemContainerProps {
  tag: Tag;
  tagQuery: string;
}

const TagItemContainer: React.FC<TagItemContainerProps> = (props: TagItemContainerProps) => {
  const { tag, tagQuery } = props;
  const isActive = tagQuery === tag.text;
  const hasSubTags = tag.subTags.length > 0;
  const [showSubTags, toggleSubTags] = useToggle(tagQuery.includes(tag.text) && !isActive);
  const renameAble = tag.id !== "";

  useEffect(() => {
    toggleSubTags(tagQuery.indexOf(tag.text) === 0 && !isActive);
  }, [tagQuery, tag]);

  const handleTagClick = () => {
    const tagText = isActive ? "" : tag.text;
    if (tagText) {
      utils.copyTextToClipboard(`# ${tagText} `);
      memoService.polishTag(tag.id).catch(() => {
        // do nth
      });
    }
    locationService.pushHistory("/");
    locationService.setTagQuery(tagText);
  };

  const handleTogglePinTagBtnClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (tag.pinnedAt) {
      memoService.unpinTag(tag.id);
    } else {
      memoService.pinTag(tag.id);
    }
    memoService.clearMemos();
    memoService.fetchMoreMemos();
  };

  const handleRenameTagBtnClick = (event: React.MouseEvent) => {
    if (renameAble) {
      event.stopPropagation();
      showRenameTagDialog(tag);
    }
  };

  const handleToggleBtnClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSubTags();
  };

  return (
    <>
      <div className={`tag-item-container ${isActive ? "active" : ""}`} onClick={handleTagClick}>
        <div className="tag-text-container">
          <span className="icon-text">#</span>
          <div className="action-btns-wrapper">
            <div className="action-btns-container">
              <span className="text-btn" onClick={handleTogglePinTagBtnClick}>
                {tag.pinnedAt ? "取消置顶" : "置顶"}
              </span>
              <span className="text-btn" onClick={handleRenameTagBtnClick}>
                重命名
              </span>
            </div>
          </div>
          <span className="tag-text">{tag.key}</span>
        </div>
        <div className="btns-container">
          {hasSubTags ? (
            <span className={`action-btn toggle-btn ${showSubTags ? "shown" : ""}`} onClick={handleToggleBtnClick}>
              <img className="icon-img" src={`/icons/arrow-right${isActive ? "-white" : ""}.svg`} />
            </span>
          ) : null}
        </div>
      </div>

      {hasSubTags ? (
        <div className={`subtags-container ${showSubTags ? "" : "hidden"}`}>
          {tag.subTags.map((st, idx) => (
            <TagItemContainer key={st.id + "-" + idx} tag={st} tagQuery={tagQuery} />
          ))}
        </div>
      ) : null}
    </>
  );
};

interface RenameTagDialogProps extends DialogProps {
  tag: Tag;
}

const RenameTagDialog: React.FC<RenameTagDialogProps> = (props) => {
  const { destroy, tag } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleConfirmBtnClick = () => {
    const text = inputRef.current?.value;
    if (!text || text === tag.text) {
      destroy();
      return;
    }
    memoService
      .updateTagText(tag.id, text)
      .then(() => {
        memoService.clearMemos();
        memoService.fetchAllMemos();
        destroy();
      })
      .catch(() => {
        // do nth
      });
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🏷️</span>标签重命名
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <p className="tag-text">旧：{tag.text}</p>
        <input className="text-input" type="text" placeholder="输入新标签" ref={inputRef} />
        <div className="btns-container">
          <span className="btn-text cancel-btn" onClick={handleCloseBtnClick}>
            取消
          </span>
          <span className="btn-text confirm-btn" onClick={handleConfirmBtnClick}>
            确定
          </span>
        </div>
      </div>
    </>
  );
};

function showRenameTagDialog(tag: Tag): void {
  showDialog(
    {
      className: "rename-tag-dialog",
    },
    RenameTagDialog,
    {
      tag,
    }
  );
}

export default TagList;
