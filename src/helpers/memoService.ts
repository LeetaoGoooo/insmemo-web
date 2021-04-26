import { api } from "./api";
import { userService } from "./userService";

class MemoService {
  private memos: Model.Memo[];
  private listeners: Map<Object, (memos: Model.Memo[]) => void>;

  constructor() {
    this.memos = [];
    this.listeners = new Map();

    this.init();
  }

  public async init() {
    userService.bindStateChange(this, async (user) => {
      if (user) {
        const { data: memos } = await api.getMyMemos();
        this.memos = memos
          .map(
            (m): Model.Memo => {
              return {
                id: m.id,
                content: m.content,
                uponMemoId: m.uponMemoId,
                createdAt: new Date(m.createdAt).getTime(),
                updatedAt: new Date(m.updatedAt).getTime(),
              };
            }
          )
          .sort((a, b) => b.updatedAt - a.updatedAt);

        this.emitValueChangedEvent();
      }
    });
  }

  public getMemos() {
    return this.memos;
  }

  public push(memo: Model.Memo) {
    this.memos.unshift(memo);
    this.emitValueChangedEvent();
  }

  public deleteById(id: string) {
    for (let i = 0; i < this.memos.length; ++i) {
      if (this.memos[i].id === id) {
        this.memos.splice(i, 1);
        this.emitValueChangedEvent();
        break;
      }
    }
  }

  public bindStateChange(context: Object, handler: (memos: Model.Memo[]) => void) {
    this.listeners.set(context, handler);
  }

  public unbindStateListener(context: Object) {
    this.listeners.delete(context);
  }

  private emitValueChangedEvent() {
    this.listeners.forEach((handler, ctx) => {
      handler.call(ctx, this.memos);
    });
  }
}

export const memoService = new MemoService();
