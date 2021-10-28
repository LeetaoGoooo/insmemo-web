import { useContext } from "react";
import { MEMO_TYPES } from "../helpers/consts";
import { locationService } from "../services";
import appContext from "../labs/appContext";
import "../less/search-bar.less";

interface Props {}

const SearchBar: React.FC<Props> = () => {
  const {
    locationState: {
      query: { type: memoType },
    },
  } = useContext(appContext);

  const handleMemoTypeItemClick = (type: MemoType | "") => {
    const { type: prevType } = locationService.getState().query;
    if (type === prevType) {
      type = "";
    }
    locationService.setMemoTypeQuery(type);
  };

  const handleTextQueryInput = (event: React.FormEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value;
    locationService.setTextQuery(text);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-inputer">
        <img className="icon-img" src="/icons/search.svg" />
        <input className="text-input" type="text" placeholder="" onChange={handleTextQueryInput} />
      </div>
      <div className="quickly-action-wrapper">
        <div className="quickly-action-container">
          <p className="title-text">QUICKLY FILTER</p>
          <div className="section-container types-container">
            <span className="section-text">类型:</span>
            {MEMO_TYPES.map((t, idx) => {
              return (
                <div key={t.type}>
                  <span
                    className={`type-item ${memoType === t.type ? "selected" : ""}`}
                    onClick={() => {
                      handleMemoTypeItemClick(t.type as MemoType);
                    }}
                  >
                    {t.text}
                  </span>
                  {idx + 1 < MEMO_TYPES.length ? <span className="split-text">/</span> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
