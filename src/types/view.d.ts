interface DialogProps {
  destroy: FunctionType;
}

interface FormattedMemo extends Model.Memo {
  formattedContent: string;
  createdAtStr: string;
}
